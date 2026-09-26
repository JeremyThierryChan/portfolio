<script setup>
/**
 * TimelinePage — 40 chronological entries.
 *
 * Fixed relative to the old page:
 *   - Entries used `:key="index"` because the source data had 40 entries sharing only
 *     30 ids. The content layer now gives every entry a unique slug, and that slug is
 *     the key.
 *   - The staggered animation delay counted DOWN (1.5s on the first entry, 0s on the
 *     last), so the visual order was the reverse of the reading order.
 *   - Every entry started at `opacity: 0` with `animation-fill-mode: forwards`, so when
 *     animations were unavailable the entire page rendered blank.
 *   - The page was a dead end with no link back to /about. The header now carries the
 *     context and the category filter makes the 40 entries navigable.
 */
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useContent, enumLabelKey, distinctValues } from '@/content/index.js';
import PageShell from '@/components/layout/PageShell.vue';
import PageHeader from '@/components/layout/PageHeader.vue';
import FilterBar from '@/components/ui/FilterBar.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import TimelineList from '@/components/content/TimelineList.vue';

const { t } = useI18n();
const { timeline } = useContent();

const ALL = 'all';
const selected = ref(ALL);

const categories = computed(() => distinctValues(timeline.value, 'category'));

const options = computed(() => {
  const countFor = (value) =>
    value === ALL ? timeline.value.length : timeline.value.filter((e) => e.category === value).length;

  return [
    { value: ALL, label: t('common.filterAll'), count: countFor(ALL) },
    ...categories.value.map((value) => ({
      value,
      label: t(enumLabelKey('timeline', 'category', value)),
      count: countFor(value),
    })),
  ];
});

const filtered = computed(() =>
  selected.value === ALL
    ? timeline.value
    : timeline.value.filter((e) => e.category === selected.value),
);
</script>

<template>
  <PageShell>
    <PageHeader
      :overline="t('timeline.overline')"
      :title="t('timeline.title')"
      :lede="t('timeline.lede')"
      :meta="t('timeline.countLabel', { count: timeline.length })"
    />

    <FilterBar
      v-model="selected"
      class="timeline__filters"
      :options="options"
      :label="t('timeline.categoryLabel')"
    />

    <TimelineList v-if="filtered.length" :events="filtered" />

    <EmptyState
      v-else
      :title="t('common.empty')"
      :action-label="t('common.filterAll')"
      @action="selected = ALL"
    />
  </PageShell>
</template>

<style scoped>
.timeline__filters {
  margin-block-end: var(--space-lg);
}
</style>
