import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createWithdraw, getWithdrawals } from '../services/user';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';

export default function Withdraw() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const loadWithdrawals = async () => {
    try {
      setLoadingHistory(true);
      const data = await getWithdrawals();
      setWithdrawals(data.withdrawals || []);
    } catch (err) {
      console.error('Failed to load withdrawals:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const amountNum = parseFloat(amount);

    if (!amount || isNaN(amountNum) || amountNum < 10) {
      setError('Minimum withdrawal amount is $10');
      return;
    }

    const balance = parseFloat(user?.balance || 0);
    if (amountNum > balance) {
      setError('Insufficient balance');
      return;
    }

    try {
      setLoading(true);
      const result = await createWithdraw(amountNum);

      if (result.success) {
        setSuccess(true);
        // Update user balance
        updateUser({
          ...user,
          balance: (balance - amountNum).toFixed(2),
        });
        // Reload withdrawals
        await loadWithdrawals();
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to create withdrawal request');
    } finally {
      setLoading(false);
    }
  };

  const balance = parseFloat(user?.balance || 0);

  return (
    <div className="p-4 space-y-4">
      <div className="bg-telegram-secondary rounded-lg p-4">
        <h2 className="text-xl font-bold mb-1">Withdraw Funds</h2>
        <p className="text-gray-400 text-sm">Minimum: $10</p>
        <p className="text-lg font-semibold mt-2">
          Available Balance: <span className="text-green-400">${balance.toFixed(2)}</span>
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      {success && (
        <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
          <p className="text-green-300 text-sm">
            Withdrawal request created successfully! Waiting for admin approval.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="10"
            max={balance}
            step="0.01"
            required
            disabled={loading || success}
            className="w-full bg-telegram-bg border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-telegram-button disabled:opacity-50"
          />
          <p className="text-xs text-gray-400 mt-1">
            Max: ${balance.toFixed(2)}
          </p>
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setAmount((balance * 0.25).toFixed(2))}
            disabled={loading || success}
            className="bg-telegram-secondary hover:bg-telegram-secondary/80 text-white py-2 px-3 rounded text-sm disabled:opacity-50"
          >
            25%
          </button>
          <button
            type="button"
            onClick={() => setAmount((balance * 0.5).toFixed(2))}
            disabled={loading || success}
            className="bg-telegram-secondary hover:bg-telegram-secondary/80 text-white py-2 px-3 rounded text-sm disabled:opacity-50"
          >
            50%
          </button>
          <button
            type="button"
            onClick={() => setAmount(balance.toFixed(2))}
            disabled={loading || success}
            className="bg-telegram-secondary hover:bg-telegram-secondary/80 text-white py-2 px-3 rounded text-sm disabled:opacity-50"
          >
            Max
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || success || balance < 10}
          className="w-full bg-telegram-button hover:bg-telegram-buttonHover text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : success ? 'Success!' : 'Create Withdrawal Request'}
        </button>
      </form>

      {/* Withdrawal History */}
      <div className="bg-telegram-secondary rounded-lg p-4">
        <h3 className="font-semibold mb-3">Withdrawal History</h3>
        {loadingHistory ? (
          <Loading message="Loading..." />
        ) : withdrawals.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            No withdrawals yet
          </p>
        ) : (
          <div className="space-y-2">
            {withdrawals.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="flex items-center justify-between p-2 bg-telegram-bg rounded"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    ${parseFloat(withdrawal.amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(withdrawal.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-xs font-semibold ${
                      withdrawal.status === 'approved' || withdrawal.status === 'completed'
                        ? 'text-green-400'
                        : withdrawal.status === 'pending'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                  >
                    {withdrawal.status}
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

