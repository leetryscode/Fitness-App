import { z } from 'zod';
import { MUSCLE_REGIONS } from '../types/muscles';

export const LLMWorkoutResponseSchema = z.object({
  muscles: z.array(
    z.object({
      region: z.enum(MUSCLE_REGIONS),
      intensity: z.number().min(1).max(10),
    })
  ),
  summary: z.string().min(1),
});

export type LLMWorkoutResponse = z.infer<typeof LLMWorkoutResponseSchema>;

export const LLM_RESPONSE_JSON_SCHEMA = {
  type: 'object',
  properties: {
    muscles: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          region: { type: 'string', enum: [...MUSCLE_REGIONS] },
          intensity: { type: 'number', minimum: 1, maximum: 10 },
        },
        required: ['region', 'intensity'],
        additionalProperties: false,
      },
    },
    summary: { type: 'string' },
  },
  required: ['muscles', 'summary'],
  additionalProperties: false,
} as const;
