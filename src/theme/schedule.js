/**
 * Time-of-day styling schedule.
 *
 * The site ships three visual styles over one content set, chosen by the visitor's
 * local clock:
 *
 *   07:00 – 12:00  A  Editorial   — morning; formal, professional enquiries
 *   12:00 – 18:00  C  Magazine    — afternoon; lifestyle-leaning audience
 *   18:00 – 07:00  B  Terminal    — evening and late night; younger, creative traffic
 *
 * Everything here is PURE: no DOM, no storage, no timers. The composable in
 * `useTimeTheme.js` owns the side effects. Keeping the schedule pure is what makes
 * the boundary behaviour testable — see `tests/schedule.test.mjs`.
 *
 * Intervals are half-open: `[start, end)`. So 12:00:00 sharp already belongs to C,
 * and 07:00:00 sharp already belongs to A. A slot whose `end` is numerically less
 * than its `start` wraps past midnight.
 */

export const MINUTES_PER_DAY = 24 * 60;

/** The three styles, plus the mode each one is designed around. */
export const STYLES = {
  a: {
    id: 'a',
    short: 'A',
    name: 'Editorial',
    preferredMode: 'light',
    blurb: 'Serif display, hairline rules, numbered sections. Formal and calm.',
  },
  b: {
    id: 'b',
    short: 'B',
    name: 'Terminal',
    preferredMode: 'dark',
    blurb: 'Monospace metadata, visible grid, sharp corners. Nocturnal and technical.',
  },
  c: {
    id: 'c',
    short: 'C',
    name: 'Magazine',
    preferredMode: 'light',
    blurb: 'Cream paper, serif body, image-led blocks. Warm and human.',
  },
};

export const STYLE_IDS = Object.keys(STYLES);

/**
 * Declarative schedule. Order matters only for readability — slots are checked by
 * range, and the wrap-around slot is handled explicitly rather than by ordering.
 */
export const SCHEDULE = [
  {
    style: 'a',
    start: 7 * 60,
    end: 12 * 60,
    label: 'Morning',
    rationale: 'Professional and formal enquiries — people who check their inbox before lunch.',
  },
  {
    style: 'c',
    start: 12 * 60,
    end: 18 * 60,
    label: 'Afternoon',
    rationale: 'A more personal, lifestyle-leaning audience browsing during the day.',
  },
  {
    style: 'b',
    start: 18 * 60,
    end: 7 * 60,
    label: 'Evening & night',
    rationale: 'Creative, younger traffic — the hour when side projects get worked on.',
  },
];

/** Used only if the schedule somehow fails to cover a minute. */
export const DEFAULT_STYLE = 'b';

/** Normalise any minute count (including negative) into [0, 1440). */
export function wrapMinutes(minutes) {
  return ((Math.floor(minutes) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
}

/** Minutes since local midnight for a Date. */
export function minutesOf(date) {
  return date.getHours() * 60 + date.getMinutes();
}

/** Does `minutes` fall inside this slot? Handles slots that wrap past midnight. */
export function slotContains(slot, minutes) {
  const m = wrapMinutes(minutes);
  return slot.start < slot.end
    ? m >= slot.start && m < slot.end
    : m >= slot.start || m < slot.end;
}

/** The schedule slot covering `minutes`, or null. */
export function slotForMinutes(minutes) {
  return SCHEDULE.find((slot) => slotContains(slot, minutes)) ?? null;
}

/** Which style id applies at `minutes` since midnight. */
export function styleForMinutes(minutes) {
  return slotForMinutes(minutes)?.style ?? DEFAULT_STYLE;
}

/** Which style id applies at this Date (visitor's local time). */
export function styleForDate(date = new Date()) {
  return styleForMinutes(minutesOf(date));
}

/** 'HH:MM' for a minute offset — used by the UI to state the next window. */
export function formatMinutes(minutes) {
  const m = wrapMinutes(minutes);
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

/**
 * The Date at which the schedule next changes, strictly after `date`.
 *
 * Lets the UI sleep until the exact boundary instead of polling every second, and
 * lets it tell the visitor "switches to Terminal at 18:00".
 */
export function nextChangeAfter(date = new Date()) {
  const nowMinutes = minutesOf(date);

  const boundaries = [...new Set(SCHEDULE.flatMap((s) => [wrapMinutes(s.start), wrapMinutes(s.end)]))]
    .sort((x, y) => x - y);

  // The first boundary strictly after now (strictly, so a boundary at the current
  // minute counts as already applied rather than as "upcoming").
  const ahead = boundaries.find((b) => b > nowMinutes);
  const deltaMinutes = ahead !== undefined
    ? ahead - nowMinutes
    : MINUTES_PER_DAY - nowMinutes + boundaries[0];

  const next = new Date(date.getTime());
  next.setHours(0, 0, 0, 0);
  // setMinutes overflows into the next day correctly, which is what carries the
  // 18:00 → 07:00 wrap past midnight.
  next.setMinutes(nowMinutes + deltaMinutes);
  next.setSeconds(0, 0);
  return next;
}

/** Milliseconds from `date` until the next scheduled change. */
export function msUntilNextChange(date = new Date()) {
  return Math.max(1000, nextChangeAfter(date).getTime() - date.getTime());
}

/** Human summary of the whole schedule, for the explainer UI. */
export function scheduleSummary() {
  return SCHEDULE.map((s) => ({
    ...s,
    window: `${formatMinutes(s.start)}–${formatMinutes(s.end)}`,
    styleName: STYLES[s.style].name,
  }));
}
