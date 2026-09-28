<script setup>
/**
 * TutoringPage — the per-hour rate card, at /tutoring.
 *
 * WHY THIS IS ITS OWN PAGE. The teaching service card is one of nine in a grid, and a
 * 27-row price table does not belong inside a card: it would either blow up the grid or
 * force the other eight services to grow a table they do not have. So the card states how
 * it is billed and links here.
 *
 * WHAT THE TABLE ACTUALLY IS, and the reason it is laid out this way: it is NOT twenty-
 * seven independent prices. It is one one-to-one price per course plus a four-entry
 * coefficient row, which is how Jeremy's own sheet is built and which was verified cell by
 * cell before publishing (`verify-content` re-checks the arithmetic on every run). So the
 * coefficient sits in the header row where it belongs, next to the column it scales, and
 * `howBody` states the relationship in words for anyone who would rather read it than
 * infer it.
 *
 * Read as a real table: `<th scope="col">` for the group sizes, `<th scope="row">` for
 * each course, and a `<colgroup>`-scoped heading row per section. On a narrow screen the
 * table scrolls sideways inside a labelled, focusable region rather than being reflowed,
 * because a price table that has been turned into stacked cards can no longer be compared
 * across columns — and comparing columns is the only thing anyone does with it.
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useContent } from '@/content/index.js';
import PageShell from '@/components/layout/PageShell.vue';
import PageHeader from '@/components/layout/PageHeader.vue';
import AppButton from '@/components/ui/AppButton.vue';

const { t } = useI18n();
const { tutoringGroups, tutoringSections, tutoringCourses } = useContent();

/** Sections with their courses attached, in curated order. Sections with none are dropped. */
const table = computed(() =>
  tutoringSections.value
    .map((section) => ({
      ...section,
      courses: tutoringCourses.value.filter((course) => course.section === section.id),
    }))
    .filter((section) => section.courses.length > 0),
);

const hasAnyPrice = computed(() =>
  tutoringCourses.value.some((course) => course.prices && Object.keys(course.prices).length),
);

/**
 * One cell. Three outcomes, and they mean different things:
 *   a number  — offered at this group size
 *   on request — `prices: null`, which is what the sheet says for LLM, Shapr3D and PE
 *   a dash     — not offered at this group size (after-school support is one-to-one only)
 */
function cell(course, groupId) {
  if (course.prices === null) return t('tutoring.quotedOnRequest');
  const price = course.prices?.[groupId];
  return typeof price === 'number' ? String(price) : '—';
}

function isNumber(course, groupId) {
  return typeof course.prices?.[groupId] === 'number';
}
</script>

<template>
  <PageShell>
    <PageHeader
      :overline="t('tutoring.overline')"
      :title="t('tutoring.title')"
      :lede="t('tutoring.lede')"
    />

    <!-- The pricing model in words, before the numbers. The table is not self-explanatory:
         without this, the coefficient row reads as four unrelated columns. -->
    <section class="rates__how" aria-labelledby="rates-how-title">
      <h2 id="rates-how-title" class="rates__how-title">{{ t('tutoring.howTitle') }}</h2>
      <p class="rates__how-body">{{ t('tutoring.howBody') }}</p>
    </section>

    <h2 id="rates-table-title" class="rates__heading">
      {{ t('tutoring.title') }}
      <span class="rates__unit">{{ t('tutoring.unit') }}</span>
    </h2>

    <div
      v-if="hasAnyPrice"
      class="rates__scroll"
      role="region"
      aria-labelledby="rates-table-title"
      tabindex="0"
    >
      <table class="rates__table">
        <thead>
          <tr>
            <th scope="col" class="rates__col-course">{{ t('tutoring.courseColumn') }}</th>
            <th v-for="group in tutoringGroups" :key="group.id" scope="col" class="rates__col-group">
              <span class="rates__group-name">{{ group.label }}</span>
              <span class="rates__group-coef">×{{ group.coefficient }}</span>
            </th>
          </tr>
        </thead>

        <tbody v-for="section in table" :key="section.id">
          <tr class="rates__section">
            <th scope="colgroup" :colspan="tutoringGroups.length + 1" class="rates__section-name">
              {{ section.label }}
            </th>
          </tr>
          <tr v-for="course in section.courses" :key="course.id" class="rates__row">
            <th scope="row" class="rates__course">{{ course.name }}</th>
            <td
              v-for="group in tutoringGroups"
              :key="group.id"
              class="rates__price"
              :class="{ 'rates__price--text': !isNumber(course, group.id) }"
            >
              {{ cell(course, group.id) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="rates__cta">
      <AppButton variant="primary" size="lg" to="/contact">{{ t('tutoring.cta') }}</AppButton>
    </div>
  </PageShell>
</template>

<style scoped>
.rates__how {
  max-inline-size: var(--measure-read);
  margin-block-end: var(--space-2xl);
  padding-inline-start: var(--space-md);
  border-inline-start: var(--border-width) solid var(--accent);
}

.rates__how-title {
  font-size: var(--step-1);
  margin-block-end: var(--space-2xs);
}

.rates__how-body {
  margin: 0;
  color: var(--fg-muted);
  line-height: var(--leading-loose);
}

.rates__heading {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-2xs) var(--space-sm);

  font-size: var(--step-2);
  margin-block-end: var(--space-sm);
}

.rates__unit {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  font-weight: var(--weight-body);
  letter-spacing: var(--tracking-wide);
  color: var(--fg-faint);
}

/* Scrolls rather than reflows: a price table that has been stacked into cards can no
   longer be compared down a column, which is the only thing it is for. Focusable and
   labelled so a keyboard can scroll it too. */
.rates__scroll {
  overflow-x: auto;
  border: var(--border-width) solid var(--line);
  border-radius: var(--radius-md);
}

.rates__scroll:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}

.rates__table {
  inline-size: 100%;
  min-inline-size: 34rem;
  border-collapse: collapse;
  font-size: var(--step--1);
}

.rates__table th,
.rates__table td {
  text-align: start;
  padding: var(--space-2xs) var(--space-sm);
  border-block-end: var(--border-width) solid var(--line);
}

.rates__col-course {
  min-inline-size: 11rem;
}

.rates__col-group {
  text-align: end;
  white-space: nowrap;
}

/* The coefficient lives under the column heading it scales, which is where the reader
   needs it — the alternative is a separate row that has to be matched up by eye. */
.rates__group-name {
  display: block;
  font-weight: var(--weight-strong);
}

.rates__group-coef {
  display: block;
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--fg-faint);
}

.rates__section-name {
  background-color: var(--bg-sunken);
  font-family: var(--font-mono);
  font-size: var(--step--1);
  font-weight: var(--weight-strong);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--fg-muted);
}

.rates__course {
  font-weight: var(--weight-body);
  color: var(--fg);
}

/* Tabular figures so the columns line up as numbers rather than as text. */
.rates__price {
  text-align: end;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  color: var(--fg);
}

/* "On request" and the not-offered dash are not numbers and must not read as one. */
.rates__price--text {
  font-family: var(--font-body);
  color: var(--fg-faint);
}

.rates__cta {
  margin-block-start: var(--space-2xl);
}
</style>
