import {
  LLMWorkoutResponse,
  LLMWorkoutResponseSchema,
  LLM_RESPONSE_JSON_SCHEMA,
} from './schema';
import { SYSTEM_PROMPT } from './prompts';
import { ProviderConfig } from './providers';

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string | ContentPart[];
};

type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

export async function chatCompletion(params: {
  provider: ProviderConfig;
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  imageBase64?: string;
  imageMimeType?: string;
}): Promise<LLMWorkoutResponse> {
  const { provider, apiKey, model, messages, imageBase64, imageMimeType } =
    params;

  const systemMessage: ChatMessage = {
    role: 'system',
    content: SYSTEM_PROMPT,
  };

  const apiMessages: ChatMessage[] = [systemMessage, ...messages];

  // If last message needs image attachment, rebuild it
  if (imageBase64 && apiMessages.length > 1) {
    const lastIdx = apiMessages.length - 1;
    const last = apiMessages[lastIdx];
    if (last.role === 'user' && typeof last.content === 'string') {
      apiMessages[lastIdx] = {
        role: 'user',
        content: [
          { type: 'text', text: last.content },
          {
            type: 'image_url',
            image_url: {
              url: `data:${imageMimeType ?? 'image/jpeg'};base64,${imageBase64}`,
            },
          },
        ],
      };
    }
  }

  const response = await fetch(`${provider.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: apiMessages,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'workout_response',
          strict: true,
          schema: LLM_RESPONSE_JSON_SCHEMA,
        },
      },
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LLM request failed (${response.status}): ${errorText.slice(0, 200)}`
    );
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Empty response from LLM');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('Failed to parse LLM JSON response');
  }

  return LLMWorkoutResponseSchema.parse(parsed);
}
