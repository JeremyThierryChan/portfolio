<script setup>
/**
 * CollapsedGroup — holds the content that was reordered out of the way.
 *
 * The design decision behind this component: selecting an audience REORDERS and
 * COLLAPSES, it never hides. Three reasons, all of which this element has to honour:
 *
 *   - The breadth of nine services across language, trade and technology is the actual
 *     selling point. Hiding seven of them to focus an audience would delete the pitch.
 *   - Nothing disappearing means nothing looks broken, and no visitor is left wondering
 *     whether work was quietly dropped.
 *   - Crawlers and no-JS visitors still get the whole page, because this is a native
 *     `<details>` — the content is present and in the DOM, just folded.
 *
 * Native `<details>`/`<summary>` rather than a hand-rolled disclosure: it is keyboard
 * operable, announced correctly, findable with in-page search, and needs no JavaScript.
 */
defineProps({
  /** Shown as the summary text, e.g. "Show 4 more". */
  label: { type: String, required: true },
  /** Optional one-line explanation beside the summary. */
  hint: { type: String, default: '' },
  /** Notified when toggled, so a page can react (analytics, focus management). */
  name: { type: String, default: '' },
});
</script>

<template>
  <details class="cg" :data-group="name || undefined">
    <summary class="cg__summary">
      <span class="cg__chevron" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="12" height="12" focusable="false">
          <path
            d="M6 3.5L10.5 8 6 12.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <span class="cg__label">{{ label }}</span>
      <span v-if="hint" class="cg__hint">{{ hint }}</span>
    </summary>

    <div class="cg__body">
      <slot />
    </div>
  </details>
</template>

<style scoped>
.cg {
  margin-block-start: var(--space-lg);
  border-block-start: var(--border-width) solid var(--line);
}

.cg__summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-xs);
  padding-block: var(--space-sm);
  cursor: pointer;
  list-style: none;
  font-size: var(--step--1);
  color: var(--fg-muted);
  transition: color var(--dur-fast) var(--ease-out);
}

/* The default disclosure triangle differs across browsers; draw our own instead. */
.cg__summary::-webkit-details-marker { display: none; }
.cg__summary::marker { content: ''; }

.cg__summary:hover { color: var(--fg); }

.cg__summary:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
  border-radius: var(--radius-sm);
}

.cg__chevron {
  display: inline-flex;
  color: var(--accent);
  transition: transform var(--dur-fast) var(--ease-out);
}

.cg[open] .cg__chevron {
  transform: rotate(90deg);
}

.cg__label {
  font-family: var(--font-mono);
  font-weight: var(--weight-strong);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--accent);
  white-space: nowrap;
}

.cg__hint {
  color: var(--fg-faint);
}

.cg__body {
  padding-block-end: var(--space-xs);
}</style>
