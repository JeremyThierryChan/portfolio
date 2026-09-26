<script setup>
/**
 * AppButton — the single button/link primitive.
 *
 * Renders as `<router-link>`, `<a>` or `<button>` depending on what it is given, so
 * that a navigation control is never a click-handling `<div>` and an action is never
 * a link that does nothing.
 *
 * Every visual value is a token, so the button restyles itself across all six
 * style x mode combinations without a single variant-specific rule.
 */
import { computed } from 'vue';

const props = defineProps({
  /** 'primary' | 'secondary' | 'ghost' | 'quiet' */
  variant: { type: String, default: 'primary' },
  /** 'sm' | 'md' | 'lg' */
  size: { type: String, default: 'md' },
  /** Internal route — renders a <router-link>. */
  to: { type: [String, Object], default: null },
  /** External URL — renders an <a>. Adds target/rel and an sr-only hint. */
  href: { type: String, default: null },
  /** Native button type, only used when rendering a <button>. */
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  /** Stretch to the container width. */
  block: { type: Boolean, default: false },
  /** Screen-reader-only hint, e.g. "opens in a new tab". */
  srHint: { type: String, default: '' },
});

const tag = computed(() => {
  if (props.disabled) return 'button';
  if (props.to) return 'router-link';
  if (props.href) return 'a';
  return 'button';
});

const bindings = computed(() => {
  const base = {
    class: [
      'app-btn',
      `app-btn--${props.variant}`,
      `app-btn--${props.size}`,
      { 'app-btn--block': props.block, 'app-btn--disabled': props.disabled },
    ],
  };

  if (tag.value === 'router-link') {
    return { ...base, to: props.to, 'aria-disabled': props.disabled || undefined };
  }
  if (tag.value === 'a') {
    return {
      ...base,
      href: props.disabled ? undefined : props.href,
      target: '_blank',
      rel: 'noopener noreferrer',
      'aria-disabled': props.disabled || undefined,
    };
  }
  return {
    ...base,
    type: props.type,
    disabled: props.disabled,
    'aria-disabled': props.disabled || undefined,
  };
});
</script>

<template>
  <component :is="tag" v-bind="bindings">
    <slot />
    <span v-if="srHint" class="visually-hidden">{{ srHint }}</span>
  </component>
</template>

<style scoped>
.app-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2xs);
  font-family: var(--font-body);
  font-weight: var(--weight-strong);
  line-height: 1;
  text-decoration: none;
  border: var(--border-width) solid transparent;
  border-radius: var(--radius-full);
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-out);
}

.app-btn:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}

/* ── sizes ─────────────────────────────────────────────────────────────── */

.app-btn--sm {
  block-size: var(--control-height-sm);
  padding-inline: var(--space-sm);
  font-size: var(--step--1);
  letter-spacing: var(--tracking-wide);
}

.app-btn--md {
  block-size: var(--control-height);
  padding-inline: var(--space-md);
  font-size: var(--step--1);
  letter-spacing: var(--tracking-wide);
}

.app-btn--lg {
  block-size: var(--control-height-lg);
  padding-inline: var(--space-lg);
  font-size: var(--step-0);
}

/* ── variants ──────────────────────────────────────────────────────────── */

.app-btn--primary {
  background-color: var(--accent);
  border-color: var(--accent);
  color: var(--accent-fg);
}

.app-btn--primary:hover:not(.app-btn--disabled) {
  transform: translateY(var(--hover-lift));
}

.app-btn--secondary {
  background-color: transparent;
  border-color: var(--line-strong);
  color: var(--fg);
}

.app-btn--secondary:hover:not(.app-btn--disabled) {
  border-color: var(--accent);
  color: var(--accent);
}

.app-btn--ghost {
  background-color: transparent;
  border-color: transparent;
  color: var(--fg-muted);
}

.app-btn--ghost:hover:not(.app-btn--disabled) {
  background-color: var(--accent-soft);
  color: var(--accent);
}

.app-btn--quiet {
  background-color: var(--bg-sunken);
  border-color: var(--line);
  color: var(--fg);
}

.app-btn--quiet:hover:not(.app-btn--disabled) {
  border-color: var(--line-strong);
}

/* ── states ────────────────────────────────────────────────────────────── */

.app-btn--block { inline-size: 100%; }

.app-btn--disabled {
  cursor: not-allowed;
  opacity: 0.55;
  transform: none;
}
</style>
