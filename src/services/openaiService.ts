import { OPENAI_CONFIG } from '../config/openai.config';
import { handleApiError } from '../utils/error.utils';
import { formatMathExpression } from '../utils/math.utils';
import { convertImageToBase64 } from '../utils/image.utils';
import { OpenAIMessage } from '../types/openai.types';
import { SolverError } from '../types/errors';

class OpenAIService {
  private validateApiKey(): void {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new SolverError('API_ERROR', 'Clé API OpenAI non configurée');
    }
  }

  private async prepareMessages(problemText: string, imageUrl?: string): Promise<OpenAIMessage[]> {
    const messages: OpenAIMessage[] = [
      {
        role: "system",
        content: OPENAI_CONFIG.SYSTEM_PROMPT
      }
    ];

    if (imageUrl) {
      try {
        const base64Image = await convertImageToBase64(imageUrl);
        messages.push({
          role: "user",
          content: [
            { type: "text", text: problemText || "Analyse et résous ce problème mathématique." },
            {
              type: "image_url",
              image_url: {
                url: base64Image,
                detail: "high"
              }
            }
          ]
        });
      } catch (error) {
        throw new SolverError('API_ERROR', 'Impossible de traiter l\'image fournie', error as Error);
      }
    } else {
      messages.push({
        role: "user",
        content: problemText
      });
    }

    return messages;
  }

  async solveMathProblem(problemText: string, imageUrl?: string): Promise<string> {
    try {
      this.validateApiKey();
      const messages = await this.prepareMessages(problemText, imageUrl);

      const response = await fetch(OPENAI_CONFIG.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: OPENAI_CONFIG.MODEL,
          messages,
          max_tokens: OPENAI_CONFIG.MAX_TOKENS,
          temperature: OPENAI_CONFIG.TEMPERATURE
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw await handleApiError(errorData);
      }

      const data = await response.json();
      const solution = data.choices[0].message.content;
      
      return formatMathExpression(solution);
    } catch (error) {
      console.error('Erreur OpenAI:', error);
      if (error instanceof SolverError) throw error;
      throw new SolverError('API_ERROR', 'Une erreur est survenue lors de la communication avec OpenAI', error as Error);
    }
  }
}

export const openaiService = new OpenAIService();