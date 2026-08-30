import { MuscleRegion } from './muscles';

export type EntrySource = 'chat' | 'photo';

export type MuscleTag = {
  region: MuscleRegion;
  intensity: number;
};

export type Entry = {
  id: string;
  timestamp: number;
  rawUserText: string | null;
  rawAiResponse: string;
  imageReference: string | null;
  parsedMuscleTags: MuscleTag[];
  source: EntrySource;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  imageReference?: string | null;
};
