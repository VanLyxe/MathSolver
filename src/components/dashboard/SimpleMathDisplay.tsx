import React from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface SimpleMathDisplayProps {
  solution: string;
}

const SimpleMathDisplay: React.FC<SimpleMathDisplayProps> = ({ solution }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(solution);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderLine = (line: string, index: number): JSX.Element => {
    // Ligne vide
    if (!line.trim()) {
      return <div key={index} className="h-4" />;
    }

    // Titres et étapes
    if (line === 'Expression initiale :' || line.match(/^\d+\./)) {
      return (
        <h4 key={index} className="text-lg font-semibold text-gray-800 mt-6 mb-3">
          {line}
        </h4>
      );
    }

    // Expression mathématique ou texte explicatif
    return (
      <div 
        key={index} 
        className={`my-2 pl-4 font-mono ${line.includes('=') ? 'bg-gray-50 p-3 rounded-lg' : ''}`}
      >
        {line}
      </div>
    );
  };

  return (
    <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Solution détaillée
        </h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 text-sm text-purple-600 hover:text-purple-700 transition-colors"
        >
          {copied ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? 'Copié !' : 'Copier'}
        </button>
      </div>

      <div className="space-y-1">
        {solution
          .split('\n')
          .map(line => line.trim())
          .map((line, index) => renderLine(line, index))}
      </div>
    </div>
  );
};

export default SimpleMathDisplay;