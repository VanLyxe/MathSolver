import React from 'react';
import { Copy, CheckCircle } from 'lucide-react';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { formatKatexExpression, isTextLine, isMathExpression } from '../../utils/katex.utils';

interface SolutionDisplayProps {
  solution: string;
}

const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ solution }) => {
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

    // Texte explicatif
    if (isTextLine(line)) {
      return (
        <p key={index} className="text-gray-700 my-2 pl-4">
          {line}
        </p>
      );
    }

    // Expression mathématique
    if (isMathExpression(line)) {
      try {
        const formattedExpression = formatKatexExpression(line);
        const katexHtml = katex.renderToString(formattedExpression, {
          throwOnError: false,
          displayMode: true,
          strict: false,
          trust: true
        });
        return (
          <div 
            key={index}
            className="my-3 px-6 py-3 bg-gray-50 rounded-lg overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: katexHtml }} 
          />
        );
      } catch (error) {
        console.error('Erreur KaTeX:', error, 'Expression:', line);
        return <p key={index} className="text-red-600 pl-4">{line}</p>;
      }
    }

    // Fallback pour tout autre contenu
    return (
      <p key={index} className="text-gray-700 pl-4">
        {line}
      </p>
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

export default SolutionDisplay;