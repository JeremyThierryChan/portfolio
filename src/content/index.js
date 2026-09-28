/**
 * Content layer — single public entry point.
 *
 *   import { content, useContent, SUPPORTED_LOCALES } from '@/content';
 *
 * `content.*` holds the raw, locale-neutral modules (structure + `i18n` side by side).
 * `useContent()` resolves them for the locale currently active in vue-i18n, falling
 * back per-field to English. See SCHEMA.md for the authoring contract.
 */

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { profile } from './profile.js';
import { projects } from './projects.js';
import { timeline } from './timeline.js';
import { skills } from './skills.js';
import { gallery } from './gallery.js';
import { testimonials } from './testimonials.js';
import { posts } from './posts.js';
import { services, SERVICE_DOMAINS } from './services.js';
import { awards } from './awards.js';
import { audiences, AUDIENCE_ALL, AUDIENCE_IDS, splitByAudience, isRelevant } from './audiences.js';
import { links } from './links.js';
import { tutoringGroups, tutoringSections, tutoringCourses } from './tutoring.js';

import { pick, pickAll, byDateDesc, availableLocales, isTranslated } from './resolve.js';

export { profile, projects, timeline, skills, gallery, testimonials, posts, services, awards, links };
export { tutoringGroups, tutoringSections, tutoringCourses };
export { SERVICE_DOMAINS };
export { audiences, AUDIENCE_ALL, AUDIENCE_IDS, splitByAudience, isRelevant };
export { pick, pickAll, byDateDesc, availableLocales, isTranslated };
export { FALLBACK_LOCALE } from './resolve.js';

/** Raw modules, handy for tooling and the i18n coverage checker. */
export const content = { profile, projects, timeline, skills, gallery, testimonials, posts, services, awards, links, tutoringGroups, tutoringSections, tutoringCourses };

/* ── locales ──────────────────────────────────────────────────────────────
   Single source of truth for the language list. The navigation bar used to
   hard-code this, and main.js never validated the value stored in
   localStorage — so a stale/garbage value silently produced an all-English
   site while the switcher displayed a language code that did not exist.
   ──────────────────────────────────────────────────────────────────────── */

export const SUPPORTED_LOCALES = ['en', 'zh', 'fr', 'de', 'es', 'it'];
export const FALLBACK_LOCALE_CODE = 'en';

/** Native label + English name for the switcher, derived rather than duplicated. */
export const LOCALE_META = [
  { code: 'en', short: 'EN', native: 'English',  english: 'English' },
  { code: 'zh', short: '中',  native: '中文',      english: 'Chinese' },
  { code: 'fr', short: 'FR', native: 'Français', english: 'French' },
  { code: 'de', short: 'DE', native: 'Deutsch',  english: 'German' },
  { code: 'es', short: 'ES', native: 'Español',  english: 'Spanish' },
  { code: 'it', short: 'IT', native: 'Italiano', english: 'Italian' },
];

/** Coerce anything (localStorage, `?lang=`, a browser tag) to a locale we actually ship. */
export function normalizeLocale(value) {
  if (typeof value !== 'string') return FALLBACK_LOCALE_CODE;
  const base = value.toLowerCase().split('-')[0];
  return SUPPORTED_LOCALES.includes(base) ? base : FALLBACK_LOCALE_CODE;
}

/* ── enum → i18n key ──────────────────────────────────────────────────────
   Content enums are lowercase kebab-case ('in-progress', 'programming'), and
   the display label lives at `<namespace>.<field>.<value>`:
       projects.status.in-progress
       skills.category.programming
   This replaces the old string-concatenation lookups
   (`'projects.status.' + status.replace(' ', '')`) which silently produced a
   raw key whenever the data gained a new value.
   ──────────────────────────────────────────────────────────────────────── */

/**
 * Which i18n namespace holds each collection's enum labels.
 *
 * Not always the collection name: the blog *page* is namespace `blog` while its
 * content module is `posts`. Centralising the mapping means a component never has
 * to know that, and `scripts/verify-i18n.mjs` can prove that every enum value in
 * the content layer has a matching label.
 */
export const ENUM_LABEL_NAMESPACE = {
  projects: 'projects',
  timeline: 'timeline',
  skills: 'skills',
  gallery: 'gallery',
  posts: 'blog',
  services: 'services',
  awards: 'awards',
};

export function enumKey(namespace, field, value) {
  return `${namespace}.${field}.${value}`;
}

/** Label key for a `collection`'s enum `field` holding `value`. */
export function enumLabelKey(collection, field, value) {
  return enumKey(ENUM_LABEL_NAMESPACE[collection] ?? collection, field, value);
}

/** Every distinct value of `field` across a collection, in first-seen order. */
export function distinctValues(list, field) {
  const seen = [];
  for (const entry of list ?? []) {
    const v = entry?.[field];
    if (v != null && !seen.includes(v)) seen.push(v);
  }
  return seen;
}

/* ── resolved, render-ready access ─────────────────────────────────────── */

/**
 * Resolved content for the active locale.
 * Every collection is sorted for display; `timeline` is newest-first.
 */
export function useContent() {
  const { locale } = useI18n();
  const L = computed(() => normalizeLocale(locale.value));

  return {
    locale: L,
    profile: computed(() => pick(profile, L.value)),
    projects: computed(() => pickAll(projects, L.value)),
    timeline: computed(() => pickAll(timeline, L.value).sort(byDateDesc)),
    skills: computed(() => pickAll(skills, L.value)),
    gallery: computed(() => pickAll(gallery, L.value)),
    testimonials: computed(() => pickAll(testimonials, L.value)),
    posts: computed(() => pickAll(posts, L.value).slice().sort(byDateDesc)),

    /** Competitions, exams and certificates. Newest first. */
    awards: computed(() =>
      pickAll(awards, L.value).sort((a, b) => String(b.year).localeCompare(String(a.year)))),

    /** The visitor-identity definitions, locale-resolved, in curated order. */
    audiences: computed(() =>
      pickAll(audiences, L.value).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))),

    /** What he sells. Sorted by the curated `order` field, not alphabetically. */
    services: computed(() =>
      pickAll(services, L.value).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))),

    /** The undated timeline entry (e.g. "learned to speak") sinks to the end. */
    timelineWithUndatedLast: computed(() => pickAll(timeline, L.value).sort(byDateDesc)),

    /**
     * The footer's outgoing links. Ordered by the curated `order`, never by insertion:
     * the array order should not be the thing that decides who appears first.
     */
    links: computed(() =>
      pickAll(links, L.value).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))),

    /*
     * The tutoring rate card, in three flat lists so that the same grouping the page needs
     * is also the shape the bilingual checker can walk. Sorted by the curated `order` on
     * every one of them — the array order should not be what decides the reading order.
     */
    tutoringGroups: computed(() =>
      pickAll(tutoringGroups, L.value).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))),
    tutoringSections: computed(() =>
      pickAll(tutoringSections, L.value).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))),
    tutoringCourses: computed(() =>
      pickAll(tutoringCourses, L.value).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))),

    /** True when the active locale is a non-English one that is still untranslated. */
    isFallbackOnly: computed(() => L.value === FALLBACK_LOCALE_CODE),
  };
}
