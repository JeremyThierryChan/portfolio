# Content layer schema — contract

Every content module in `src/content/` obeys these rules. **Do not change this file
without updating the resolver in `resolve.js`.**

## The one rule

Split every entity into two halves:

| half | where | examples |
|---|---|---|
| **structure** — locale-neutral, machine-usable | top level of the object | `id`, `status`, `progress`, `tech`, `date`, `category`, `url`, `usage`, `tier`, `imageStatus` |
| **copy** — human-visible, translatable | inside `i18n.<locale>` | `title`, `description`, `excerpt`, `full`, `role`, `context`, `location`, `includes[]`, `evidence[]` |

Never put a user-visible sentence at the top level. Never put a number/date/enum inside `i18n`.

### Documented exception: proper nouns stay at the top level

`name` (a person, an organisation, a technology, a language) stays at the **top level**, even
though it is human-visible. Two reasons:

1. It is an identity, not prose — it is what you look an entity up by, and it must stay
   stable when the locale changes.
2. Translating it is often wrong (you do not translate `Vue.js` or `Python`), and where it
   *is* transliterated (`Dr. Peter Schütz` → `彼得·舒茨`) a future `i18n.<locale>.name`
   overrides the top-level value through the normal per-field merge — no schema change needed.

So: `name` at the top level, and `i18n.<locale>.name` only when a locale genuinely
transliterates it. This is the *only* sanctioned exception.

## `i18n` shape

```js
i18n: {
  en: { title: '…', description: '…' },   // REQUIRED — `en` is the fallback for every locale
  zh: { title: '…', description: '…' },   // REQUIRED for shipped content — see below
}
```

`en` must always be present and complete. Missing locales fall back to `en` at runtime,
so a half-finished translation file is never fatal.

### Bilingual policy (decided 2026-09)

The site is **bilingual by design, not by translation**. The Chinese is written for the
Chinese client deciding whether to make contact; the English for the international one.
Same facts and same promises, but not mechanically parallel sentences — which is why the
two are not literal translations of each other.

The rule the checker enforces is mechanical, not stylistic:

> If `i18n.en` has a key, `i18n.zh` must have the **same key, in the same position**, and
> vice versa. Arrays must have the same length.

`verify-content.mjs` asserts this for every collection. It exists because the failure mode
is silent: a missing `zh` field does not error, it quietly renders the English sentence to
a Chinese visitor, and nobody notices. Do not "fix" the checker by relaxing it.

Two consequences worth knowing:

- **Copy must not live at the top level.** `skills[].evidence[]` used to, and the result
  was that the one part of the skills page a Chinese visitor most needs to read — the
  checkable facts — could not be translated at all. It now lives in `i18n.<locale>.evidence`.
  `pick()` spreads it back onto the flat object, so consumers are unaffected.
- **Skills are the one place `i18n.<locale>.name` is used in bulk.** `English` → `英语`,
  `Mandarin Chinese` → `普通话`, `NAS & Home Server Setup` → keep the English name. Use it
  where the name is genuinely translated; leave it out where the name is a technology.

### Quotations are not translatable copy

`testimonials[].excerpt` and `.full` are **real words written by real people**. Their
Chinese versions are prefixed with `（译文）` so the visitor can see they are a translation
of an original English statement. Publishing a Chinese translation of a quotation without
saying so would misrepresent the person who wrote it. Any future quoted material follows
the same rule.

## Nested translatable objects

If a child object has copy of its own (e.g. a project stage), give that child its own `i18n`
and keep the child's structural fields beside it. The resolver recurses automatically into
`stages` only.

```js
{
  id: 'concept',
  completed: true,
  i18n: { en: { name: 'Concept & Branding', description: 'Defining brand identity…' } },
}
```

## Enums (use these exact strings)

| field | allowed values |
|---|---|
| `projects[].status` | `'in-progress'` \| `'paused'` \| `'completed'` |
| `timeline[].category` | `'career'` \| `'personal'` \| `'education'` \| `'hobby'` |
| `skills[].category` | `'programming'` \| `'language'` \| `'other'` |
| `skills[].usage` | `'professional'` \| `'working'` \| `'learning'` — HOW it is used, not how skilled he is |
| `gallery[].category` | `'events'` \| `'sports'` \| `'volunteer'` \| `'campus'` \| `'travel'` |
| `posts[].category` | `'tech'` \| `'language'` \| `'culture'` \| `'life'` |
| `services[].domain` | `'language'` \| `'trade'` \| `'tech'` — a **filter facet**, not a ranking |
| `awards[].kind` | `'exam'` \| `'competition'` \| `'certificate'` \| `'sport'` |

Enum values are **lowercase kebab-case** and are also the i18n lookup key
(`projects.status.in-progress`, `skills.category.language`, …). Never store a
display-string enum (the old `'Programming Language'` / `'In Progress'` strings are banned).

## Dates

`date` is an ISO-prefixed string at **whatever precision is known**, so plain
lexicographic sort is also chronological sort:

`'2002-03-22'` > `'2024-06'` > `'2024'` — all valid.

If there is genuinely no date, use `date: null` and set `datePrecision: 'none'`,
then supply the human-readable stand-in as **translatable** copy:
`i18n.en.dateLabel: 'The Time for Learning to Speak'`.

`datePrecision` ∈ `'day' | 'month' | 'year' | 'none'`.

## Empty values

Use `null`, never `''` and never `'#'`. An empty string is treated as "absent" by the
resolver and by the UI's safe-degradation rules.

## IDs

- `projects`, `skills`, `gallery`, `posts`, `testimonials`: `id` is a **number**, unique.
- `timeline`: `id` is a **stable kebab-case slug string** (e.g. `'born-wenzhou'`), unique.
  The old file had 40 entries sharing only 30 numeric ids — do not reproduce that.

## Files

| file | export | notes |
|---|---|---|
| `projects.js` | `projects` | 21 entries. `tech` is a **string array**, not a comma string. `tier` ∈ `'featured'` \| `'listed'` \| `'archived'`. |
| `timeline.js` | `timeline` | 50 entries. Ordered **newest first**. |
| `skills.js` | `skills` | 21 entries. `evidence[]` lives inside `i18n.<locale>` and holds checkable facts; `usage` replaced a self-rated `level` percentage. |
| `gallery.js` | `gallery` | 14 entries. |
| `testimonials.js` | `testimonials` | 5 entries. Quotations — see the `（译文）` rule above. |
| `posts.js` | `posts` | 3 entries. |
| `profile.js` | `profile` | site identity, positioning, contact, socials. Objects, not arrays. |
| `awards.js` | `awards` | 15 entries. `result: null` means the CV states no outcome — see the TODO list at the foot of that file. |
| `services.js` | `services` | 9 entries. What can be *hired*, as opposed to what has been *built*. `order` is a curated render order; `includes` is an array of strings inside `i18n.<locale>`. |
| `audiences.js` | `audiences` | 4 identities plus the `all` option. Drives the visitor-identity control and the CV variant mapping. |
| `links.js` | `links` | The footer's outgoing links. `name` is a proper noun at the top level; `url` must be a real absolute `http(s)` address, asserted by `verify-content` — a control with no destination is a defect here, not a placeholder. `order` is curated. |

### Field additions beyond the original contract

- `gallery[].imageStatus` ∈ `'placeholder'` \| `'real'` — all 14 current images are
  `picsum.photos` stubs, so the UI can badge or de-emphasise them.

## Known limitations (deliberate, not oversights)

- **`gallery[].year` is a display string, not a sortable date.** Some values are ranges
  (`'2020–2024'`, en dash U+2013), so string comparison is meaningless. Values were kept
  verbatim during migration. If the UI ever needs to sort or filter gallery by time, add a
  separate ISO field plus `datePrecision` per the Dates section — do not parse `year`.
- **`posts[].excerpt` duplicates the first sentence of `content`.** Preserved verbatim from
  the source; de-duplicating is a content decision, not a migration one.
- **`profile.socials` keeps 7 entries with `url: null`.** These are accounts with no public
  URL. The UI must render them as non-interactive (safe degradation), never as `'#'` links.
- **`testimonials[].name` / `skills[].name` are proper nouns at the top level** — see the
  documented exception above.
