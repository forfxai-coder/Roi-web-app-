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
import { WebApp } from '@twa-dev/sdk';

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

  // Show error even if loading is false but not authenticated
  if (error && !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-telegram-bg text-telegram-text">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-bold mb-4 text-red-400">Authentication Error</h1>
          <p className="mb-4 font-semibold">{error}</p>
          
          {/* Debug Info */}
          <div className="mt-4 p-3 bg-telegram-secondary rounded text-left text-xs">
            <p className="font-bold mb-2">Debug Info:</p>
            <p>window.Telegram: {typeof window !== 'undefined' && window.Telegram ? 'Exists' : 'Not Found'}</p>
            <p>window.Telegram.WebApp: {typeof window !== 'undefined' && window.Telegram?.WebApp ? 'Exists' : 'Not Found'}</p>
            <p>Platform: {typeof window !== 'undefined' && window.Telegram?.WebApp?.platform ? window.Telegram.WebApp.platform : (typeof WebApp !== 'undefined' ? WebApp.platform : 'Unknown')}</p>
            <p>Version: {typeof window !== 'undefined' && window.Telegram?.WebApp?.version ? window.Telegram.WebApp.version : (typeof WebApp !== 'undefined' ? WebApp.version : 'Unknown')}</p>
            <p>initData: {typeof window !== 'undefined' && window.Telegram?.WebApp?.initData ? 'Available' : (typeof WebApp !== 'undefined' && WebApp.initData ? 'Available' : 'Not Available')}</p>
            <p>initDataUnsafe: {typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe ? 'Available' : (typeof WebApp !== 'undefined' && WebApp.initDataUnsafe ? 'Available' : 'Not Available')}</p>
            <p className="mt-2 text-gray-400">Check browser console for more details</p>
            <p className="mt-2 text-yellow-400 text-xs">
              ⚠️ If Platform is "Unknown", make sure you opened this from your bot's menu button in Telegram
            </p>
            <p className="mt-2 text-yellow-400 text-xs">
              ⚠️ If error mentions CORS or Network, check Render backend CORS_ORIGIN setting
            </p>
          </div>
          
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-telegram-button hover:bg-telegram-buttonHover text-white rounded mt-4 transition-colors"
          >
            Retry
          </button>
          <p className="text-sm text-gray-400 mt-4">
            If the error mentions "CORS" or "Network error", you need to add your Netlify URL to the backend CORS_ORIGIN in Render.
          </p>
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
    // Wait a bit to ensure Telegram SDK is loaded
    const timer = setTimeout(() => {
      initTelegramWebApp();
    }, 50);
    
    return () => clearTimeout(timer);
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
