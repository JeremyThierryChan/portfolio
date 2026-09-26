<script setup>
/**
 * PageHeader — the standard page opener: an overline, an <h1>, and a lede.
 *
 * Exactly one <h1> per route. The old build used <h2> on some pages, <h1> on others
 * and <h2> again inside the About subtree, so the heading outline was inconsistent
 * and some pages had no top-level heading at all.
 */
defineProps({
  /** Small uppercase label above the title. */
  overline: { type: String, default: '' },
  title: { type: String, required: true },
  lede: { type: String, default: '' },
  /** Optional right-aligned meta, e.g. a count. */
  meta: { type: String, default: '' },
  size: { type: String, default: 'md' },
});
</script>

<template>
  <header class="page-header" :class="`page-header--${size}`">
    <div class="page-header__main">
      <p v-if="overline" class="page-header__overline">{{ overline }}</p>
      <h1 class="page-header__title">{{ title }}</h1>
      <p v-if="lede" class="page-header__lede">{{ lede }}</p>
    </div>

    <div v-if="meta || $slots.actions" class="page-header__aside">
      <p v-if="meta" class="page-header__meta">{{ meta }}</p>
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-md);
  margin-block-end: var(--space-xl);
  padding-block-end: var(--space-md);
  border-bottom: var(--border-width) solid var(--line);
}

.page-header__main {
  flex: 1 1 30rem;
  min-inline-size: 0;
}

.page-header__overline {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  font-weight: var(--weight-strong);
  text-transform: var(--overline-transform);
  letter-spacing: var(--overline-spacing);
  color: var(--accent);
  margin-block-end: var(--space-xs);
}

.page-header__title {
  font-size: var(--step-3);
  margin-block-end: var(--space-sm);
}

.page-header--sm .page-header__title { font-size: var(--step-2); }

.page-header__lede {
  font-size: var(--step-0);
  line-height: var(--leading-loose);
  color: var(--fg-muted);
  max-inline-size: var(--measure-read);
}

.page-header__aside {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-xs);
}

.page-header__meta {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--fg-faint);
  white-space: nowrap;
}

@media (max-width: 640px) {
  .page-header {
    align-items: flex-start;
  }
  .page-header__aside {
    align-items: flex-start;
  }
}
</style>
