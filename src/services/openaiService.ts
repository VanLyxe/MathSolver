import { OPENAI_CONFIG } from '../config/openai.config';
import { OpenAIMessage } from '../types/openai.types';
import { SolverError } from '../types/errors';
import { convertImageToBase64 } from '../utils/image.utils';

class OpenAIService {
  private validateApiKey(): void {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new SolverError('API_ERROR', 'OpenAI API key not configured');
    }
  }

  private async prepareMessages(problemText: string, imageUrl?: string): Promise<OpenAIMessage[]> {
    const messages: OpenAIMessage[] = [
      { role: "system", content: OPENAI_CONFIG.SYSTEM_PROMPT }
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
        throw new SolverError('API_ERROR', 'Impossible de traiter l\'image fournie');
      }
    } else {
      messages.push({ role: "user", content: problemText });
    }

    return messages;
  }

  private async makeOpenAIRequest(messages: OpenAIMessage[]): Promise<string> {
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
      throw new SolverError('API_ERROR', errorData.error?.message || 'Erreur OpenAI');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async solveMathProblem(problemText: string, imageUrl?: string): Promise<string> {
    try {
      this.validateApiKey();
      const messages = await this.prepareMessages(problemText, imageUrl);
      return await this.makeOpenAIRequest(messages);
    } catch (error) {
      console.error('Erreur OpenAI:', error);
      if (error instanceof SolverError) throw error;
      throw new SolverError('API_ERROR', 'Une erreur est survenue lors de la communication avec OpenAI');
    }
  }
}

export const openaiService = new OpenAIService();
