<script setup>
/**
 * SiteNav — the site header.
 *
 * Replaces `components/NavigationBar.vue`, whose defects this fixes:
 *   1. The About submenu opened on `@mouseenter` only. A keyboard user could
 *      never reach About Me / Timeline / Skills / Testimonials — the links
 *      existed in the DOM but were unreachable. There is now a real
 *      disclosure button (`aria-expanded` + `aria-haspopup` + `aria-controls`),
 *      it opens on hover *and* on keyboard focus, Esc closes it and returns
 *      focus to the trigger, and Tab is contained while it is open.
 *   2. The language list was hard-coded in the component. It now comes from
 *      `LOCALE_META`, the single source of truth, and the active item carries
 *      `aria-current`.
 *   3. The switcher trigger was an icon-ish button with no accessible name.
 *      Icon-only controls here always carry `aria-label`.
 *   4. The old bar invented its own colour literals and leaned on retired
 *      variables. Everything below is drawn from the token contract.
 *
 * The appearance control is a separate component (`theme/ThemeControl.vue`);
 * this file only places it.
 *
 * The About trigger is a *link* (/about) next to a *button* (the disclosure):
 * splitting them is what lets the page stay navigable while the submenu is
 * still operable from the keyboard.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import ThemeControl from '@/components/theme/ThemeControl.vue';
import SiteNotice from '@/components/layout/SiteNotice.vue';
import { LOCALE_META, normalizeLocale } from '@/content';
import { formatMinutes, scheduleSummary } from '@/theme/schedule.js';
import { useTimeTheme } from '@/theme/useTimeTheme.js';

/** A proper noun: the site name is not translated (see main.js). */
const SITE_NAME = 'Jeremy Thierry Chan';

/* ids for aria-controls — stable strings, not generated per instance. */
const PRIMARY_NAV_ID = 'site-nav-primary';
const ABOUT_MENU_ID = 'site-nav-about-menu';
const LANG_MENU_ID = 'site-nav-languages';

const { t, locale } = useI18n();
const route = useRoute();
const { style, styleMeta, nextStyleMeta, nextChangeLabel } = useTimeTheme();

/* ── navigation model ────────────────────────────────────────────────────── */

/**
 * Primary destinations, each labelled by a `nav.*` entry.
 *
 * `Services` comes first because the site's goal is inbound work: a prospective client
 * needs to find what can be hired within one glance, and burying it behind Projects
 * (which is evidence, not an offer) inverted the order of the conversation.
 */
const primaryLinks = [
  { to: '/', labelKey: 'nav.home' },
  { to: '/services', labelKey: 'nav.services' },
  { to: '/projects', labelKey: 'nav.projects' },
  { to: '/about', labelKey: 'nav.about', submenu: true },
  { to: '/gallery', labelKey: 'nav.gallery' },
  { to: '/blog', labelKey: 'nav.blog' },
  { to: '/resume', labelKey: 'nav.resume' },
  { to: '/contact', labelKey: 'nav.contact' },
];

/** The About section's own pages. */
const aboutLinks = [
  { to: '/about', labelKey: 'nav.aboutMe' },
  { to: '/about/timeline', labelKey: 'nav.timeline' },
  { to: '/about/skills', labelKey: 'nav.skills' },
  { to: '/about/testimonials', labelKey: 'nav.testimonials' },
];

/* ── element references ──────────────────────────────────────────────────── */

const headerEl = ref(null);
const langWrapEl = ref(null);
const langMenuEl = ref(null);
const langToggleEl = ref(null);
const mobileToggleEl = ref(null);

const aboutGroupEl = ref(null);
const aboutMenuEl = ref(null);
const aboutToggleEl = ref(null);

/* The disclosure lives inside a `v-for`, where a string template ref collects
   into an array. Function refs keep it a single element. */
function setAboutGroup(el) { aboutGroupEl.value = el; }
function setAboutMenu(el) { aboutMenuEl.value = el; }
function setAboutToggle(el) { aboutToggleEl.value = el; }

/* ── state ───────────────────────────────────────────────────────────────── */

const mobileOpen = ref(false);
const aboutOpen = ref(false);
const langOpen = ref(false);

/* ── current route ───────────────────────────────────────────────────────── */

function normalizePath(path) {
  if (!path) return '/';
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
}

const currentPath = computed(() => normalizePath(route.path));

/** Exactly this page — the only case that earns `aria-current="page"`. */
function isCurrentPage(to) {
  return currentPath.value === normalizePath(to);
}

/** A page inside this section (e.g. /about/skills under /about). */
function isActiveSection(to) {
  const base = normalizePath(to);
  return base !== '/' && currentPath.value.startsWith(`${base}/`);
}

function linkClass(to) {
  return { 'is-current': isCurrentPage(to), 'is-section': isActiveSection(to) };
}

/* ── About disclosure ────────────────────────────────────────────────────── */

function openAbout() {
  aboutOpen.value = true;
}

function closeAbout({ restoreFocus = false } = {}) {
  if (!aboutOpen.value) return;
  aboutOpen.value = false;
  if (restoreFocus) aboutToggleEl.value?.focus();
}

function toggleAbout() {
  if (aboutOpen.value) closeAbout();
  else openAbout();
}

/*
 * `@focus` is how a keyboard user opens the submenu — the requirement the old
 * navbar failed. A pointer press also focuses the button, so a press is flagged
 * and skips the focus-open: otherwise the click that follows would immediately
 * close what focusing had just opened.
 */
let aboutPointerDriven = false;

function onAboutTogglePointerDown() {
  aboutPointerDriven = true;
}

function onAboutToggleFocus() {
  if (aboutPointerDriven) {
    aboutPointerDriven = false;
    return;
  }
  openAbout();
}

function onAboutGroupLeave() {
  // Focusing inside the group also fires mouseleave; the visitor is clearly
  // still using the menu, so only a genuine unwind closes it.
  if (aboutGroupEl.value?.contains(document.activeElement)) return;
  closeAbout();
}

function onAboutGroupFocusOut(event) {
  const next = event.relatedTarget;
  if (next && aboutGroupEl.value?.contains(next)) return;
  closeAbout();
}

function focusFirstAboutItem() {
  const first = aboutMenuEl.value?.querySelector('a[href]');
  first?.focus();
}

function openAboutAndFocusFirst() {
  openAbout();
  nextTick(focusFirstAboutItem);
}

/**
 * Containment: while the submenu is open, Tab cycles inside it instead of
 * escaping and leaving an open menu behind. Esc — handled on the document, so
 * it works however the menu was opened — closes it and hands focus back to the
 * trigger, which is the way out.
 */
function onAboutMenuKeydown(event) {
  if (event.key !== 'Tab') return;
  const items = Array.from(aboutMenuEl.value?.querySelectorAll('a[href], button') ?? []);
  if (items.length === 0) return;

  const index = items.indexOf(document.activeElement);
  if (index === -1) return;

  const nextIndex = event.shiftKey ? index - 1 : index + 1;
  if (nextIndex < 0 || nextIndex >= items.length) {
    event.preventDefault();
    items[event.shiftKey ? items.length - 1 : 0].focus();
  }
}

/* ── language switcher ───────────────────────────────────────────────────── */

const currentLocaleCode = computed(() => normalizeLocale(locale.value));

const currentLocale = computed(
  () => LOCALE_META.find((meta) => meta.code === currentLocaleCode.value) ?? LOCALE_META[0],
);

/* "Change language: EN" — the visible short code stays part of the accessible
   name, so voice control still matches what is on screen (WCAG 2.5.3). */
const languageButtonLabel = computed(
  () => `${t('nav.languageLabel')}: ${currentLocale.value.short}`,
);

let langPointerDriven = false;

function openLang() {
  langOpen.value = true;
}

function closeLang({ restoreFocus = false } = {}) {
  if (!langOpen.value) return;
  langOpen.value = false;
  if (restoreFocus) langToggleEl.value?.focus();
}

function toggleLang() {
  if (langOpen.value) closeLang();
  else openLang();
}

function onLangTogglePointerDown() {
  langPointerDriven = true;
}

function onLangToggleFocus() {
  if (langPointerDriven) {
    langPointerDriven = false;
    return;
  }
  openLang();
}

function onLangGroupLeave() {
  if (langWrapEl.value?.contains(document.activeElement)) return;
  closeLang();
}

function onLangGroupFocusOut(event) {
  const next = event.relatedTarget;
  if (next && langWrapEl.value?.contains(next)) return;
  closeLang();
}

/** main.js watches `locale` for persistence and for `<html lang>`. */
function setLocale(code) {
  locale.value = code;
  closeLang({ restoreFocus: true });
}

/* ── mobile menu ─────────────────────────────────────────────────────────── */

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value;
  if (!mobileOpen.value) closeAbout();
}

function closeMobile({ restoreFocus = false } = {}) {
  if (!mobileOpen.value) return;
  mobileOpen.value = false;
  closeAbout();
  if (restoreFocus) mobileToggleEl.value?.focus();
}

/* ── document-level behaviour ────────────────────────────────────────────── */

function onDocumentKeydown(event) {
  if (event.key !== 'Escape') return;
  // One place decides, so the two menus can never fight over the same press.
  if (aboutOpen.value) {
    closeAbout({ restoreFocus: true });
    return;
  }
  if (mobileOpen.value) {
    closeMobile({ restoreFocus: true });
    return;
  }
  if (langOpen.value) closeLang({ restoreFocus: true });
}

function onDocumentPointerDown(event) {
  const root = headerEl.value;
  if (!root || root.contains(event.target)) return;
  closeAbout();
  closeMobile();
  closeLang();
}

onMounted(() => {
  document.addEventListener('keydown', onDocumentKeydown);
  document.addEventListener('pointerdown', onDocumentPointerDown);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onDocumentKeydown);
  document.removeEventListener('pointerdown', onDocumentPointerDown);
});

// Navigating with an open menu would otherwise leave it hanging over the page.
watch(() => route.fullPath, () => {
  closeAbout();
  closeMobile();
  closeLang();
});

/* ── "the site changes with the clock" — shown, not just applied ─────────── */

const currentSlot = computed(
  () => scheduleSummary().find((slot) => slot.style === style.value) ?? null,
);

const currentWindow = computed(() => {
  const slot = currentSlot.value;
  if (!slot) return '';
  return `${formatMinutes(slot.start)}–${formatMinutes(slot.end)}`;
});

const nextChangeText = computed(() => {
  const next = nextStyleMeta.value;
  if (!next || !nextChangeLabel.value) return t('theme.nextChangeUnknown');
  return t('theme.nextChange', { style: next.name, time: nextChangeLabel.value });
});
</script>

<template>
  <header ref="headerEl" class="site-nav">
    <!--
      NOT `.container`. The bar spans the viewport so its four groups can spread across
      it, while every other surface stays inside `--measure`. Same gutter, so the brand
      still lines up with the content underneath.
    -->
    <div class="site-nav__inner">
      <!-- Primary navigation. Below 768px this collapses into a panel that the
           button in `__tools` toggles (aria-controls points at its id). -->
      <nav
        :id="PRIMARY_NAV_ID"
        class="site-nav__nav"
        :class="{ 'is-open': mobileOpen }"
        :aria-label="t('nav.primaryLabel')"
      >
        <ul class="site-nav__list">
          <li
            v-for="item in primaryLinks"
            :key="item.to"
            class="site-nav__item"
            :class="{ 'site-nav__item--disclosure': item.submenu }"
          >
            <template v-if="item.submenu">
              <div
                :ref="setAboutGroup"
                class="site-nav__disclosure"
                @mouseenter="openAbout"
                @mouseleave="onAboutGroupLeave"
                @focusout="onAboutGroupFocusOut"
              >
                <div class="site-nav__disclosure-row">
                  <router-link
                    class="site-nav__link"
                    :to="item.to"
                    :class="linkClass(item.to)"
                    :aria-current="isCurrentPage(item.to) ? 'page' : null"
                    @keydown.down.prevent="openAboutAndFocusFirst"
                  >
                    {{ t(item.labelKey) }}
                  </router-link>

                  <button
                    :ref="setAboutToggle"
                    type="button"
                    class="site-nav__disclosure-toggle"
                    :aria-expanded="aboutOpen"
                    aria-haspopup="true"
                    :aria-controls="ABOUT_MENU_ID"
                    :aria-label="t('nav.aboutSubmenuLabel')"
                    @pointerdown="onAboutTogglePointerDown"
                    @focus="onAboutToggleFocus"
                    @click="toggleAbout"
                  >
                    <svg
                      class="icon icon--chevron"
                      :class="{ 'is-open': aboutOpen }"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M6 9.5l6 6 6-6"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.75"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <ul
                  :id="ABOUT_MENU_ID"
                  :ref="setAboutMenu"
                  v-show="aboutOpen"
                  class="site-nav__menu"
                  @keydown="onAboutMenuKeydown"
                >
                  <li v-for="sub in aboutLinks" :key="sub.to">
                    <router-link
                      class="site-nav__menu-link"
                      :to="sub.to"
                      :class="{ 'is-current': isCurrentPage(sub.to) || isActiveSection(sub.to) }"
                      :aria-current="isCurrentPage(sub.to) ? 'page' : null"
                    >
                      {{ t(sub.labelKey) }}
                    </router-link>
                  </li>
                </ul>
              </div>
            </template>

            <router-link
              v-else
              class="site-nav__link"
              :to="item.to"
              :class="linkClass(item.to)"
              :aria-current="isCurrentPage(item.to) ? 'page' : null"
            >
              {{ t(item.labelKey) }}
            </router-link>
          </li>
        </ul>
      </nav>

      <router-link class="site-nav__brand" to="/">
        {{ SITE_NAME }}
      </router-link>

      <div class="site-nav__tools">
        <!--
          The style marker lives with the controls, not beside the brand: on the right it
          reads as part of the "how this page is being presented" cluster.
        -->
        <p class="site-nav__style">
          <span class="site-nav__style-dot" aria-hidden="true"></span>
          <span class="site-nav__style-name">{{ t('theme.currentStyle', { name: styleMeta.name }) }}</span>
          <span v-if="currentWindow" class="site-nav__style-window">{{ currentWindow }}</span>
          <span class="visually-hidden">{{ nextChangeText }}</span>
        </p>

        <!-- Language switcher: the list is derived from LOCALE_META. -->
        <div
          ref="langWrapEl"
          class="lang"
          role="group"
          :aria-label="t('nav.languageLabel')"
          @mouseenter="openLang"
          @mouseleave="onLangGroupLeave"
          @focusout="onLangGroupFocusOut"
        >
          <button
            ref="langToggleEl"
            type="button"
            class="lang__toggle"
            :aria-expanded="langOpen"
            :aria-controls="LANG_MENU_ID"
            :aria-label="languageButtonLabel"
            @pointerdown="onLangTogglePointerDown"
            @focus="onLangToggleFocus"
            @click="toggleLang"
          >
            <span class="lang__code">{{ currentLocale.short }}</span>
            <svg
              class="icon icon--chevron"
              :class="{ 'is-open': langOpen }"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M6 9.5l6 6 6-6"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <ul :id="LANG_MENU_ID" ref="langMenuEl" v-show="langOpen" class="lang__menu">
            <li v-for="meta in LOCALE_META" :key="meta.code">
              <button
                type="button"
                class="lang__item"
                :class="{ 'is-current': meta.code === currentLocaleCode }"
                :aria-current="meta.code === currentLocaleCode ? 'true' : null"
                :lang="meta.code"
                @click="setLocale(meta.code)"
              >
                <span class="lang__code">{{ meta.short }}</span>
                <span class="lang__name">{{ meta.native }}</span>
              </button>
            </li>
          </ul>
        </div>

        <!-- Owned by theme/ThemeControl.vue. -->
        <ThemeControl />

        <button
          ref="mobileToggleEl"
          type="button"
          class="site-nav__menu-toggle"
          :aria-expanded="mobileOpen"
          :aria-controls="PRIMARY_NAV_ID"
          @click="toggleMobile"
        >
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <template v-if="mobileOpen">
              <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
              />
            </template>
            <template v-else>
              <path
                d="M4 7h16M4 12h16M4 17h16"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
              />
            </template>
          </svg>
          <span>{{ mobileOpen ? t('nav.closeMenu') : t('nav.menu') }}</span>
        </button>
      </div>
    </div>

    <!--
      The build-status strip, as the last row INSIDE the header rather than as a sibling
      after it. It stays attached to the nav it describes, and since the header is sticky
      the strip stays with it.
    -->
    <SiteNotice />
  </header>
</template>

<style scoped>
.site-nav {
  /* WCAG 2.5.5 target size, local to the chrome. */
  --tap-target: 2.75rem;

  position: sticky;
  inset-block-start: 0;
  z-index: var(--z-sticky);

  color: var(--fg);
  font-family: var(--font-body);
  font-size: var(--step--1);

  /* Opaque first: a browser without color-mix() still gets a legible bar. */
  background-color: var(--bg);
  background-color: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border-block-end: var(--border-width) solid var(--line);

  transition: background-color var(--dur-base) var(--ease-out);
}

.site-nav__inner {
  display: flex;

  /*
   * THREE COLUMNS — links, a centred brand, and the controls — on ONE row, always.
   *
   * Two things make this work, and both are deliberate:
   *
   * 1. `nowrap`. Line breaking uses each item's flex BASE size, not its shrunk size, and
   *    the nav's basis used to be `auto` — its full content width. The whole bar needs
   *    roughly 1180px, against the ~1048px that `--measure` left inside `.container`, so
   *    the row broke after the style line: brand alone on the first line, links and
   *    controls on the second. That is the bug this row was rebuilt to remove.
   *
   * 2. EQUAL SIDE COLUMNS. Both flanking columns are `flex: 1 1 0` with
   *    `min-inline-size: 0`, so they resolve to exactly the same width and the brand
   *    between them lands on the true centre line — not merely in the middle of the
   *    leftover space, which is what `space-between` would have given. The maths holds
   *    with the gaps included, because the two gaps are equal.
   *
   * The cost is that the wider column sets the floor for both: the links need about
   * 550px, so one clean row needs roughly 2x550 + the brand, about 1270px of content —
   * a 1440px window with its gutters. Below that the LINKS wrap inside their own column
   * and the bar grows a line; the brand stays centred throughout, and neither flanks
   * column can ever overlap it. The alternatives — absolute centring or a `calc()`
   * reserve for the brand's half-width — both risk the two colliding, which this cannot.
   */
  flex-wrap: nowrap;
  align-items: center;
  gap: var(--space-sm) var(--space-md);

  inline-size: 100%;
  padding-inline: var(--gutter);
  padding-block: var(--space-xs);
  min-block-size: var(--control-height-lg);
}

/* ── brand ───────────────────────────────────────────────────────────────── */

.site-nav__brand {
  display: inline-flex;
  align-items: center;
  min-block-size: var(--tap-target);
  /* Placement is `space-between` on the row; an auto margin here fought it. */
  flex: none;
  white-space: nowrap;

  font-family: var(--font-display);
  font-weight: var(--weight-display);
  font-size: var(--step-0);
  letter-spacing: var(--tracking-tight);
  color: var(--fg);
  text-decoration: none;
}

.site-nav__brand:hover {
  color: var(--accent);
}

/* ── "which style is showing" ────────────────────────────────────────────── */

.site-nav__style {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  margin: 0;
  flex: none;
  white-space: nowrap;
  color: var(--fg-muted);
  font-size: var(--step--1);
}

.site-nav__style-dot {
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: var(--radius-full);
  background-color: var(--accent);
  flex: none;
}

.site-nav__style-window {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--fg-faint);
}

/* ── primary navigation ──────────────────────────────────────────────────── */

.site-nav__nav {
  /* Left column. `1 1 0` with a zero minimum is what makes it exactly as wide as the
     right column, which is what centres the brand between them. */
  flex: 1 1 0;
  min-inline-size: 0;
}

.site-nav__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  /* Start-aligned: the links now occupy the left column, so centring them inside it
     would leave a ragged gap against the gutter. */
  justify-content: flex-start;
  gap: var(--space-3xs);
  margin: 0;
  padding: 0;
  list-style: none;
}

.site-nav__item {
  position: relative;
}

.site-nav__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  min-block-size: var(--tap-target);
  padding-inline: var(--space-sm);

  font-weight: var(--weight-strong);
  color: var(--fg-muted);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: color var(--dur-fast) var(--ease-out);
}

.site-nav__link:hover {
  color: var(--fg);
}

.site-nav__link::after {
  content: '';
  position: absolute;
  inset-inline: var(--space-sm);
  inset-block-end: var(--space-2xs);
  block-size: 2px;
  background-color: var(--accent);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform var(--dur-fast) var(--ease-out);
}

.site-nav__link:hover::after,
.site-nav__link.is-section::after,
.site-nav__link.is-current::after {
  transform: scaleX(1);
}

.site-nav__link.is-current {
  color: var(--fg);
}

/* ── About disclosure ────────────────────────────────────────────────────── */

.site-nav__disclosure {
  position: relative;
}

.site-nav__disclosure-row {
  display: flex;
  align-items: center;
}

.site-nav__disclosure-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-inline-size: var(--tap-target);
  min-block-size: var(--tap-target);

  padding: 0;
  background: none;
  border: 0;
  color: var(--fg-muted);
  border-radius: var(--radius-sm);
  transition: color var(--dur-fast) var(--ease-out);
}

.site-nav__disclosure-toggle:hover {
  color: var(--fg);
}

.icon {
  inline-size: 1rem;
  block-size: 1rem;
  flex: none;
}

.icon--chevron {
  transition: transform var(--dur-fast) var(--ease-out);
}

.icon--chevron.is-open {
  transform: rotate(180deg);
}

.site-nav__menu {
  position: absolute;
  inset-block-start: 100%;
  inset-inline-start: 0;
  z-index: var(--z-sticky);

  min-inline-size: 12rem;
  margin: 0;
  /* No visual gap, so `mouseleave` cannot fire while the pointer travels to
     the panel — the old bar bridged that with a magic padding-top. */
  padding: var(--space-2xs);
  list-style: none;

  background-color: var(--bg-raised);
  border: var(--border-width) solid var(--line);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.site-nav__menu-link {
  display: flex;
  align-items: center;
  min-block-size: var(--tap-target);
  padding-inline: var(--space-sm);

  color: var(--fg-muted);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: background-color var(--dur-fast) var(--ease-out),
              color var(--dur-fast) var(--ease-out);
}

.site-nav__menu-link:hover {
  background-color: var(--accent-soft);
  color: var(--fg);
}

.site-nav__menu-link.is-current {
  color: var(--fg);
  background-color: var(--accent-soft);
}

/* ── tools: language, appearance, mobile toggle ──────────────────────────── */

.site-nav__tools {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-xs);
  /* Right column: same zero-basis rule as the left, so the two are the same width and the
     brand between them is centred by construction rather than by eye. */
  flex: 1 1 0;
  min-inline-size: 0;
}

.lang {
  position: relative;
}

.lang__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2xs);
  min-block-size: var(--tap-target);
  min-inline-size: var(--tap-target);
  padding-inline: var(--space-xs);

  background-color: var(--bg-raised);
  border: var(--border-width) solid var(--line);
  border-radius: var(--radius-full);
  color: var(--fg-muted);
  transition: border-color var(--dur-fast) var(--ease-out),
              color var(--dur-fast) var(--ease-out);
}

.lang__toggle:hover {
  border-color: var(--line-strong);
  color: var(--fg);
}

.lang__code {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  letter-spacing: var(--tracking-wide);
}

.lang__menu {
  position: absolute;
  inset-block-start: 100%;
  inset-inline-end: 0;
  z-index: var(--z-sticky);

  min-inline-size: 11rem;
  margin: 0;
  padding: var(--space-2xs);
  list-style: none;
  text-align: start;

  background-color: var(--bg-raised);
  border: var(--border-width) solid var(--line);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.lang__item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  inline-size: 100%;
  min-block-size: var(--tap-target);
  padding-inline: var(--space-sm);

  background: none;
  border: 0;
  border-radius: var(--radius-sm);
  color: var(--fg-muted);
  text-align: start;
  transition: background-color var(--dur-fast) var(--ease-out),
              color var(--dur-fast) var(--ease-out);
}

.lang__item:hover {
  background-color: var(--accent-soft);
  color: var(--fg);
}

.lang__item.is-current {
  color: var(--fg);
  background-color: var(--accent-soft);
}

.lang__name {
  font-size: var(--step--1);
}

.site-nav__menu-toggle {
  display: none;
  align-items: center;
  gap: var(--space-2xs);
  min-block-size: var(--tap-target);
  padding-inline: var(--space-sm);

  background-color: var(--bg-raised);
  border: var(--border-width) solid var(--line);
  border-radius: var(--radius-full);
  color: var(--fg);
  font-weight: var(--weight-strong);
}

.site-nav__menu-toggle:hover {
  border-color: var(--line-strong);
}

/* ── focus: every control, from tokens ───────────────────────────────────── */

.site-nav__brand:focus-visible,
.site-nav__link:focus-visible,
.site-nav__disclosure-toggle:focus-visible,
.site-nav__menu-link:focus-visible,
.lang__toggle:focus-visible,
.lang__item:focus-visible,
.site-nav__menu-toggle:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}

/* ── mobile: the primary nav collapses into one panel ────────────────────── */

/*
 * NOTE ON A RULE THAT WAS HERE AND IS NOT ANY MORE.
 *
 * This used to hide the style prose below 1440px, on the reasoning that it was the least
 * load-bearing item in the bar. That reasoning only held while one flexible column
 * absorbed the shortfall. With two EQUAL side columns it no longer does anything useful:
 * the links set the floor for both columns, so shrinking the right one buys the left one
 * nothing. It has been removed rather than left in as a rule that looks like it helps —
 * and removing it is also what keeps the style marker visible on the right, which is
 * where it was asked to be.
 */

@media (max-width: 767.98px) {
  /*
   * Below the collapse point the links move into the panel, but brand, dot, language,
   * appearance and the menu button still do not fit on one line at 320px — so the row is
   * allowed to wrap again here. `nowrap` above is for the desktop bar only.
   */
  .site-nav__inner {
    flex-wrap: wrap;
  }

  .site-nav__brand {
    font-size: var(--step--1);
  }

  .site-nav__style-name {
    /* The style is still announced; the prose label is what gives way. */
    display: none;
  }

  .site-nav__menu-toggle {
    display: inline-flex;
  }

  .site-nav__nav {
    position: absolute;
    inset-inline: 0;
    inset-block-start: 100%;
    z-index: var(--z-sticky);

    /* Hidden from the tab order and the accessibility tree while collapsed —
       not merely transparent. */
    visibility: hidden;
    max-block-size: 80dvh;
    overflow-y: auto;

    padding: var(--space-sm) var(--gutter) var(--space-md);
    background-color: var(--bg-raised);
    border-block-end: var(--border-width) solid var(--line);
    box-shadow: var(--shadow-md);
  }

  .site-nav__nav.is-open {
    visibility: visible;
  }

  .site-nav__list {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }

  .site-nav__item {
    position: static;
  }

  .site-nav__link {
    flex: 1 1 auto;
    padding-inline: 0;
  }

  .site-nav__link::after {
    inset-inline: 0;
  }

  .site-nav__disclosure-row {
    justify-content: space-between;
  }

  /* Inside the mobile panel the submenu is an accordion, not a popover. */
  .site-nav__menu {
    position: static;
    min-inline-size: 0;
    padding: 0 0 var(--space-xs) var(--space-md);
    background: none;
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }
}
</style>
