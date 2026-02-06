import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, PiggyBank } from "lucide-react";
import InteractiveQuiz from "@/components/InteractiveQuiz";

const quizQuestions = [
  {
    question: "Looking at your budget: Rent $1,200, Groceries $400, Gas $150, Netflix $15. Which are fixed expenses?",
    options: [
      "Rent and Netflix",
      "Groceries and Gas",
      "All of them",
      "Only Rent"
    ],
    correct_answer: 0,
    explanation: "Fixed expenses stay mostly the same each month. Rent ($1,200) and Netflix ($15) are fixed. Groceries and Gas are variable - they change based on your usage and choices each month."
  },
  {
    question: "Your budget shows: Income $3,500, Fixed $1,800, Variable $1,200. How much can you save?",
    scenario: "You want to know your monthly savings potential.",
    options: [
      "$1,700",
      "$500",
      "$3,000",
      "$300"
    ],
    correct_answer: 1,
    explanation: "Savings = Income - Total Expenses. $3,500 - ($1,800 + $1,200) = $500. This is your savings/remaining money each month."
  },
  {
    question: "Your chart shows Food is 35% of spending. Income is $4,000. How much are you spending on food?",
    scenario: "Your pie chart breakdown reveals Food takes up over a third of your budget.",
    options: [
      "$1,400/month",
      "$350/month",
      "$400/month",
      "$3,500/month"
    ],
    correct_answer: 0,
    explanation: "35% of $4,000 = $1,400. If food is more than 30% of your budget, you might want to look for ways to reduce eating out or grocery costs."
  },
  {
    question: "July: Spent $2,800. August: Spent $3,200. September: Spent $2,600. What do you notice?",
    options: [
      "Spending is consistent around $2,800-3,200/month",
      "Spending is out of control",
      "August needs investigation - what caused the spike?",
      "This is perfect budgeting"
    ],
    correct_answer: 2,
    explanation: "Your baseline is around $2,700. August spiked to $3,200 (+$400). You should review August's expenses to see what caused the increase. Was it expected (birthday, trip) or unexpected (overspending)? This is how budgeting helps you spot patterns!"
  },
  {
    question: "Fixed expenses are $2,000. Income is $3,500. What's your flexibility percentage?",
    options: [
      "57% ($2,000/$3,500)",
      "43% ($1,500/$3,500)",
      "75%",
      "$1,500"
    ],
    correct_answer: 1,
    explanation: "Flexibility = (Income - Fixed Expenses) / Income. ($3,500 - $2,000) / $3,500 = 43%. This means 43% of your income is flexible (for variable expenses and savings). The higher this percentage, the more financial flexibility you have."
  },
  {
    question: "Your rent increases from $1,000 to $1,200. Income stays $3,500. What must you cut?",
    scenario: "You need to adjust your budget due to the rent increase.",
    options: [
      "$200 from variable expenses or savings",
      "Nothing - just pay it",
      "$100 from income somehow",
      "$200 from fixed expenses"
    ],
    correct_answer: 0,
    explanation: "Since fixed expenses increased by $200, and income didn't change, you must reduce variable expenses (dining out, entertainment) or savings by $200 to balance your budget. Or find additional income!"
  },
  {
    question: "Why track monthly instead of yearly when budgeting?",
    options: [
      "It's easier to remember",
      "Most bills come monthly, and it's easier to adjust quickly",
      "Tax season requires it",
      "Banks require monthly tracking"
    ],
    correct_answer: 1,
    explanation: "Monthly tracking aligns with how bills work (rent, utilities, subscriptions) and lets you spot problems and adjust quickly. If you track yearly, you won't notice overspending until it's too late to fix it!"
  },
  {
    question: "Budget: Income $4,000, Fixed $2,000, Variable $1,500, Savings $500. Is this good?",
    options: [
      "Yes - following 50/30/20 rule (50% needs, 30% wants, 20% savings)",
      "No - saving too much",
      "No - spending too much on variable",
      "Yes - but needs more detail"
    ],
    correct_answer: 0,
    explanation: "Let's check: Fixed ($2,000) = 50% ✓, Variable ($1,500) = 37.5% (close to 30%), Savings ($500) = 12.5% (should aim for 20%). This is decent but could increase savings by reducing variable expenses by $300."
  }
];

export default function BudgetQuiz() {
  const navigate = useNavigate();

  const handleComplete = (score) => {
    navigate(createPageUrl("Learn"));
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-lime-50 via-white to-green-50">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("BudgetLesson"))}
          className="shadow-md"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Lesson
        </Button>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-gradient-to-br from-lime-400 to-green-500 rounded-2xl shadow-lg mb-4">
            <PiggyBank className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Budget Mastery Quiz
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Can you analyze real budget scenarios and make smart financial decisions?
          </p>
        </div>

        {/* Interactive Quiz */}
        <InteractiveQuiz questions={quizQuestions} onComplete={handleComplete} />

        {/* Info Card */}
        <Card className="border-2 border-lime-200 shadow-xl">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">💡 Key Takeaway</h3>
            <p className="text-gray-600">
              A good budget isn't restrictive—it's a spending plan that helps you afford what matters while building savings. Review and adjust monthly!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
