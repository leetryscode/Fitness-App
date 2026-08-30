import { MuscleRegion } from './muscles';

export type EntrySource = 'chat' | 'photo';

export type MuscleTag = {
  region: MuscleRegion;
  intensity: number;
};

/**
 * Session-level effort rating, extracted from natural language.
 * null if user didn't mention effort level.
 */
export type SessionEffort =
  | 'very_light'
  | 'easy'
  | 'moderate'
  | 'hard'
  | 'max';

/**
 * Per-set detail when user narrates set-by-set effort.
 * null/empty if user didn't provide set-level detail.
 */
export type SetDetail = {
  muscleSlugs: MuscleRegion[];
  rpe: number | null;
  order: number;
};

export type Entry = {
  id: string;
  timestamp: number;
  rawUserText: string | null;
  rawAiResponse: string;
  imageReference: string | null;
  parsedMuscleTags: MuscleTag[];
  source: EntrySource;
  sessionEffort: SessionEffort | null;
  sets: SetDetail[] | null;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  imageReference?: string | null;
  entryId?: string;
  sessionEffort?: SessionEffort | null;
  hasMuscles?: boolean;
};
