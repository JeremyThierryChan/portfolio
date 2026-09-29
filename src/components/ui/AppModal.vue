<script setup>
/**
 * AppModal — the one dialog primitive.
 *
 * The previous modals were written inline in three different pages and shared the
 * same set of defects: no `Teleport` (so any ancestor with a transform would break
 * the `position: fixed` escape), no `role="dialog"` or `aria-modal`, no focus
 * management, and no body scroll lock. A keyboard user could not open them at all
 * because the trigger was a `<div @click>`, and could not escape one because Esc was
 * bound to a permanently-attached window listener.
 *
 * This component fixes all of that in one place:
 *   - Teleport to <body>, so no ancestor can trap it
 *   - role="dialog" + aria-modal + aria-labelledby
 *   - focus moved in on open, cycled inside, returned to the trigger on close
 *   - body scroll lock with scrollbar compensation and reference counting
 *   - Esc to close, scrim click to close (and clicks inside do not)
 *   - labelled close button
 */
import { ref, computed, watch, useSlots } from 'vue';
import { useI18n } from 'vue-i18n';
import { useBodyScrollLock } from '@/composables/useBodyScrollLock.js';
import { useFocusTrap } from '@/composables/useFocusTrap.js';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  /** Rendered as the dialog's heading and used as its accessible name. */
  title: { type: String, default: '' },
  /** 'sm' | 'md' | 'lg' */
  size: { type: String, default: 'md' },
  /** Set false to require an explicit action instead of a scrim click. */
  closeOnScrim: { type: Boolean, default: true },
});

const emit = defineEmits(['update:modelValue', 'close']);

const { t } = useI18n();
const slots = useSlots();

let uid = 0;
const titleId = `modal-title-${++uid}-${Math.random().toString(36).slice(2, 7)}`;

const panel = ref(null);
const closeButton = ref(null);

const isOpen = computed(() => props.modelValue);
const hasHeaderSlot = computed(() => Boolean(slots.header));

function close() {
  emit('update:modelValue', false);
  emit('close');
}

// Effects that must only run while open.
useBodyScrollLock(isOpen);
useFocusTrap(isOpen, panel, {
  /*
   * The close button, not the heading. The heading is a plain <h2> with no tabindex, so
   * `focus()` on it is silently ignored and focus would stay on <body> — outside the
   * dialog, the very defect this trap exists to fix. The first real control is safely
   * inside the trap, and `aria-labelledby` still gets the title announced.
   */
  initialFocus: closeButton,
  onEscape: close,
});

// Lock background scrolling for pointer/touch drags too.
watch(isOpen, (open) => {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('has-modal', open);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="modal"
        :class="`modal--${size}`"
        @click.self="closeOnScrim && close()"
      >
        <div
          ref="panel"
          class="modal__panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? titleId : undefined"
          :aria-label="title ? undefined : t('common.close')"
        >
          <button
            ref="closeButton"
            type="button"
            class="modal__close"
            :aria-label="t('common.close')"
            @click="close"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="18" height="18">
              <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
          </button>

          <header v-if="title || hasHeaderSlot" class="modal__header">
            <slot name="header">
              <h2 :id="titleId" class="modal__title">{{ title }}</h2>
            </slot>
          </header>

          <div class="modal__body">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  background-color: var(--bg-overlay);
  overflow-y: auto;
}

.modal__panel {
  position: relative;
  inline-size: 100%;
  max-block-size: min(88dvh, 60rem);
  display: flex;
  flex-direction: column;
  background-color: var(--bg-raised);
  border: var(--border-width) solid var(--line);
  /* Style B sets radius to 0 and shadow to none — that is intentional, not missing. */
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.modal--sm .modal__panel { max-inline-size: 26rem; }
.modal--md .modal__panel { max-inline-size: 40rem; }
.modal--lg .modal__panel { max-inline-size: 56rem; }

.modal__header {
  padding: var(--space-md) var(--space-lg);
  padding-inline-end: calc(var(--space-lg) + 2.5rem);
  border-bottom: var(--border-width) solid var(--line);
}

.modal__title {
  font-size: var(--step-1);
}

.modal__body {
  padding: var(--space-lg);
  overflow-y: auto;
  color: var(--fg);
}

.modal__footer {
  padding: var(--space-md) var(--space-lg);
  border-top: var(--border-width) solid var(--line);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  justify-content: flex-end;
}

.modal__close {
  position: absolute;
  inset-block-start: var(--space-sm);
  inset-inline-end: var(--space-sm);
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: var(--control-height-sm);
  block-size: var(--control-height-sm);
  color: var(--fg-muted);
  background-color: transparent;
  border: var(--border-width) solid var(--line);
  border-radius: var(--radius-sm);
  transition:
    color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}

.modal__close:hover {
  color: var(--fg);
  border-color: var(--line-strong);
}

.modal__close:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}

/* ── transition ────────────────────────────────────────────────────────── */

.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--dur-base) var(--ease-out);
}

.modal-enter-active .modal__panel,
.modal-leave-active .modal__panel {
  transition: transform var(--dur-base) var(--ease-out);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal__panel,
.modal-leave-to .modal__panel {
  transform: translateY(12px);
}

/* Motion is decorative; the modal still opens and closes without it. */
@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active,
  .modal-enter-active .modal__panel,
  .modal-leave-active .modal__panel {
    transition: none;
  }
  .modal-enter-from .modal__panel,
  .modal-leave-to .modal__panel {
    transform: none;
  }
}
</style>
