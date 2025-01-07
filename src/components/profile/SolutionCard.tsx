import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Image } from 'lucide-react';
import MathDisplay from '../dashboard/MathDisplay';

interface SolutionCardProps {
  solution: {
    id: string;
    problem_text: string;
    solution: string;
    image_url: string | null;
    created_at: string;
  };
}

const SolutionCard: React.FC<SolutionCardProps> = ({ solution }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg transition-all duration-200 ${
      isExpanded ? 'ring-2 ring-purple-500' : 'hover:shadow-xl hover:translate-y-[-2px]'
    }`}>
      <div 
        className={`p-6 cursor-pointer transition-colors ${
          isExpanded ? 'bg-purple-50' : 'hover:bg-gray-50'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {/* Afficher l'image si elle existe */}
            {solution.image_url && !isExpanded && (
              <div className="mb-4">
                <img 
                  src={solution.image_url} 
                  alt="Problème" 
                  className="max-h-32 rounded-lg shadow-md"
                />
              </div>
            )}
            
            {/* Afficher le texte du problème */}
            <p className="font-medium text-gray-900 text-lg">
              {solution.problem_text}
            </p>

            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(solution.created_at)}</span>
              </div>
              {solution.image_url && (
                <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                  <Image className="h-4 w-4" />
                  <span>Image fournie</span>
                </div>
              )}
            </div>
          </div>
          <div className={`ml-4 p-2 rounded-full transition-colors ${
            isExpanded 
              ? 'bg-purple-100 text-purple-600' 
              : 'bg-gray-100 text-gray-400 hover:bg-purple-100 hover:text-purple-600'
          }`}>
            {isExpanded ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && solution.solution && (
        <div className="border-t border-gray-100">
          {solution.image_url && (
            <div className="p-6 border-b border-gray-100 bg-white">
              <img 
                src={solution.image_url} 
                alt="Problème" 
                className="max-h-64 mx-auto rounded-lg shadow-md"
              />
            </div>
          )}
          <div className="p-6 bg-white rounded-b-lg">
            <MathDisplay solution={solution.solution} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionCard;