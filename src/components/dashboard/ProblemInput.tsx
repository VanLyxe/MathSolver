import React, { useState, useEffect } from 'react';
import { useProblemSolver } from '../../hooks/useProblemSolver';
import ImageUpload from './ImageUpload';
import MathDisplay from './MathDisplay';
import ProgressBar from '../ProgressBar';
import toast from 'react-hot-toast';

const ProblemInput: React.FC = () => {
  const [problemText, setProblemText] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [solution, setSolution] = useState('');
  const [progress, setProgress] = useState(0);
  const { solveProblem, isLoading } = useProblemSolver();

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (isLoading) {
      setProgress(0);
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 500);
    } else {
      setProgress(100);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!problemText && !imageUrl) {
      toast.error('Veuillez entrer une description ou ajouter une image');
      return;
    }

    try {
      const result = await solveProblem(problemText, imageUrl);
      if (result?.solution) {
        setSolution(result.solution);
        toast.success('Problème résolu !');
      }
    } catch (error) {
      console.error('Erreur lors de la résolution:', error);
      toast.error('Une erreur est survenue lors de la résolution');
    }
  };

  const handleImageUploaded = (url: string) => {
    setImageUrl(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Décrivez votre problème (optionnel si une image est fournie)
            </label>
            <textarea
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
              className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ex: Résoudre l'équation 2x + 5 = 13"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ou ajoutez une image du problème
            </label>
            <ImageUpload onImageUploaded={handleImageUploaded} />
          </div>

          {isLoading && <ProgressBar progress={progress} />}

          <button
            type="submit"
            disabled={isLoading || (!problemText && !imageUrl)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? 'Résolution en cours...' : 'Résoudre le problème'}
          </button>
        </form>
      </div>

      {solution && <MathDisplay solution={solution} />}
    </div>
  );
};

export default ProblemInput;