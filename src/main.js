import { createApp, watch } from 'vue';
import { createI18n } from 'vue-i18n';

// Design system: tokens, reset and the three style identities. Imported once,
// globally. (The old build pulled a shared stylesheet in via `@import` inside two
// components' <style scoped>, which scoped it to those two components and left the
// other eleven pages to reinvent their own containers.)
import './styles/index.css';

import App from './App.vue';
import router from './router';
import { normalizeLocale, FALLBACK_LOCALE_CODE } from './content/index.js';

import en from './locales/en.js';
import zh from './locales/zh.js';
import fr from './locales/fr.js';
import de from './locales/de.js';
import es from './locales/es.js';
import it from './locales/it.js';

/*
 * The two theme axes (data-style / data-mode) are already on <html> by the time
 * this module runs — the inline bootstrap in index.html applies them before first
 * paint so there is no flash. `useTimeTheme()` takes over from here: the clock, the
 * visitor's overrides, and the crossfade.
 *
 * Do NOT re-derive the theme in this file. Two sources of truth for the theme is
 * exactly what made the old navbar toggle disagree with the stored preference.
 */

/*
 * Validate the persisted locale. The old build read localStorage raw, so a stale or
 * hand-edited value ('ja', 'en-US') silently produced an all-English site while the
 * switcher displayed a language code that does not exist, no dropdown item was
 * marked active, and the visitor had no way to tell what had gone wrong.
 */
const savedLocale = normalizeLocale(localStorage.getItem('locale'));

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: FALLBACK_LOCALE_CODE,
  // Surface missing keys in development rather than silently rendering the key path.
  missingWarn: import.meta.env.DEV,
  fallbackWarn: import.meta.env.DEV,
  messages: { en, zh, fr, de, es, it },
});

const SITE_TITLE = 'Jeremy Thierry Chan — Portfolio';

/*
 * Keep <html lang> in step with the active locale. It used to be static at "en",
 * so screen readers and translation tools were told the wrong language on every
 * non-English visit. The site name itself is a proper noun and is not translated.
 */
function syncDocumentLanguage(locale) {
  document.documentElement.setAttribute('lang', locale);
  document.title = SITE_TITLE;
}

syncDocumentLanguage(savedLocale);

// vue-i18n exposes `locale` as a ref in composition mode; the navbar switcher
// writes to it directly, so watch it here for persistence and <html lang>.
watch(i18n.global.locale, (next) => {
  const safe = normalizeLocale(next);
  syncDocumentLanguage(safe);
  try {
    localStorage.setItem('locale', safe);
  } catch {
    /* private mode — the session still works, it just will not be remembered */
  }
});

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount('#app');
