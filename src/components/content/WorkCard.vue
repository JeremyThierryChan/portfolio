<template>
  <article v-if="project" class="work-card" :class="`work-card--${style}`">
    <h3 class="work-card__title">
      <button type="button" class="work-card__trigger" @click="emit('open', project)">
        <span class="work-card__title-text">{{ project.title }}</span>
        <span class="visually-hidden">— {{ t('projects.openProject') }}</span>
      </button>
    </h3>

    <div class="work-card__meta">
      <StatusPill :status="project.status" />
      <span v-if="stageLabel" class="work-card__stage">{{ stageLabel }}</span>
    </div>

    <p v-if="project.description" class="work-card__desc">{{ project.description }}</p>

    <!-- The label gives the chip row an accessible name, so it is not announced as
         an unlabelled list of words. -->
    <TagList
      v-if="project.tech && project.tech.length"
      :items="project.tech"
      :label="t('projects.techStack')"
    />

    <p v-if="project.cofounder" class="work-card__cofounder">
      {{ t('projects.cofounderLabel', { name: project.cofounder }) }}
    </p>

    <div v-if="hasProgress" class="work-card__meter">
      <ProgressMeter :value="project.progress" />
    </div>

    <!-- No public URL is stated plainly (muted, dashed) instead of rendering an
         anchor that goes nowhere. -->
    <p class="work-card__action" :class="{ 'work-card__action--none': !project.link }">
      <span>{{ project.link ? t('projects.viewProject') : t('projects.noLink') }}</span>
      <span v-if="project.link" class="work-card__arrow" aria-hidden="true">↗</span>
    </p>
  </article>
</template>

<script setup>
/**
 * WorkCard — one project, three expressions, one information hierarchy:
 * title → status (+ stage) → description → tech → cofounder → progress → affordance.
 *
 * Keyboard reachability (the defect this replaces): the old card attached a click
 * handler to a plain div, so a keyboard user could not open a project at all. The
 * card is now an <article> whose title contains a real button, stretched over the
 * whole card with a pseudo-element. That gives one tab stop, an accessible name, and
 * a full-card hit area — while keeping the <h3> a heading (a whole-card button would
 * have to swallow the heading, the paragraph and the list, none of which are valid
 * button content).
 *
 * `emits: open` — the card never navigates by itself. The parent decides: an external
 * link opens the site, anything else opens details. The action line is therefore
 * presentational text, not a nested control (which would be invalid inside the
 * stretched button and would swallow the click).
 *
 * Tokens only — see src/styles/TOKENS.md. The three expressions share one skeleton
 * and differ through --card-bg / --card-border / --card-radius / --card-shadow /
 * --hover-lift / --tick-size plus per-variant typography.
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useTimeTheme } from '@/theme/useTimeTheme.js';

import StatusPill from '@/components/ui/StatusPill.vue';
import TagList from '@/components/ui/TagList.vue';
import ProgressMeter from '@/components/ui/ProgressMeter.vue';

const props = defineProps({
  /** A resolved project from useContent(): id/slug/status/progress/tech/cofounder/link/title/description/stages */
  project: { type: Object, default: null },
});

const emit = defineEmits(['open']);

const { t } = useI18n();
/** 'a' | 'b' | 'c' — the reactive style axis, resolved by the clock. */
const { style } = useTimeTheme();

const hasProgress = computed(() => typeof props.project?.progress === 'number');

/**
 * "Stage 2 of 4" — only for projects that actually have stages, and counted from
 * the data (`completed: true`) rather than from `progress`, which measures the
 * project as a whole and does not imply a stage boundary.
 */
const stageLabel = computed(() => {
  const stages = props.project?.stages ?? [];
  if (!stages.length) return null;
  const current = stages.filter((stage) => stage.completed).length;
  return t('projects.stageOf', { current, total: stages.length });
});
</script>

<style scoped>
/* ── shared skeleton ─────────────────────────────────────────────────────── */

.work-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-lg);
  background-color: var(--card-bg);
  border: var(--border-width) solid var(--card-border);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  transition:
    transform var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out),
    border-color var(--dur-base) var(--ease-out),
    background-color var(--dur-fast) var(--ease-out);
}

.work-card__title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: var(--weight-display);
  font-size: var(--step-1);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

.work-card__trigger {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
  text-align: left;
}

/* The stretched hit area: whole card clickable, one tab stop, no nested controls. */
.work-card__trigger::after {
  content: '';
  position: absolute;
  inset: 0;
}

.work-card__trigger:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
  border-radius: var(--radius-sm);
}

.work-card__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-xs);
}

.work-card__desc {
  margin: 0;
  color: var(--fg-muted);
}

.work-card__cofounder {
  margin: 0;
  color: var(--fg-muted);
  font-size: var(--step--1);
}

.work-card__meter { margin-top: auto; }

.work-card__action {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: var(--space-2xs);
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--accent);
}

.work-card__arrow {
  display: inline-block;
  transition: transform var(--dur-base) var(--ease-out);
}

.work-card:hover .work-card__arrow { transform: translateX(var(--space-3xs)); }

/* The explicit disabled state for a project with no public URL. */
.work-card__action--none {
  color: var(--fg-faint);
  border: var(--border-width) dashed var(--line-strong);
  border-radius: var(--radius-sm);
  padding: var(--space-3xs) var(--space-xs);
}

/* ── a · Editorial — hairline restraint, no shadow, serif title ──────────── */

.work-card--a { gap: var(--space-md); }

.work-card--a:hover,
.work-card--a:focus-within {
  transform: translateY(var(--hover-lift));
  border-color: var(--line-strong);
}

.work-card--a .work-card__meta {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--fg-muted);
}

.work-card--a .work-card__desc { max-width: var(--measure-read); }

.work-card--a .work-card__meter {
  padding-top: var(--space-sm);
  border-top: var(--border-width) solid var(--line);
}

.work-card--a .work-card__action {
  letter-spacing: var(--overline-spacing);
  text-transform: uppercase;
}

/* ── b · Terminal — ticked box, monospace metadata, no rounding ──────────── */

.work-card--b { gap: var(--space-sm); }

/* Corner ticks. Style B sets every radius to 0 and every shadow to none, so the
   box reads purely from its border plus these two accent marks. */
.work-card--b::before,
.work-card--b::after {
  content: '';
  position: absolute;
  width: var(--tick-size);
  height: var(--tick-size);
  border: var(--border-width) solid var(--accent);
  pointer-events: none;
}

.work-card--b::before {
  top: calc(-1 * var(--border-width));
  left: calc(-1 * var(--border-width));
  border-right: 0;
  border-bottom: 0;
}

.work-card--b::after {
  right: calc(-1 * var(--border-width));
  bottom: calc(-1 * var(--border-width));
  border-left: 0;
  border-top: 0;
}

.work-card--b:hover,
.work-card--b:focus-within {
  background-color: var(--bg-sunken);
  border-color: var(--line-strong);
}

.work-card--b .work-card__title { font-weight: var(--weight-strong); }

.work-card--b .work-card__meta {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--fg-muted);
  letter-spacing: var(--overline-spacing);
  text-transform: uppercase;
}

.work-card--b .work-card__desc { max-width: var(--measure-read); }

.work-card--b .work-card__stage,
.work-card--b .work-card__cofounder { font-family: var(--font-mono); }

.work-card--b .work-card__meter {
  padding-top: var(--space-sm);
  border-top: var(--border-width) solid var(--line);
}

.work-card--b .work-card__action {
  padding: var(--space-3xs) var(--space-xs);
  border: var(--border-width) solid var(--line-strong);
  border-radius: var(--radius-sm);
  color: var(--fg-muted);
  transition:
    color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}

.work-card--b:hover .work-card__action,
.work-card--b:focus-within .work-card__action {
  color: var(--accent);
  border-color: var(--accent);
}

/* ── c · Magazine — paper card, wide leading, soft warm shadow ───────────── */

.work-card--c { gap: var(--space-md); }

.work-card--c:hover,
.work-card--c:focus-within {
  transform: translateY(var(--hover-lift));
  box-shadow: var(--shadow-md);
  border-color: var(--line-strong);
}

.work-card--c .work-card__title {
  font-weight: var(--weight-display);
  font-size: var(--step-2);
}

.work-card--c .work-card__meta {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--fg-muted);
}

.work-card--c .work-card__desc {
  line-height: var(--leading-loose);
  max-width: var(--measure-read);
}

.work-card--c .work-card__action {
  letter-spacing: var(--overline-spacing);
  text-transform: uppercase;
}

@media (max-width: 40rem) {
  .work-card--c .work-card__title { font-size: var(--step-1); }
}
</style>
