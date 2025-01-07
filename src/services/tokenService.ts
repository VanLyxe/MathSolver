import { supabase } from '../lib/supabase';
import { TokenError } from '../types/errors';

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
      const currentTokens = await this.getUserTokens(userId);
      
      if (currentTokens <= 0) {
        throw new TokenError('NO_TOKENS', 'Vous n\'avez plus de tokens disponibles');
      }

      const { data, error } = await supabase.rpc('decrement_tokens');
      
      if (error) {
        throw new TokenError('UPDATE_ERROR', 'Impossible de mettre à jour les tokens');
      }
      
      if (data === 0) {
        throw new TokenError('NO_TOKENS', 'Plus de tokens disponibles');
      }
    } catch (error) {
      if (error instanceof TokenError) throw error;
      throw new TokenError('UNKNOWN_ERROR', 'Une erreur inattendue est survenue');
    }
  }
}

export const tokenService = new TokenService();