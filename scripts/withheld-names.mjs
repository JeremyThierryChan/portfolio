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
 * `Pingyang` is deliberately NOT listed. Pingyang High School is Jeremy's own school
 * and stays named; only `Pingyang Lacquer Art` was withdrawn. Keep entries specific
 * enough that a genuine credential is never caught by them.
 */
export const WITHHELD = [
  // private clients
  'Catherine',
  'catherinejanetsui',
  'LetterResearchINST',
  'letterresearchinst',
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
  'InChief',
  'inchiefprinting',
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
