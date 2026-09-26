/**
 * useBodyScrollLock — freeze the page behind an overlay.
 *
 * The old modals had no scroll lock at all, so the page behind scrolled while the
 * dialog also scrolled internally. Two details matter for doing this properly:
 *
 *   1. REFERENCE COUNTING. Overlays can nest (a lightbox opened over a modal), and
 *      the first one to close must not unlock the page while the other is still up.
 *   2. SCROLLBAR COMPENSATION. Hiding the scrollbar widens the viewport, which makes
 *      the whole layout jump sideways by ~15px. Padding the body by the measured
 *      scrollbar width prevents that.
 *
 * The `is-locked` class on <body> is styled in base.css so the rule lives with the
 * rest of the reset rather than here.
 */

import { watch, onScopeDispose } from 'vue';

let holders = 0;
let previousPaddingRight = '';
let previousOverflow = '';

function lock() {
  if (holders === 0) {
    const body = document.body;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    previousPaddingRight = body.style.paddingRight;
    previousOverflow = body.style.overflow;

    if (scrollbarWidth > 0) {
      // Only pad if the body is not already padded by something else.
      const current = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${current + scrollbarWidth}px`;
    }
    body.style.overflow = 'hidden';
    body.classList.add('is-locked');
  }
  holders += 1;
}

function unlock() {
  holders = Math.max(0, holders - 1);
  if (holders === 0) {
    const body = document.body;
    body.style.paddingRight = previousPaddingRight;
    body.style.overflow = previousOverflow;
    body.classList.remove('is-locked');
  }
}

/**
 * @param {Ref<boolean>} isLocked  lock while this ref is true
 */
export function useBodyScrollLock(isLocked) {
  let held = false;

  const release = () => {
    if (held) {
      unlock();
      held = false;
    }
  };

  watch(isLocked, (locked) => {
    if (locked && !held) {
      lock();
      held = true;
    } else if (!locked) {
      release();
    }
  }, { immediate: true });

  // A component unmounting while its overlay is open must still unlock.
  onScopeDispose(release);

  return { release };
}
