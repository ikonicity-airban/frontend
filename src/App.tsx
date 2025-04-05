import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OtpVerification from "./pages/OtpVerification";
import SignupSuccess from "./pages/SignupSuccess";
import Dashboard from "./pages/Dashboard";
import EvaluationForm from "./pages/EvaluationForm";
import EvaluationsPage from "./pages/EvaluationsPage";
import TeamPage from "./pages/TeamPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import queryClient from "./api/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import UserList from "./components/users/UserList";
import UserPage from "./pages/UserPage";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/otp-verification" element={<OtpVerification />} />
              <Route path="/signup-success" element={<SignupSuccess />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/evaluations" element={<EvaluationsPage />} />
                  <Route path="/evaluation/:id" element={<EvaluationForm />} />
                  <Route path="/team" element={<TeamPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/users" element={<UserList />} />
                  <Route path="/users/:id" element={<UserPage />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
}
