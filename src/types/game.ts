export type GameStatus =
  | 'INTRO'
  | 'CASE_GENERATED'
  | 'PURSUIT'
  | 'CAUGHT'
  | 'ESCAPED'
  | 'VICTORY';

export interface Case {
  id: string;
  caseNumber: string;
  titleKey: string;
  descriptionKey: string;
  defaultTitle: string;
  defaultDescription: string;
  multiplier: number;
}

export type RecordStatus = 'active' | 'resolved';

export interface RecordEntry {
  id: string;
  dayNumber: number;
  status: RecordStatus;
  outcome?: 'CAUGHT' | 'ESCAPED';
  multiplierWhenClosed?: number;
}

export interface FictionalEvent {
  id: string;
  timestamp: number;
  messageKey: string;
  defaultMessage: string;
  heatDelta: number;
}

export interface GameState {
  version: number;
  currentDay: number;
  status: GameStatus;
  currentCase: Case | null;
  startTime: number | null; // absolute timestamp ms
  endTime: number | null;   // absolute timestamp ms (startTime + 24 hours)
  penaltyMultiplier: number;
  heat: number; // 0..100
  record: RecordEntry[];
  eventLog: FictionalEvent[];
  lastUpdated: number;
}

export interface UserPreferences {
  version: number;
  language: 'en' | 'ar';
  soundEnabled: boolean;
  reducedMotion: boolean;
}
