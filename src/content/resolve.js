/**
 * Locale resolver for the content layer.
 *
 * Content modules keep structure (locale-neutral) and copy (`i18n`) side by side.
 * `pick()` flattens one entity into a plain, render-ready object for a given locale,
 * falling back per-field to English so a partially translated locale degrades
 * gracefully instead of showing gaps.
 *
 * See SCHEMA.md for the authoring contract.
 */

export const FALLBACK_LOCALE = 'en';

/** Drop keys whose value is nullish so a partial locale can't blank out a translated field. */
function defined(obj) {
  if (!obj || typeof obj !== 'object') return {};
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined) out[k] = v;
  }
  return out;
}

/**
 * Flatten one content entity for `locale`.
 *
 * - `i18n.en` is always the fallback, applied per-field.
 * - Recurses into `stages` because project stages carry their own copy.
 * - Returns a new object; the input is never mutated.
 *
 * @template T
 * @param {T} entry
 * @param {string} locale
 * @returns {Omit<T, 'i18n'> & Record<string, unknown>}
 */
export function pick(entry, locale = FALLBACK_LOCALE) {
  if (!entry || typeof entry !== 'object') return entry;

  const { i18n, ...structure } = entry;

  const base = defined(i18n?.[FALLBACK_LOCALE]);
  const override = locale === FALLBACK_LOCALE ? {} : defined(i18n?.[locale]);
  const text = { ...base, ...override };

  const out = { ...structure, ...text };

  if (Array.isArray(structure.stages)) {
    out.stages = structure.stages.map((stage) => pick(stage, locale));
  }

  return out;
}

/** `pick()` over a list, dropping falsy entries. */
export function pickAll(list, locale = FALLBACK_LOCALE) {
  if (!Array.isArray(list)) return [];
  return list.filter(Boolean).map((entry) => pick(entry, locale));
}

/**
 * Which locales an entity actually has copy for.
 * Used by the UI to flag untranslated content while translations are still pending.
 */
export function availableLocales(entry) {
  return Object.keys(entry?.i18n ?? {});
}

/** True when this entity has real copy for `locale` (not just the English fallback). */
export function isTranslated(entry, locale) {
  return availableLocales(entry).includes(locale);
}

/**
 * True only when EVERY field of the locale's copy is present — a locale object that
 * exists but is half-filled still counts as untranslated.
 */
export function isFullyTranslated(entry, locale) {
  const base = defined(entry?.i18n?.[FALLBACK_LOCALE]);
  const target = defined(entry?.i18n?.[locale]);
  const keys = Object.keys(base);
  return keys.length > 0 && keys.every((k) => k in target);
}

/**
 * Chronological sort for timeline-style entries, newest first.
 * `date` is ISO-prefixed, so plain string comparison is already chronological.
 * Entries with no date sink to the bottom (they are the earliest / undated ones).
 */
export function byDateDesc(a, b) {
  if (a.date === b.date) return 0;
  if (!a.date) return 1;
  if (!b.date) return -1;
  return a.date < b.date ? 1 : -1;
}
