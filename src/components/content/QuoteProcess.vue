<script setup>
/**
 * QuoteProcess — how a request turns into a price.
 *
 * WHY THIS EXISTS INSTEAD OF A PRICE LIST. No figure appears beside a service card, and
 * that is a decision rather than an omission. The nine services are billed in units that
 * cannot be compared with one another — day, event, word, project, hour, lesson — so a
 * single figure would mislead more than it helps, and each direction carries a real cost:
 * priced too high it filters people out before they have seen the work; priced too low it
 * anchors the number and a later increase reads as a price rise. Three of the four
 * audiences make it worse rather than better: trade work is quoted per project, where the
 * price is a function of product, market and volume, so any published figure is wrong
 * before the brief has been read; event work varies by duration and staging so a list
 * price becomes a ceiling in negotiation; and institutional procurement needs a formal
 * quote regardless of what the website says.
 *
 * /tutoring IS the one published rate card, and that is a deliberate exception, not an
 * oversight in the paragraph above: teaching is sold in comparable hourly units with no
 * scope left to discover, so a table there removes friction instead of anchoring a number.
 * Do not read this as "the site has no rates anywhere" — `quote.noNumbers` says "no price
 * list HERE" for exactly that reason. (An earlier version of this comment claimed trade
 * sourcing was commission-based; `cross-border-trade` states a fixed price per project.
 * The comment was the stale side and was corrected, not the data.)
 *
 * What a prospective client actually lacks is not a number, it is any idea of what happens
 * after they write in. That is what this answers, and it costs nothing to publish. The unit
 * each service is billed in lives on the service card itself (`services.billingLabel`), and
 * a service with a published table links to it (`services[].ratesPath`), so the two halves
 * together remove the friction without anchoring a figure.
 *
 * Rendered on /contact only, from one component and one set of keys. /services is the
 * obvious other home — that is where the price question arises — but it already closes
 * with its own ask and a "how I work" panel stating the billing basis, so this block there
 * would have been the third pricing section on one screen. /contact is where the decision
 * happens and had no pricing answer at all.
 */
import { useI18n } from 'vue-i18n';

import AppButton from '@/components/ui/AppButton.vue';

const { t } = useI18n();

/*
 * Literal key pairs, never assembled at runtime — the same rule the rest of the codebase
 * follows, so a renamed key fails loudly instead of rendering a key path.
 */
const STEPS = [
  { title: 'quote.step1Title', body: 'quote.step1Body' },
  { title: 'quote.step2Title', body: 'quote.step2Body' },
  { title: 'quote.step3Title', body: 'quote.step3Body' },
];
</script>

<template>
  <section class="quote" aria-labelledby="quote-title">
    <h2 id="quote-title" class="quote__title">{{ t('quote.heading') }}</h2>
    <p class="quote__lede">{{ t('quote.lede') }}</p>

    <ol class="quote__steps">
      <li v-for="step in STEPS" :key="step.title" class="quote__step">
        <h3 class="quote__step-title">{{ t(step.title) }}</h3>
        <p class="quote__step-body">{{ t(step.body) }}</p>
      </li>
    </ol>

    <!--
      Saying "no price list" out loud. A visitor who finds no figure and no explanation
      reasonably reads it as evasion; this is the difference between a decision and a
      gap, and it is the one paragraph on the page doing that work.
    -->
    <p class="quote__why">{{ t('quote.noNumbers') }}</p>

    <!--
      The close, and not decoration: /services previously ended with no call to action at
      all, so a visitor who had read all nine services and been convinced had nowhere to
      go. The steps above end with "confirm, and I book it", which needs an exit.
    -->
    <AppButton variant="primary" size="lg" to="/contact">{{ t('quote.cta') }}</AppButton>
  </section>
</template>

<style scoped>
.quote {
  margin-block-start: var(--space-3xl);
  padding: var(--space-xl);
  background-color: var(--card-bg);
  border: var(--border-width) solid var(--card-border);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
}

.quote__title {
  font-size: var(--step-2);
  margin-block-end: var(--space-2xs);
}

.quote__lede {
  color: var(--fg-muted);
  max-inline-size: var(--measure-read);
  margin-block-end: var(--space-lg);
}

/*
 * Columns from the container, not from the viewport — the same rule the rest of the
 * layout follows, so this needs no breakpoint and cannot land on an intermediate count
 * that changes with the clock's style.
 */
.quote__steps {
  counter-reset: quote-step;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(16rem, 100%), 1fr));
  gap: var(--space-lg);

  margin: 0 0 var(--space-lg);
  padding: 0;
  list-style: none;
}

.quote__step {
  counter-increment: quote-step;
}

/* The number is decoration; the heading carries the meaning. */
.quote__step::before {
  content: counter(quote-step, decimal-leading-zero);

  display: block;
  margin-block-end: var(--space-2xs);

  font-family: var(--font-mono);
  font-size: var(--step--1);
  font-weight: var(--weight-strong);
  letter-spacing: var(--tracking-wide);
  color: var(--accent);
}

.quote__step-title {
  font-size: var(--step-0);
  margin-block-end: var(--space-2xs);
}

.quote__step-body {
  color: var(--fg-muted);
  margin: 0;
}

.quote__why {
  max-inline-size: var(--measure-read);
  margin-block-end: var(--space-lg);
  padding-inline-start: var(--space-sm);

  border-inline-start: var(--border-width) solid var(--accent);
  font-size: var(--step--1);
  line-height: var(--leading-loose);
  color: var(--fg-muted);
}
</style>
