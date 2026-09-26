<script setup>
/**
 * FilterBar — a single-select filter row.
 *
 * Labels arrive already resolved, so this component stays free of any knowledge
 * about i18n key conventions; the page decides whether a label comes from `t()` or
 * from `enumLabelKey()`.
 *
 * `aria-pressed` carries the selection so it is not communicated by colour alone,
 * and each button is a real `<button>`, so the row is fully keyboard operable.
 */
import { computed } from 'vue';

const props = defineProps({
  /** `[{ value, label, count? }]` — `value` is compared against `modelValue`. */
  options: { type: Array, required: true },
  modelValue: { type: String, required: true },
  /** Accessible name for the group, e.g. "Filter projects by status". */
  label: { type: String, required: true },
  size: { type: String, default: 'md' },
});

const emit = defineEmits(['update:modelValue']);

const hasCounts = computed(() => props.options.some((o) => typeof o.count === 'number'));
</script>

<template>
  <div class="filter-bar" role="group" :aria-label="label">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="filter-bar__btn"
      :class="[`filter-bar__btn--${size}`, { 'is-active': option.value === modelValue }]"
      :aria-pressed="option.value === modelValue"
      @click="emit('update:modelValue', option.value)"
    >
      <span class="filter-bar__label">{{ option.label }}</span>
      <span v-if="hasCounts && typeof option.count === 'number'" class="filter-bar__count">
        {{ option.count }}
      </span>
    </button>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2xs);
}

.filter-bar__btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  font-family: var(--font-body);
  font-weight: var(--weight-strong);
  color: var(--fg-muted);
  background-color: transparent;
  border: var(--border-width) solid var(--line-strong);
  border-radius: var(--radius-full);
  letter-spacing: var(--tracking-wide);
  transition:
    background-color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out);
}

.filter-bar__btn--md {
  block-size: var(--control-height-sm);
  padding-inline: var(--space-sm);
  font-size: var(--step--1);
}

.filter-bar__btn--sm {
  block-size: 1.75rem;
  padding-inline: var(--space-xs);
  font-size: 0.72rem;
}

.filter-bar__btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/*
 * Selected state uses BOTH a fill and an inset ring, so it is distinguishable
 * without relying on hue.
 */
.filter-bar__btn.is-active {
  background-color: var(--accent);
  border-color: var(--accent);
  color: var(--accent-fg);
  box-shadow: inset 0 0 0 var(--border-width) var(--accent-fg);
}

.filter-bar__btn:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}

.filter-bar__count {
  font-family: var(--font-mono);
  font-size: 0.9em;
  opacity: 0.7;
  font-variant-numeric: tabular-nums;
}
</style>
