import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile, getTransactions } from '../services/user';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileData, transactionsData] = await Promise.all([
        getProfile(),
        getTransactions(null, null, 5),
      ]);

      setProfile(profileData);
      setTransactions(transactionsData.transactions || []);
      
      // Update user in context
      if (profileData.user) {
        updateUser(profileData.user);
      }
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />;
  }

  const wallet = profile?.wallet || {};
  const investments = profile?.investments || {};

  return (
    <div className="p-4 space-y-4">
      {/* Welcome Section */}
      <div className="bg-telegram-secondary rounded-lg p-4">
        <h2 className="text-xl font-bold mb-1">
          Welcome, {user?.first_name || 'User'}!
        </h2>
        <p className="text-gray-400 text-sm">Manage your investments</p>
      </div>

      {/* Wallet Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-telegram-secondary rounded-lg p-4">
          <p className="text-gray-400 text-xs mb-1">Total Balance</p>
          <p className="text-2xl font-bold text-green-400">
            ${parseFloat(wallet.balance || 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-telegram-secondary rounded-lg p-4">
          <p className="text-gray-400 text-xs mb-1">Total ROI</p>
          <p className="text-2xl font-bold text-blue-400">
            ${parseFloat(wallet.total_roi || 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-telegram-secondary rounded-lg p-4">
          <p className="text-gray-400 text-xs mb-1">Active Deposits</p>
          <p className="text-2xl font-bold text-yellow-400">
            {investments.active || 0}
          </p>
        </div>
        <div className="bg-telegram-secondary rounded-lg p-4">
          <p className="text-gray-400 text-xs mb-1">Total Invested</p>
          <p className="text-2xl font-bold text-purple-400">
            ${parseFloat(wallet.total_invested || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/deposit')}
          className="bg-telegram-button hover:bg-telegram-buttonHover text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          💰 Deposit
        </button>
        <button
          onClick={() => navigate('/withdraw')}
          className="bg-telegram-secondary hover:bg-telegram-secondary/80 text-white font-semibold py-3 px-4 rounded-lg transition-colors border border-gray-600"
        >
          💸 Withdraw
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="bg-telegram-secondary rounded-lg p-4">
        <h3 className="font-semibold mb-3">Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            No transactions yet
          </p>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-2 bg-telegram-bg rounded"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium capitalize">{tx.type}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      tx.type === 'deposit' || tx.type === 'roi' || tx.type === 'referral'
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {tx.type === 'deposit' || tx.type === 'roi' || tx.type === 'referral'
                      ? '+'
                      : '-'}
                    ${parseFloat(tx.amount).toFixed(2)}
                  </p>
                  <p
                    className={`text-xs ${
                      tx.status === 'approved' || tx.status === 'completed'
                        ? 'text-green-400'
                        : tx.status === 'pending'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                  >
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

