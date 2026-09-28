/**
 * Names that must not appear on anything a visitor can receive.
 *
 * WHY THIS EXISTS: the content layer is not the only thing that ships. Two other
 * surfaces are publicly served — the rendered HTML, and every file under `public/`
 * (the ATS-facing résumé JSON in particular). A future edit, or an agent rewriting
 * copy, can put a client's name back into either one without touching `src/content`
 * at all, and nothing would catch it. `src/content` is checked; these two were not.
 *
 * WHAT IT IS NOT: scrubbing the working tree does not retract a name that is already
 * in the repository. Every string listed below also sits in
 * `scripts/fixtures/legacy/projectsData.js` and in the INTENTIONAL_DEVIATIONS map in
 * `scripts/verify-content.mjs`, and commits before this one carry them in history.
 * This check protects what visitors receive. It does not, and cannot, protect the
 * repository — if that matters, the answer is a private repository, not tree hygiene.
 *
 * THREE DECISIONS ALREADY MADE — do not "fix" any of these:
 *
 * 1. Repository history is accepted as-is. The names below are also in
 *    `scripts/fixtures/legacy/projectsData.js` and in INTENTIONAL_DEVIATIONS, and
 *    commit 4ca6d36 (2026-05-30) is an ancestor of origin/main, so they are already
 *    public in this repository's history. Jeremy's call: guarantee the SITE is clean,
 *    do not chase history. Rewriting history or making the repository private is
 *    therefore not a pending task.
 * 2. CLIENT SITES MAY BE LINKED FROM THE FOOTER — added later, and it reverses part of
 *    the anonymisation on purpose. The three affected URLs carry the client's name in the
 *    domain itself (`catherinejanetsui`, `letterresearchinst`, `inchiefprinting`), so once
 *    `src/content/links.js` publishes them, keeping those names in this list would fail
 *    the build over a disclosure the site is now making deliberately. They have been
 *    removed. What remains guarded are the organisations with no published URL at all —
 *    the studios, the training centre, the practitioner, the poultry farm, the family —
 *    so nothing else on the site discloses them either.
 * 3. The Taoism link on the fortune-teller entry is KEPT on purpose. Its URL is
 *    neutral, so this check cannot flag it, but the site behind it names the client.
 *    That was raised and accepted — it is an informed exception, not an oversight.
 *
 * `Pingyang` is deliberately NOT listed. Pingyang High School is Jeremy's own school
 * and stays named; only `Pingyang Lacquer Art` was withdrawn. Keep entries specific
 * enough that a genuine credential is never caught by them.
 */
export const WITHHELD = [
  /*
   * The three client names that were here — Catherine / catherinejanetsui,
   * LetterResearchINST / letterresearchinst, InChief / inchiefprinting — were removed when
   * their sites were linked from the footer. See decision 3 above.
   */
  // organisations
  'Muyang',
  '沐阳教育',
  'Qianyuan',
  '乾元',
  'Pingyang Lacquer',
  '平阳漆器',
  'Wokete',
  '沃可特',
  'Qing Shan Kiln',
  '箐山隐',
  'Wenzhou Lacquerware Gallery',
  '温州漆器馆',
  // individuals named as collaborators
  'Henry Young',
  // the family whose records the genealogy project holds
  '陳氏宗譜',
  '陈氏',
  'Chen family',
];

/** Which withheld names occur in `text`. Case-insensitive, so URL fragments are caught. */
export function findWithheld(text) {
  if (typeof text !== 'string' || !text) return [];
  const haystack = text.toLowerCase();
  return WITHHELD.filter((name) => haystack.includes(name.toLowerCase()));
}
