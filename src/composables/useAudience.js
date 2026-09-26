/**
 * useAudience — the visitor-identity axis, persisted and shareable.
 *
 * The visitor says what they came for ("I'm here about…"), and the site reorders
 * content around that answer. This composable owns three things:
 *
 *   - WHERE THE CHOICE LIVES. `localStorage` is the source of truth so the choice
 *     survives navigation and return visits; the URL query (`?for=events`) is a mirror
 *     so a choice can be *shared*. That mirror matters commercially: it means Jeremy can
 *     send an event company `…/portfolio/?for=events` and `…/portfolio/?for=trade` to a
 *     sourcing agent, and each sees a page built for them.
 *
 *   - VALIDATION. An unknown `?for=` value is ignored rather than trusted, so a
 *     hand-edited or stale link degrades to "show everything" instead of an empty page.
 *
 *   - REACTIVITY IN BOTH DIRECTIONS. Clicking the control pushes a history entry (so
 *     Back undoes the choice); following a link that carries `?for=` adopts it.
 *
 * Module-scope state, like `useTimeTheme`, so every component shares one value and
 * there is a single writer to storage.
 */

import { ref, computed, watch, readonly, onScopeDispose } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { audiences, AUDIENCE_ALL, isAudienceId } from '@/content/audiences.js';

const isBrowser = typeof window !== 'undefined';

const STORAGE_KEY = 'audience';

/* ── storage ──────────────────────────────────────────────────────────── */

function readStored() {
  if (!isBrowser) return AUDIENCE_ALL;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return isAudienceId(raw) ? raw : AUDIENCE_ALL;
  } catch {
    // localStorage throws in some privacy modes — never let that break the page.
    return AUDIENCE_ALL;
  }
}

function writeStored(value) {
  if (!isBrowser) return;
  try {
    if (value === AUDIENCE_ALL) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* ignore */
  }
}

/* ── module-scope state ───────────────────────────────────────────────────
   Only the CHOICE is shared. The route wiring is per-instance, deliberately: an earlier
   version guarded bootstrap with a one-shot module flag, which meant the first component
   to mount captured a `route`/`router` pair forever. That works in a single-page app but
   is not re-entrant — a second app instance (a test harness, a future SSR render, an
   embedded widget) silently inherited the first one's router and read a stale `?for=`.
   Per-instance watchers all write the same shared value, so duplication is harmless.
   ──────────────────────────────────────────────────────────────────────── */

const current = ref(AUDIENCE_ALL);

/** Set while a `set()` is pushing to the URL, so the route watcher does not echo back. */
let applyingFromCode = false;

/** Storage is read only once per page load; the live value wins after that. */
let hasBootstrappedOnce = false;

/** The audience definitions, ordered, for the picker. */
const options = computed(() => [...audiences].sort((a, b) => a.order - b.order));

const currentAudience = computed(() =>
  options.value.find((a) => a.id === current.value) ?? null);

const isFiltered = computed(() => current.value !== AUDIENCE_ALL);

/* ── public surface ───────────────────────────────────────────────────── */

export function useAudience() {
  const route = useRoute();
  const router = useRouter();

  const fromUrl = route.query.for;
  const fromStorage = readStored();

  // Priority: a valid URL parameter wins (that IS the shared link), then storage, then
  // "everything". An invalid parameter is discarded rather than obeyed, so a hand-edited
  // or stale link degrades to the complete page instead of an empty one.
  if (isUrlValue(fromUrl)) {
    if (fromUrl !== current.value) current.value = fromUrl;
  } else if (!hasBootstrappedOnce) {
    // Storage is only consulted on the first mount; after that the live value wins, so a
    // second component mounting mid-session cannot reset the visitor's choice.
    hasBootstrappedOnce = true;
    current.value = fromStorage;
  }

  // Adopt a value that arrives later: with createWebHistory the initial navigation is
  // async, so `route.query` can be empty on the very first render.
  watch(() => route.query.for, (next) => {
    if (applyingFromCode) return;
    if (isUrlValue(next) && next !== current.value) {
      current.value = next;
    }
    // NOTE: a URL *without* `?for=` deliberately does NOT reset the choice — the visitor's
    // decision outlives a single URL, otherwise every internal link would undo it.
  });

  // Keep the URL in step with the choice, so the address bar always reflects what is on
  // screen and can be copied and shared.
  watch(current, (value) => {
    if (!isBrowser) return;
    const wants = value === AUDIENCE_ALL ? undefined : value;
    const has = isUrlValue(route.query.for) ? route.query.for : undefined;
    if (wants === has) return;

    const query = { ...route.query };
    if (wants === undefined) delete query.for;
    else query.for = wants;

    applyingFromCode = true;
    const navigation = wants === undefined ? router.replace : router.push;
    Promise.resolve(navigation.call(router, { path: route.path, query, hash: route.hash }))
      .catch(() => { /* duplicate navigation — harmless */ })
      .finally(() => { applyingFromCode = false; });
  }, { immediate: true });

  // Persist the choice so it survives navigation and return visits.
  watch(current, (value) => writeStored(value), { immediate: true });

  return {
    /** 'all' | 'events' | 'trade' | 'web' | 'institutions' */
    current: readonly(current),
    currentAudience,
    options,
    isFiltered,
    allValue: AUDIENCE_ALL,

    /** Choose an audience. Pushes history so Back undoes it. */
    set(value) {
      const safe = isAudienceId(value) ? value : AUDIENCE_ALL;
      // Assigning is enough: the watcher above pushes the change into the URL.
      if (safe !== current.value) current.value = safe;
    },

    /** Back to the complete, unranked view. */
    reset() {
      if (current.value !== AUDIENCE_ALL) current.value = AUDIENCE_ALL;
    },

    /** A shareable link to the current audience view. */
    shareUrl() {
      if (!isBrowser) return '';
      const url = new URL(window.location.href);
      if (current.value === AUDIENCE_ALL) url.searchParams.delete('for');
      else url.searchParams.set('for', current.value);
      return url.toString();
    },
  };
}

function isUrlValue(value) {
  // `route.query.for` is `string | string[] | null` depending on repetition.
  return typeof value === 'string' && isAudienceId(value);
}

/* ── split helpers, so pages do not each re-implement the partition ────── */

export { splitByAudience, AUDIENCE_ALL } from '@/content/audiences.js';
