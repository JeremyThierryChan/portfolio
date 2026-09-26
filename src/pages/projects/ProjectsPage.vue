<script setup>
/**
 * ProjectsPage — selected work, then the complete index.
 *
 * THE TRIAGE PROBLEM THIS SOLVES: 21 entries of very uneven depth. Ranking them flat buries
 * the six actually worth reading; deleting the weak ones would throw away real work. So the
 * page has two halves:
 *
 *   1. SELECTED WORK — the `tier: 'featured'` projects as full cards, audience-filtered, so
 *      a visitor meets their own kind of work first.
 *
 *   2. ALL PROJECTS — a compact index of every entry, `archived` included. This is the
 *      page's guarantee: triage decides what is PROMOTED, never what EXISTS. Nothing is
 *      hidden, and the index is deliberately NOT audience-filtered for exactly that reason.
 *
 * `archived` is surfaced as "Not promoted". The data field is internal shorthand, but to a
 * visitor the word "archived" reads as "abandoned", which is not what it means here.
 *
 * Two splits compose because they apply to different halves:
 *   featured grid → audience split (reorder + collapse)
 *   full index    → status split (a filter the reader drives explicitly)
 */
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useContent, enumLabelKey, distinctValues } from '@/content/index.js';
import { splitByAudience } from '@/content/audiences.js';
import { useAudience } from '@/composables/useAudience.js';

import PageShell from '@/components/layout/PageShell.vue';
import PageHeader from '@/components/layout/PageHeader.vue';
import AudiencePicker from '@/components/ui/AudiencePicker.vue';
import FilterBar from '@/components/ui/FilterBar.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import CollapsedGroup from '@/components/ui/CollapsedGroup.vue';
import WorkCard from '@/components/content/WorkCard.vue';
import AppModal from '@/components/ui/AppModal.vue';
import AppButton from '@/components/ui/AppButton.vue';
import StatusPill from '@/components/ui/StatusPill.vue';
import TagList from '@/components/ui/TagList.vue';
import ProgressMeter from '@/components/ui/ProgressMeter.vue';

const { t } = useI18n();
const { projects } = useContent();
const { current } = useAudience();

const ALL = 'all';
const selected = ref(ALL);
const active = ref(null);

/* ── the two halves ────────────────────────────────────────────────────── */

const featured = computed(() => projects.value.filter((p) => p.tier === 'featured'));

/** Audience split applies to the promoted half only. */
const featuredSplit = computed(() => splitByAudience(featured.value, current.value));
const otherLabel = computed(() => t('audience.otherCount', { count: featuredSplit.value.other.length }));

/**
 * The complete index: every project, ordered featured → listed → archived so the reader
 * still meets the stronger work first, with nothing filtered out of the list itself.
 */
const TIER_ORDER = ['featured', 'listed', 'archived'];
const indexList = computed(() =>
  [...projects.value]
    .filter((p) => selected.value === ALL || p.status === selected.value)
    .sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier)));

/* ── status filter, driving the index only ─────────────────────────────── */

const statuses = computed(() => distinctValues(projects.value, 'status'));

const options = computed(() => {
  const countFor = (value) =>
    value === ALL
      ? projects.value.length
      : projects.value.filter((p) => p.status === value).length;

  return [
    { value: ALL, label: t('common.filterAll'), count: countFor(ALL) },
    ...statuses.value.map((value) => ({
      value,
      label: t(enumLabelKey('projects', 'status', value)),
      count: countFor(value),
    })),
  ];
});

/* ── detail dialog ─────────────────────────────────────────────────────── */

function open(project) {
  active.value = project;
}

const stageProgress = computed(() => {
  const stages = active.value?.stages ?? [];
  if (!stages.length) return null;
  const done = stages.filter((s) => s.completed).length;
  return { label: t('projects.stageOf', { current: done, total: stages.length }) };
});
</script>

<template>
  <PageShell>
    <PageHeader
      :overline="t('projects.overline')"
      :title="t('projects.title')"
      :lede="t('projects.lede')"
      :meta="t('projects.countLabel', { count: projects.length })"
    />

    <AudiencePicker />

    <!-- ── 1. selected work ──────────────────────────────────────────────── -->
    <section aria-labelledby="projects-featured-title">
      <header class="sec-head">
        <h2 id="projects-featured-title" class="sec-head__title">{{ t('projects.featuredTitle') }}</h2>
        <p class="sec-head__lede">{{ t('projects.featuredLede') }}</p>
      </header>

      <ul v-if="featuredSplit.relevant.length" class="grid">
        <li v-for="project in featuredSplit.relevant" :key="project.id">
          <WorkCard :project="project" @open="open(project)" />
        </li>
      </ul>

      <CollapsedGroup
        v-if="featuredSplit.other.length"
        name="projects-featured-other"
        :label="otherLabel"
        :hint="t('audience.otherBody')"
      >
        <ul class="grid grid--other">
          <li v-for="project in featuredSplit.other" :key="project.id">
            <WorkCard :project="project" @open="open(project)" />
          </li>
        </ul>
      </CollapsedGroup>
    </section>

    <!-- ── 2. the complete index ─────────────────────────────────────────── -->
    <section class="index" aria-labelledby="projects-index-title">
      <header class="sec-head">
        <h2 id="projects-index-title" class="sec-head__title">{{ t('projects.indexTitle') }}</h2>
        <p class="sec-head__lede">{{ t('projects.indexLede') }}</p>
      </header>

      <FilterBar
        v-model="selected"
        class="index__filter"
        :options="options"
        :label="t('projects.filterLabel')"
        size="sm"
      />

      <p class="index__count">{{ t('projects.indexCount', { count: projects.length }) }}</p>

      <ul v-if="indexList.length" class="index__list">
        <li v-for="project in indexList" :key="project.id" class="row">
          <span class="row__title">
            <!-- A real button: every project opens its detail, including the unpromoted
                 ones. The index is a complete door, not a display case. -->
            <button type="button" class="row__button" @click="open(project)">
              {{ project.title }}
              <span class="visually-hidden">— {{ t('projects.clickForMore') }}</span>
            </button>
          </span>

          <span class="row__status">
            <StatusPill :status="project.status" size="sm" />
          </span>

          <span class="row__tech">
            <TagList v-if="project.tech?.length" :items="project.tech" size="sm" :max="3" />
          </span>

          <span class="row__actions">
            <span v-if="project.tier === 'archived'" class="row__archived">
              {{ t('projects.archivedNote') }}
            </span>
            <a
              v-if="project.link"
              class="row__link"
              :href="project.link"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`${t('projects.openLink')}: ${project.title}`"
            >↗</a>
          </span>
        </li>
      </ul>

      <EmptyState
        v-else
        :title="t('projects.emptyTitle')"
        :body="t('projects.emptyBody')"
        :action-label="t('common.filterAll')"
        @action="selected = ALL"
      />
    </section>

    <!-- ── detail dialog ─────────────────────────────────────────────────── -->
    <AppModal
      :model-value="Boolean(active)"
      :title="active?.title ?? ''"
      size="md"
      @update:model-value="(v) => { if (!v) active = null; }"
    >
      <div v-if="active" class="detail">
        <div class="detail__row">
          <StatusPill :status="active.status" />
          <span v-if="stageProgress" class="detail__stages">{{ stageProgress.label }}</span>
        </div>

        <p class="detail__desc">{{ active.description }}</p>

        <ProgressMeter
          v-if="typeof active.progress === 'number'"
          :value="active.progress"
          :label="`${active.title} — ${t('projects.progressLabel')}`"
        />

        <section v-if="active.tech?.length" class="detail__section">
          <h3 class="detail__heading">{{ t('projects.techStack') }}</h3>
          <TagList :items="active.tech" :label="t('projects.techStack')" />
        </section>

        <p v-if="active.cofounder" class="detail__cofounder">
          {{ t('projects.cofounderLabel', { name: active.cofounder }) }}
        </p>

        <section v-if="active.stages?.length" class="detail__section">
          <h3 class="detail__heading">{{ t('projects.stages') }}</h3>
          <ol class="stages">
            <li
              v-for="stage in active.stages"
              :key="stage.id"
              class="stage"
              :class="{ 'stage--done': stage.completed }"
            >
              <span class="stage__mark" aria-hidden="true">{{ stage.completed ? '✓' : '·' }}</span>
              <span class="stage__body">
                <span class="stage__name">
                  {{ stage.name }}
                  <span class="visually-hidden">
                    — {{ stage.completed ? t('projects.stageCompleted') : t('projects.stageInProgress') }}
                  </span>
                </span>
                <span class="stage__desc">{{ stage.description }}</span>
              </span>
            </li>
          </ol>
        </section>
      </div>

      <template #footer>
        <AppButton
          v-if="active?.link"
          variant="primary"
          :href="active.link"
          :sr-hint="t('common.externalLink')"
        >
          {{ t('projects.viewProject') }}
        </AppButton>
        <span v-else class="detail__nolink">{{ t('projects.noLink') }}</span>
      </template>
    </AppModal>
  </PageShell>
</template>

<style scoped>
.sec-head {
  margin-block-end: var(--space-lg);
}

.sec-head__title {
  font-size: var(--step-2);
  margin-block-end: var(--space-2xs);
}

.sec-head__lede {
  font-size: var(--step--1);
  line-height: var(--leading-loose);
  color: var(--fg-muted);
  max-inline-size: var(--measure-read);
}

.grid {
  display: grid;
  gap: var(--space-md);
  list-style: none;
}

@media (min-width: 640px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1040px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}

.grid--other {
  opacity: 0.9;
  margin-block-start: var(--space-sm);
}

/* ── the complete index ────────────────────────────────────────────────── */

.index {
  margin-block-start: var(--space-3xl);
}

.index__filter {
  margin-block-end: var(--space-sm);
}

.index__count {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--fg-faint);
  margin-block-end: var(--space-xs);
}

.index__list {
  list-style: none;
}

.row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-2xs) var(--space-sm);
  align-items: center;
  padding-block: var(--space-xs);
  border-block-start: var(--border-width) solid var(--line);
}

.row:last-child {
  border-block-end: var(--border-width) solid var(--line);
}

@media (min-width: 900px) {
  .row {
    grid-template-columns: minmax(0, 1.6fr) auto minmax(0, 1.2fr) auto;
  }
}

.row__title {
  min-inline-size: 0;
}

.row__button {
  font-family: var(--font-display);
  font-size: var(--step-0);
  font-weight: var(--weight-display);
  color: var(--fg);
  background: none;
  border: 0;
  padding: 0;
  text-align: start;
  text-decoration: underline;
  text-decoration-color: var(--line-strong);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
  transition: color var(--dur-fast) var(--ease-out);
}

.row__button:hover {
  color: var(--accent);
  text-decoration-color: var(--accent);
}

.row__button:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
  border-radius: var(--radius-sm);
}

.row__status {
  justify-self: start;
}

.row__tech {
  min-inline-size: 0;
}

.row__actions {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  justify-self: end;
}

.row__archived {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--fg-faint);
  border: var(--border-width) dashed var(--line);
  border-radius: var(--radius-sm);
  padding: 0 var(--space-3xs);
  white-space: nowrap;
}

.row__link {
  font-family: var(--font-mono);
  font-size: var(--step-0);
  color: var(--accent);
  text-decoration: none;
  padding: var(--space-3xs) var(--space-2xs);
  border: var(--border-width) solid var(--line);
  border-radius: var(--radius-sm);
  transition: border-color var(--dur-fast) var(--ease-out);
}

.row__link:hover {
  border-color: var(--accent);
}

.row__link:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}

/* ── dialog content ────────────────────────────────────────────────────── */

.detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.detail__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-xs);
}

.detail__stages {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--fg-faint);
}

.detail__desc {
  line-height: var(--leading-loose);
  color: var(--fg-muted);
}

.detail__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.detail__heading {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--fg-faint);
}

.detail__cofounder {
  font-size: var(--step--1);
  color: var(--fg-muted);
}

.detail__nolink {
  font-size: var(--step--1);
  color: var(--fg-faint);
}

.stages {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  list-style: none;
}

.stage {
  display: grid;
  grid-template-columns: 1.25rem 1fr;
  gap: var(--space-xs);
  align-items: start;
  font-size: var(--step--1);
  color: var(--fg-faint);
}

.stage__mark {
  font-family: var(--font-mono);
  color: var(--line-strong);
  text-align: center;
}

.stage--done { color: var(--fg-muted); }
.stage--done .stage__mark { color: var(--ok); }

.stage__body { display: flex; flex-direction: column; gap: 0.1rem; }
.stage__name { font-weight: var(--weight-strong); color: var(--fg); }
.stage__desc { color: var(--fg-muted); }
</style>
