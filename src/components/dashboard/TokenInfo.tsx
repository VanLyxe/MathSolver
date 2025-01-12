import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, Play } from 'lucide-react';
import { useTokens } from '../../hooks/useTokens';
import { useAdRewards } from '../../hooks/useAdRewards';
import toast from 'react-hot-toast';

const TokenInfo = () => {
  const { tokens, loading } = useTokens();
  const navigate = useNavigate();
  const [isLoadingAd, setIsLoadingAd] = useState(false);
  const { canWatchAd, watchAd, remainingAdsToday } = useAdRewards();

  const handleWatchAd = async () => {
    if (!canWatchAd) {
      toast.error('Vous avez atteint la limite de publicités pour aujourd\'hui');
      return;
    }

    setIsLoadingAd(true);
    try {
      await watchAd();
      toast.success('Token obtenu !');
    } catch (error) {
      toast.error('Erreur lors du chargement de la publicité');
    } finally {
      setIsLoadingAd(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Coins className="h-6 w-6 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900">Vos tokens</h2>
      </div>
      
      {loading ? (
        <div className="animate-pulse h-8 bg-gray-200 rounded w-16 mb-2" />
      ) : (
        <div className="text-3xl font-bold text-purple-600 mb-2">{tokens}</div>
      )}
      
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Tokens restants pour résoudre vos problèmes
        </p>
        <p className="text-xs text-gray-500">
          5 tokens = 2.99€
        </p>
      </div>
      
      <div className="mt-4 space-y-2">
        <button 
          onClick={() => navigate('/pricing')}
          className="w-full bg-purple-100 text-purple-600 py-2 rounded-lg hover:bg-purple-200 transition-colors"
        >
          Acheter des tokens
        </button>

        <button
          onClick={handleWatchAd}
          disabled={!canWatchAd || isLoadingAd}
          className={`w-full flex items-center justify-center space-x-2 py-2 rounded-lg transition-colors ${
            canWatchAd 
              ? 'bg-green-100 text-green-600 hover:bg-green-200'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Play className="h-4 w-4" />
          <span>
            {isLoadingAd 
              ? 'Chargement...' 
              : canWatchAd 
                ? 'Regarder une pub (+1 token)' 
                : `Maximum atteint (${remainingAdsToday}/5)`}
          </span>
        </button>
      </div>
    </div>
  );
};

export default TokenInfo;
