import { z } from 'zod';
import { MUSCLE_REGIONS } from '../types/muscles';
import { SESSION_EFFORT_VALUES } from './prompts';

const SessionEffortSchema = z.enum(SESSION_EFFORT_VALUES).nullable().optional();

const SetDetailSchema = z.object({
  muscle_slugs: z.array(z.enum(MUSCLE_REGIONS)),
  rpe: z.number().min(1).max(10).nullable(),
  order: z.number().int().min(1),
});

export const LLMWorkoutResponseSchema = z.object({
  muscles: z.array(
    z.object({
      region: z.enum(MUSCLE_REGIONS),
      intensity: z.number().min(1).max(10),
    })
  ),
  session_effort: SessionEffortSchema,
  sets: z.array(SetDetailSchema).nullable().optional(),
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
    session_effort: {
      type: ['string', 'null'],
      enum: [...SESSION_EFFORT_VALUES, null],
    },
    sets: {
      type: ['array', 'null'],
      items: {
        type: 'object',
        properties: {
          muscle_slugs: {
            type: 'array',
            items: { type: 'string', enum: [...MUSCLE_REGIONS] },
          },
          rpe: { type: ['number', 'null'], minimum: 1, maximum: 10 },
          order: { type: 'integer', minimum: 1 },
        },
        required: ['muscle_slugs', 'rpe', 'order'],
        additionalProperties: false,
      },
    },
    summary: { type: 'string' },
  },
  required: ['muscles', 'summary'],
  additionalProperties: false,
} as const;
