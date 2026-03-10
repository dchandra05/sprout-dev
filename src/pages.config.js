// src/pages.config.js
// Updated: Landing page is now the entry point for unauthenticated users

import __Layout from "./Layout.jsx";

import AIDay1 from "./pages/AIDay1";
import AIDay10 from "./pages/AIDay10";
import AIDay2 from "./pages/AIDay2";
import AIDay3 from "./pages/AIDay3";
import AIDay4 from "./pages/AIDay4";
import AIDay5 from "./pages/AIDay5";
import AIDay6 from "./pages/AIDay6";
import AIDay7 from "./pages/AIDay7";
import AIDay8 from "./pages/AIDay8";
import AIDay9 from "./pages/AIDay9";
import AILiteracy from "./pages/AILiteracy";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import BudgetLesson from "./pages/BudgetLesson";
import BudgetQuiz from "./pages/BudgetQuiz";
import BudgetSimulation from "./pages/BudgetSimulation";
import Challenges from "./pages/Challenges";
import CourseDetail from "./pages/CourseDetail";
import CreditCardLesson from "./pages/CreditCardLesson";
import CreditCardQuiz from "./pages/CreditCardQuiz";
import Dashboard from "./pages/Dashboard";
import FinalExam from "./pages/FinalExam";
import ForgotPassword from "./pages/ForgotPassword";
import Goals from "./pages/Goals";
import Home from "./pages/Home";
import InvestmentCalculator from "./pages/InvestmentCalculator";
import Leaderboard from "./pages/Leaderboard";
import Learn from "./pages/Learn";
import Lesson from "./pages/Lesson";
import PaperTrading from "./pages/PaperTrading";
import PaycheckLesson from "./pages/PaycheckLesson";
import PaycheckQuiz from "./pages/PaycheckQuiz";
import PaycheckSimulation from "./pages/PaycheckSimulation";
import Progress from "./pages/Progress";
import SchoolSelection from "./pages/SchoolSelection";
import Simulations from "./pages/Simulations";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// ✅ NEW: Landing page
import Landing from "./pages/Landing";

export const PAGES = {
  // ─── Public (no auth needed) ────────────────────────────────
  Landing,   // "/" → landing page
  Login,
  Signup,
  ForgotPassword,

  // ─── Onboarding ─────────────────────────────────────────────
  SchoolSelection,
  Welcome,

  // ─── Authenticated app ──────────────────────────────────────
  Dashboard,
  Learn,
  Lesson,
  CourseDetail,
  Progress,
  Goals,
  Leaderboard,
  Challenges,
  Simulations,
  InvestmentCalculator,
  PaperTrading,
  Account,
  Admin,

  // ─── AI Literacy course ─────────────────────────────────────
  AILiteracy,
  AIDay1,
  AIDay2,
  AIDay3,
  AIDay4,
  AIDay5,
  AIDay6,
  AIDay7,
  AIDay8,
  AIDay9,
  AIDay10,
  FinalExam,

  // ─── Finance simulations ─────────────────────────────────────
  BudgetLesson,
  BudgetQuiz,
  BudgetSimulation,
  CreditCardLesson,
  CreditCardQuiz,
  PaycheckLesson,
  PaycheckQuiz,
  PaycheckSimulation,

  // ─── Legacy ──────────────────────────────────────────────────
  Home,
};

export const pagesConfig = {
  // Landing is now the root; authenticated users get redirected to Dashboard
  // by the Landing component itself (checks supabase.auth.getSession)
  mainPage: "Landing",
  Pages: PAGES,
  Layout: __Layout,
};