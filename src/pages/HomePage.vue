<script setup>
/**
 * HomePage — the landing page, rewritten as an offer rather than a greeting.
 *
 * WHAT WAS WRONG: the first screen said "Welcome To My Website" and "Glad you're here".
 * For the visitor this site is built for — someone deciding whether to hire Jeremy — that
 * is zero information. They need, in order: what he does, proof, and how to start.
 *
 * The page is now: hero (positioning + one action) → "I'm here about…" → the nine
 * services → third-party proof → an index of the rest of the site → one closing ask.
 *
 * TWO THINGS MOVED OFF THIS PAGE ON PURPOSE:
 *
 *   - The "alive for X days, Y hours…" counter now lives at the bottom of /about, where
 *     someone who is already interested will find it. On the landing page it invited
 *     visitors to compute his age, which is not what a freelancer wants foregrounded.
 *   - The four big "chapter" cards became the closing index, in one section instead of
 *     four screens of scrolling.
 *
 * The audience picker sits directly under the hero, NOT in front of it: it is a refinement
 * of an already-complete page, never a gate.
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useContent, pick } from '@/content/index.js';
import { splitByAudience } from '@/content/audiences.js';
import { useAudience } from '@/composables/useAudience.js';

import PageShell from '@/components/layout/PageShell.vue';
import AudiencePicker from '@/components/ui/AudiencePicker.vue';
import CollapsedGroup from '@/components/ui/CollapsedGroup.vue';
import AppButton from '@/components/ui/AppButton.vue';
import ServiceCard from '@/components/content/ServiceCard.vue';
import ContentIndex from '@/components/content/ContentIndex.vue';

const { t } = useI18n();
const { profile, services, testimonials, locale } = useContent();
const { current } = useAudience();

/*
 * `positioning` is a nested object carrying its own `i18n` block, and `pick()` only
 * flattens the top level of an entry — so it must be resolved separately rather than
 * read as `profile.positioning.line`.
 */
const positioning = computed(() => pick(profile.value.positioning, locale.value));

/* Audience-aware split, same rules as /services: reorder, then collapse the remainder. */
const grouping = computed(() => splitByAudience(services.value, current.value));
const otherLabel = computed(() => t('audience.otherCount', { count: grouping.value.other.length }));

/* Two testimonials, taken in data order so the page is stable between renders. */
const shownTestimonials = computed(() => testimonials.value.slice(0, 2));

const indexItems = computed(() => [
  {
    id: 'services',
    to: '/services',
    title: t('nav.services'),
    description: t('services.lede'),
    action: t('home.exploreMore'),
  },
  {
    id: 'projects',
    to: '/projects',
    title: t('home.projectsTitle'),
    description: t('home.projectsDesc'),
    action: t('home.exploreMore'),
  },
  {
    id: 'about',
    to: '/about',
    title: t('home.aboutTitle'),
    description: t('home.aboutDesc'),
    action: t('home.exploreMore'),
  },
  {
    id: 'contact',
    to: '/contact',
    title: t('home.contactTitle'),
    description: t('home.contactDesc'),
    action: t('home.getInTouch'),
  },
]);
</script>

<template>
  <PageShell>
    <!-- ── hero: who, what, one action ────────────────────────────────────── -->
    <section class="hero">
      <p class="hero__overline">{{ t('home.overline') }}</p>

      <h1 class="hero__title">{{ positioning.line }}</h1>

      <p class="hero__summary">{{ positioning.summary }}</p>

      <div class="hero__actions">
        <AppButton variant="primary" size="lg" to="/contact">
          {{ positioning.cta }}
        </AppButton>
        <AppButton variant="secondary" size="lg" to="/services">
          {{ t('nav.services') }}
        </AppButton>
      </div>

      <dl class="hero__facts">
        <div class="hero__fact">
          <dt>{{ t('contact.location') }}</dt>
          <dd>{{ positioning.based }}</dd>
        </div>
        <div class="hero__fact">
          <dt>{{ t('services.travelNote') }}</dt>
          <dd>{{ positioning.available }}</dd>
        </div>
        <div class="hero__fact">
          <dt>{{ t('audience.title') }}</dt>
          <dd class="hero__fact-ok">{{ positioning.availability }}</dd>
        </div>
      </dl>
    </section>

    <!-- ── the visitor-identity question, refining everything below ──────── -->
    <AudiencePicker />

    <!-- ── the offer ─────────────────────────────────────────────────────── -->
    <section aria-labelledby="home-services-title">
      <header class="sec-head">
        <h2 id="home-services-title" class="sec-head__title">{{ t('services.title') }}</h2>
        <p class="sec-head__lede">{{ t('home.servicesLede') }}</p>
      </header>

      <ul class="grid">
        <li v-for="service in grouping.relevant" :key="service.id">
          <ServiceCard :service="service" />
        </li>
      </ul>

      <CollapsedGroup
        v-if="grouping.other.length"
        name="home-services-other"
        :label="otherLabel"
        :hint="t('audience.otherBody')"
      >
        <ul class="grid grid--other">
          <li v-for="service in grouping.other" :key="service.id">
            <ServiceCard :service="service" />
          </li>
        </ul>
      </CollapsedGroup>
    </section>

    <!-- ── third-party proof, promoted out of the About subtree ──────────── -->
    <section class="trust" aria-labelledby="home-trust-title">
      <header class="sec-head">
        <h2 id="home-trust-title" class="sec-head__title">{{ t('home.trustTitle') }}</h2>
        <p class="sec-head__lede">{{ t('home.trustLede') }}</p>
      </header>

      <div class="trust__grid">
        <figure v-for="item in shownTestimonials" :key="item.id" class="trust__item">
          <blockquote class="trust__quote">
            <p>{{ item.excerpt }}</p>
          </blockquote>
          <figcaption class="trust__caption">
            <cite class="trust__name">{{ item.name }}</cite>
            <span class="trust__role">{{ item.role }}</span>
          </figcaption>
        </figure>
      </div>

      <AppButton variant="ghost" to="/about/testimonials">
        {{ t('home.trustAll') }}
      </AppButton>
    </section>

    <!-- ── the rest of the site ──────────────────────────────────────────── -->
    <section class="index" aria-labelledby="home-index-title">
      <h2 id="home-index-title" class="index__title">{{ t('home.indexLabel') }}</h2>
      <ContentIndex :items="indexItems" />
    </section>

    <!-- ── one closing ask ───────────────────────────────────────────────── -->
    <section class="closing" aria-labelledby="home-closing-title">
      <h2 id="home-closing-title" class="closing__title">{{ t('home.closingTitle') }}</h2>
      <p class="closing__body">{{ t('home.closingBody') }}</p>
      <AppButton variant="primary" size="lg" to="/contact">
        {{ t('home.getInTouch') }}
      </AppButton>
    </section>
  </PageShell>
</template>

<style scoped>
/* ── hero ──────────────────────────────────────────────────────────────── */

.hero {
  padding-block: var(--space-lg) var(--space-xl);
}

.hero__overline {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  font-weight: var(--weight-strong);
  text-transform: var(--overline-transform);
  letter-spacing: var(--overline-spacing);
  color: var(--accent);
  margin-block-end: var(--space-sm);
}

.hero__title {
  font-size: var(--step-3);
  max-inline-size: 22ch;
  margin-block-end: var(--space-md);
}

.hero__summary {
  font-size: var(--step-1);
  line-height: var(--leading-loose);
  color: var(--fg-muted);
  max-inline-size: 62ch;
  margin-block-end: var(--space-lg);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-block-end: var(--space-lg);
}

.hero__facts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md) var(--space-xl);
  margin: 0;
  padding-block-start: var(--space-md);
  border-block-start: var(--border-width) solid var(--line);
}

.hero__fact dt {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  font-weight: var(--weight-strong);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--fg-faint);
  margin-block-end: var(--space-3xs);
}

.hero__fact dd {
  margin: 0;
  font-size: var(--step--1);
  color: var(--fg);
}

.hero__fact-ok {
  color: var(--ok);
}

/* ── shared section head ───────────────────────────────────────────────── */

.sec-head {
  margin-block-end: var(--space-lg);
}

.sec-head__title {
  font-size: var(--step-2);
  margin-block-end: var(--space-2xs);
}

.sec-head__lede {
  font-size: var(--step-0);
  line-height: var(--leading-loose);
  color: var(--fg-muted);
  max-inline-size: var(--measure-read);
}

/* ── service grid ──────────────────────────────────────────────────────── */

.grid {
  display: grid;
  gap: var(--space-md);
  list-style: none;
}

@media (min-width: 720px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1080px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}

.grid--other {
  opacity: 0.9;
  margin-block-start: var(--space-sm);
}

/* ── trust ─────────────────────────────────────────────────────────────── */

.trust {
  margin-block-start: var(--space-3xl);
}

.trust__grid {
  display: grid;
  gap: var(--space-lg);
  margin-block-end: var(--space-md);
}

@media (min-width: 860px) {
  .trust__grid { grid-template-columns: repeat(2, 1fr); }
}

.trust__item {
  margin: 0;
  padding: var(--space-md);
  background-color: var(--bg-raised);
  border: var(--border-width) solid var(--line);
  border-radius: var(--radius-lg);
}

.trust__quote {
  margin: 0;
  padding-inline-start: var(--space-sm);
  border-inline-start: 2px solid var(--accent);
}

.trust__quote p {
  font-family: var(--font-display);
  font-size: var(--step-0);
  line-height: var(--leading-loose);
  color: var(--fg);
}

.trust__caption {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  margin-block-start: var(--space-sm);
  padding-inline-start: var(--space-sm);
}

.trust__name {
  font-style: normal;
  font-weight: var(--weight-strong);
  color: var(--fg);
}

.trust__role {
  font-size: var(--step--1);
  color: var(--fg-muted);
}

/* ── index + closing ───────────────────────────────────────────────────── */

.index {
  margin-block-start: var(--space-3xl);
}

.index__title {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  font-weight: var(--weight-strong);
  text-transform: var(--overline-transform);
  letter-spacing: var(--overline-spacing);
  color: var(--fg-faint);
  margin-block-end: var(--space-md);
}

.closing {
  margin-block-start: var(--space-3xl);
  padding: var(--space-lg);
  text-align: center;
  background-color: var(--bg-raised);
  border: var(--border-width) solid var(--line);
  border-radius: var(--radius-lg);
}

.closing__title {
  font-size: var(--step-2);
  margin-block-end: var(--space-xs);
}

.closing__body {
  margin-inline: auto;
  margin-block-end: var(--space-md);
  max-inline-size: 52ch;
  color: var(--fg-muted);
  line-height: var(--leading-loose);
}
</style>
