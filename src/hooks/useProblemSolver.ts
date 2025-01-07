import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { problemService } from '../services/problemService';
import { tokenService } from '../services/tokenService';
import { openaiService } from '../services/openaiService';
import { TokenError, SolverError } from '../types/errors';
import toast from 'react-hot-toast';

export const useProblemSolver = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  const handleError = (error: unknown) => {
    if (error instanceof TokenError) {
      switch (error.code) {
        case 'NO_TOKENS':
          toast.error('Vous n\'avez plus de tokens disponibles');
          break;
        case 'FETCH_ERROR':
        case 'UPDATE_ERROR':
          toast.error('Erreur lors de la gestion des tokens');
          break;
        default:
          toast.error('Une erreur est survenue');
      }
    } else if (error instanceof SolverError) {
      toast.error(error.message);
    } else {
      toast.error('Une erreur inattendue est survenue');
    }
  };

  const solveProblem = async (problemText: string, imageUrl?: string) => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return null;
    }

    if (!problemText && !imageUrl) {
      toast.error('Veuillez fournir un problème à résoudre');
      return null;
    }

    setIsLoading(true);
    try {
      // Vérifier les tokens avant toute opération
      const tokens = await tokenService.getUserTokens(user.id);
      if (tokens <= 0) {
        throw new TokenError('NO_TOKENS', 'Vous n\'avez plus de tokens disponibles');
      }

      // Créer le problème
      const { problem, error: createError } = await problemService.createProblem(
        user.id,
        problemText || 'Problème soumis via image',
        imageUrl
      );
      
      if (createError) {
        throw new SolverError('STORAGE_ERROR', 'Erreur lors de la création du problème');
      }

      if (!problem) {
        throw new SolverError('UNKNOWN_ERROR', 'Erreur lors de la création du problème');
      }

      // Décrémenter les tokens
      await tokenService.decrementTokens(user.id);

      // Résoudre avec OpenAI
      const solution = await openaiService.solveMathProblem(problemText, imageUrl);

      // Mettre à jour la solution
      const { problem: updatedProblem, error: updateError } = 
        await problemService.updateSolution(problem.id, solution);
      
      if (updateError) {
        throw new SolverError('STORAGE_ERROR', 'Erreur lors de la mise à jour de la solution');
      }

      toast.success('Problème résolu avec succès !');
      return updatedProblem;

    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    solveProblem,
    isLoading
  };
};