<script setup>
/**
 * App — the shell.
 *
 * A fragment root on purpose: `#app` in index.html is the flex column, so the nav,
 * the routed page and the footer must be its direct children. The previous version
 * wrapped them in another `<div id="app">`, which put a duplicate `id="app"` in the
 * DOM (invalid HTML) and nested the flex context one level deeper than intended.
 *
 * All theme tokens, the reset and the base primitives are imported once in main.js.
 * This file no longer owns a `:root` block of theme variables — that used to be the
 * second source of truth that the navbar's toggle disagreed with.
 */
import { watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import SiteNav from '@/components/layout/SiteNav.vue';
import SiteFooter from '@/components/layout/SiteFooter.vue';
import ThemeExplainer from '@/components/theme/ThemeExplainer.vue';

const { t } = useI18n();
const route = useRoute();

/*
 * Per-route document title. It used to be one static string, so every page in the
 * tab bar, the history and every bookmark carried the same name. The brand name is a
 * proper noun and is not translated.
 */
const BRAND = 'Jeremy Thierry Chan';
const title = computed(() => {
  const key = route.meta?.titleKey;
  const page = key ? t(key) : '';
  return page ? `${page} — ${BRAND}` : BRAND;
});

watch(title, (value) => { document.title = value; }, { immediate: true });
</script>

<template>
  <!--
    First tabbable element on the page: lets a keyboard visitor skip the navigation
    on every route instead of tabbing through it each time.
  -->
  <a class="skip-link" href="#main">{{ t('nav.skipToContent') }}</a>

  <SiteNav />

  <RouterView v-slot="{ Component }">
    <component :is="Component" />
  </RouterView>

  <SiteFooter />

  <!--
    Shown when the clock changes the style while the visitor is present. A site that
    silently restyles itself reads as a bug; this says what happened and offers to
    stop it.
  -->
  <ThemeExplainer />
</template>
