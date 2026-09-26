<script setup>
/**
 * TestimonialsPage — five letters.
 *
 * Fixed relative to the old page:
 *   - Cards started at `opacity: 0` with `animation: slideUp 1s forwards` and no
 *     reduced-motion fallback, so with animation disabled the page rendered blank.
 *   - The excerpt was a bare `<p>` wrapped in hand-typed straight quotes, and
 *     role/context/date were plain divs. It is now `<blockquote>` + `<cite>` with a
 *     `<footer>` and `<time>`, so a quotation is semantically a quotation.
 *   - The avatar was a coloured square with an inline background colour and no label;
 *     it is now a monogram with an accessible name.
 *   - This page sized its `<h1>` differently from the detail page for no reason.
 */
import { useI18n } from 'vue-i18n';
import { useContent } from '@/content/index.js';
import PageShell from '@/components/layout/PageShell.vue';
import PageHeader from '@/components/layout/PageHeader.vue';
import TestimonialCard from '@/components/content/TestimonialCard.vue';

const { t } = useI18n();
const { testimonials } = useContent();
</script>

<template>
  <PageShell>
    <PageHeader
      :overline="t('testimonials.overline')"
      :title="t('testimonials.title')"
      :lede="t('testimonials.lede')"
      :meta="t('common.showing', { count: testimonials.length, total: testimonials.length })"
    />

    <ul class="testimonials">
      <li v-for="item in testimonials" :key="item.id">
        <TestimonialCard
          :testimonial="item"
          :to="{ name: 'testimonialDetail', params: { id: item.id } }"
        />
      </li>
    </ul>
  </PageShell>
</template>

<style scoped>
.testimonials {
  display: grid;
  gap: var(--space-lg);
  list-style: none;
}

@media (min-width: 860px) {
  .testimonials {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
