import React from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface MathDisplayProps {
  solution: string;
}

const MathDisplay: React.FC<MathDisplayProps> = ({ solution }) => {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetClear();
      window.MathJax.typesetPromise();
    }
  }, [solution]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(solution);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isTextLine = (line: string): boolean => {
    // Une ligne est considérée comme du texte si :
    return line.match(/[a-zA-Z]{3,}/) && // Contient au moins 3 lettres consécutives
           !line.match(/^\d+\./) && // N'est pas un numéro d'étape
           line !== 'Expression initiale :' && // N'est pas le titre initial
           !line.includes('\\frac') && // Ne contient pas de fraction LaTeX
           !line.includes('\\div') && // Ne contient pas d'opérateur de division LaTeX
           !line.includes('\\times'); // Ne contient pas d'opérateur de multiplication LaTeX
  };

  const renderLine = (line: string, index: number): JSX.Element => {
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

    // Texte explicatif
    if (isTextLine(line)) {
      return (
        <p key={index} className="text-gray-700 my-2 pl-4">
          {line}
        </p>
      );
    }

    // Expression mathématique
    return (
      <div 
        key={index} 
        className="my-3 px-6 py-3 bg-gray-50 rounded-lg overflow-x-auto"
      >
        <div className="mjx-math">
          {`\\[${line}\\]`}
        </div>
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

export default MathDisplay;