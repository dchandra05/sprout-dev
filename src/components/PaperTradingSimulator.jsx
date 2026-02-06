import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  getBars,
  getSnapshot,
  getPaperAccount,
  getPaperPositions,
  placePaperOrder,
  openMarketWS
} from "@/lib/alpacaClient";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight, RefreshCw, Search, Plus, Minus, AlertCircle } from "lucide-react";

const DEFAULT_WATCHLIST = [
  // Big tech
  "AAPL","MSFT","NVDA","AMZN","GOOGL","META","TSLA",
  // Banks / consumer
  "JPM","BAC","V","MA","COST",
  // Index proxies (since indexes themselves usually aren’t tradable)
  "SPY","QQQ","DIA","IWM","VTI"
];

const TIMEFRAMES = [
  { label: "1D", timeframe: "1Min", limit: 390 },
  { label: "5D", timeframe: "5Min", limit: 500 },
  { label: "1M", timeframe: "15Min", limit: 600 },
  { label: "6M", timeframe: "1Hour", limit: 600 },
  { label: "1Y", timeframe: "1Day", limit: 365 }
];

export default function PaperTradingSimulator() {
  const [symbol, setSymbol] = useState("AAPL");
  const [searchSymbol, setSearchSymbol] = useState("");
  const [timeframeIdx, setTimeframeIdx] = useState(0);

  const [chart, setChart] = useState([]);
  const [lastTrade, setLastTrade] = useState(null);
  const [lastQuote, setLastQuote] = useState(null);

  const [account, setAccount] = useState(null);
  const [positions, setPositions] = useState([]);

  const [qty, setQty] = useState(1);
  const [side, setSide] = useState("buy");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const wsRef = useRef(null);

  const tf = TIMEFRAMES[timeframeIdx];

  const price = useMemo(() => {
    // Prefer latest trade, fallback to quote mid, fallback to chart last close
    if (lastTrade?.p) return lastTrade.p;
    if (lastQuote?.bp && lastQuote?.ap) return (lastQuote.bp + lastQuote.ap) / 2;
    const last = chart[chart.length - 1];
    return last?.close ?? null;
  }, [lastTrade, lastQuote, chart]);

  async function loadAccount() {
    const [acct, pos] = await Promise.all([getPaperAccount(), getPaperPositions()]);
    setAccount(acct);
    setPositions(pos);
  }

  async function loadChart(s) {
    setLoading(true);
    setErr(null);
    try {
      const bars = await getBars({
        symbol: s,
        timeframe: tf.timeframe,
        limit: tf.limit,
        feed: "delayed_sip"
      });

      // Alpaca bars response shape commonly includes "bars": [...]
      const rows = (bars.bars || []).map((b) => ({
        t: b.t, // timestamp
        time: new Date(b.t).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        open: b.o,
        high: b.h,
        low: b.l,
        close: b.c,
        volume: b.v
      }));

      setChart(rows);

      // Optional snapshot to quickly populate price/change
      try {
        await getSnapshot({ symbol: s, feed: "delayed_sip" });
      } catch {
        // safe to ignore
      }
    } catch (e) {
      setErr(String(e?.message || e));
      setChart([]);
    } finally {
      setLoading(false);
    }
  }

  function connectStream(s) {
    if (wsRef.current) {
      try { wsRef.current.close(); } catch {}
      wsRef.current = null;
    }

    const ws = openMarketWS();
    wsRef.current = ws;

    ws.onopen = () => {
      // Subscribe to trades + quotes + minute bars for this symbol
      ws.send(JSON.stringify({
        type: "subscribe",
        trades: [s],
        quotes: [s],
        bars: [s]
      }));
    };

    ws.onmessage = (evt) => {
      // Alpaca stream sends arrays of messages
      let payload;
      try { payload = JSON.parse(evt.data); } catch { return; }

      const msgs = Array.isArray(payload) ? payload : [payload];

      for (const m of msgs) {
        // Trade: { T:"t", S:"AAPL", p:..., t:... }
        if (m?.T === "t" && m?.S === s) {
          setLastTrade({ p: m.p, s: m.s, t: m.t });
        }

        // Quote: { T:"q", S:"AAPL", bp:..., ap:..., t:... }
        if (m?.T === "q" && m?.S === s) {
          setLastQuote({ bp: m.bp, ap: m.ap, t: m.t });
        }

        // Minute Bar: { T:"b", S:"AAPL", o,h,l,c,v,t }
        if (m?.T === "b" && m?.S === s) {
          setChart((prev) => {
            const next = [...prev];
            const timeLabel = new Date(m.t).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

            const row = {
              t: m.t,
              time: timeLabel,
              open: m.o,
              high: m.h,
              low: m.l,
              close: m.c,
              volume: m.v
            };

            // Replace last bar if same minute, otherwise append
            const last = next[next.length - 1];
            if (last && last.time === row.time) next[next.length - 1] = row;
            else next.push(row);

            // Keep chart bounded
            const max = tf.limit;
            if (next.length > max) return next.slice(next.length - max);
            return next;
          });
        }
      }
    };

    ws.onerror = () => {
      setErr("Stream error (check server logs / Alpaca credentials / feed access).");
    };
  }

  async function refreshAll(nextSymbol = symbol) {
    setLastTrade(null);
    setLastQuote(null);
    await loadChart(nextSymbol);
    connectStream(nextSymbol);
  }

  async function executeOrder() {
    setErr(null);
    try {
      await placePaperOrder({ symbol, qty, side });
      await loadAccount();
    } catch (e) {
      setErr(String(e?.message || e));
    }
  }

  useEffect(() => {
    // Initial load
    loadAccount().catch(() => {});
    refreshAll(symbol).catch(() => {});
    return () => {
      try { wsRef.current?.close(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // If timeframe changes, reload chart (stream bars still fine)
    refreshAll(symbol).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframeIdx]);

  const change = useMemo(() => {
    if (!chart.length) return null;
    const first = chart[0]?.close;
    if (!first || !price) return null;
    return price - first;
  }, [chart, price]);

  const changePct = useMemo(() => {
    if (!chart.length) return null;
    const first = chart[0]?.close;
    if (!first || !price) return null;
    return (price / first - 1) * 100;
  }, [chart, price]);

  return (
    <div className="space-y-6">
      {err && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-semibold">Something went wrong</p>
                <p className="text-sm">{err}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Paper Buying Power</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {account?.buying_power ? `$${Number(account.buying_power).toLocaleString()}` : "—"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Cash</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {account?.cash ? `$${Number(account.cash).toLocaleString()}` : "—"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{positions?.length ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart + Trading */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search */}
          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search symbol (e.g., AAPL, SPY, QQQ)"
                    value={searchSymbol}
                    onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchSymbol) {
                        setSymbol(searchSymbol);
                        refreshAll(searchSymbol).catch(() => {});
                      }
                    }}
                    className="pl-10"
                  />
                </div>
                <Button
                  onClick={() => {
                    if (!searchSymbol) return;
                    setSymbol(searchSymbol);
                    refreshAll(searchSymbol).catch(() => {});
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Search
                </Button>
              </div>

              <div className="flex gap-2 flex-wrap">
                {DEFAULT_WATCHLIST.map((s) => (
                  <Button
                    key={s}
                    variant={symbol === s ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSymbol(s);
                      refreshAll(s).catch(() => {});
                    }}
                    className={symbol === s ? "bg-green-600" : ""}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chart */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{symbol}</CardTitle>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-3xl font-bold">
                      {price ? `$${price.toFixed(2)}` : "—"}
                    </span>
                    {change != null && changePct != null && (
                      <Badge className={`${change >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {change >= 0 ? <ArrowUpRight className="w-4 h-4 inline mr-1" /> : <ArrowDownRight className="w-4 h-4 inline mr-1" />}
                        ${Math.abs(change).toFixed(2)} ({changePct.toFixed(2)}%)
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Streaming trades/quotes + minute bars (feed: delayed SIP)
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refreshAll(symbol).catch(() => {})}
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex gap-2 mb-4 flex-wrap">
                {TIMEFRAMES.map((t, idx) => (
                  <Button
                    key={t.label}
                    variant={timeframeIdx === idx ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeframeIdx(idx)}
                    className={timeframeIdx === idx ? "bg-green-600" : ""}
                  >
                    {t.label}
                  </Button>
                ))}
              </div>

              <div className="h-[320px]">
                {chart.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" hide />
                      <YAxis domain={["auto", "auto"]} tickFormatter={(v) => `$${Number(v).toFixed(2)}`} />
                      <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} />
                      <Line type="monotone" dataKey="close" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    {loading ? "Loading chart..." : "No chart data"}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-3 mt-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-600">Last trade</div>
                  <div className="font-semibold">
                    {lastTrade?.p ? `$${lastTrade.p.toFixed(2)}` : "—"}{" "}
                    <span className="text-gray-500 font-normal">
                      {lastTrade?.t ? `@ ${new Date(lastTrade.t).toLocaleTimeString()}` : ""}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-600">Bid / Ask</div>
                  <div className="font-semibold">
                    {lastQuote?.bp ? `$${lastQuote.bp.toFixed(2)}` : "—"} /{" "}
                    {lastQuote?.ap ? `$${lastQuote.ap.toFixed(2)}` : "—"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trade Panel */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Paper Trade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => setSide("buy")}
                  variant={side === "buy" ? "default" : "outline"}
                  className={`h-14 ${side === "buy" ? "bg-green-600 hover:bg-green-700" : ""}`}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Buy
                </Button>
                <Button
                  onClick={() => setSide("sell")}
                  variant={side === "sell" ? "default" : "outline"}
                  className={`h-14 ${side === "sell" ? "bg-red-600 hover:bg-red-700" : ""}`}
                >
                  <Minus className="w-5 h-5 mr-2" />
                  Sell
                </Button>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Shares</label>
                <Input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || "1", 10)))}
                  className="text-lg"
                />
              </div>

              <Button
                onClick={executeOrder}
                className={`w-full h-14 text-lg ${side === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
              >
                {side === "buy" ? "Buy" : "Sell"} {qty} share{qty > 1 ? "s" : ""}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Positions */}
        <div>
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Your Paper Positions</CardTitle>
            </CardHeader>
            <CardContent>
              {!positions?.length ? (
                <p className="text-gray-500 text-center py-8">No positions yet</p>
              ) : (
                <div className="space-y-3">
                  {positions.map((p) => (
                    <div
                      key={p.asset_id || p.symbol}
                      onClick={() => {
                        setSymbol(p.symbol);
                        refreshAll(p.symbol).catch(() => {});
                      }}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-400 cursor-pointer transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-lg">{p.symbol}</span>
                        <Badge variant="outline">{Number(p.qty).toLocaleString()} sh</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Avg: ${Number(p.avg_entry_price).toFixed(2)} • Mkt: ${Number(p.current_price).toFixed(2)}
                      </div>
                      <div className={`text-sm font-semibold ${Number(p.unrealized_pl) >= 0 ? "text-green-600" : "text-red-600"}`}>
                        UPL: ${Number(p.unrealized_pl).toFixed(2)} ({Number(p.unrealized_plpc) * 100 >= 0 ? "+" : ""}
                        {(Number(p.unrealized_plpc) * 100).toFixed(2)}%)
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
