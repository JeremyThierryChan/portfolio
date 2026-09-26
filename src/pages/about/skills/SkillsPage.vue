<script setup>
/**
 * SkillsPage — evidence instead of self-assessment.
 *
 * WHAT CHANGED AND WHY: every skill used to carry `level: 90`, rendered as a progress bar.
 * A visitor cannot verify a self-awarded percentage, cannot act on it, and it invites the
 * reader to argue about the number instead of reading what is behind it. What Jeremy
 * actually has is a stack of checkable credentials — IELTS 8.0, ETIC Advanced, CET-6 583,
 * Gaokao English 135/150, chief interpreter at IRONMAN China — and none of them were
 * visible in that model.
 *
 * So the bar is gone. Each skill now carries:
 *
 *   usage     'professional' | 'working' | 'learning'
 *             A statement about whether client work depends on it. A fact, not a boast,
 *             which gives the page an honest triage without inventing a ranking.
 *
 *   evidence  the checkable facts themselves, listed on the card.
 *
 * The filter follows the same axis — how a skill is used rather than its category —
 * because "what do you actually deliver with" is the question a client has. Category
 * survives as a small badge on each card.
 */
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useContent, enumLabelKey, distinctValues } from '@/content/index.js';
import PageShell from '@/components/layout/PageShell.vue';
import PageHeader from '@/components/layout/PageHeader.vue';
import FilterBar from '@/components/ui/FilterBar.vue';
import EmptyState from '@/components/ui/EmptyState.vue';

const { t } = useI18n();
const { skills } = useContent();

const ALL = 'all';
const selected = ref(ALL);

/** Strongest usage first, so the default reading order leads with delivered work. */
const USAGE_ORDER = ['professional', 'working', 'learning'];

const usages = computed(() =>
  distinctValues(skills.value, 'usage')
    .slice()
    .sort((a, b) => USAGE_ORDER.indexOf(a) - USAGE_ORDER.indexOf(b)));

const options = computed(() => {
  const countFor = (value) =>
    value === ALL ? skills.value.length : skills.value.filter((s) => s.usage === value).length;

  return [
    { value: ALL, label: t('common.filterAll'), count: countFor(ALL) },
    ...usages.value.map((value) => ({
      value,
      // Short form: the long one ("Client work depends on it") is a sentence, and a
      // filter chip is not the place for a sentence.
      label: t(enumLabelKey('skills', 'usageShort', value)),
      count: countFor(value),
    })),
  ];
});

const filtered = computed(() =>
  selected.value === ALL
    ? skills.value
    : skills.value.filter((s) => s.usage === selected.value),
);
</script>

<template>
  <PageShell>
    <PageHeader
      :overline="t('skills.overline')"
      :title="t('skills.title')"
      :lede="t('skills.lede')"
      :meta="t('skills.countLabel', { count: skills.length })"
    />

    <FilterBar
      v-model="selected"
      class="skills__filters"
      :options="options"
      :label="t('skills.filterLabel')"
    />

    <ul v-if="filtered.length" class="skills__grid">
      <li v-for="skill in filtered" :key="skill.id" class="skill">
        <header class="skill__head">
          <h2 class="skill__name">{{ skill.name }}</h2>
          <span class="skill__category">
            {{ t(enumLabelKey('skills', 'category', skill.category)) }}
          </span>
        </header>

        <!--
          The usage band is stated in words, not drawn as a bar. It is the honest
          replacement for the percentage: it says whether client work depends on the
          skill, which is a fact the reader can weigh.
        -->
        <p
          class="skill__usage"
          :class="`skill__usage--${skill.usage}`"
          :title="t(enumLabelKey('skills', 'usage', skill.usage))"
        >
          {{ t(enumLabelKey('skills', 'usageShort', skill.usage)) }}
          <span class="visually-hidden">— {{ t(enumLabelKey('skills', 'usage', skill.usage)) }}</span>
        </p>

        <p class="skill__desc">{{ skill.description }}</p>

        <template v-if="skill.evidence?.length">
          <h3 class="skill__evidence-label">{{ t('skills.evidenceLabel') }}</h3>
          <ul class="skill__evidence">
            <li v-for="item in skill.evidence" :key="item" class="skill__fact">{{ item }}</li>
          </ul>
        </template>
      </li>
    </ul>

    <EmptyState
      v-else
      :title="t('common.empty')"
      :action-label="t('common.filterAll')"
      @action="selected = ALL"
    />
  </PageShell>
</template>

<style scoped>
.skills__filters {
  margin-block-end: var(--space-lg);
}

.skills__grid {
  display: grid;
  gap: var(--space-md);
  list-style: none;
}

@media (min-width: 640px) {
  .skills__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1060px) {
  .skills__grid { grid-template-columns: repeat(3, 1fr); }
}

.skill {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
  padding: var(--space-md);
  background-color: var(--card-bg);
  border: var(--border-width) solid var(--card-border);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  transition: transform var(--dur-fast) var(--ease-out);
}

.skill:hover {
  transform: translateY(var(--hover-lift));
}

.skill__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-xs);
  flex-wrap: wrap;
}

.skill__name {
  font-size: var(--step-1);
}

.skill__category {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--fg-faint);
  white-space: nowrap;
}

/* ── the usage band ────────────────────────────────────────────────────── */

.skill__usage {
  position: relative;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: var(--weight-strong);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  padding-inline-start: var(--space-sm);
}

/* A coloured marker, not a bar: it classifies rather than scoring. */
.skill__usage::before {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 0.45em;
  inline-size: 0.35rem;
  block-size: 0.35rem;
  border-radius: var(--radius-full);
  background-color: currentColor;
}

.skill__usage--professional { color: var(--ok); }
.skill__usage--working { color: var(--accent); }
.skill__usage--learning { color: var(--fg-faint); }

.skill__desc {
  margin-block-start: var(--space-2xs);
  font-size: var(--step--1);
  line-height: var(--leading);
  color: var(--fg-muted);
}

/* ── evidence ──────────────────────────────────────────────────────────── */

.skill__evidence-label {
  margin-block-start: var(--space-sm);
  font-family: var(--font-mono);
  font-size: 0.64rem;
  font-weight: var(--weight-strong);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--fg-faint);
}

.skill__evidence {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xs);
  list-style: none;
  margin: 0;
  padding: 0;
}

.skill__fact {
  position: relative;
  padding-inline-start: var(--space-sm);
  font-size: var(--step--1);
  line-height: var(--leading);
  color: var(--fg);
}

.skill__fact::before {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 0.55em;
  inline-size: 0.25rem;
  block-size: 0.25rem;
  border-radius: var(--radius-full);
  background-color: var(--line-strong);
}
</style>
