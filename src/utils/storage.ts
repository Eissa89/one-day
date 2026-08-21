import { GameState, UserPreferences, RecordEntry } from '../types/game';

export const GAME_STATE_KEY = 'one_day_game_state_v1';
export const USER_PREFS_KEY = 'one_day_user_prefs_v1';
export const STORAGE_VERSION = 1;

export const INITIAL_RECORDS: RecordEntry[] = [
  { id: 'record-01', dayNumber: 1, status: 'active' },
  { id: 'record-02', dayNumber: 2, status: 'active' },
  { id: 'record-03', dayNumber: 3, status: 'active' },
  { id: 'record-04', dayNumber: 4, status: 'active' },
  { id: 'record-05', dayNumber: 5, status: 'active' },
];

export const DEFAULT_GAME_STATE: GameState = {
  version: STORAGE_VERSION,
  currentDay: 1,
  status: 'INTRO',
  currentCase: null,
  startTime: null,
  endTime: null,
  penaltyMultiplier: 1,
  heat: 0,
  record: INITIAL_RECORDS,
  eventLog: [],
  lastUpdated: Date.now(),
};

export const DEFAULT_USER_PREFS: UserPreferences = {
  version: STORAGE_VERSION,
  language: 'en',
  soundEnabled: true,
  reducedMotion: false,
};

export function sanitizeGameState(raw: unknown): GameState {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_GAME_STATE, lastUpdated: Date.now() };
  }

  const obj = raw as Partial<GameState>;

  // Check version schema
  if (obj.version !== STORAGE_VERSION) {
    return { ...DEFAULT_GAME_STATE, lastUpdated: Date.now() };
  }

  // Validate status
  const validStatuses = ['INTRO', 'CASE_GENERATED', 'PURSUIT', 'CAUGHT', 'ESCAPED', 'VICTORY'];
  const status = validStatuses.includes(obj.status as string)
    ? (obj.status as GameState['status'])
    : 'INTRO';

  // Validate heat
  let heat = typeof obj.heat === 'number' && !isNaN(obj.heat) ? obj.heat : 0;
  heat = Math.min(100, Math.max(0, heat));

  // Validate penaltyMultiplier
  let penaltyMultiplier = typeof obj.penaltyMultiplier === 'number' && !isNaN(obj.penaltyMultiplier) && obj.penaltyMultiplier >= 1
    ? Math.min(256, obj.penaltyMultiplier)
    : 1;

  // Validate timestamps
  const startTime = typeof obj.startTime === 'number' ? obj.startTime : null;
  const endTime = typeof obj.endTime === 'number' ? obj.endTime : null;

  // Validate record
  let record: RecordEntry[] = Array.isArray(obj.record) ? obj.record : INITIAL_RECORDS;
  record = record.map((r, idx) => ({
    id: typeof r?.id === 'string' ? r.id : `record-0${idx + 1}`,
    dayNumber: typeof r?.dayNumber === 'number' ? r.dayNumber : idx + 1,
    status: r?.status === 'resolved' ? 'resolved' : 'active',
    outcome: r?.outcome === 'CAUGHT' || r?.outcome === 'ESCAPED' ? r.outcome : undefined,
    multiplierWhenClosed: typeof r?.multiplierWhenClosed === 'number' ? r.multiplierWhenClosed : undefined,
  }));

  if (record.length === 0) {
    record = INITIAL_RECORDS;
  }

  return {
    version: STORAGE_VERSION,
    currentDay: typeof obj.currentDay === 'number' && obj.currentDay > 0 ? obj.currentDay : 1,
    status,
    currentCase: obj.currentCase || null,
    startTime,
    endTime,
    penaltyMultiplier,
    heat,
    record,
    eventLog: Array.isArray(obj.eventLog) ? obj.eventLog.slice(0, 20) : [],
    lastUpdated: Date.now(),
  };
}

export function loadGameState(): GameState {
  try {
    const item = localStorage.getItem(GAME_STATE_KEY);
    if (!item) return { ...DEFAULT_GAME_STATE, lastUpdated: Date.now() };
    const parsed = JSON.parse(item);
    return sanitizeGameState(parsed);
  } catch (err) {
    console.warn('Failed to load game state from localStorage, resetting:', err);
    return { ...DEFAULT_GAME_STATE, lastUpdated: Date.now() };
  }
}

export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save game state to localStorage:', err);
  }
}

export function loadUserPrefs(): UserPreferences {
  try {
    const item = localStorage.getItem(USER_PREFS_KEY);
    if (!item) return DEFAULT_USER_PREFS;
    const parsed = JSON.parse(item);
    return {
      version: STORAGE_VERSION,
      language: parsed?.language === 'ar' ? 'ar' : 'en',
      soundEnabled: typeof parsed?.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
      reducedMotion: typeof parsed?.reducedMotion === 'boolean' ? parsed.reducedMotion : false,
    };
  } catch {
    return DEFAULT_USER_PREFS;
  }
}

export function saveUserPrefs(prefs: UserPreferences): void {
  try {
    localStorage.setItem(USER_PREFS_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.warn('Failed to save user prefs to localStorage:', err);
  }
}
