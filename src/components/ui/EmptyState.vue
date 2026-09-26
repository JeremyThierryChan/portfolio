<script setup>
/**
 * EmptyState — shown when a filter matches nothing.
 *
 * Previously a filter with no results (for example the blog's `culture` category,
 * which has no posts at all) rendered an empty region with no explanation, so the
 * page looked broken rather than filtered.
 */
import AppButton from './AppButton.vue';

defineProps({
  title: { type: String, required: true },
  body: { type: String, default: '' },
  /** Optional reset action. */
  actionLabel: { type: String, default: '' },
  to: { type: [String, Object], default: null },
});

defineEmits(['action']);
</script>

<template>
  <div class="empty-state" role="status">
    <p class="empty-state__title">{{ title }}</p>
    <p v-if="body" class="empty-state__body">{{ body }}</p>
    <AppButton
      v-if="actionLabel"
      variant="secondary"
      size="sm"
      :to="to"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </AppButton>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  text-align: center;
  padding: var(--space-2xl) var(--space-md);
  border: var(--border-width) dashed var(--line-strong);
  border-radius: var(--card-radius);
  background-color: var(--bg-sunken);
}

.empty-state__title {
  font-family: var(--font-display);
  font-size: var(--step-1);
  color: var(--fg);
}

.empty-state__body {
  color: var(--fg-muted);
  font-size: var(--step--1);
  max-inline-size: 44ch;
}
</style>
