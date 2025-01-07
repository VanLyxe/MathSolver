import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

export type Problem = Database['public']['Tables']['problems']['Row'];
export type ProblemResponse = {
  problem: Problem | null;
  error: Error | null;
};
export type ProblemsResponse = {
  problems: Problem[] | null;
  error: Error | null;
};

export const problemService = {
  async createProblem(userId: string, problemText: string, imageUrl?: string): Promise<ProblemResponse> {
    try {
      const { data, error } = await supabase
        .from('problems')
        .insert([{ 
          user_id: userId, 
          problem_text: problemText,
          image_url: imageUrl 
        }])
        .select()
        .single();

      if (error) throw error;
      return { problem: data, error: null };
    } catch (error) {
      return { problem: null, error: error as Error };
    }
  },

  async updateSolution(problemId: string, solution: string): Promise<ProblemResponse> {
    try {
      const { data, error } = await supabase
        .from('problems')
        .update({ solution })
        .eq('id', problemId)
        .select()
        .single();

      if (error) throw error;
      return { problem: data, error: null };
    } catch (error) {
      return { problem: null, error: error as Error };
    }
  },

  async getUserProblems(userId: string): Promise<ProblemsResponse> {
    try {
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { problems: data, error: null };
    } catch (error) {
      return { problems: null, error: error as Error };
    }
  }
};