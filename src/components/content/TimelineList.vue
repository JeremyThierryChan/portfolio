<template>
  <ol
    v-if="events && events.length"
    class="timeline"
    :class="`timeline--${style}`"
    role="list"
  >
    <li
      v-for="(event, i) in events"
      :key="event.id"
      class="timeline__item"
      :style="{ '--stagger': String(i) }"
    >
      <article class="timeline__entry">
        <time v-if="event.date" class="timeline__date" :datetime="event.date">
          {{ event.date }}
        </time>
        <span v-else class="timeline__date timeline__date--label">
          {{ event.dateLabel }}
        </span>

        <div class="timeline__body">
          <p class="timeline__category">
            {{ t(enumLabelKey('timeline', 'category', event.category)) }}
          </p>
          <h3 class="timeline__title">{{ event.title }}</h3>
          <p v-if="event.description" class="timeline__desc">{{ event.description }}</p>
        </div>
      </article>
    </li>
  </ol>

  <p v-else class="timeline__empty">{{ t('common.empty') }}</p>
</template>

<script setup>
/**
 * TimelineList — the whole journey (~40 entries), in three expressions:
 *
 *   a  Editorial   mono date in a left column, hairline rules between entries
 *   b  Terminal    a log stream, dates bracketed, inside a ticked frame
 *   c  Magazine    yearbook column: italic serif date, serif title, measured prose
 *
 * Three fixes over the old list:
 *   * `:key` is the entry's own slug id, not the array index. The index hid a data
 *     defect (40 entries sharing only 30 numeric ids) and made Vue reuse the wrong
 *     row when the list was filtered.
 *   * the date is a real <time datetime>, so the entry carries machine-readable
 *     chronology instead of an untyped string.
 *   * the entry animation is staggered by *increasing* index, and no rule sets
 *     `opacity: 0`, so with reduced motion (or animations unavailable) the list
 *     renders fully visible instead of blank.
 *
 * The one undated entry (`datePrecision: 'none'`) renders `dateLabel` — the
 * translatable stand-in — and never a null or an empty cell.
 *
 * Tokens only — see src/styles/TOKENS.md. Enum labels go through enumLabelKey()
 * from @/content, never string concatenation: a new content category must surface
 * as a missing key rather than as a silently rendered key path.
 */
import { useI18n } from 'vue-i18n';

import { enumLabelKey } from '@/content';
import { useTimeTheme } from '@/theme/useTimeTheme.js';

defineProps({
  /** Resolved timeline entries: id (slug) / category / date / datePrecision / dateLabel / title / description */
  events: { type: Array, default: () => [] },
});

const { t } = useI18n();
/** 'a' | 'b' | 'c' — the reactive style axis, resolved by the clock. */
const { style } = useTimeTheme();
</script>

<style scoped>
/* ── shared skeleton ─────────────────────────────────────────────────────── */

.timeline {
  margin: 0;
  padding: 0;
  list-style: none;
}

.timeline__entry {
  display: grid;
  align-items: start;
}

.timeline__date {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.timeline__title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: var(--weight-display);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

.timeline__category,
.timeline__desc {
  margin: 0;
  color: var(--fg-muted);
}

.timeline__category {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  letter-spacing: var(--overline-spacing);
  text-transform: uppercase;
}

.timeline__empty {
  margin: 0;
  color: var(--fg-muted);
}

/*
 * Entrance stagger. The delay grows with the index, so the reading order and the
 * animation order agree (the old list decremented it, so the last row arrived
 * first). `backwards` — not `both` — is deliberate: the animation borrows the
 * invisible first frame only while it is waiting, and once it is done the element
 * returns to its natural, visible style. Nothing below sets `opacity: 0`, so a
 * broken or disabled animation costs the motion and never the content.
 *
 * The step is derived from --dur-instant (a token) rather than a literal, and is
 * capped so the fortieth entry is not left waiting behind the first.
 */
.timeline__item {
  animation: timeline-enter var(--dur-base) var(--ease-out) backwards;
  animation-delay: calc(min(var(--stagger), 14) * var(--dur-instant) / 3);
}

@keyframes timeline-enter {
  from {
    opacity: 0;
    transform: translateY(var(--space-xs));
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* Belt and braces: base.css already collapses motion globally, but this list is
   long enough that a blank page is the failure mode worth naming explicitly. */
@media (prefers-reduced-motion: reduce) {
  .timeline__item { animation: none; }
}

/* ── a · Editorial — dated left column, hairline rules ───────────────────── */

.timeline--a .timeline__entry {
  grid-template-columns: 6rem 1fr;
  gap: var(--space-lg);
  padding-block: var(--space-lg);
  border-top: var(--border-width) solid var(--line);
}

.timeline--a .timeline__item:last-child .timeline__entry {
  border-bottom: var(--border-width) solid var(--line);
}

.timeline--a .timeline__date {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--accent);
  padding-top: var(--space-3xs);
}

.timeline--a .timeline__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.timeline--a .timeline__title { font-size: var(--step-1); }
.timeline--a .timeline__desc { max-width: var(--measure-read); }

/* ── b · Terminal — a log stream in a ticked frame ───────────────────────── */

.timeline--b {
  position: relative;
  padding: var(--space-xs) 0;
  background-color: var(--card-bg);
  border: var(--border-width) solid var(--card-border);
  border-radius: var(--card-radius);
}

.timeline--b::before,
.timeline--b::after {
  content: '';
  position: absolute;
  width: var(--tick-size);
  height: var(--tick-size);
  border: var(--border-width) solid var(--accent);
  pointer-events: none;
}

.timeline--b::before {
  top: calc(-1 * var(--border-width));
  left: calc(-1 * var(--border-width));
  border-right: 0;
  border-bottom: 0;
}

.timeline--b::after {
  right: calc(-1 * var(--border-width));
  bottom: calc(-1 * var(--border-width));
  border-left: 0;
  border-top: 0;
}

.timeline--b .timeline__entry {
  grid-template-columns: 7rem 1fr;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-lg);
  border-top: var(--border-width) solid var(--line);
}

.timeline--b .timeline__item:first-child .timeline__entry { border-top: 0; }

.timeline--b .timeline__date {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--accent);
  padding-top: var(--space-3xs);
}

/* The bracketed timestamp of a log line. Decorative punctuation, so it is drawn
   by CSS rather than duplicated as translatable-looking copy. */
.timeline--b .timeline__date::before { content: '['; color: var(--fg-faint); }
.timeline--b .timeline__date::after { content: ']'; color: var(--fg-faint); }

.timeline--b .timeline__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xs);
}

.timeline--b .timeline__title { font-size: var(--step-0); font-weight: var(--weight-strong); }
.timeline--b .timeline__desc { max-width: var(--measure-read); }

.timeline--b .timeline__category { color: var(--fg-faint); }
.timeline--b .timeline__category::before { content: '#'; }

/* ── c · Magazine — yearbook: italic serif dates, measured prose ─────────── */

.timeline--c .timeline__entry {
  grid-template-columns: 9rem 1fr;
  gap: var(--space-xl);
  padding-block: var(--space-xl);
  border-top: var(--border-width) solid var(--line);
}

.timeline--c .timeline__item:last-child .timeline__entry {
  border-bottom: var(--border-width) solid var(--line);
}

.timeline--c .timeline__date {
  font-family: var(--font-display);
  font-size: var(--step-1);
  font-style: italic;
  line-height: var(--leading-tight);
  color: var(--accent);
}

/* The undated entry uses a sentence instead of a date; drop it a size so the
   stand-in reads as a label rather than as a headline. */
.timeline--c .timeline__date--label {
  font-size: var(--step-0);
  font-style: italic;
  color: var(--fg-muted);
  white-space: normal;
  text-wrap: pretty;
}

.timeline--c .timeline__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.timeline--c .timeline__title { font-size: var(--step-1); }
.timeline--c .timeline__desc {
  line-height: var(--leading-loose);
  max-width: var(--measure-read);
}

/* ── narrow screens ─────────────────────────────────────────────────────── */

@media (max-width: 767.98px) {
  .timeline--a .timeline__entry,
  .timeline--b .timeline__entry,
  .timeline--c .timeline__entry {
    grid-template-columns: 1fr;
    gap: var(--space-2xs);
  }
}
</style>
