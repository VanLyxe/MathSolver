import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { problemService } from '../../services/problemService';
import { History } from 'lucide-react';
import SolutionCard from './SolutionCard';
import toast from 'react-hot-toast';

const SolutionHistory = () => {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchSolutions = async () => {
      if (!user) return;
      
      try {
        const { problems, error } = await problemService.getUserProblems(user.id);
        if (error) throw error;
        setSolutions(problems || []);
      } catch (error) {
        console.error('Error fetching solutions:', error);
        toast.error('Erreur lors du chargement de l\'historique');
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!solutions.length) {
    return (
      <div className="text-center py-8">
        <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Aucune solution enregistrée</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {solutions.map((solution) => (
        <SolutionCard key={solution.id} solution={solution} />
      ))}
    </div>
  );
};

export default SolutionHistory;