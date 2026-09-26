/**
 * audiences.js — the visitor-identity axis.
 *
 * WHY THIS EXISTS: the site sells nine services to four quite different kinds of
 * client. Ranking those nine globally would mean deciding whose work matters most,
 * which is both arbitrary and unfair to the ones ranked low. Instead the CONTENT stays
 * complete and unranked, and the VISITOR says what they came for — so nothing is ever
 * demoted, it is only "not your filter".
 *
 * This is the third adaptive axis on the site, after time (which style) and language.
 *
 * ── How the mapping works ────────────────────────────────────────────────────────
 *
 * Content items DECLARE which audiences they serve:
 *
 *     // in projects.js
 *     { id: 5, audiences: ['trade'], … }
 *
 * and the per-audience view is derived by filtering, rather than each audience
 * carrying its own list of ids. The direction matters: adding a project means editing
 * one file, and there is no second list to forget.
 *
 * An item with NO `audiences` field is relevant to EVERYONE. That makes the whole
 * mechanism additive and backwards compatible — existing untagged content keeps
 * showing up everywhere, and tagging is opt-in per item.
 *
 * ── What an audience selection actually does ─────────────────────────────────────
 *
 * REORDER + COLLAPSE, never hide (decided with Jeremy):
 *   - relevant items come first
 *   - everything else is folded into a collapsed, countable group ("+4 more …"), so
 *     the breadth that is Jeremy's whole selling point stays visible, nothing is
 *     hidden, and crawlers still see the full default page.
 *
 * ── The same table drives /resume ────────────────────────────────────────────────
 *
 * Each audience names a `resumeVariant`, so the on-site view and the matching CV are
 * two renderings of one mapping. Change a tag, both follow.
 */

/** The "show me everything" option. Not a content tag — it is the absence of one. */
export const AUDIENCE_ALL = 'all';

export const audiences = [
  {
    id: 'events',
    order: 1,
    resumeVariant: 'interpretation',
    i18n: {
      en: {
        label: 'Event & brand clients',
        short: 'Events',
        /* Written as the visitor's own situation, not as a category label — the
           control asks a question, it does not sort people into boxes. */
        need: 'You need interpreting or on-the-ground help at a launch, a tasting or a VIP event.',
        accent: 'Launches, tastings, VIP evenings',
      },
      zh: {
        label: '活动与品牌客户',
        short: '活动',
        need: '你在发布会、品鉴会或 VIP 活动上需要口译或现场协助。',
        accent: '发布会、品鉴会、VIP 晚宴',
      },
    },
  },
  {
    id: 'trade',
    order: 2,
    resumeVariant: 'trade',
    i18n: {
      en: {
        label: 'Trade & sourcing',
        short: 'Trade',
        need: 'You need to find a supplier, agree a specification, or get goods and paperwork moving.',
        accent: 'Sourcing, documentation, logistics',
      },
      zh: {
        label: '贸易与采购',
        short: '贸易',
        need: '你需要找供应商、确认规格，或者让货物和单证走起来。',
        accent: '采购、单证、物流',
      },
    },
  },
  {
    id: 'web',
    order: 3,
    resumeVariant: 'web',
    i18n: {
      en: {
        label: 'Business owners',
        short: 'Web & systems',
        need: 'You need a website, an intranet, or private infrastructure you actually own.',
        accent: 'Websites, intranet, servers',
      },
      zh: {
        label: '企业主',
        short: '网站系统',
        need: '你需要一个网站、一个内网，或者真正属于你自己的私有基础设施。',
        accent: '网站、内网、服务器',
      },
    },
  },
  {
    id: 'institutions',
    order: 4,
    resumeVariant: 'education',
    i18n: {
      en: {
        label: 'Schools & institutions',
        short: 'Institutions',
        need: 'You need teaching, document translation, or a long-term language partner.',
        accent: 'Teaching, translation, exchange',
      },
      zh: {
        label: '学校与机构',
        short: '机构',
        need: '你需要教学、文件翻译，或者长期的语言合作方。',
        accent: '教学、翻译、交流',
      },
    },
  },
];

/** Every valid selection, including the "everything" option. */
export const AUDIENCE_IDS = [AUDIENCE_ALL, ...audiences.map((a) => a.id)];

export function isAudienceId(value) {
  return AUDIENCE_IDS.includes(value);
}

/* ── pure query helpers ───────────────────────────────────────────────────
   Deliberately framework-free so `tests/audience.test.mjs` can exercise them
   directly, and so the same rules could drive a build-time resume export. */

/** The audiences an item declares. Absent or empty means "relevant to everyone". */
export function audiencesOf(item) {
  const list = item?.audiences;
  return Array.isArray(list) ? list : [];
}

/**
 * Should `item` be shown as relevant to `audienceId`?
 * Everything is relevant when the selection is "all", and untagged items are
 * relevant to every audience.
 */
export function isRelevant(item, audienceId) {
  if (audienceId === AUDIENCE_ALL) return true;
  const declared = audiencesOf(item);
  if (declared.length === 0) return true;
  return declared.includes(audienceId);
}

/**
 * Split a list for display.
 *
 * @returns {{ relevant: unknown[], other: unknown[] }}
 *   `relevant` keeps the input order (so each domain keeps its curated `order`),
 *   `other` is what gets collapsed.
 */
export function splitByAudience(items, audienceId) {
  if (audienceId === AUDIENCE_ALL) return { relevant: [...items], other: [] };

  const relevant = [];
  const other = [];
  for (const item of items ?? []) {
    (isRelevant(item, audienceId) ? relevant : other).push(item);
  }
  return { relevant, other };
}

/**
 * A count summary for the collapsed group, e.g. "4 services you may not need".
 * Kept here rather than in a component so the wording stays consistent everywhere
 * the collapse appears.
 */
export function otherCount(list) {
  return Array.isArray(list) ? list.length : 0;
}
