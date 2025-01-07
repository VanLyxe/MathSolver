import { OpenAIMessage } from '../types/openai.types';
import { OPENAI_CONFIG } from '../config/openai.config';

export const createSystemMessage = (): OpenAIMessage => ({
  role: 'system',
  content: OPENAI_CONFIG.SYSTEM_PROMPT
});

export const createTextMessage = (text: string): OpenAIMessage => ({
  role: 'user',
  content: text
});