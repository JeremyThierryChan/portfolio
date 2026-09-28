<script setup>
/**
 * ServiceCard — one thing that can be hired.
 *
 * Structurally different from `WorkCard`: a project card is a pointer to evidence (it
 * opens a case study), whereas a service card IS the information. So this is a plain
 * `<article>` with no interactive affordance, and the call to action lives once at the
 * bottom of the page rather than on every card — nine competing "contact me" buttons is
 * nine times the noise for the same click.
 *
 * The "what that covers" list is the part clients actually read: "interpreting" is
 * vague, "trade fairs and exhibition-booth support" is a thing they can picture.
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { enumLabelKey } from '@/content/index.js';

const props = defineProps({
  /** A service from `useContent().services` — already locale-resolved. */
  service: { type: Object, required: true },
  /** Compact mode drops the includes list, for index-style listings. */
  compact: { type: Boolean, default: false },
});

const { t } = useI18n();

const domainLabel = computed(() =>
  t(enumLabelKey('services', 'domain', props.service.domain)),
);
</script>

<template>
  <article class="svc">
    <header class="svc__head">
      <h3 class="svc__title">{{ service.title }}</h3>
      <span class="svc__domain">{{ domainLabel }}</span>
    </header>

    <p v-if="service.languages" class="svc__langs">{{ service.languages }}</p>

    <p class="svc__summary">{{ service.summary }}</p>

    <template v-if="!compact && service.includes?.length">
      <h4 class="svc__includes-label">{{ t('services.includesLabel') }}</h4>
      <ul class="svc__includes">
        <li v-for="item in service.includes" :key="item" class="svc__include">{{ item }}</li>
      </ul>
    </template>

    <!--
      The unit this service is billed in. It sits on every card, compact or not: the
      figure itself is deliberately absent site-wide (see QuoteProcess.vue), so this line
      is the whole of what a visitor is told about price until they make contact.
    -->
    <p v-if="service.billing" class="svc__billing">
      <span class="svc__billing-label">{{ t('services.billingLabel') }}</span>
      {{ service.billing }}
    </p>

    <!--
      Only the service that actually has a detail page gets this, so it is not the "nine
      competing calls to action" the component deliberately avoids — it is one pointer to
      more information about one service.
    -->
    <router-link v-if="service.ratesPath" class="svc__more" :to="service.ratesPath">
      {{ t('tutoring.title') }}
      <span aria-hidden="true">→</span>
    </router-link>
  </article>
</template>

<style scoped>
.svc {
  /* One place for the label size, shared by both captions on the card. */
  --svc-label-size: 0.66rem;

  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
  block-size: 100%;
  padding: var(--space-md);
  background-color: var(--card-bg);
  border: var(--border-width) solid var(--card-border);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  transition: transform var(--dur-fast) var(--ease-out);
}

/* A service card is not clickable, so the lift is purely a reading aid, not a
   false affordance. */
.svc:hover {
  transform: translateY(var(--hover-lift));
}

.svc__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-xs);
  flex-wrap: wrap;
}

.svc__title {
  font-size: var(--step-1);
}

.svc__domain {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--accent);
  white-space: nowrap;
  padding: 0.1rem var(--space-2xs);
  border: var(--border-width) solid var(--line);
  border-radius: var(--radius-sm);
}

.svc__langs {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--fg-muted);
}

.svc__summary {
  margin-block-start: var(--space-2xs);
  font-size: var(--step--1);
  line-height: var(--leading);
  color: var(--fg-muted);
  flex: 1;
}

.svc__includes-label {
  margin-block-start: var(--space-sm);
  font-family: var(--font-mono);
  font-size: var(--svc-label-size);
  font-weight: var(--weight-strong);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--fg-faint);
}

/* A single pointer to a detail page, on the one service that has one. Still not a call to
   action: the link goes to information, not to the contact form. */
.svc__more {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  margin-block-start: var(--space-sm);
  min-block-size: var(--control-height);

  font-size: var(--step--1);
  font-weight: var(--weight-strong);
  color: var(--accent);
  text-decoration: none;
}

.svc__more:hover {
  text-decoration: underline;
}

.svc__more:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}

.svc__billing {
  margin-block-start: var(--space-sm);
  padding-block-start: var(--space-2xs);
  border-block-start: var(--border-width) solid var(--line);
  font-size: var(--step--1);
  line-height: var(--leading);
  color: var(--fg-muted);
}

.svc__billing-label {
  font-family: var(--font-mono);
  font-size: var(--svc-label-size);
  font-weight: var(--weight-strong);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--fg-faint);
  margin-inline-end: var(--space-2xs);
}

.svc__includes {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xs);
  list-style: none;
  margin: 0;
  padding: 0;
}

.svc__include {
  position: relative;
  padding-inline-start: var(--space-sm);
  font-size: var(--step--1);
  line-height: var(--leading);
  color: var(--fg);
}

/* A token-coloured marker instead of a list-style-glyph, so it follows the theme in
   all six combinations and never renders as a stray bullet in style B. */
.svc__include::before {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 0.55em;
  inline-size: 0.3rem;
  block-size: 0.3rem;
  border-radius: var(--radius-full);
  background-color: var(--accent);
}</style>
