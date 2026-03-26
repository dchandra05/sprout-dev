import React, { useEffect } from "react";
import InterestCalculator from "../components/InterestCalculator";
import { trackSimulationStart } from "@/lib/activityTracker";

export default function InvestmentCalculator() {
  useEffect(() => {
    trackSimulationStart("investment-calculator", "Investment Growth Calculator").catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#ede8e3]">
      <div className="max-w-5xl mx-auto px-4 py-8 md:px-8 md:py-12 space-y-6">
        <div className="mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Investment Growth Calculator</h1>
          <p className="text-gray-500 text-sm">
            See how compound interest grows your money over time. Adjust the values to match your financial goals.
          </p>
        </div>

        <InterestCalculator />

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Key Principles</p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1c2f3c] flex-shrink-0 mt-1.5" />
              <span><strong>Start early.</strong> Time is your biggest advantage with compound interest.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1c2f3c] flex-shrink-0 mt-1.5" />
              <span><strong>Contribute regularly.</strong> Even small monthly contributions add up significantly over decades.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1c2f3c] flex-shrink-0 mt-1.5" />
              <span><strong>Be consistent.</strong> The power of compound interest grows exponentially over time.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1c2f3c] flex-shrink-0 mt-1.5" />
              <span><strong>Historical average:</strong> The US stock market has returned roughly 10% annually over the long term (past performance does not guarantee future results).</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}