<script setup>
/**
 * StatusPill — a content enum rendered as a labelled, colour-coded chip.
 *
 * The label is looked up through `enumLabelKey`, never by string concatenation, so a
 * new status value in the content layer surfaces as a missing key (which
 * `npm run verify:i18n` fails on) instead of a raw `projects.status.foo` printed to
 * the visitor.
 *
 * Colour is never the only signal: the text label is always present, and each state
 * also carries a distinct dot shape/size so it reads without colour.
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { enumLabelKey } from '@/content/index.js';

const props = defineProps({
  /** The enum value, e.g. 'in-progress'. */
  status: { type: String, required: true },
  /** Which collection's namespace to look the label up in. */
  collection: { type: String, default: 'projects' },
  /** Field name inside that namespace. */
  field: { type: String, default: 'status' },
  /** 'md' | 'sm' */
  size: { type: String, default: 'md' },
});

const { t } = useI18n();

const label = computed(() => t(enumLabelKey(props.collection, props.field, props.status)));

/**
 * Visual tone. Content enums are free-form strings, so anything unrecognised falls
 * back to `neutral` rather than throwing.
 */
const tone = computed(() => {
  const known = {
    'in-progress': 'progress',
    paused: 'paused',
    completed: 'done',
  };
  return known[props.status] ?? 'neutral';
});
</script>

<template>
  <span class="status-pill" :class="[`status-pill--${tone}`, `status-pill--${size}`]">
    <span class="status-pill__dot" aria-hidden="true" />
    {{ label }}
  </span>
</template>

<style scoped>
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  font-family: var(--font-mono);
  font-weight: var(--weight-strong);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  border: var(--border-width) solid currentColor;
  border-radius: var(--radius-full);
  background-color: transparent;
  white-space: nowrap;
}

.status-pill--md {
  font-size: 0.68rem;
  padding: var(--space-3xs) var(--space-xs);
}

.status-pill--sm {
  font-size: 0.6rem;
  padding: var(--space-3xs) var(--space-2xs);
}

/* The dot differs in SIZE as well as colour, so the state survives greyscale. */
.status-pill__dot {
  inline-size: 0.4em;
  block-size: 0.4em;
  border-radius: var(--radius-full);
  background-color: currentColor;
  flex: none;
}

.status-pill--progress { color: var(--warn); }
.status-pill--progress .status-pill__dot { inline-size: 0.4em; block-size: 0.4em; }

.status-pill--done { color: var(--ok); }
.status-pill--done .status-pill__dot { inline-size: 0.55em; block-size: 0.55em; }

.status-pill--paused { color: var(--fg-faint); }
.status-pill--paused .status-pill__dot {
  border-radius: 0;
  inline-size: 0.45em;
  block-size: 0.45em;
}

.status-pill--neutral { color: var(--fg-muted); }
</style>
