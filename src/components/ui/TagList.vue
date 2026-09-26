<script setup>
/**
 * TagList — a row of short meta chips (tech stacks, keywords).
 * Renders a real list so a screen reader announces the count.
 */
defineProps({
  items: { type: Array, default: () => [] },
  /** Cap the number shown; the remainder is summarised. */
  max: { type: Number, default: 0 },
  /** Accessible name for the list, e.g. "Tech stack". */
  label: { type: String, default: '' },
  size: { type: String, default: 'md' },
});

const emit = defineEmits([]);
void emit;
</script>

<template>
  <ul class="tag-list" :aria-label="label || undefined">
    <li v-for="tag in items" :key="tag" class="tag-list__item" :class="`tag-list__item--${size}`">
      {{ tag }}
    </li>
    <li v-if="max > 0 && items.length > max" class="tag-list__item tag-list__item--more">
      +{{ items.length - max }}
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
