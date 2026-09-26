<script setup>
/**
 * NotFoundPage — the catch-all route.
 *
 * Fixed relative to the old page:
 *   - It was the only route with no i18n at all (hard-coded English), so a
 *     French or Chinese visitor got an English error page. Now fully translated.
 *   - The "return home" link was `<a href="/">`, which under the GitHub Pages base
 *     of `/portfolio/` sent the visitor to the domain root, not the site. Now a
 *     `<router-link>`, which is base-aware.
 *   - Its background was a hard-coded dark gradient plus `color: white`, so it stayed
 *     black in light mode. Now it follows the theme like every other page.
 *   - It used `height: 100vh`, which crops on short viewports; `100dvh` and
 *     min-height instead of a fixed height.
 */
import { useI18n } from 'vue-i18n';
import PageShell from '@/components/layout/PageShell.vue';
import PageHeader from '@/components/layout/PageHeader.vue';
import AppButton from '@/components/ui/AppButton.vue';

const { t } = useI18n();
</script>

<template>
  <PageShell width="read">
    <PageHeader
      :overline="t('notFound.overline')"
      :title="t('notFound.title')"
      :lede="t('notFound.body')"
    />

    <div class="nf">
      <p class="nf__hint">{{ t('notFound.hint') }}</p>
      <AppButton to="/" variant="primary">{{ t('notFound.cta') }}</AppButton>
    </div>
  </PageShell>
</template>

<style scoped>
.nf {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-md);
  padding-block: var(--space-xl);
}

.nf__hint {
  color: var(--fg-muted);
  font-size: var(--step--1);
}
</style>
