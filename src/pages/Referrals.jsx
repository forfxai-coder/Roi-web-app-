import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getReferrals } from '../services/user';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function Referrals() {
  const { user } = useAuth();
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedLevels, setExpandedLevels] = useState(new Set([1, 2, 3]));

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReferrals();
      setReferralData(data);
    } catch (err) {
      setError(err.message || 'Failed to load referrals');
    } finally {
      setLoading(false);
    }
  };

  const toggleLevel = (level) => {
    const newExpanded = new Set(expandedLevels);
    if (newExpanded.has(level)) {
      newExpanded.delete(level);
    } else {
      newExpanded.add(level);
    }
    setExpandedLevels(newExpanded);
  };

  if (loading) {
    return <Loading message="Loading referrals..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadReferrals} />;
  }

  const stats = referralData?.statistics || {};
  const tree = referralData?.referral_tree || {};

  return (
    <div className="p-4 space-y-4">
      {/* Statistics */}
      <div className="bg-telegram-secondary rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Referral Statistics</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-telegram-bg rounded p-3">
            <p className="text-gray-400 text-xs mb-1">Total Referrals</p>
            <p className="text-lg font-bold text-blue-400">
              {stats.total_referrals || 0}
            </p>
          </div>
          <div className="bg-telegram-bg rounded p-3">
            <p className="text-gray-400 text-xs mb-1">Referral Earnings</p>
            <p className="text-lg font-bold text-green-400">
              ${parseFloat(stats.total_referral_earnings || 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-telegram-bg rounded p-3">
            <p className="text-gray-400 text-xs mb-1">Total Invested</p>
            <p className="text-lg font-bold text-yellow-400">
              ${parseFloat(stats.total_invested_by_referrals || 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-telegram-bg rounded p-3">
            <p className="text-gray-400 text-xs mb-1">Total Earned</p>
            <p className="text-lg font-bold text-purple-400">
              ${parseFloat(stats.total_earned_by_referrals || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Referral Tree */}
      <div className="bg-telegram-secondary rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Referral Tree (15 Levels)</h3>
          <p className="text-xs text-gray-400">Tap to expand/collapse</p>
        </div>

        {Object.keys(tree).length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            No referrals yet. Share your referral code to invite others!
          </p>
        ) : (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((level) => {
              const referrals = tree[level] || [];
              const isExpanded = expandedLevels.has(level);
              const commissionRates = {
                1: '10%',
                2: '5%',
                3: '3%',
                4: '2%',
                5: '1%',
                6: '0.5%',
                7: '0.5%',
                8: '0.5%',
                9: '0.5%',
                10: '0.5%',
                11: '0.25%',
                12: '0.25%',
                13: '0.25%',
                14: '0.25%',
                15: '0.25%',
              };

              if (referrals.length === 0 && level <= 5) {
                return null; // Don't show empty levels for first 5
              }

              return (
                <div key={level} className="bg-telegram-bg rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleLevel(level)}
                    className="w-full flex items-center justify-between p-3 hover:bg-telegram-secondary transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {isExpanded ? '📂' : '📁'}
                      </span>
                      <span className="font-medium">
                        Level {level} ({referrals.length} referrals)
                      </span>
                      <span className="text-xs text-green-400">
                        {commissionRates[level]} commission
                      </span>
                    </div>
                    <span className="text-gray-400">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  </button>

                  {isExpanded && referrals.length > 0 && (
                    <div className="border-t border-gray-700 p-3 space-y-2">
                      {referrals.map((ref, idx) => (
                        <div
                          key={idx}
                          className="bg-telegram-secondary rounded p-2 text-sm"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium">
                              {ref.first_name || ref.username || 'User'}
                            </p>
                            <p className="text-xs text-gray-400">
                              @{ref.username || 'N/A'}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                            <div>
                              Invested: ${ref.total_invested.toFixed(2)}
                            </div>
                            <div>
                              Earned: ${ref.total_earned.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Referral Code */}
      <div className="bg-telegram-secondary rounded-lg p-4">
        <h3 className="font-semibold mb-2">Your Referral Code</h3>
        <div className="bg-telegram-bg rounded p-3">
          <p className="text-lg font-mono text-center text-telegram-button">
            {user?.telegram_id || user?.username || 'N/A'}
          </p>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          Share this code with others to earn referral commissions!
        </p>
      </div>
    </div>
  );
}

