// src/utils/index.js
// IMPORTANT: Landing is at /landing (not /) so App.jsx's "/" → mainPage redirect works correctly.
// The App.jsx route: <Route path="/" element={<Navigate to={createPageUrl(mainPageKey)} />} />
// sends / → /landing, which then renders the Landing page. No infinite loop.

const pageRoutes = {
  Landing: "/landing",       // ← /landing NOT "/" — avoids infinite redirect in App.jsx
  Home:    "/home",
  Welcome: "/welcome",
  Login:   "/login",
  Signup:  "/signup",
  ForgotPassword: "/forgot-password",
  ResetPassword:  "/reset-password",

  Dashboard:   "/dashboard",
  Learn:       "/learn",
  Lesson:      "/lesson",
  CourseDetail: "/course",
  Progress:    "/progress",
  Goals:       "/goals",
  Leaderboard: "/leaderboard",
  Challenges:  "/challenges",
  Account:     "/account",
  Admin:       "/admin",

  Simulations:           "/simulations",
  InvestmentCalculator:  "/investment-calculator",
  PaperTrading:          "/paper-trading",

  SchoolSelection: "/school-selection",

  AILiteracy: "/ai-literacy",
  AIDay1:  "/ai-day-1",
  AIDay2:  "/ai-day-2",
  AIDay3:  "/ai-day-3",
  AIDay4:  "/ai-day-4",
  AIDay5:  "/ai-day-5",
  AIDay6:  "/ai-day-6",
  AIDay7:  "/ai-day-7",
  AIDay8:  "/ai-day-8",
  AIDay9:  "/ai-day-9",
  AIDay10: "/ai-day-10",
  FinalExam: "/final-exam",

  BudgetLesson:      "/budget-lesson",
  BudgetQuiz:        "/budget-quiz",
  BudgetSimulation:  "/budget-simulation",
  CreditCardLesson:  "/credit-card-lesson",
  CreditCardQuiz:    "/credit-card-quiz",
  PaycheckLesson:    "/paycheck-lesson",
  PaycheckQuiz:      "/paycheck-quiz",
  PaycheckSimulation: "/paycheck-simulation",
};

export function createPageUrl(pageName) {
  if (!pageName) return "/";
  const [name, query] = String(pageName).split("?");
  const base = pageRoutes[name] || `/${name.toLowerCase()}`;
  return query ? `${base}?${query}` : base;
}

export { pageRoutes };