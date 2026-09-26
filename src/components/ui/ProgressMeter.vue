<script setup>
/**
 * ProgressMeter — a percentage with a real accessibility role.
 *
 * The old build drew this as a bare `<div>` with an inline `width: 90%` and no
 * semantics, so the value was invisible to assistive technology and the inline
 * style bypassed theming entirely.
 *
 * The number is always rendered as text: a bar alone does not communicate a value.
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  /** 0–100. */
  value: { type: Number, required: true },
  /** Overrides the default accessible name. */
  label: { type: String, default: '' },
  /** Hide the numeric readout (the accessible value is still exposed). */
  hideValue: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
});

const { t } = useI18n();

const clamped = computed(() => Math.max(0, Math.min(100, Math.round(props.value ?? 0))));
const accessibleName = computed(() => props.label || t('projects.progressLabel'));
</script>

<template>
  <div class="meter" :class="`meter--${size}`">
    <div
      class="meter__track"
      role="progressbar"
      :aria-valuenow="clamped"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="accessibleName"
      :aria-valuetext="t('common.percentOf', { value: clamped, max: 100 })"
    >
      <span class="meter__fill" :style="{ inlineSize: `${clamped}%` }" />
    </div>
    <b v-if="!hideValue" class="meter__value" aria-hidden="true">{{ clamped }}%</b>
  </div>
</template>

<style scoped>
.meter {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.meter__track {
  flex: 1;
  background-color: var(--bg-sunken);
  border: var(--border-width) solid var(--line);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.meter--md .meter__track { block-size: 0.4rem; }
.meter--sm .meter__track { block-size: 0.25rem; }

.meter__fill {
  display: block;
  block-size: 100%;
  background-color: var(--accent);
  transition: inline-size var(--dur-slow) var(--ease-out);
}

.meter__value {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  font-variant-numeric: tabular-nums;
  color: var(--fg-muted);
  font-weight: var(--weight-strong);
  min-inline-size: 3ch;
  text-align: right;
}
</style>
