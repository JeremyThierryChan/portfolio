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

import { useContent } from '@/content/index.js';
import { pick } from '@/content/resolve.js';
import SiteNav from '@/components/layout/SiteNav.vue';
import SiteFooter from '@/components/layout/SiteFooter.vue';
import ThemeExplainer from '@/components/theme/ThemeExplainer.vue';

const { t, locale } = useI18n();
const route = useRoute();
const { profile } = useContent();

/*
 * The absolute origin. Open Graph scrapers reject a relative image or URL, so the
 * deployment origin has to appear literally somewhere; this is the one place it does.
 */
const ORIGIN = 'https://jeremythierrychan.github.io/portfolio';

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

/**
 * The description for the current route.
 *
 * It REUSES the `lede` each page already shows rather than adding a parallel set written
 * for crawlers. Those are real one-sentence summaries, they are already translated into
 * all six locales, and a second set would be free to say something different from the page
 * it describes. Routes with no lede fall back to the positioning summary, which is the
 * best description of the whole site there is.
 */
const description = computed(() => {
  const key = route.meta?.descKey;
  if (key) {
    const value = t(key);
    // vue-i18n renders the key path itself when a key is missing; that must not ship as a
    // meta description.
    if (value && value !== key) return value;
  }
  /*
   * `positioning` carries its own `i18n` block, and `pick()` flattens only the TOP level
   * of whatever it is handed — so `pick(profile, locale).positioning` is still the raw
   * {based, available, i18n} object, and its `summary` is `undefined`. Every route with no
   * lede was therefore rendering `content=""`, which is how a shared link ended up with no
   * description at all. Pick the nested object itself, the way HomePage already does.
   */
  return pick(profile.value?.positioning, locale.value)?.summary ?? '';
});

/*
 * One canonical form, and it has to match sitemap.xml exactly: no trailing slash on a
 * sub-path, a trailing slash on the root. The first version added a slash to every path,
 * which meant the sitemap and the page each declared a different canonical URL for the
 * same route — the two would have competed.
 */
const canonicalUrl = computed(() => `${ORIGIN}${route.path === '/' ? '/' : route.path}`);

/** Write one tag, creating it if the static HTML did not declare it. */
function writeTag(selector, attributes) {
  const el = document.head.querySelector(selector) ?? document.createElement(selector.startsWith('link') ? 'link' : 'meta');
  for (const [name, value] of Object.entries(attributes)) el.setAttribute(name, value);
  if (!el.parentNode) document.head.appendChild(el);
}

/**
 * Keep the document metadata in step with the route.
 *
 * Guarded twice: there is no `document` during the SSR smoke render, and the harness's
 * stub has no `head`. Neither is an error — it just means there is nothing to update.
 */
function applyMetadata() {
  if (typeof document === 'undefined' || !document.head) return;
  document.title = title.value;
  /*
   * The description-bearing tags are written ONLY when there is a description. `writeTag`
   * sets `content` unconditionally, so an empty string does not mean "leave it alone" — it
   * DELETES the real tags declared in index.html, and the link then gets shared with no
   * description whatsoever. Absent is harmless; blank is not. This is the second half of
   * the fix for the bug above: even if a description ever goes missing again, the static
   * tags survive instead of being blanked out.
   */
  const desc = description.value;
  if (desc) {
    writeTag('meta[name="description"]', { content: desc });
    writeTag('meta[property="og:description"]', { content: desc });
    writeTag('meta[name="twitter:description"]', { content: desc });
  }
  writeTag('meta[property="og:title"]', { content: title.value });
  writeTag('meta[property="og:url"]', { content: canonicalUrl.value });
  writeTag('meta[name="twitter:title"]', { content: title.value });
  writeTag('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl.value });
}

watch([title, description, canonicalUrl], applyMetadata, { immediate: true });
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
