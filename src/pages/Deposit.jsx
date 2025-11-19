import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createDeposit } from '../services/user';
import ErrorMessage from '../components/ErrorMessage';

export default function Deposit() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [referrerCode, setReferrerCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const getPackageType = (amt) => {
    const amtNum = parseFloat(amt);
    if (amtNum >= 35 && amtNum <= 499) return { type: 1, percent: 0.5 };
    if (amtNum >= 500 && amtNum <= 4999) return { type: 2, percent: 1.0 };
    if (amtNum >= 5000 && amtNum <= 100000) return { type: 3, percent: 2.0 };
    return null;
  };

  const packageInfo = amount ? getPackageType(amount) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const amountNum = parseFloat(amount);

    if (!amount || isNaN(amountNum) || amountNum < 35) {
      setError('Minimum deposit amount is $35');
      return;
    }

    if (amountNum > 100000) {
      setError('Maximum deposit amount is $100,000');
      return;
    }

    try {
      setLoading(true);
      const result = await createDeposit(
        amountNum,
        referrerCode || undefined
      );

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to create deposit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="bg-telegram-secondary rounded-lg p-4">
        <h2 className="text-xl font-bold mb-1">Make Deposit</h2>
        <p className="text-gray-400 text-sm">
          Minimum: $35 | Maximum: $100,000
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      {success && (
        <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
          <p className="text-green-300 text-sm">
            Deposit request created successfully! Waiting for admin approval.
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
            min="35"
            max="100000"
            step="0.01"
            required
            disabled={loading || success}
            className="w-full bg-telegram-bg border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-telegram-button disabled:opacity-50"
          />
        </div>

        {/* Package Info */}
        {packageInfo && (
          <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-3">
            <p className="text-sm text-blue-300">
              Package {packageInfo.type}: {packageInfo.percent}% daily ROI
            </p>
          </div>
        )}

        {/* Referrer Code (Optional) */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Referrer Code (Optional)
          </label>
          <input
            type="text"
            value={referrerCode}
            onChange={(e) => setReferrerCode(e.target.value)}
            placeholder="Enter referrer code"
            disabled={loading || success}
            className="w-full bg-telegram-bg border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-telegram-button disabled:opacity-50"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || success}
          className="w-full bg-telegram-button hover:bg-telegram-buttonHover text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : success ? 'Success!' : 'Create Deposit Request'}
        </button>
      </form>

      {/* Info */}
      <div className="bg-telegram-secondary rounded-lg p-4">
        <h3 className="font-semibold mb-2">Package Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Package 1:</span>
            <span>$35 - $499</span>
            <span className="text-green-400">0.5% daily</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Package 2:</span>
            <span>$500 - $4,999</span>
            <span className="text-green-400">1% daily</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Package 3:</span>
            <span>$5,000 - $100,000</span>
            <span className="text-green-400">2% daily</span>
          </div>
        </div>
      </div>
    </div>
  );
}

