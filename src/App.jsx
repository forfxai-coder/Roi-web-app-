import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { initTelegramWebApp, isTelegramWebApp } from './utils/telegram';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/Loading';
import Dashboard from './pages/Dashboard';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import Referrals from './pages/Referrals';
import { useEffect } from 'react';

// Fallback component for non-Telegram access
function TelegramRequired() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-telegram-bg text-telegram-text">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Telegram Required</h1>
        <p className="mb-4">
          This app must be opened from within Telegram. Please open it through your Telegram bot.
        </p>
        <p className="text-sm text-gray-400">
          If you're already in Telegram, make sure you're using the latest version of the app.
        </p>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated, loading, error } = useAuth();
  const isTelegram = isTelegramWebApp();

  // Show fallback if not in Telegram
  if (!isTelegram) {
    return <TelegramRequired />;
  }

  if (loading) {
    return <Loading message="Initializing..." />;
  }

  if (error && !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-telegram-bg text-telegram-text">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-bold mb-4 text-red-400">Authentication Error</h1>
          <p className="mb-4">{error}</p>
          <p className="text-sm text-gray-400">Please try refreshing the app or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Loading message="Authenticating..." />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/deposit"
        element={
          <ProtectedRoute>
            <Layout>
              <Deposit />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/withdraw"
        element={
          <ProtectedRoute>
            <Layout>
              <Withdraw />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/referrals"
        element={
          <ProtectedRoute>
            <Layout>
              <Referrals />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  useEffect(() => {
    // Initialize Telegram WebApp (with error handling)
    initTelegramWebApp();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
