import { OpenAIError } from '../types/openai.types';

export async function handleApiError(error: OpenAIError): Promise<Error> {
  console.error('API Error:', error);

  switch (error.error.type) {
    case 'invalid_request_error':
      if (error.error.code === 'model_not_found') {
        return new Error('Le modèle spécifié n\'est pas disponible. Veuillez contacter le support.');
      }
      return new Error('Configuration incorrecte de l\'API');
      
    case 'insufficient_quota':
      return new Error('Quota d\'utilisation dépassé');
      
    case 'rate_limit_exceeded':
      return new Error('Trop de requêtes. Veuillez réessayer dans quelques instants.');
      
    default:
      return new Error(error.error.message || 'Une erreur est survenue lors de la communication avec le service');
  }
}