<script setup>
/**
 * GalleryPage — 14 photographs.
 *
 * SAFE DEGRADATION, and the honest handling of placeholder content:
 *   Every one of the 14 images is a `picsum.photos` stub — there is not a single real
 *   photograph in the project. The old page presented them as if they were real. Here
 *   a notice at the top of the page says so plainly, and each card carries a
 *   "Placeholder" badge, so the gallery reads as a work in progress rather than as the
 *   owner's actual photography. `content.layer` tags them with `imageStatus:
 *   'placeholder'`, so when real images arrive the flag flips and the notice and badges
 *   disappear on their own.
 *
 * Also fixed:
 *   - The card was a `<div @click>`, so the lightbox was unreachable by keyboard.
 *   - The lightbox had no Teleport, ARIA, focus handling or scroll lock.
 *   - Images had no intrinsic dimensions, so the grid reflowed as each one loaded.
 *   - `alt` was a copy of `title`, which is adequate, but the location and year were
 *     not associated with the image at all; they now appear in the caption and in the
 *     lightbox.
 */
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useContent, enumLabelKey, distinctValues } from '@/content/index.js';
import PageShell from '@/components/layout/PageShell.vue';
import PageHeader from '@/components/layout/PageHeader.vue';
import FilterBar from '@/components/ui/FilterBar.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import AppModal from '@/components/ui/AppModal.vue';

const { t } = useI18n();
const { gallery } = useContent();

const ALL = 'all';
const selected = ref(ALL);
const active = ref(null);

const categories = computed(() => distinctValues(gallery.value, 'category'));

const options = computed(() => {
  const countFor = (value) =>
    value === ALL ? gallery.value.length : gallery.value.filter((i) => i.category === value).length;

  return [
    { value: ALL, label: t('common.filterAll'), count: countFor(ALL) },
    ...categories.value.map((value) => ({
      value,
      label: t(enumLabelKey('gallery', 'category', value)),
      count: countFor(value),
    })),
  ];
});

const filtered = computed(() =>
  selected.value === ALL
    ? gallery.value
    : gallery.value.filter((i) => i.category === selected.value),
);

/** True while any item is still a stub, so the notice can retire itself later. */
const hasPlaceholders = computed(() => gallery.value.some((i) => i.imageStatus === 'placeholder'));
</script>

<template>
  <PageShell>
    <PageHeader
      :overline="t('gallery.overline')"
      :title="t('gallery.title')"
      :lede="t('gallery.lede')"
      :meta="t('gallery.countLabel', { count: gallery.length })"
    />

    <p v-if="hasPlaceholders" class="notice" role="note">
      {{ t('gallery.placeholderNotice') }}
    </p>

    <FilterBar
      v-model="selected"
      class="gallery__filters"
      :options="options"
      :label="t('gallery.filterLabel')"
    />

    <ul v-if="filtered.length" class="gallery__grid">
      <li v-for="item in filtered" :key="item.id">
        <button
          type="button"
          class="shot"
          :aria-label="`${t('gallery.openPhoto')}: ${item.title}`"
          @click="active = item"
        >
          <span class="shot__frame">
            <!-- Explicit dimensions reserve the box so late loading cannot reflow the grid. -->
            <img
              :src="item.image"
              :alt="item.title"
              width="600"
              height="400"
              loading="lazy"
              decoding="async"
            />
            <span v-if="item.imageStatus === 'placeholder'" class="shot__badge">
              {{ t('gallery.placeholderBadge') }}
            </span>
          </span>

          <span class="shot__caption">
            <span class="shot__title">{{ item.title }}</span>
            <span class="shot__meta">
              <span>{{ item.location }}</span>
              <span v-if="item.year">· {{ item.year }}</span>
            </span>
          </span>
        </button>
      </li>
    </ul>

    <EmptyState
      v-else
      :title="t('gallery.emptyTitle')"
      :body="t('gallery.emptyBody')"
      :action-label="t('common.filterAll')"
      @action="selected = ALL"
    />

    <!-- ── lightbox ──────────────────────────────────────────────────── -->
    <AppModal
      :model-value="Boolean(active)"
      :title="active?.title ?? ''"
      size="lg"
      @update:model-value="(v) => { if (!v) active = null; }"
    >
      <figure v-if="active" class="lightbox">
        <img
          class="lightbox__img"
          :src="active.image"
          :alt="active.title"
          width="600"
          height="400"
        />
        <figcaption class="lightbox__caption">
          <p class="lightbox__desc">{{ active.description }}</p>
          <dl class="lightbox__facts">
            <div>
              <dt>{{ t('gallery.locationLabel') }}</dt>
              <dd>{{ active.location }}</dd>
            </div>
            <div v-if="active.year">
              <dt>{{ t('gallery.yearLabel') }}</dt>
              <dd>{{ active.year }}</dd>
            </div>
          </dl>
          <p v-if="active.imageStatus === 'placeholder'" class="lightbox__badge">
            {{ t('gallery.placeholderBadge') }}
          </p>
        </figcaption>
      </figure>
    </AppModal>
  </PageShell>
</template>

<style scoped>
.notice {
  padding: var(--space-sm);
  margin-block-end: var(--space-lg);
  font-size: var(--step--1);
  color: var(--fg-muted);
  background-color: var(--warn-soft);
  border-inline-start: 2px solid var(--warn);
  border-radius: var(--radius-sm);
}

.gallery__filters {
  margin-block-end: var(--space-lg);
}

.gallery__grid {
  display: grid;
  gap: var(--space-md);
  list-style: none;
}

@media (min-width: 620px) {
  .gallery__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 980px) {
  .gallery__grid { grid-template-columns: repeat(3, 1fr); }
}

.shot {
  display: flex;
  flex-direction: column;
  inline-size: 100%;
  block-size: 100%;
  gap: var(--space-xs);
  padding: 0;
  text-align: start;
  background: none;
  border: 0;
}

.shot__frame {
  position: relative;
  display: block;
  overflow: hidden;
  background-color: var(--bg-sunken);
  border: var(--border-width) solid var(--card-border);
  border-radius: var(--card-radius);
}

.shot__frame img {
  inline-size: 100%;
  block-size: auto;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  transition: transform var(--dur-slow) var(--ease-out);
}

.shot:hover .shot__frame img {
  transform: scale(1.03);
}

.shot:focus-visible {
  outline: none;
}

.shot:focus-visible .shot__frame {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}

/* The placeholder badge is always visible, not a hover reveal — the point is that the
   visitor cannot mistake these for real photographs. */
.shot__badge {
  position: absolute;
  inset-block-start: var(--space-xs);
  inset-inline-start: var(--space-xs);
  padding: 0.1rem var(--space-2xs);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--fg-inverse);
  background-color: var(--fg-muted);
  border-radius: var(--radius-sm);
}

.shot__caption {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.shot__title {
  font-family: var(--font-display);
  font-size: var(--step-0);
  font-weight: var(--weight-display);
  color: var(--fg);
}

.shot__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2xs);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--fg-faint);
}

/* ── lightbox ──────────────────────────────────────────────────────────── */

.lightbox {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin: 0;
}

.lightbox__img {
  inline-size: 100%;
  block-size: auto;
  border-radius: var(--radius-sm);
}

.lightbox__caption {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.lightbox__desc {
  line-height: var(--leading-loose);
  color: var(--fg-muted);
}

.lightbox__facts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin: 0;
}

.lightbox__facts dt {
  font-family: var(--font-mono);
  font-size: 0.64rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--fg-faint);
}

.lightbox__facts dd {
  margin: 0;
  font-size: var(--step--1);
  color: var(--fg);
}

.lightbox__badge {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--warn);
}
</style>
