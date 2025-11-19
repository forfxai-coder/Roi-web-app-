import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/deposit', label: 'Deposit', icon: '💰' },
    { path: '/withdraw', label: 'Withdraw', icon: '💸' },
    { path: '/referrals', label: 'Referrals', icon: '👥' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-telegram-bg">
      {/* Header */}
      <header className="bg-telegram-secondary border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-telegram-text">ROI WebApp</h1>
            {user && (
              <div className="text-sm text-gray-400">
                ${parseFloat(user.balance || 0).toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-20">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-telegram-secondary border-t border-gray-700">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-4 gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors ${
                  isActive(item.path)
                    ? 'text-telegram-button bg-telegram-button/10'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <span className="text-lg mb-1">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}

