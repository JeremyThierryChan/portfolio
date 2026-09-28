/**
 * links.js — the footer's "友情链接" row: sites worth sending a visitor onward to.
 *
 * WHY THIS IS A CONTENT MODULE AND NOT A TEMPLATE LIST: a link is a published claim
 * about someone else, so it belongs where every other published claim lives — in the
 * content layer, bilingual, with the same contract (structure at the top level, copy
 * inside `i18n`, `name` kept as a proper noun). It also means the footer cannot invent a
 * destination: an entry without a real absolute URL fails `verify-content` rather than
 * rendering a control that goes nowhere, which is the defect the old footer had.
 *
 * ────────────────────────────────────────────────────────────────────────────────
 * WHAT IS IN IT, AND WHAT WAS DECIDED: the first four entries are Jeremy's own live
 * sites. The last three are CLIENT sites, added on his explicit instruction that they may
 * be linked here even though the client entries elsewhere on the site stay anonymous. That
 * is a deliberate, partial reversal of the earlier anonymisation, and it is coherent: each
 * of those three URLs carries the client's name in the domain, so the link discloses what
 * the prose was withholding. `scripts/withheld-names.mjs` records the same decision and no
 * longer guards those three names — guarding them would have been theatre, since this file
 * publishes them.
 *
 * Their names are written here as the site previously titled them, not invented. The
 * NOTES are placeholders in both languages and should be replaced with whatever the owner
 * wants said about them.
 *
 * STILL NEEDED from Jeremy: the actual friend / partner links. The mechanism is finished;
 * this list is not the one he asked for. Per entry he needs to supply a name, a URL and a
 * short note, and anything unverifiable stays out — a footer that sends a client to a dead
 * or wrong site is worse than a footer with three links.
 * ────────────────────────────────────────────────────────────────────────────────
 */

export const links = [
  {
    id: 'carpe-lucem',
    /* Proper noun, top level: a brand name is an identity, not prose (SCHEMA.md). */
    name: 'Carpe Lucem',
    url: 'https://jeremythierrychan.github.io/CarpeLucem/',
    order: 1,
    i18n: {
      en: { note: 'Imported food and drink brand' },
      zh: { note: '进口食品与酒水品牌' },
    },
  },
  {
    id: 'lacquora',
    name: 'Lacquora',
    url: 'https://jeremythierrychan.github.io/Lacquora/',
    order: 2,
    i18n: {
      en: { note: 'Lacquer art and custom electric guitars' },
      zh: { note: '漆艺与定制电吉他' },
    },
  },
  {
    id: 'parallel-offset',
    name: 'Parallel Offset',
    url: 'https://jeremythierrychan.github.io/ParallelOffset/',
    order: 3,
    i18n: {
      en: { note: 'Band website' },
      zh: { note: '乐队官方网站' },
    },
  },
  {
    id: 'csdn',
    name: 'CSDN',
    url: 'https://blog.csdn.net/JeremyTC',
    order: 4,
    i18n: {
      en: { note: 'Technical writing on Python and programming' },
      zh: { note: 'Python 与编程技术文章' },
    },
  },

  /* ── client sites, linked on Jeremy's instruction (see the header) ──────── */

  {
    id: 'catherine-portfolio',
    /* Her name is in the domain, so this label is not the thing disclosing it. */
    name: 'Catherine',
    url: 'https://catherinejanetsui.github.io/portfolio/',
    order: 5,
    i18n: {
      en: { note: 'Portfolio website' },
      zh: { note: '个人作品集网站' },
    },
  },
  {
    id: 'letterresearchinst',
    name: 'LetterResearchINST',
    url: 'https://letterresearchinst.vercel.app',
    order: 6,
    i18n: {
      en: { note: 'Web application tool' },
      zh: { note: 'Web 应用工具' },
    },
  },
  {
    id: 'inchief-printing',
    name: 'InChief Printing',
    url: 'https://inchiefprinting.github.io/MainWebsite/',
    order: 7,
    i18n: {
      en: { note: 'Printing company website' },
      zh: { note: '印刷企业官方网站' },
    },
  },
];
