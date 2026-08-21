import { FictionalEvent } from '../types/game';

export interface EventTemplate {
  messageKey: string;
  defaultMessage: string;
  heatDelta: number;
}

export const EVENT_TEMPLATES: EventTemplate[] = [
  {
    messageKey: 'event_unknown_signal_title',
    defaultMessage: 'UNKNOWN SIGNAL DETECTED',
    heatDelta: 8,
  },
  {
    messageKey: 'event_activity_increased_title',
    defaultMessage: 'CASE ACTIVITY INCREASED',
    heatDelta: 5,
  },
  {
    messageKey: 'event_trace_detected_title',
    defaultMessage: 'TRACE DETECTED',
    heatDelta: 10,
  },
  {
    messageKey: 'event_pursuit_rising_title',
    defaultMessage: 'PURSUIT LEVEL RISING',
    heatDelta: 12,
  },
  {
    messageKey: 'event_packet_intercept_title',
    defaultMessage: 'PACKET INTERCEPT',
    heatDelta: 6,
  },
];

export function getRandomEvent(): FictionalEvent {
  const index = Math.floor(Math.random() * EVENT_TEMPLATES.length);
  const template = EVENT_TEMPLATES[index];

  return {
    id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    messageKey: template.messageKey,
    defaultMessage: template.defaultMessage,
    heatDelta: template.heatDelta,
  };
}
