<script setup>
/**
 * AudiencePicker — "I'm here about…".
 *
 * The site sells nine services to four quite different kinds of client, and rather
 * than rank them the visitor says what they came for. This component is that question.
 *
 * THREE RULES IT EXISTS TO ENFORCE
 *
 *  1. IT IS NOT A GATE. The page underneath is already complete when this renders. The
 *     visitor can ignore it entirely and lose nothing — a "choose your path" interstitial
 *     is the version of this idea that loses half its traffic.
 *
 *  2. THE FILTERED STATE IS ALWAYS VISIBLE. If content has been reordered, the page says
 *     so out loud with a one-click way back. A silent filter makes people think the site
 *     is broken or that work is missing.
 *
 *  3. IT NEVER REMOVES ANYTHING. Selection reorders and collapses; the collapsed group is
 *     countable and expandable, so the breadth that is the point of this portfolio stays
 *     legible.
 *
 * Implemented as a radio group with roving tabindex: the semantics are "exactly one of
 * these", which `aria-pressed` cannot express, and arrow keys move focus AND selection the
 * way a native radio group does.
 */
import { ref, computed, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useContent } from '@/content/index.js';
import { useAudience } from '@/composables/useAudience.js';

const props = defineProps({
  /** 'full' — the question plus the options. 'status' — only the "you are viewing…" line. */
  variant: { type: String, default: 'full' },
  /** Drop the explanatory sentence and the per-option descriptions. */
  compact: { type: Boolean, default: false },
});

const { t } = useI18n();

// Labels come from the locale-resolved content layer, so the picker stays free of any
// knowledge about how translations are stored.
const { audiences } = useContent();
const { current, currentAudience, isFiltered, allValue, set, reset } = useAudience();

void props;

const activeLabel = computed(() => currentAudience.value?.label ?? '');

/** "Show everything" is presented as one more choice, not as a reset button. */
const entries = computed(() => [
  { id: allValue, label: t('audience.allLabel'), need: t('audience.allNeed') },
  ...audiences.value.map((a) => ({ id: a.id, label: a.label, need: a.need })),
]);

const groupRef = ref(null);

const tabIndexFor = (id) => (id === current.value ? 0 : -1);

/**
 * Focus by querying the group rather than collecting element refs: a `ref` callback inside
 * a `v-for` that pushes into an array accumulates across re-renders unless explicitly reset.
 */
function focusOption(id) {
  groupRef.value?.querySelector(`[data-value="${CSS.escape(id)}"]`)?.focus();
}

/** Arrow keys move focus and selection together, as a native radio group does. */
function onKeydown(event) {
  const ids = entries.value.map((e) => e.id);
  const at = ids.indexOf(current.value);
  let next = null;

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown': next = ids[(at + 1) % ids.length]; break;
    case 'ArrowLeft':
    case 'ArrowUp': next = ids[(at - 1 + ids.length) % ids.length]; break;
    case 'Home': next = ids[0]; break;
    case 'End': next = ids[ids.length - 1]; break;
    default: return;
  }

  event.preventDefault();
  set(next);
  nextTick(() => focusOption(next));
}
</script>

<template>
  <!-- The persistent state line. Rendered in both variants, because a reordered page must
       always say that it is reordered. -->
  <p v-if="isFiltered" class="ap__status" role="status">
    <span class="ap__status-dot" aria-hidden="true" />
    <span>{{ t('audience.showingFor', { label: activeLabel }) }}</span>
    <button type="button" class="ap__reset" @click="reset">{{ t('audience.showAll') }}</button>
  </p>

  <section v-if="variant === 'full'" ref="groupRef" class="ap" :class="{ 'ap--compact': compact }">
    <div class="ap__head">
      <h2 class="ap__title">{{ t('audience.title') }}</h2>
      <p v-if="!compact" class="ap__hint">{{ t('audience.hint') }}</p>
    </div>

    <div
      class="ap__options"
      role="radiogroup"
      :aria-label="t('audience.title')"
      @keydown="onKeydown"
    >
      <button
        v-for="entry in entries"
        :key="entry.id"
        type="button"
        class="ap__option"
        :class="{ 'is-selected': entry.id === current }"
        :data-value="entry.id"
        role="radio"
        :aria-checked="entry.id === current"
        :tabindex="tabIndexFor(entry.id)"
        @click="set(entry.id)"
      >
        <span class="ap__check" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="11" height="11" focusable="false">
            <path
              d="M3 8.5l3.2 3.2L13 5"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span class="ap__label">{{ entry.label }}</span>
        <span v-if="!compact && entry.need" class="ap__need">{{ entry.need }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
/* ── persistent filtered-state line ────────────────────────────────────── */

.ap__status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-xs);
  margin-block-end: var(--space-md);
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--step--1);
  color: var(--fg-muted);
  background-color: var(--accent-soft);
  border: var(--border-width) solid var(--line);
  border-inline-start: 2px solid var(--accent);
  border-radius: var(--radius-sm);
}

.ap__status-dot {
  inline-size: 0.45rem;
  block-size: 0.45rem;
  border-radius: var(--radius-full);
  background-color: var(--accent);
  flex: none;
}

.ap__reset {
  margin-inline-start: auto;
  font: inherit;
  font-weight: var(--weight-strong);
  color: var(--accent);
  background: none;
  border: 0;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 0.18em;
}

.ap__reset:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
  border-radius: var(--radius-sm);
}

/* ── the question ─────────────────────────────────────────────────────── */

.ap {
  margin-block-end: var(--space-xl);
  padding-block-end: var(--space-lg);
  border-block-end: var(--border-width) solid var(--line);
}

.ap__head {
  margin-block-end: var(--space-md);
}

.ap__title {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  font-weight: var(--weight-strong);
  text-transform: var(--overline-transform);
  letter-spacing: var(--overline-spacing);
  color: var(--accent);
  margin-block-end: var(--space-2xs);
}

.ap__hint {
  font-size: var(--step--1);
  line-height: var(--leading);
  color: var(--fg-muted);
  max-inline-size: var(--measure-read);
}

.ap__options {
  display: grid;
  gap: var(--space-xs);
}

@media (min-width: 720px) {
  .ap__options {
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  }
}

.ap__option {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-2xs) var(--space-xs);
  align-items: start;
  text-align: start;
  padding: var(--space-sm);
  background-color: var(--card-bg);
  border: var(--border-width) solid var(--card-border);
  border-radius: var(--card-radius);
  transition:
    border-color var(--dur-fast) var(--ease-out),
    background-color var(--dur-fast) var(--ease-out);
}

.ap__option:hover {
  border-color: var(--accent);
}

.ap__option:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}

/* Selection is carried by a check mark and a doubled border, never by hue alone. */
.ap__option.is-selected {
  border-color: var(--accent);
  box-shadow: inset 0 0 0 var(--border-width) var(--accent);
  background-color: var(--accent-soft);
}

.ap__check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.15rem;
  block-size: 1.15rem;
  margin-block-start: 0.1rem;
  border: var(--border-width) solid var(--line-strong);
  border-radius: var(--radius-full);
  color: transparent;
  flex: none;
}

.ap__option.is-selected .ap__check {
  color: var(--accent-fg);
  background-color: var(--accent);
  border-color: var(--accent);
}

.ap__label {
  font-family: var(--font-display);
  font-size: var(--step-0);
  font-weight: var(--weight-strong);
  color: var(--fg);
}

.ap__need {
  grid-column: 2;
  font-size: var(--step--1);
  line-height: var(--leading);
  color: var(--fg-muted);
}

.ap--compact .ap__need {
  display: none;
}
</style>
