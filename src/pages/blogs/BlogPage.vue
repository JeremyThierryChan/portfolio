<script setup>
/**
 * BlogPage — three posts, filtered by category.
 *
 * Fixed relative to the old page:
 *   - The card was a `<div @click>`; the post body existed only inside the dialog, so
 *     keyboard users could read no article at all.
 *   - The category label was a concatenated key (`'blog.cat.' + category`) pointing at
 *     a namespace that no longer exists; it now uses `enumLabelKey`, which maps the
 *     `posts` collection onto the `blog` namespace explicitly.
 *   - Selecting the `culture` category produced a blank region with no explanation,
 *     because no post has that category. There is now an empty state.
 *   - The modal lacked Teleport, ARIA, focus handling and a scroll lock.
 *
 * The three posts are authored samples — the source file says "Add real articles here
 * when ready" — so each card is badged as a draft rather than presented as published.
 */
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useContent, enumLabelKey, distinctValues } from '@/content/index.js';
import PageShell from '@/components/layout/PageShell.vue';
import PageHeader from '@/components/layout/PageHeader.vue';
import FilterBar from '@/components/ui/FilterBar.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import AppModal from '@/components/ui/AppModal.vue';

const { t } = useI18n();
const { posts } = useContent();

const ALL = 'all';
const selected = ref(ALL);
const active = ref(null);

const categories = computed(() => distinctValues(posts.value, 'category'));

const options = computed(() => {
  const countFor = (value) =>
    value === ALL ? posts.value.length : posts.value.filter((p) => p.category === value).length;

  return [
    { value: ALL, label: t('common.filterAll'), count: countFor(ALL) },
    ...categories.value.map((value) => ({
      value,
      label: t(enumLabelKey('posts', 'category', value)),
      count: countFor(value),
    })),
  ];
});

const filtered = computed(() =>
  selected.value === ALL
    ? posts.value
    : posts.value.filter((p) => p.category === selected.value),
);

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '';
</script>

<template>
  <PageShell>
    <PageHeader
      :overline="t('blog.overline')"
      :title="t('blog.title')"
      :lede="t('blog.lede')"
      :meta="t('blog.countLabel', { count: posts.length })"
    />

    <FilterBar
      v-model="selected"
      class="blog__filters"
      :options="options"
      :label="t('blog.filterLabel')"
    />

    <ul v-if="filtered.length" class="blog__grid">
      <li v-for="post in filtered" :key="post.id">
        <!--
          A real <button>: the whole card opens the article, and it must be reachable
          by keyboard. The heading inside is not focusable, so the button's accessible
          name is composed from its visible text.
        -->
        <button type="button" class="post" @click="active = post">
          <span class="post__meta">
            <span class="post__cat">{{ t(enumLabelKey('posts', 'category', post.category)) }}</span>
            <time v-if="post.date" class="post__date" :datetime="post.date">{{ formatDate(post.date) }}</time>
            <span v-if="post.draft" class="post__draft">{{ t('blog.draftBadge') }}</span>
          </span>

          <span class="post__title">{{ post.title }}</span>
          <span class="post__excerpt">{{ post.excerpt }}</span>
          <span class="post__cta">{{ t('blog.clickToRead') }} →</span>
        </button>
      </li>
    </ul>

    <EmptyState
      v-else
      :title="t('blog.emptyTitle')"
      :body="t('blog.emptyBody')"
      :action-label="t('common.filterAll')"
      @action="selected = ALL"
    />

    <AppModal
      :model-value="Boolean(active)"
      :title="active?.title ?? ''"
      size="md"
      @update:model-value="(v) => { if (!v) active = null; }"
    >
      <article v-if="active" class="article">
        <p class="article__meta">
          <span class="post__cat">{{ t(enumLabelKey('posts', 'category', active.category)) }}</span>
          <time v-if="active.date" :datetime="active.date">{{ formatDate(active.date) }}</time>
          <span v-if="active.draft" class="post__draft">{{ t('blog.draftBadge') }}</span>
        </p>
        <p class="article__body">{{ active.content }}</p>
      </article>
    </AppModal>
  </PageShell>
</template>

<style scoped>
.blog__filters {
  margin-block-end: var(--space-lg);
}

.blog__grid {
  display: grid;
  gap: var(--space-md);
  list-style: none;
}

@media (min-width: 820px) {
  .blog__grid { grid-template-columns: repeat(2, 1fr); }
}

.post {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  inline-size: 100%;
  block-size: 100%;
  padding: var(--space-md);
  text-align: start;
  background-color: var(--card-bg);
  border: var(--border-width) solid var(--card-border);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  transition:
    transform var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}

.post:hover {
  transform: translateY(var(--hover-lift));
  border-color: var(--accent);
}

.post:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}

.post__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--fg-faint);
}

.post__cat { color: var(--accent); }

.post__draft {
  padding: 0 var(--space-2xs);
  border: var(--border-width) dashed var(--line-strong);
  border-radius: var(--radius-sm);
}

.post__title {
  font-family: var(--font-display);
  font-size: var(--step-1);
  font-weight: var(--weight-display);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--fg);
}

.post__excerpt {
  flex: 1;
  font-size: var(--step--1);
  line-height: var(--leading);
  color: var(--fg-muted);
}

.post__cta {
  font-size: var(--step--1);
  font-weight: var(--weight-strong);
  color: var(--accent);
}

.article {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.article__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--fg-faint);
}

.article__body {
  font-size: var(--step-0);
  line-height: var(--leading-loose);
  color: var(--fg-muted);
}
</style>
