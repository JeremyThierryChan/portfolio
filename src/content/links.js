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
 * TODO(verify) — THIS LIST IS NOT THE LIST JEREMY ASKED FOR.
 *
 * The four entries below are the sites already published in `projects.js`, so nothing in
 * this file is a new claim: every URL here is one the site was already linking to. They
 * are a placeholder in the honest sense — the mechanism is finished and visible, and the
 * content is standing in until he supplies the actual friend / partner links.
 *
 * What is needed from him, per entry: the site's name (as it wants to be written), its
 * URL, and a short note in both languages. Anything unverifiable stays out; a footer that
 * sends a client to a dead or wrong site is worse than a footer with three links.
 *
 * Also unresolved: whether the withdrawn client sites may be re-linked here. They were
 * anonymised deliberately (see scripts/withheld-names.mjs), so naming them in the footer
 * would undo exactly that decision. Their consent is the question, not the code.
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
];
