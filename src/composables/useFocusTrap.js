/**
 * useFocusTrap — keep keyboard focus inside an open overlay.
 *
 * Without this, a modal opens with focus still on <body>: Tab walks into the page
 * behind the scrim, a screen reader keeps reading content the visitor cannot see,
 * and closing the dialog dumps focus back at the top of the document.
 *
 * What this does:
 *   - moves focus into the container (first sensible target, or the container itself)
 *   - cycles Tab / Shift+Tab within the container
 *   - restores focus to whatever was focused before opening
 *
 * The Tab cycling is done by hand rather than with the `inert` attribute so it works
 * consistently across the browsers this site targets.
 */

import { watch, nextTick, onScopeDispose } from 'vue';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  'details > summary:first-of-type',
].join(',');

/** Visible, focusable elements inside `root`, in DOM order. */
export function focusableWithin(root) {
  if (!root) return [];
  return [...root.querySelectorAll(FOCUSABLE)].filter((el) => {
    if (el.hasAttribute('inert')) return false;
    if (el.getAttribute('aria-hidden') === 'true') return false;
    // offsetParent is null for display:none, but also for position:fixed elements —
    // so fall back to a rect check.
    const rect = el.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0 || el === document.activeElement;
  });
}

/**
 * @param {Ref<boolean>} isActive  trap while this ref is true
 * @param {Ref<HTMLElement|null>} containerRef
 * @param {{ initialFocus?: Ref<HTMLElement|null>, onEscape?: () => void }} [options]
 */
export function useFocusTrap(isActive, containerRef, options = {}) {
  let previouslyFocused = null;

  function onKeydown(event) {
    if (event.key === 'Escape' && options.onEscape) {
      event.stopPropagation();
      options.onEscape();
      return;
    }
    if (event.key !== 'Tab') return;

    const container = containerRef.value;
    if (!container) return;

    const items = focusableWithin(container);
    if (items.length === 0) {
      // Nothing to focus: keep focus on the container itself.
      event.preventDefault();
      container.focus();
      return;
    }

    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !container.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !container.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  }

  watch(isActive, async (active) => {
    // Guarded so this composable is safe to instantiate where there is no DOM
    // (SSR, unit tests, node-based render checks). With `immediate: true` the
    // inactive branch runs during setup, before any browser global exists.
    if (typeof document === 'undefined') return;

    if (active) {
      previouslyFocused = document.activeElement;
      await nextTick();
      const container = containerRef.value;
      if (!container) return;

      const preferred = options.initialFocus?.value ?? null;
      if (preferred) preferred.focus();
      else {
        const items = focusableWithin(container);
        if (items.length) items[0].focus();
        else {
          // Make the container itself focusable as a last resort.
          if (!container.hasAttribute('tabindex')) container.setAttribute('tabindex', '-1');
          container.focus();
        }
      }
      document.addEventListener('keydown', onKeydown, true);
    } else {
      document.removeEventListener('keydown', onKeydown, true);
      // Return focus where it came from, if that element is still in the document.
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
      previouslyFocused = null;
    }
  }, { immediate: true });

  onScopeDispose(() => {
    if (typeof document === 'undefined') return;
    document.removeEventListener('keydown', onKeydown, true);
  });

  return { focusableWithin };
}
