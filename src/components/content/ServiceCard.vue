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
  </article>
</template>

<style scoped>
.svc {
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
  font-size: 0.66rem;
  font-weight: var(--weight-strong);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--fg-faint);
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
