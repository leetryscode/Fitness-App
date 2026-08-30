import { chatCompletion } from './openai-compatible';
import { resolveModel, getProvider } from './providers';
import { getSetting } from '../db/settings';
import { ChatMessage } from '../types/entry';
import { getApiKey } from '../storage/secure';

export async function hasApiKey(): Promise<boolean> {
  const key = await getApiKey();
  return !!key && key.length > 0;
}

export async function sendWorkoutMessage(params: {
  userText: string;
  history: ChatMessage[];
  imageBase64?: string;
  imageMimeType?: string;
}) {
  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new Error(
      'No API key configured. Add one in Settings to start logging workouts.'
    );
  }

  const modelId = (await getSetting('modelId')) ?? 'auto';
  const modelOption = resolveModel(modelId);
  const provider = getProvider(modelOption.providerId);

  if (!provider) {
    throw new Error(`Unknown provider: ${modelOption.providerId}`);
  }

  const messages = [
    ...params.history.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: params.userText },
  ];

  return chatCompletion({
    provider,
    apiKey,
    model: modelOption.model,
    messages,
    imageBase64: params.imageBase64,
    imageMimeType: params.imageMimeType,
  });
}
