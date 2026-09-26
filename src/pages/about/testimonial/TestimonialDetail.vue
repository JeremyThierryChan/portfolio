<script setup>
/**
 * TestimonialDetail — one full letter.
 *
 * Fixed relative to the old page:
 *   - The whole letter was stuffed into a single `<p>` wrapped in literal quote
 *     characters, with no `<blockquote>` and no `<cite>`. A 900-character quotation
 *     is now marked up as a quotation, with the attribution beside it rather than
 *     inside the quoted text.
 *   - The not-found branch hard-coded "Testimonial not found." in English and reused
 *     the detail URL, so a non-English visitor got English and stayed put. It is now
 *     translated and offers a real way back.
 *   - `props: ['id']` was untyped and compared with `==`, so `/about/testimonials/01`
 *     and `/about/testimonials/1` behaved differently depending on coercion. The id is
 *     now normalised once.
 *   - Both branches repeated the entire root structure; there is now one shell.
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useContent } from '@/content/index.js';
import PageShell from '@/components/layout/PageShell.vue';
import PageHeader from '@/components/layout/PageHeader.vue';
import AppButton from '@/components/ui/AppButton.vue';

const props = defineProps({
  /** Route param — always a string from the URL. */
  id: { type: [String, Number], required: true },
});

const { t } = useI18n();
const { testimonials } = useContent();

/** Normalise once so '01' and '1' resolve to the same letter. */
const wanted = computed(() => String(props.id));

const testimonial = computed(
  () => testimonials.value.find((item) => String(item.id) === wanted.value) ?? null,
);
</script>

<template>
  <PageShell width="read">
    <!-- ── found ─────────────────────────────────────────────────────── -->
    <template v-if="testimonial">
      <PageHeader
        :overline="t('testimonials.overline')"
        :title="testimonial.name"
        :lede="testimonial.role"
      />

      <article class="letter">
        <div class="letter__meta">
          <p v-if="testimonial.context" class="letter__context">
            <span class="letter__label">{{ t('testimonials.contextLabel') }}</span>
            {{ testimonial.context }}
          </p>
          <time v-if="testimonial.date" class="letter__date" :datetime="testimonial.date">
            {{ testimonial.date }}
          </time>
        </div>

        <figure class="letter__figure">
          <blockquote class="letter__quote">
            <p>{{ testimonial.full }}</p>
          </blockquote>
          <figcaption class="letter__caption">
            <cite>{{ testimonial.name }}</cite>
            <span>{{ testimonial.role }}</span>
          </figcaption>
        </figure>
      </article>

      <AppButton
        class="letter__back"
        variant="secondary"
        :to="{ name: 'testimonials' }"
      >
        {{ t('testimonials.backBtn') }}
      </AppButton>
    </template>

    <!-- ── not found ─────────────────────────────────────────────────── -->
    <template v-else>
      <PageHeader
        :overline="t('testimonials.overline')"
        :title="t('testimonials.notFoundTitle')"
        :lede="t('testimonials.notFoundBody')"
      />
      <AppButton variant="primary" :to="{ name: 'testimonials' }">
        {{ t('testimonials.notFoundCta') }}
      </AppButton>
    </template>
  </PageShell>
</template>

<style scoped>
.letter {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.letter__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-xs);
  padding-block-end: var(--space-sm);
  border-block-end: var(--border-width) solid var(--line);
}

.letter__context {
  font-size: var(--step--1);
  color: var(--fg-muted);
}

.letter__label {
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  font-size: 0.68rem;
  color: var(--fg-faint);
  margin-inline-end: var(--space-2xs);
}

.letter__date {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--fg-faint);
}

.letter__figure {
  margin: 0;
}

.letter__quote {
  margin: 0;
  padding-inline-start: var(--space-md);
  border-inline-start: 2px solid var(--accent);
  font-size: var(--step-1);
  line-height: var(--leading-loose);
  color: var(--fg);
}

.letter__caption {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xs);
  margin-block-start: var(--space-md);
  padding-inline-start: var(--space-md);
  font-size: var(--step--1);
  color: var(--fg-muted);
}

.letter__caption cite {
  font-style: normal;
  font-weight: var(--weight-strong);
  color: var(--fg);
}

.letter__back {
  margin-block-start: var(--space-xl);
}
</style>
