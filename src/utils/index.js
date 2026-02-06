const pageRoutes = {
  Home: "/",
  Welcome: "/welcome",
  Login: "/login",
  Signup: "/signup",

  Dashboard: "/dashboard",
  Learn: "/learn",
  Lesson: "/lesson",
  CourseDetail: "/course",
  Progress: "/progress",
  Goals: "/goals",
  Leaderboard: "/leaderboard",

  Simulations: "/simulations",
  InvestmentCalculator: "/investment-calculator",
  PaperTrading: "/paper-trading",

  SchoolSelection: "/school-selection",
};

export function createPageUrl(pageName) {
  return pageRoutes[pageName] || `/${String(pageName || "").toLowerCase()}`;
}
