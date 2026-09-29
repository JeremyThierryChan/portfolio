<script setup>
/**
 * TagList — a row of short meta chips (tech stacks, keywords).
 * Renders a real list so a screen reader announces the count.
 */
import { computed } from 'vue';

const props = defineProps({
  items: { type: Array, default: () => [] },
  /** Cap the number shown; the remainder is summarised. 0 (or less) means no cap. */
  max: { type: Number, default: 0 },
  /** Accessible name for the list, e.g. "Tech stack". */
  label: { type: String, default: '' },
  size: { type: String, default: 'md' },
});

/*
 * `max` is a ceiling on what is RENDERED, not merely a number printed on a chip.
 * Capping only the chip left every tag on screen and then claimed some of them were
 * hidden, so the row said "6 tags +3" while all six were visible.
 */
const visible = computed(() =>
  (props.max > 0 ? props.items.slice(0, props.max) : props.items),
);

/** The chip states how many tags it actually replaced, so it is absent at zero. */
const hiddenCount = computed(() =>
  (props.max > 0 ? Math.max(0, props.items.length - props.max) : 0),
);

const emit = defineEmits([]);
void emit;
</script>

<template>
  <ul class="tag-list" :aria-label="label || undefined">
    <li v-for="tag in visible" :key="tag" class="tag-list__item" :class="`tag-list__item--${size}`">
      {{ tag }}
    </li>
    <li v-if="hiddenCount" class="tag-list__item tag-list__item--more">
      +{{ hiddenCount }}
    </li>
  </ul>
</template>

<style scoped>
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3xs);
  list-style: none;
  margin: 0;
  padding: 0;
}

.tag-list__item {
  font-family: var(--font-mono);
  color: var(--fg-muted);
  background-color: var(--bg-sunken);
  border: var(--border-width) solid var(--line);
  border-radius: var(--radius-sm);
  white-space: nowrap;
}

.tag-list__item--md {
  font-size: 0.68rem;
  padding: var(--space-3xs) var(--space-2xs);
}

.tag-list__item--sm {
  font-size: 0.62rem;
  padding: 0.1rem var(--space-2xs);
}

.tag-list__item--more {
  color: var(--fg-faint);
  background-color: transparent;
  border-style: dashed;
}
</style>
