/**
 * resume.js — composes a CV out of the same content layer the website uses.
 *
 * ── Why this is a separate composition, not just a page with filters ─────────────
 *
 * The website REORDERS AND COLLAPSES: nothing is ever hidden, because the breadth of the
 * work is the selling point. A CV is the opposite document. It has to fit a recruiter's
 * ninety seconds, so it genuinely FILTERS — an unfiltered dump of 50 timeline entries and
 * 21 projects is not a CV, it is a database export.
 *
 * So this module is deliberately allowed to drop things, and the variants differ in what
 * they drop and how much they keep.
 *
 * ── Why the composition is explicit rather than derived ─────────────────────────
 *
 * `EDUCATION_IDS` and the per-variant emphasis are written out. That looks like duplication
 * next to the timeline data, and it is intentional: a CV is a curated document. Which three
 * education entries matter is an editorial decision, not something a rule can infer from 50
 * records — the timeline legitimately contains "entered primary school", and no derived
 * query would know that a recruiter does not care.
 *
 * Text always comes from the content layer, so editing a project description updates the
 * site and every CV variant at once. Only the SELECTION lives here.
 */

import { pick, pickAll, byDateDesc } from './resolve.js';
import { audiences, isRelevant, AUDIENCE_ALL } from './audiences.js';
import { projects } from './projects.js';
import { timeline } from './timeline.js';
import { skills } from './skills.js';
import { services } from './services.js';
import { awards } from './awards.js';
import { profile } from './profile.js';

/**
 * The variants.
 *
 * `audience` ties a variant to the visitor-identity axis, so `/resume/web` and the "I'm here
 * about → Business owners" view of the site are two renderings of one decision. That mapping
 * was the reason for building the audience axis before the CV.
 *
 * `maxExperience` is the editorial cut: an interpretation client wants the event work, a
 * trade client wants the trade work, and neither wants forty lines.
 */
export const RESUME_VARIANTS = [
  {
    id: 'full',
    audience: AUDIENCE_ALL,
    /*
     * NOT unlimited. The exhaustive record is the timeline on /about/timeline; a CV is a
     * curated document even in its longest form. 34 entries is a database export, and no
     * reader gets past the first eight.
     */
    maxExperience: 18,
    maxProjects: 8,
    order: 1,
    i18n: {
      en: {
        label: 'Complete',
        blurb: 'Everything — the long version, for when someone actually wants the detail.',
        title: 'Interpreter, trade specialist and developer',
      },
      zh: {
        label: '完整版',
        blurb: '全部内容——最长版本，给真正想看细节的人。',
        title: '口译员、贸易专员与开发者',
      },
    },
  },
  {
    id: 'interpretation',
    audience: 'events',
    maxExperience: 14,
    maxProjects: 4,
    order: 2,
    i18n: {
      en: {
        label: 'Interpreting & events',
        blurb: 'For interpreting agencies, brand teams and event organisers.',
        title: 'Interpreter and event planner — CN / EN / FR / DE',
      },
      zh: {
        label: '口译',
        blurb: '面向口译公司、品牌团队和活动主办方。',
        title: '口译员与活动策划——中 / 英 / 法 / 德',
      },
    },
  },
  {
    id: 'trade',
    audience: 'trade',
    maxExperience: 12,
    maxProjects: 5,
    order: 3,
    i18n: {
      en: {
        label: 'Trade & sourcing',
        blurb: 'For importers, exporters and anyone who needs goods to move and paperwork to be right.',
        title: 'Cross-border trade specialist and business interpreter',
      },
      zh: {
        label: '贸易',
        blurb: '面向进口商、出口商，以及需要让货走起来、单证不出错的任何人。',
        title: '跨境贸易专员与商务口译',
      },
    },
  },
  {
    id: 'web',
    audience: 'web',
    maxExperience: 6,
    maxProjects: 8,
    order: 4,
    i18n: {
      en: {
        label: 'Web & systems',
        blurb: 'For businesses that need a site, an intranet, or infrastructure they own.',
        title: 'Web developer and systems builder',
      },
      zh: {
        label: '技术',
        blurb: '面向需要网站、内网或自有基础设施的企业。',
        title: '网站开发者与系统搭建者',
      },
    },
  },
  {
    id: 'education',
    audience: 'institutions',
    maxExperience: 6,
    maxProjects: 3,
    order: 5,
    i18n: {
      en: {
        label: 'Teaching & institutions',
        blurb: 'For schools, universities and language programmes.',
        title: 'Language teacher and academic interpreter',
      },
      zh: {
        label: '教育',
        blurb: '面向学校、大学和语言课程项目。',
        title: '语言教师与学术口译',
      },
    },
  },
];

export const DEFAULT_VARIANT = 'full';

export function isVariantId(value) {
  return RESUME_VARIANTS.some((v) => v.id === value);
}

export function variantById(id) {
  return RESUME_VARIANTS.find((v) => v.id === id) ?? RESUME_VARIANTS[0];
}

/**
 * Which education entries belong on a CV.
 *
 * Explicit, and short on purpose: the timeline also records entering primary school and
 * graduating from middle school, which is personal history rather than a qualification.
 */
const EDUCATION_IDS = [
  'graduated-shandong-university-science-technology',
  'entered-high-school-early',
];

/**
 * Build the CV document for a variant.
 *
 * @param {string} variantId
 * @param {string} locale
 * @returns {object} a plain, render-ready document — no `i18n` blocks remain
 */
export function buildResume(variantId = DEFAULT_VARIANT, locale = 'en') {
  const variant = variantById(variantId);
  const audience = variant.audience;

  /* ── identity ─────────────────────────────────────────────────────────── */
  const p = pick(profile, locale);
  const positioning = pick(profile.positioning, locale);

  /* ── experience: career entries, audience-filtered, most recent first ──── */
  let experience = pickAll(timeline, locale)
    .filter((e) => e.category === 'career')
    .filter((e) => isRelevant(e, audience))
    .sort(byDateDesc);

  /* ── education ────────────────────────────────────────────────────────── */
  const education = pickAll(timeline, locale)
    .filter((e) => EDUCATION_IDS.includes(e.id))
    .sort(byDateDesc);

  /* ── projects: promoted work first, then audience relevance ────────────── */
  const TIER_RANK = { featured: 0, listed: 1, archived: 2 };

  /*
   * STRICT MATCHING for project selection, unlike the website.
   *
   * On the site an untagged item is "relevant to everyone", which is right there: nothing
   * may disappear. On a CV that rule BACKFIRES — the three untagged projects (Arbitrage,
   * Forex, Minecraft) padded every variant, so an interpreting CV opened with an arbitrage
   * system and a Minecraft server. A CV is a curated document, so a variant only carries
   * work that was explicitly tagged for it. The `full` variant is exempt by definition.
   */
  let projectList = pickAll(projects, locale)
    .filter((pr) => pr.tier !== 'archived')          // a CV does not list dormant work
    .filter((pr) => (audience === AUDIENCE_ALL
      ? true
      : (pr.audiences ?? []).includes(audience)))
    .sort((a, b) => TIER_RANK[a.tier] - TIER_RANK[b.tier]);

  /* ── services ─────────────────────────────────────────────────────────── */
  const serviceList = pickAll(services, locale)
    .filter((sv) => isRelevant(sv, audience))
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  /* ── skills: split languages from everything else ──────────────────────── */
  const allSkills = pickAll(skills, locale);
  const languages = allSkills.filter((sk) => sk.category === 'language');
  const technical = allSkills.filter((sk) => sk.category !== 'language');

  /* ── awards: strict match too, most recent first ───────────────────────── */
  /*
   * Same reasoning as the projects above. Under the loose rule a web-development CV
   * carried a junior road-cycling championship, because the award is untagged and therefore
   * "relevant to everyone". Strict matching means a web CV has no awards section at all,
   * which is the honest answer — and the page omits empty sections rather than printing a
   * heading with nothing under it.
   */
  const awardList = pickAll(awards, locale)
    .filter((aw) => (audience === AUDIENCE_ALL
      ? true
      : (aw.audiences ?? []).includes(audience)))
    .sort((a, b) => String(b.year).localeCompare(String(a.year)));

  /* ── apply the editorial cut ───────────────────────────────────────────── */
  if (variant.maxExperience > 0) experience = experience.slice(0, variant.maxExperience);
  if (variant.maxProjects > 0) projectList = projectList.slice(0, variant.maxProjects);

  return {
    variant: { id: variant.id, audience, label: variant.i18n[locale]?.label ?? variant.i18n.en.label },
    title: variant.i18n[locale]?.title ?? variant.i18n.en.title,

    name: {
      /* The site shows the English name only; a CV carries both, because a Chinese client
         and an international client each look for a different one. */
      english: [p.name.first, p.name.middle, p.name.last].filter(Boolean).join(' '),
      native: p.name.native ?? null,
    },

    summary: positioning.summary,

    contact: {
      emails: [p.contact.email, p.contact.emailAlt].filter(Boolean),
      phone: p.contact.phone,
      wechat: p.contact.wechat,
      location: p.contact.location,
    },

    experience,
    education,
    projects: projectList,
    services: serviceList,
    skills: { languages, technical },
    awards: awardList,

    counts: {
      experience: experience.length,
      projects: projectList.length,
      services: serviceList.length,
      awards: awardList.length,
    },
  };
}

/* ── JSON Resume export ───────────────────────────────────────────────────
   https://jsonresume.org/schema — a portable, tool-readable form. It has to survive being
   parsed by software, so it carries structured dates and no presentation markup. */

/** Best-effort split of a timeline `date` into JSON Resume's `startDate`/`endDate`. */
function resumeDates(entry) {
  if (!entry.date) return {};
  const d = entry.date;
  return d.length === 7 ? { startDate: `${d}-01` } : { startDate: d };
}

function skillKeywords(list) {
  return list.map((sk) => sk.name);
}

/**
 * @param {string} variantId
 * @param {string} locale
 */
export function buildJsonResume(variantId = DEFAULT_VARIANT, locale = 'en') {
  const doc = buildResume(variantId, locale);

  return {
    $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: doc.name.native ? `${doc.name.native} (${doc.name.english})` : doc.name.english,
      label: doc.title,
      email: doc.contact.emails[0],
      phone: doc.contact.phone,
      location: { city: doc.contact.location },
      summary: doc.summary,
      profiles: [],
    },
    work: doc.experience.map((e) => ({
      name: e.title.split(' — ')[0],
      position: e.title.includes(' — ') ? e.title.split(' — ')[1] : e.title,
      summary: e.description,
      ...resumeDates(e),
    })),
    education: doc.education.map((e) => ({
      institution: e.title,
      summary: e.description,
      ...resumeDates(e),
    })),
    skills: [
      { name: 'Languages', keywords: skillKeywords(doc.skills.languages) },
      { name: 'Technical', keywords: skillKeywords(doc.skills.technical) },
      { name: 'Services', keywords: doc.services.map((sv) => sv.title) },
    ],
    awards: doc.awards.map((a) => ({
      title: a.title,
      awarder: a.issuer ?? '',
      date: a.year,
      summary: a.result ?? '',
    })),
    projects: doc.projects.map((pr) => ({
      name: pr.title,
      description: pr.description,
      keywords: pr.tech ?? [],
      url: pr.link ?? undefined,
    })),
    languages: doc.skills.languages.map((l) => ({ language: l.name, fluency: l.usage })),
    meta: {
      /* Kept deliberately: a consumer of this file should be able to tell which variant it
         is holding, because two variants of the same CV are different documents. */
      variant: doc.variant.id,
      locale,
      generatedBy: 'my-portfolio/src/content/resume.js',
    },
  };
}

/** Exposed for the /resume page's variant switcher. */
export function variantOptions(locale = 'en') {
  return [...RESUME_VARIANTS]
    .sort((a, b) => a.order - b.order)
    .map((v) => ({
      id: v.id,
      label: v.i18n[locale]?.label ?? v.i18n.en.label,
      blurb: v.i18n[locale]?.blurb ?? v.i18n.en.blurb,
      audience: v.audience,
    }));
}

/** The audience an existing audience id maps to for CV purposes (used by verify tooling). */
export function resumeVariantForAudience(audienceId) {
  return audiences.find((a) => a.id === audienceId)?.resumeVariant ?? null;
}
