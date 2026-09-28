<script setup>
/**
 * AboutPage — the hub of the About subtree.
 *
 * Fixed relative to the old page:
 *   - `timeElapsed` was hard-coded English ("days, hours, minutes, seconds") while the
 *     sentence around it came from the locale files, so every non-English visitor got
 *     a half-translated line. The units are now translated too.
 *   - The 1-second interval never paused on a hidden tab, and the ticking value was
 *     on a path that would make a screen reader announce it every second.
 *   - It used `<h2>` as the page's top-level heading; that is now a single `<h1>`.
 *   - The birthday was duplicated here as a literal string and in the timeline data.
 *     It now comes from `profile.birth.iso` in the content layer, which is the same
 *     value the timeline's "Born in Wenzhou" entry uses.
 *   - It had a scoped rule duplicating a value already set in the shared stylesheet.
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useContent, enumLabelKey } from '@/content/index.js';
import { useElapsed } from '@/composables/useElapsed.js';
import PageShell from '@/components/layout/PageShell.vue';
import PageHeader from '@/components/layout/PageHeader.vue';
import ContentIndex from '@/components/content/ContentIndex.vue';
import AppButton from '@/components/ui/AppButton.vue';

const { t } = useI18n();
const { profile, timeline, awards, testimonials } = useContent();
const { parts, units } = useElapsed(profile.value.birth.iso);

/*
 * Testimonials are promoted here as well as on the home page, which the brief asked for.
 * They are a DIFFERENT pair from the two the home page shows (slice(2, 4) vs slice(0, 2)) —
 * repeating the same quotation on both pages would spend the second slot on something the
 * reader has already read.
 */
const quotes = computed(() => testimonials.value.slice(2, 4));

const items = computed(() => [
  {
    id: 'timeline',
    to: '/about/timeline',
    title: t('about.timelineTitle'),
    description: t('about.timelineDesc'),
    action: t('about.viewTimeline'),
  },
  {
    id: 'skills',
    to: '/about/skills',
    title: t('about.skillsTitle'),
    description: t('about.skillsDesc'),
    action: t('about.viewSkills'),
  },
  {
    id: 'testimonials',
    to: '/about/testimonials',
    title: t('about.testimonialsTitle'),
    description: t('about.testimonialsDesc'),
    action: t('about.viewTestimonials'),
  },
]);
</script>

<template>
  <PageShell>
    <PageHeader
      :overline="t('about.overline')"
      :title="t('about.title')"
      :lede="t('about.subtitle')"
      :meta="t('timeline.countLabel', { count: timeline.length })"
    />

    <div class="bio">
      <p class="bio__text">{{ t('about.bio1') }}</p>
      <p class="bio__hint">{{ t('about.bio2') }}</p>
    </div>

    <!--
      Competitions and certificates. Placed ABOVE the "where to go next" index because it
      is the only part of this page that a third party can verify — everything else here is
      self-description. Entries whose CV states no outcome render without a result line
      rather than claiming one.
    -->
    <section v-if="awards.length" class="awards" aria-labelledby="about-awards-title">
      <header class="awards__head">
        <h2 id="about-awards-title" class="awards__title">{{ t('awards.title') }}</h2>
        <p class="awards__lede">{{ t('awards.lede') }}</p>
      </header>

      <ul class="awards__list">
        <li v-for="award in awards" :key="award.id" class="award">
          <span class="award__year">
            <time :datetime="award.year">{{ award.year }}</time>
          </span>

          <span class="award__body">
            <span class="award__kind">{{ t(enumLabelKey('awards', 'kind', award.kind)) }}</span>
            <span class="award__name">{{ award.title }}</span>
            <span v-if="award.issuer" class="award__issuer">{{ award.issuer }}</span>
          </span>

          <span v-if="award.result" class="award__result">{{ award.result }}</span>
        </li>
      </ul>
    </section>

    <!--
      Two more voices, promoted out of the testimonials sub-page. Placed after the
      verifiable results and before the navigation index: a reader who has just checked the
      credentials is exactly the reader who wants to hear from the people behind them.
    -->
    <section v-if="quotes.length" class="quotes" aria-labelledby="about-quotes-title">
      <header class="quotes__head">
        <h2 id="about-quotes-title" class="quotes__title">{{ t('home.trustTitle') }}</h2>
        <p class="quotes__lede">{{ t('home.trustLede') }}</p>
      </header>

      <div class="quotes__grid">
        <figure v-for="item in quotes" :key="item.id" class="quote">
          <blockquote class="quote__text">
            <p>{{ item.excerpt }}</p>
          </blockquote>
          <figcaption class="quote__caption">
            <cite class="quote__name">{{ item.name }}</cite>
            <span class="quote__role">{{ item.role }}</span>
          </figcaption>
        </figure>
      </div>

      <AppButton variant="ghost" to="/about/testimonials">
        {{ t('home.trustAll') }}
      </AppButton>
    </section>

    <ContentIndex :items="items" />

    <!--
      The "alive for X days, Y hours…" counter sits at the FOOT of the page, not in the
      hero and not above the fold. It is the most personal thing on the site and it earns
      its place here, where someone who is already reading about Jeremy will find it. Put
      on a landing page it mostly invites visitors to compute his age.
    -->
    <p class="elapsed">
      <span>{{ t('about.timelineLived') }}</span>
      <span class="elapsed__clock">
        <b>{{ parts.days.toLocaleString() }}</b> {{ units.days }}
        <b aria-hidden="true">{{ parts.hours }}</b> <span aria-hidden="true">{{ units.hours }}</span>
        <b aria-hidden="true">{{ parts.minutes }}</b> <span aria-hidden="true">{{ units.minutes }}</span>
        <b aria-hidden="true">{{ parts.seconds }}</b> <span aria-hidden="true">{{ units.seconds }}</span>
      </span>
    </p>
  </PageShell>
</template>

<style scoped>
.bio {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-block-end: var(--space-2xl);
  padding-block-end: var(--space-lg);
  border-block-end: var(--border-width) solid var(--line);
}

.bio__text {
  font-size: var(--step-1);
  line-height: var(--leading-loose);
  color: var(--fg);
  max-inline-size: var(--measure-read);
}

.bio__hint {
  font-size: var(--step--1);
  color: var(--fg-muted);
}

/* ── testimonials, promoted from the sub-page ──────────────────────────── */

.quotes {
  margin-block-end: var(--space-2xl);
}

.quotes__head {
  margin-block-end: var(--space-md);
}

.quotes__title {
  font-size: var(--step-2);
  margin-block-end: var(--space-2xs);
}

.quotes__lede {
  font-size: var(--step--1);
  line-height: var(--leading);
  color: var(--fg-muted);
  max-inline-size: var(--measure-read);
}

.quotes__grid {
  display: grid;
  gap: var(--space-lg);
  margin-block-end: var(--space-md);
}

.quotes__grid { grid-template-columns: repeat(auto-fit, minmax(min(22rem, 100%), 1fr)); }

.quote {
  margin: 0;
  padding: var(--space-md);
  background-color: var(--bg-raised);
  border: var(--border-width) solid var(--line);
  border-radius: var(--radius-lg);
}

.quote__text {
  margin: 0;
  padding-inline-start: var(--space-sm);
  border-inline-start: 2px solid var(--accent);
}

.quote__text p {
  font-family: var(--font-display);
  font-size: var(--step-0);
  line-height: var(--leading-loose);
  color: var(--fg);
}

.quote__caption {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  margin-block-start: var(--space-sm);
  padding-inline-start: var(--space-sm);
}

.quote__name {
  font-style: normal;
  font-weight: var(--weight-strong);
  color: var(--fg);
}

.quote__role {
  font-size: var(--step--1);
  color: var(--fg-muted);
}

/* ── awards ────────────────────────────────────────────────────────────── */

.awards {
  margin-block-end: var(--space-2xl);
}

.awards__head {
  margin-block-end: var(--space-md);
}

.awards__title {
  font-size: var(--step-2);
  margin-block-end: var(--space-2xs);
}

.awards__lede {
  font-size: var(--step--1);
  line-height: var(--leading);
  color: var(--fg-muted);
  max-inline-size: var(--measure-read);
}

.awards__list {
  display: flex;
  flex-direction: column;
  list-style: none;
}

.award {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-3xs) var(--space-sm);
  align-items: baseline;
  padding-block: var(--space-xs);
  border-block-start: var(--border-width) solid var(--line);
}

.award:last-child {
  border-block-end: var(--border-width) solid var(--line);
}

.award__year {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.award__body {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-2xs);
  min-inline-size: 0;
}

.award__kind {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--fg-faint);
  border: var(--border-width) solid var(--line);
  border-radius: var(--radius-sm);
  padding: 0 var(--space-3xs);
  white-space: nowrap;
}

.award__name {
  font-size: var(--step--1);
  color: var(--fg);
}

.award__issuer {
  font-size: 0.72rem;
  color: var(--fg-faint);
}

.award__result {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  font-weight: var(--weight-strong);
  color: var(--ok);
  white-space: nowrap;
  text-align: end;
}

@media (max-width: 767.98px) {
  .award {
    grid-template-columns: auto 1fr;
  }
  .award__result {
    grid-column: 2;
    text-align: start;
  }
}

/* ── the counter, now a page footer rather than part of the bio ─────────── */

.elapsed {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-2xs) var(--space-xs);
  margin-block-start: var(--space-3xl);
  padding-block-start: var(--space-md);
  border-block-start: var(--border-width) solid var(--line);
  font-size: var(--step--1);
  color: var(--fg-faint);
}

.elapsed__clock {
  font-family: var(--font-mono);
  color: var(--fg-muted);
}

.elapsed__clock b {
  color: var(--accent);
  font-weight: var(--weight-strong);
  font-variant-numeric: tabular-nums;
}
</style>
