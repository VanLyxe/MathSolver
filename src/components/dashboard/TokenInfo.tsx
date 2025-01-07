import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins } from 'lucide-react';
import { useTokens } from '../../hooks/useTokens';

const TokenInfo = () => {
  const { tokens, loading } = useTokens();
  const navigate = useNavigate();

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
      
      <p className="text-sm text-gray-600">
        Tokens restants pour résoudre vos problèmes
      </p>
      
      <button 
        onClick={() => navigate('/pricing')}
        className="mt-4 w-full bg-purple-100 text-purple-600 py-2 rounded-lg hover:bg-purple-200 transition-colors"
      >
        Acheter des tokens
      </button>
    </div>
  );
};

export default TokenInfo;