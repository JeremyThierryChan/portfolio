<script setup>
/**
 * PageShell — the wrapper every route renders inside.
 *
 * Two jobs:
 *
 *  1. It is the element `.page-shell` — and in `base.css` all typographic identity
 *     (font stack, type scale, margin zeroing) is scoped to `.page-shell` rather
 *     than applied globally. That boundary exists because the not-yet-migrated pages
 *     still lean on browser default heading/paragraph margins; removing the prefix is
 *     the last step of the migration.
 *
 *  2. It replaces the page container that eleven pages each reinvented at a
 *     different width (600 / 700 / 720 / 800 / 1000 / 1100px). There are now three
 *     widths, named by intent.
 */
defineProps({
  /** 'default' | 'read' | 'wide' | 'full' */
  width: { type: String, default: 'default' },
  /** Render the container. Set false for pages that manage their own full-bleed bands. */
  container: { type: Boolean, default: true },
  /** Skip the top padding when the page supplies its own hero. */
  flush: { type: Boolean, default: false },
});
</script>

<template>
  <main
    class="page-shell"
    :class="[`page-shell--${width}`, { 'page-shell--flush': flush }]"
    :id="'main'"
  >
    <div v-if="container" class="container" :class="{ 'container--read': width === 'read' }">
      <slot />
    </div>
    <slot v-else />
  </main>
</template>

<style scoped>
.page-shell {
  /* Grows so a short page never leaves the footer floating mid-screen, and
     `min-height` is deliberately NOT set per page any more — that used to stack
     with the navbar and footer to guarantee a pointless scrollbar. */
  flex: 1 0 auto;
  inline-size: 100%;
  padding-block: var(--space-2xl) var(--space-3xl);
  background-color: var(--bg);
}

.page-shell--flush {
  padding-block-start: 0;
}

/* The blueprint grid is a Terminal-style flourish, so it is opt-in via a token
   that is `transparent` in the other two styles. */
.page-shell--wide > .container,
.page-shell--full > .container {
  max-inline-size: none;
}

@media (max-width: 767.98px) {
  .page-shell {
    padding-block: var(--space-xl) var(--space-2xl);
  }
}
</style>
