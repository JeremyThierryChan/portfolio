<template>
  <component
    v-if="testimonial"
    :is="to ? RouterLink : 'article'"
    v-bind="linkAttrs"
    class="testimonial"
    :class="`testimonial--${style}`"
  >
    <figure class="testimonial__figure">
      <blockquote class="testimonial__quote">
        <p>{{ testimonial.excerpt }}</p>
      </blockquote>

      <footer class="testimonial__attrib">
        <!-- c only. Decorative: the name is right beside it, so the block is hidden
             from assistive technology and its contrast is not load-bearing. -->
        <span
          v-if="style === 'c' && testimonial.color"
          class="testimonial__avatar"
          aria-hidden="true"
          :style="{ '--avatar': testimonial.color }"
        >{{ testimonial.initials }}</span>

        <span class="testimonial__by">
          <cite class="testimonial__name">{{ testimonial.name }}</cite>
          <span v-if="testimonial.role" class="testimonial__role">{{ testimonial.role }}</span>
          <span v-if="testimonial.context" class="testimonial__context">{{ testimonial.context }}</span>
        </span>

        <time
          v-if="testimonial.date"
          class="testimonial__date"
          :datetime="testimonial.date"
        >{{ testimonial.date }}</time>

        <!-- Always visible, never a hover-only layer. -->
        <span v-if="to" class="testimonial__more">
          {{ t('testimonials.readFull') }}
          <span class="testimonial__arrow" aria-hidden="true">→</span>
        </span>
      </footer>
    </figure>
  </component>
</template>

<script setup>
/**
 * TestimonialCard — one recommendation, in three expressions:
 *
 *   a  Editorial   no box: a vertical accent rule draws the excerpt out, serif and large
 *   b  Terminal    a ticked box, the excerpt set in monospace
 *   c  Magazine    soft-shadow paper card, round initials block, serif excerpt
 *
 * Semantics (the defect this replaces): the old card was a bare <p> with quote marks
 * typed into the copy, so a screen reader heard an ordinary paragraph. This is a
 * <figure> + <blockquote> + <cite>, with the attribution in a <footer> and the date in
 * a real <time datetime>.
 *
 * `to` decides the wrapper: a router-link when a detail page exists, a plain <article>
 * when it does not — never a dead link.
 *
 * No copy is hard-coded: the excerpt, name, role and context all arrive resolved from
 * useContent(). The one inline literal, `--avatar`, is a presentation value carried by
 * the data layer (testimonials[].color), not a design decision made in CSS.
 *
 * Tokens only — see src/styles/TOKENS.md. The three expressions differ through
 * --card-bg / --card-border / --card-radius / --card-shadow / --hover-lift /
 * --tick-size, plus per-variant typography.
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';

import { useTimeTheme } from '@/theme/useTimeTheme.js';

const props = defineProps({
  /** A resolved testimonial: id/name/initials/color/role/context/excerpt/full/date/datePrecision */
  testimonial: { type: Object, default: null },
  /**
   * Where the detail page lives, or null when there is none (the card then renders
   * as a plain <article>). Accepts either a path string or a named-route object,
   * because both are valid RouterLink locations and the testimonials page passes
   * `{ name: 'testimonialDetail', params: { id } }`.
   */
  to: { type: [String, Object], default: null },
});

const { t } = useI18n();
/** 'a' | 'b' | 'c' — the reactive style axis, resolved by the clock. */
const { style } = useTimeTheme();

/** `to` only belongs on the link wrapper; passing it to an <article> would leak an attribute. */
const linkAttrs = computed(() => (props.to ? { to: props.to } : {}));
</script>

<style scoped>
/* ── shared skeleton ─────────────────────────────────────────────────────── */

.testimonial {
  display: block;
  color: inherit;
  text-decoration: none;
  transition:
    transform var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out),
    border-color var(--dur-base) var(--ease-out),
    background-color var(--dur-fast) var(--ease-out);
}

.testimonial:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}

.testimonial__figure {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* UA margins on blockquote/figure are reset above; keep the excerpt's own paragraph clean. */
.testimonial__quote {
  margin: 0;
  font-family: var(--font-display);
  font-weight: var(--weight-display);
  letter-spacing: var(--tracking-tight);
}

.testimonial__quote p { margin: 0; }

.testimonial__attrib {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-sm);
}

.testimonial__by {
  display: flex;
  flex: 1 1 14rem;
  flex-direction: column;
  gap: var(--space-3xs);
}

.testimonial__name {
  font-family: var(--font-display);
  font-size: var(--step-0);
  font-style: normal;
  font-weight: var(--weight-strong);
}

.testimonial__role,
.testimonial__context {
  color: var(--fg-muted);
  font-size: var(--step--1);
}

.testimonial__date {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--fg-faint);
  font-variant-numeric: tabular-nums;
}

.testimonial__more {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  font-family: var(--font-mono);
  font-size: var(--step--1);
  letter-spacing: var(--overline-spacing);
  text-transform: uppercase;
  color: var(--accent);
}

.testimonial__arrow {
  display: inline-block;
  transition: transform var(--dur-base) var(--ease-out);
}

.testimonial:hover .testimonial__arrow { transform: translateX(var(--space-3xs)); }

/* ── a · Editorial — a rule, not a box ──────────────────────────────────── */

.testimonial--a .testimonial__quote {
  padding-left: var(--space-lg);
  border-left: calc(var(--border-width) * 2) solid var(--accent);
  font-size: var(--step-2);
  line-height: var(--leading);
  max-width: var(--measure-read);
}

.testimonial--a .testimonial__figure { gap: var(--space-md); }

/* ── b · Terminal — ticked box, monospace excerpt ────────────────────────── */

.testimonial--b {
  position: relative;
  padding: var(--space-lg);
  background-color: var(--card-bg);
  border: var(--border-width) solid var(--card-border);
  border-radius: var(--card-radius);
}

.testimonial--b::before,
.testimonial--b::after {
  content: '';
  position: absolute;
  width: var(--tick-size);
  height: var(--tick-size);
  border: var(--border-width) solid var(--accent);
  pointer-events: none;
}

.testimonial--b::before {
  top: calc(-1 * var(--border-width));
  left: calc(-1 * var(--border-width));
  border-right: 0;
  border-bottom: 0;
}

.testimonial--b::after {
  right: calc(-1 * var(--border-width));
  bottom: calc(-1 * var(--border-width));
  border-left: 0;
  border-top: 0;
}

.testimonial--b .testimonial__quote {
  font-family: var(--font-mono);
  font-weight: var(--weight-body);
  font-size: var(--step-0);
  letter-spacing: var(--tracking);
  max-width: var(--measure-read);
}

.testimonial--b .testimonial__attrib {
  padding-top: var(--space-md);
  border-top: var(--border-width) solid var(--line);
}

.testimonial--b .testimonial__name { font-family: var(--font-mono); }

/* Hover and focus share one treatment, so the state never depends on a pointer. */
a.testimonial--b:hover,
a.testimonial--b:focus-visible {
  background-color: var(--bg-sunken);
  border-color: var(--line-strong);
}

/* ── c · Magazine — paper card, initials block, serif excerpt ───────────── */

.testimonial--c {
  padding: var(--space-lg);
  background-color: var(--card-bg);
  border: var(--border-width) solid var(--card-border);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
}

a.testimonial--c:hover,
a.testimonial--c:focus-visible {
  transform: translateY(var(--hover-lift));
  box-shadow: var(--shadow-md);
  border-color: var(--line-strong);
}

.testimonial--c .testimonial__quote {
  font-size: var(--step-1);
  line-height: var(--leading-loose);
  max-width: var(--measure-read);
}

.testimonial__avatar {
  display: grid;
  flex: none;
  place-items: center;
  width: var(--space-2xl);
  height: var(--space-2xl);
  border-radius: var(--radius-full);
  background-color: var(--avatar);
  color: var(--fg-inverse);
  font-family: var(--font-mono);
  font-size: var(--step--1);
  letter-spacing: var(--tracking-wide);
}

.testimonial--c .testimonial__date { color: var(--fg-muted); }
</style>
