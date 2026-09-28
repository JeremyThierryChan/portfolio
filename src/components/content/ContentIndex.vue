<template>
  <ol
    v-if="items && items.length"
    class="index"
    :class="`index--${style}`"
    role="list"
  >
    <li v-for="(item, i) in items" :key="item.id" class="index__item">
      <router-link class="index__link" :to="item.to">
        <span class="index__marker">
          <!-- b only: the shell prompt. Decorative punctuation, hidden from AT. -->
          <span v-if="style === 'b'" class="index__prompt" aria-hidden="true">$</span>
          <span class="index__sigil">{{ marker(item, i) }}</span>
          <!-- c only: chapter total, hidden from AT because the list already
               announces each item's position. -->
          <span v-if="style === 'c'" class="index__total" aria-hidden="true">/ {{ total }}</span>
        </span>

        <h3 class="index__title">{{ item.title }}</h3>
        <p class="index__desc">{{ item.description }}</p>

        <span class="index__action">
          <span class="index__action-text">{{ item.action }}</span>
          <span class="index__arrow" aria-hidden="true">→</span>
        </span>
      </router-link>
    </li>
  </ol>

  <p v-else class="index__empty">{{ t('common.empty') }}</p>
</template>

<script setup>
/**
 * ContentIndex — the four chapter entries on a landing page, one markup skeleton in
 * three visual languages:
 *
 *   a  Editorial   numbered row, hairline rules, action text + arrow, row shifts right
 *   b  Terminal    shell prompt, `./slug` path, framed with corner ticks, action as a chip
 *   c  Magazine    two-column cards, mono chapter marker, serif title, lift + soft shadow
 *
 * Every entry is a router-link, so all four are real links: keyboard reachable,
 * middle-clickable, and announced with their destination. The old markup attached a
 * click handler to a plain div, which made the entries unreachable by keyboard and
 * invisible to assistive technology.
 *
 * No copy is hard-coded: titles, descriptions and action labels arrive as props. A
 * <ol> rather than a <ul> because the design is explicitly numbered — the ordinal is
 * meaningful, so let the list own it.
 *
 * Design tokens only — see src/styles/TOKENS.md. Nothing here hard-codes a colour,
 * font stack, radius, duration or page width; the three expressions are built from
 * the shared scale plus the per-style flavour tokens (--card-bg, --card-border,
 * --card-radius, --card-shadow, --hover-lift, --overline-spacing, --tick-size).
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useTimeTheme } from '@/theme/useTimeTheme.js';

const props = defineProps({
  /** [{ id, to, title, description, action }] */
  items: { type: Array, default: () => [] },
});

const { t } = useI18n();
/** 'a' | 'b' | 'c' — the reactive style axis, resolved by the clock. */
const { style } = useTimeTheme();

/** Zero-padded chapter total for the magazine marker ("01 / 04"). */
const total = computed(() => String(props.items?.length ?? 0).padStart(2, '0'));

/**
 * The leading marker: a zero-padded ordinal in Editorial and Magazine, and the
 * route-shaped `./slug` path in Terminal.
 */
function marker(item, index) {
  if (style.value === 'b') return `./${item.id}`;
  return String(index + 1).padStart(2, '0');
}
</script>

<style scoped>
/* ── shared skeleton ─────────────────────────────────────────────────────── */

.index {
  margin: 0;
  padding: 0;
  list-style: none;
}

.index__link {
  display: grid;
  align-items: start;
  color: inherit;
  text-decoration: none;
}

.index__marker {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.index__title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: var(--weight-display);
  font-size: var(--step-1);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

.index__desc {
  margin: 0;
  color: var(--fg-muted);
}

.index__action {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  font-family: var(--font-mono);
  font-size: var(--step--1);
  white-space: nowrap;
}

.index__arrow {
  display: inline-block;
  transition: transform var(--dur-base) var(--ease-out);
}

.index__empty {
  margin: 0;
  color: var(--fg-muted);
}

/* One explicit focus ring for every variant; the shared global rule in base.css
   already draws one, but a variant that re-styles a link should say so itself. */
.index__link:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}

/* ── a · Editorial — numbered rows behind hairline rules ─────────────────── */

.index--a .index__link {
  grid-template-columns: 3.5rem 1fr auto;
  grid-template-areas:
    'marker title  action'
    'marker desc   action';
  column-gap: var(--space-lg);
  row-gap: var(--space-2xs);
  padding: var(--space-lg) 0;
  border-top: var(--border-width) solid var(--line);
  transition: padding-left var(--dur-base) var(--ease-out);
}

.index--a .index__item:last-child .index__link {
  border-bottom: var(--border-width) solid var(--line);
}

/* Hover and focus move the row the same way — the movement is decoration, the
   ring is the state, and neither is the only place the information lives. */
.index--a .index__link:hover,
.index--a .index__link:focus-visible {
  padding-left: var(--space-sm);
}

.index--a .index__marker {
  grid-area: marker;
  color: var(--fg-faint);
  padding-top: var(--space-3xs);
}

.index--a .index__title { grid-area: title; }
.index--a .index__desc { grid-area: desc; max-width: var(--measure-read); }

.index--a .index__action {
  grid-area: action;
  align-self: center;
  color: var(--accent);
  font-weight: var(--weight-strong);
  letter-spacing: var(--overline-spacing);
  text-transform: uppercase;
  padding-left: var(--space-md);
}

.index--a .index__link:hover .index__arrow,
.index--a .index__link:focus-visible .index__arrow {
  transform: translateX(var(--space-2xs));
}

/* ── b · Terminal — a command list inside a ticked frame ─────────────────── */

.index--b {
  position: relative;
  background-color: var(--card-bg);
  border: var(--border-width) solid var(--card-border);
  border-radius: var(--card-radius);
}

/* Corner ticks: the Terminal style gets its depth from borders, never shadows. */
.index--b::before,
.index--b::after {
  content: '';
  position: absolute;
  width: var(--tick-size);
  height: var(--tick-size);
  border: var(--border-width) solid var(--accent);
  pointer-events: none;
}

.index--b::before {
  top: calc(-1 * var(--border-width));
  left: calc(-1 * var(--border-width));
  border-right: 0;
  border-bottom: 0;
}

.index--b::after {
  right: calc(-1 * var(--border-width));
  bottom: calc(-1 * var(--border-width));
  border-left: 0;
  border-top: 0;
}

.index--b .index__link {
  grid-template-columns: auto 1fr auto;
  grid-template-areas:
    'marker title  action'
    'marker desc   action';
  column-gap: var(--space-md);
  row-gap: var(--space-3xs);
  padding: var(--space-md) var(--space-lg);
  border-top: var(--border-width) solid var(--line);
  transition: background-color var(--dur-fast) var(--ease-out);
}

.index--b .index__item:first-child .index__link { border-top: 0; }

.index--b .index__link:hover,
.index--b .index__link:focus-visible {
  background-color: var(--bg-sunken);
}

.index--b .index__marker {
  grid-area: marker;
  display: inline-flex;
  align-items: baseline;
  gap: var(--space-2xs);
  padding-top: var(--space-3xs);
}

.index--b .index__prompt { color: var(--accent); font-weight: var(--weight-strong); }
.index--b .index__sigil { color: var(--fg-muted); }
.index--b .index__title { grid-area: title; font-weight: var(--weight-strong); }
.index--b .index__desc { grid-area: desc; max-width: var(--measure-read); }

.index--b .index__action {
  grid-area: action;
  align-self: center;
  padding: var(--space-3xs) var(--space-xs);
  border: var(--border-width) solid var(--line-strong);
  border-radius: var(--radius-sm);
  color: var(--fg-muted);
  transition:
    color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}

.index--b .index__link:hover .index__action,
.index--b .index__link:focus-visible .index__action {
  color: var(--accent);
  border-color: var(--accent);
}

/* ── c · Magazine — chapter cards, image-led rhythm ─────────────────────── */

.index--c {
  display: grid;
  gap: var(--space-lg);
  grid-template-columns: 1fr;
}

.index--c { grid-template-columns: repeat(auto-fit, minmax(min(24rem, 100%), 1fr)); }

.index--c .index__item { display: flex; }

.index--c .index__link {
  flex: 1;
  grid-template-columns: 1fr;
  grid-template-areas:
    'marker'
    'title'
    'desc'
    'action';
  row-gap: var(--space-xs);
  padding: var(--space-lg);
  background-color: var(--card-bg);
  border: var(--border-width) solid var(--card-border);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  transition:
    transform var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out),
    border-color var(--dur-base) var(--ease-out);
}

.index--c .index__link:hover,
.index--c .index__link:focus-visible {
  transform: translateY(var(--hover-lift));
  box-shadow: var(--shadow-md);
  border-color: var(--line-strong);
}

.index--c .index__marker {
  grid-area: marker;
  display: inline-flex;
  align-items: baseline;
  gap: var(--space-2xs);
  color: var(--accent);
  letter-spacing: var(--overline-spacing);
}

.index--c .index__total { color: var(--fg-faint); }
.index--c .index__title { grid-area: title; }
.index--c .index__desc { grid-area: desc; margin-bottom: var(--space-2xs); }

.index--c .index__action {
  grid-area: action;
  align-self: end;
  margin-top: auto;
  color: var(--accent);
  letter-spacing: var(--overline-spacing);
  text-transform: uppercase;
}

.index--c .index__link:hover .index__arrow,
.index--c .index__link:focus-visible .index__arrow {
  transform: translateX(var(--space-2xs));
}

/* ── narrow screens ─────────────────────────────────────────────────────── */

@media (max-width: 767.98px) {
  .index--a .index__link,
  .index--b .index__link {
    grid-template-columns: 1fr;
    grid-template-areas:
      'marker'
      'title'
      'desc'
      'action';
    row-gap: var(--space-xs);
  }

  .index--a .index__action,
  .index--b .index__action {
    justify-self: start;
    align-self: start;
    padding-left: 0;
  }
}
</style>
