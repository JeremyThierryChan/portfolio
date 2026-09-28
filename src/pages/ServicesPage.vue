<script setup>
/**
 * ServicesPage — the page that answers "what can I hire you for".
 *
 * This is the site's most commercially important route: the goal is inbound work, and
 * this is where a prospective client finds their own situation. `projects` proves
 * capability; this sells it.
 *
 * ── How the two controls divide the work ────────────────────────────────────────
 *
 * There are two filters and they answer different questions, so only one is ever
 * *grouping* at a time — a lesson from how easily stacked filters become unpredictable:
 *
 *   Audience ("I'm here about…")  WHO the visitor is. Groups the page into relevant
 *                                 items plus a collapsed remainder.
 *   Area (Language / Trade / Tech)  WHAT KIND of service. Narrows the set.
 *
 * When an area filter is active the list goes FLAT, ordered with the audience-relevant
 * items first. Collapsing *and* narrowing at once produces views where the "relevant"
 * group is empty and the visitor concludes the site is broken, so that combination is
 * deliberately not offered.
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
import CollapsedGroup from '@/components/ui/CollapsedGroup.vue';
import AppButton from '@/components/ui/AppButton.vue';
import ServiceCard from '@/components/content/ServiceCard.vue';

const { t } = useI18n();
const { services, profile } = useContent();
const { current, isFiltered } = useAudience();

const ALL_AREAS = 'all';
const area = ref(ALL_AREAS);

const areas = computed(() => distinctValues(services.value, 'domain'));

const areaOptions = computed(() => {
  const countFor = (value) =>
    value === ALL_AREAS
      ? services.value.length
      : services.value.filter((s) => s.domain === value).length;

  return [
    { value: ALL_AREAS, label: t('common.filterAll'), count: countFor(ALL_AREAS) },
    ...areas.value.map((value) => ({
      value,
      label: t(enumLabelKey('services', 'domain', value)),
      count: countFor(value),
    })),
  ];
});

/** Area filter first, then the audience split — see the note at the top of the file. */
const narrowed = computed(() =>
  area.value === ALL_AREAS
    ? services.value
    : services.value.filter((s) => s.domain === area.value));

const grouping = computed(() => splitByAudience(narrowed.value, current.value));

/** Area filter active: flat list, audience-relevant first, nothing collapsed. */
const isFlat = computed(() => area.value !== ALL_AREAS);

const flatList = computed(() => {
  const { relevant, other } = grouping.value;
  return [...relevant, ...other];
});

const otherLabel = computed(() => {
  const n = grouping.value.other.length;
  return t('audience.otherCount', { count: n });
});
</script>

<template>
  <PageShell>
    <PageHeader
      :overline="t('services.overline')"
      :title="t('services.title')"
      :lede="t('services.lede')"
      :meta="t('services.countLabel', { count: services.length })"
    />

    <!-- The visitor-identity question. Not a gate: the page below is already complete. -->
    <AudiencePicker />

    <FilterBar
      v-model="area"
      class="svc-page__areas"
      :options="areaOptions"
      :label="t('services.filterLabel')"
      size="sm"
    />

    <!-- ── flat view (an area filter is active) ──────────────────────────── -->
    <ul v-if="isFlat" class="svc-page__grid">
      <li v-for="service in flatList" :key="service.id">
        <ServiceCard :service="service" />
      </li>
    </ul>

    <!-- ── grouped view (audience, or everything) ────────────────────────── -->
    <template v-else>
      <ul v-if="grouping.relevant.length" class="svc-page__grid">
        <li v-for="service in grouping.relevant" :key="service.id">
          <ServiceCard :service="service" />
        </li>
      </ul>

      <CollapsedGroup
        v-if="grouping.other.length"
        name="services-other"
        :label="otherLabel"
        :hint="t('audience.otherBody')"
      >
        <ul class="svc-page__grid svc-page__grid--other">
          <li v-for="service in grouping.other" :key="service.id">
            <ServiceCard :service="service" />
          </li>
        </ul>
      </CollapsedGroup>
    </template>

    <!--
      The long tail. Jeremy takes on work outside these nine; saying so explicitly means
      the structured list does not read as an exhaustive menu he cannot be asked to go
      beyond.
    -->
    <p class="svc-page__other">{{ t('services.otherNote') }}</p>

    <!-- ── how it works, and the ask ─────────────────────────────────────── -->
    <section class="svc-page__cta" aria-labelledby="svc-cta-title">
      <div class="svc-page__cta-main">
        <h2 id="svc-cta-title" class="svc-page__cta-title">{{ t('services.ctaTitle') }}</h2>
        <p class="svc-page__cta-body">{{ t('services.ctaBody') }}</p>

        <AppButton variant="primary" size="lg" to="/contact">
          {{ t('services.cta') }}
        </AppButton>

        <p v-if="!isFiltered" class="svc-page__avail">
          {{ profile.positioning.availability }}
        </p>
      </div>

      <dl class="svc-page__facts">
        <div class="svc-page__fact">
          <dt>{{ t('services.pricingTitle') }}</dt>
          <dd>{{ t('services.pricingBody') }}</dd>
        </div>
        <div class="svc-page__fact">
          <dt>{{ t('services.travelNote') }}</dt>
          <dd>{{ profile.positioning.available }}</dd>
        </div>
      </dl>
    </section>
  </PageShell>
</template>

<style scoped>
.svc-page__areas {
  margin-block-end: var(--space-lg);
}

.svc-page__grid {
  display: grid;
  gap: var(--space-md);
  list-style: none;
}

/*
 * No breakpoint here on purpose: `auto-fit` asks the CONTAINER how many columns fit.
 *
 * These grids used to switch at fixed VIEWPORT widths, which measures the wrong thing.
 * The grid lives inside `.container`, capped at `--measure` (1080-1160px depending on the
 * clock), so at a 1600px window it still only had about 1048px to work with and the
 * "3 columns" rule fired because the window was wide, not because there was room.
 * `auto-fit` cannot be wrong about that at any width.
 *
 * `min(X, 100%)` is NOT optional: with a plain `Xrem` floor the track would be 320px wide
 * inside the 280px that a 320px phone leaves after gutters, and the page would scroll
 * sideways. The `min()` caps the floor at the container, so the worst case is one
 * full-width column.
 */
.svc-page__grid { grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr)); }

/* The collapsed remainder is visually quieter, so it reads as secondary without being
   hidden or disabled. */
.svc-page__grid--other {
  opacity: 0.9;
  margin-block-start: var(--space-sm);
}

.svc-page__other {
  margin-block-start: var(--space-lg);
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--fg-faint);
}

.svc-page__cta {
  display: grid;
  gap: var(--space-lg);
  margin-block-start: var(--space-2xl);
  padding: var(--space-lg);
  background-color: var(--bg-raised);
  border: var(--border-width) solid var(--line);
  border-radius: var(--radius-lg);
}

/* Same reasoning as the card grid above. The intentional 1.1fr/0.9fr asymmetry is given
   up for it: an even split that holds at every width beats a ratio that only applied above
   900px of viewport. */
.svc-page__cta {
  grid-template-columns: repeat(auto-fit, minmax(min(22rem, 100%), 1fr));
  align-items: start;
}

.svc-page__cta-title {
  font-size: var(--step-2);
  margin-block-end: var(--space-xs);
}

.svc-page__cta-body {
  font-size: var(--step-0);
  line-height: var(--leading-loose);
  color: var(--fg-muted);
  margin-block-end: var(--space-md);
}

.svc-page__avail {
  margin-block-start: var(--space-xs);
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--ok);
}

.svc-page__facts {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin: 0;
}

.svc-page__fact dt {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: var(--weight-strong);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--fg-faint);
  margin-block-end: var(--space-2xs);
}

.svc-page__fact dd {
  margin: 0;
  font-size: var(--step--1);
  line-height: var(--leading);
  color: var(--fg-muted);
}
</style>
