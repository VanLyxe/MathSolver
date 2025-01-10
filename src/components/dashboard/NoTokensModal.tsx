import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, X } from 'lucide-react';

interface NoTokensModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NoTokensModal: React.FC<NoTokensModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center justify-center mb-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <Coins className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 text-center mb-4">
          Plus de tokens disponibles
        </h3>

        <p className="text-gray-600 text-center mb-6">
          Vous avez utilisé tous vos tokens. Achetez-en plus pour continuer à résoudre vos problèmes mathématiques !
        </p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Plus tard
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Voir les offres
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoTokensModal;