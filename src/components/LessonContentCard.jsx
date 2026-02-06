import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronRight, Lightbulb, BookOpen, CheckCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function LessonContentCard({ section, index, onComplete }) {
  const [revealed, setRevealed] = useState(false);

  const getIcon = () => {
    if (section.type === "tip") return Lightbulb;
    if (section.type === "example") return CheckCircle;
    return BookOpen;
  };

  const getGradient = () => {
    if (section.type === "tip") return "from-yellow-400 to-orange-500";
    if (section.type === "example") return "from-green-400 to-emerald-500";
    return "from-blue-400 to-cyan-500";
  };

  const Icon = getIcon();
  const gradient = getGradient();

  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all overflow-hidden">
      {section.image && (
        <div className="h-48 overflow-hidden">
          <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
        </div>
      )}

      <CardContent className="p-6">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${gradient} text-white text-sm font-semibold mb-3`}>
          <Icon className="w-4 h-4" />
          {section.type || "Content"}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h3>

        {!revealed ? (
          <>
            <p className="text-gray-600 mb-4">{section.preview}</p>
            <Button
              onClick={() => {
                setRevealed(true);
                onComplete?.(index);
              }}
              className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-white"
            >
              Continue Reading
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </>
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{section.content}</ReactMarkdown>
            <div className="mt-4 p-3 bg-green-50 rounded-lg border-2 border-green-200 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-900 font-medium">Section completed!</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
