import { Case } from '../types/game';

export const CASE_TEMPLATES: Array<Omit<Case, 'id' | 'caseNumber' | 'multiplier'>> = [
  {
    titleKey: 'case_forbidden_memory_title',
    descriptionKey: 'case_forbidden_memory_desc',
    defaultTitle: 'THE FORBIDDEN MEMORY',
    defaultDescription: 'A fragmented narrative log recovered from a decommissioned mainframe. Accessing it flagged your signature.',
  },
  {
    titleKey: 'case_missing_hour_title',
    descriptionKey: 'case_missing_hour_desc',
    defaultTitle: 'THE MISSING HOUR',
    defaultDescription: 'A sixty-minute gap recorded in the central surveillance registry. The system demands reconciliation.',
  },
  {
    titleKey: 'case_red_file_title',
    descriptionKey: 'case_red_file_desc',
    defaultTitle: 'THE RED FILE',
    defaultDescription: 'A classified fictional document detailing non-existent network anomalies. Pursuers are monitoring the channel.',
  },
  {
    titleKey: 'case_last_signal_title',
    descriptionKey: 'case_last_signal_desc',
    defaultTitle: 'THE LAST SIGNAL',
    defaultDescription: 'A silent broadcast originating from a dark telemetry node. Responding initiates tracking.',
  },
  {
    titleKey: 'case_empty_room_title',
    descriptionKey: 'case_empty_room_desc',
    defaultTitle: 'THE EMPTY ROOM',
    defaultDescription: 'An unindexed virtual space containing residual memory artifacts. Clearance level restricted.',
  },
  {
    titleKey: 'case_lost_name_title',
    descriptionKey: 'case_lost_name_desc',
    defaultTitle: 'THE LOST NAME',
    defaultDescription: 'An erased identity entry deep inside the vault. Attempting recovery draws automated pursuit.',
  },
  {
    titleKey: 'case_unopened_letter_title',
    descriptionKey: 'case_unopened_letter_desc',
    defaultTitle: 'THE UNOPENED LETTER',
    defaultDescription: 'A sealed digital packet held in quarantine. Breaking the seal activates the 24-hour cycle.',
  },
];

export function generateFictionalCase(dayNumber: number, currentMultiplier: number = 1): Case {
  const caseNumInt = Math.floor(100 + Math.random() * 899);
  const templateIndex = (dayNumber - 1 + Math.floor(Math.random() * CASE_TEMPLATES.length)) % CASE_TEMPLATES.length;
  const template = CASE_TEMPLATES[templateIndex];

  return {
    id: `case-${dayNumber}-${Date.now()}`,
    caseNumber: `#${caseNumInt}`,
    titleKey: template.titleKey,
    descriptionKey: template.descriptionKey,
    defaultTitle: template.defaultTitle,
    defaultDescription: template.defaultDescription,
    multiplier: currentMultiplier,
  };
}
