import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPage from "./pages/ForgotPage";
import TripMainPage from "./pages/TripMainPage";
import TripManagePage from "./pages/TripManagePage";
import TripPlanPage from "./pages/TripPlanPage";
import TripBudgetPage from "./pages/TripBudgetPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot" element={<ForgotPage />} />
        <Route path="/tripmain" element={<TripMainPage />} />
        <Route path="/tripmanage" element={<TripManagePage />} />
        <Route path="/tripplan" element={<TripPlanPage />} />
        <Route path="/tripbudget" element={<TripBudgetPage />} />

      </Routes>
    </Router>
  );
}

export default App;
