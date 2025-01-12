import { supabase } from '../lib/supabase';
import { TokenError } from '../types/errors';
import { useAuthStore } from '../stores/authStore';

export class TokenService {
  async getUserTokens(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('tokens_remaining')
        .eq('id', userId)
        .single();
      
      if (error) {
        throw new TokenError('FETCH_ERROR', 'Impossible de vérifier les tokens disponibles');
      }
      
      return data?.tokens_remaining ?? 0;
    } catch (error) {
      if (error instanceof TokenError) throw error;
      throw new TokenError('UNKNOWN_ERROR', 'Une erreur inattendue est survenue');
    }
  }

  async decrementTokens(userId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('decrement_tokens');
      
      if (error) {
        throw new TokenError('UPDATE_ERROR', 'Impossible de mettre à jour les tokens');
      }

      // Mettre à jour le store avec le nouveau nombre de tokens
      const currentTokens = await this.getUserTokens(userId);
      const { updateUserTokens } = useAuthStore.getState();
      await updateUserTokens(currentTokens);
    } catch (error) {
      if (error instanceof TokenError) throw error;
      throw new TokenError('UNKNOWN_ERROR', 'Une erreur inattendue est survenue');
    }
  }

  async incrementTokens(userId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_tokens');
      
      if (error) {
        throw new TokenError('UPDATE_ERROR', 'Impossible de mettre à jour les tokens');
      }

      // Mettre à jour le store avec le nouveau nombre de tokens
      const currentTokens = await this.getUserTokens(userId);
      const { updateUserTokens } = useAuthStore.getState();
      await updateUserTokens(currentTokens);
    } catch (error) {
      if (error instanceof TokenError) throw error;
      throw new TokenError('UNKNOWN_ERROR', 'Une erreur inattendue est survenue');
    }
  }
}

export const tokenService = new TokenService();
