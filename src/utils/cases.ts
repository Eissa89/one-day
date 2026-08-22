import { Case, EvidencePiece } from '../types/game';

export const CASE_001_EVIDENCE: EvidencePiece[] = [
  {
    id: 'ev-01',
    titleKey: 'evidence_01_title',
    defaultTitle: 'EVIDENCE #01 — HIDDEN MESSAGE',
    contentKey: 'evidence_01_content',
    defaultContent: `"11:30.\nSame place.\nDon't bring anyone with you.\nHe doesn't know anything yet.\nIf you tell him, he'll act recklessly.\nI'll deal with him.\n— M"`,
    factKey: 'evidence_01_fact',
    defaultFact: 'FACT: Message received at 22:15 detailing a mandatory 23:30 rendezvous regarding your younger brother.',
    interpretationAKey: 'evidence_01_interp_a',
    defaultInterpretationA: 'INTERPRETATION A: Your friend M is conspiring against your brother.',
    interpretationBKey: 'evidence_01_interp_b',
    defaultInterpretationB: 'INTERPRETATION B: Your friend M is secretly shielding your brother from an unknown threat.',
  },
  {
    id: 'ev-02',
    titleKey: 'evidence_02_title',
    defaultTitle: 'EVIDENCE #02 — PHONE PHOTO TIMESTAMP CONTRADICTION',
    contentKey: 'evidence_02_content',
    defaultContent: 'Photo file recovered from friend\'s phone gallery:\nLocation: Docklands Warehouse B\nTimestamp: 3 days ago, 14:22\nSubject: Your younger brother entering Warehouse B.\nFriend\'s prior statement: "I have never visited Docklands Warehouse B until today."',
    factKey: 'evidence_02_fact',
    defaultFact: 'FACT: Your friend lied about when he first visited Docklands Warehouse B.',
    interpretationAKey: 'evidence_02_interp_a',
    defaultInterpretationA: 'INTERPRETATION A: He has been actively tracking and targeting your brother for days.',
    interpretationBKey: 'evidence_02_interp_b',
    defaultInterpretationB: 'INTERPRETATION B: He discovered a danger targeting your brother days ago and has been quietly monitoring it.',
  },
  {
    id: 'ev-03',
    titleKey: 'evidence_03_title',
    defaultTitle: 'EVIDENCE #03 — DELETED CALL RECORD',
    contentKey: 'evidence_03_content',
    defaultContent: 'Call Log:\n23:07 — Incoming Call from UNKNOWN NUMBER (+1-###-###-0941)\nDuration: 04:12\n\nFollow-up Sent Message from Friend to UNKNOWN NUMBER:\n"I won\'t let him go with you. I\'ll meet you alone."',
    factKey: 'evidence_03_fact',
    defaultFact: 'FACT: A 4-minute call occurred with an unidentified party at 23:07.',
    interpretationAKey: 'evidence_03_interp_a',
    defaultInterpretationA: 'INTERPRETATION A: He is bargaining your brother\'s location with an unknown group.',
    interpretationBKey: 'evidence_03_interp_b',
    defaultInterpretationB: 'INTERPRETATION B: He is standing alone between your brother and an unknown hostile entity.',
  },
];

export const CASE_TEMPLATES: Array<Omit<Case, 'id' | 'caseNumber' | 'multiplier'>> = [
  {
    titleKey: 'case_uncertain_protector_title',
    descriptionKey: 'case_uncertain_protector_desc',
    defaultTitle: 'CASE #001 — THE UNCERTAIN PROTECTOR',
    defaultDescription: 'You discover that a trusted childhood friend may be involved in a threat against your younger brother. Two contradictory interpretations exist: betrayal or secret protection.',
    evidence: CASE_001_EVIDENCE,
  },
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
