export type ProviderConfig = {
  id: string;
  name: string;
  baseUrl: string;
  defaultModel: string;
  supportsVision: boolean;
  apiKeyPrefix?: string;
};

export type ModelOption = {
  id: string;
  label: string;
  providerId: string;
  model: string;
  supportsVision: boolean;
};

export const PROVIDERS: ProviderConfig[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    supportsVision: true,
    apiKeyPrefix: 'sk-',
  },
  {
    id: 'qwen',
    name: 'Qwen (Alibaba)',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModel: 'qwen-vl-plus',
    supportsVision: true,
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    defaultModel: 'gemini-2.0-flash',
    supportsVision: true,
  },
];

export const MODEL_OPTIONS: ModelOption[] = [
  {
    id: 'auto',
    label: 'Auto (best available)',
    providerId: 'openai',
    model: 'gpt-4o-mini',
    supportsVision: true,
  },
  {
    id: 'openai-gpt4o-mini',
    label: 'GPT-4o Mini',
    providerId: 'openai',
    model: 'gpt-4o-mini',
    supportsVision: true,
  },
  {
    id: 'openai-gpt4o',
    label: 'GPT-4o',
    providerId: 'openai',
    model: 'gpt-4o',
    supportsVision: true,
  },
  {
    id: 'qwen-vl-plus',
    label: 'Qwen VL Plus',
    providerId: 'qwen',
    model: 'qwen-vl-plus',
    supportsVision: true,
  },
  {
    id: 'gemini-flash',
    label: 'Gemini 2.0 Flash',
    providerId: 'gemini',
    model: 'gemini-2.0-flash',
    supportsVision: true,
  },
];

export function getProvider(id: string): ProviderConfig | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

export function getModelOption(id: string): ModelOption | undefined {
  return MODEL_OPTIONS.find((m) => m.id === id);
}

export function resolveModel(modelId: string): ModelOption {
  if (modelId === 'auto') {
    return MODEL_OPTIONS.find((m) => m.id === 'openai-gpt4o-mini')!;
  }
  return getModelOption(modelId) ?? MODEL_OPTIONS[1];
}
