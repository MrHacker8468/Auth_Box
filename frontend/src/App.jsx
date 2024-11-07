import FloatingShape from "./components/FloatingShape";
import EmailVerificationPage from "./Pages/EmailVerificationPage";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from "../Store/authStore";
import { useEffect } from "react";
import Dashboard from "./Pages/Dashboard";
import LoadingSpinner from "./components/LoadingSpinner";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";

// Protect routes that require authentication
const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (isAuthenticated && !user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  return children;
};

// Redirect authenticated users to the home page
const RedirectAuthenticatedUsers = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const { checkAuth, isAuthenticated, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUsers>
              <SignUpPage />
            </RedirectAuthenticatedUsers>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUsers>
              <LoginPage />
            </RedirectAuthenticatedUsers>
          }
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot-password" element={
          <RedirectAuthenticatedUsers > 
            <ForgotPasswordPage />
          </RedirectAuthenticatedUsers>} />

        <Route path="/reset-password/:token" element={
          <RedirectAuthenticatedUsers>
            <ResetPasswordPage />
          </RedirectAuthenticatedUsers>} />

          <Route path="*" element={
            <Navigate to="/" replace />
          } />

        </Routes>

        


      <Toaster />
    </div>
  );
}

export default App;
