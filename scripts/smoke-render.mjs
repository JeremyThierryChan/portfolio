#!/usr/bin/env node
/**
 * Render smoke test.
 *
 *   node scripts/smoke-render.mjs        (or: npm run smoke)
 *
 * A 200 from the dev server only proves a component *compiles*. It does not prove it
 * *renders* — a template reading a missing property, a computed that throws, or a bad
 * prop type all compile cleanly and then fail in the browser.
 *
 * This loads every route's page through Vite's module graph and renders the real
 * `App` shell (nav + page + footer + theme UI) with `@vue/server-renderer`, against
 * real vue-router and vue-i18n instances, then asserts:
 *
 *   - no render error,
 *   - the output contains actual text (guards against a blank page),
 *   - and no raw i18n key leaked into the markup.
 *
 * It also renders the home page in all six style x mode combinations, because the
 * components branch on the active style and three of those pairings are the rare ones.
 *
 * NOTE ON `document`: this is a client-only SPA, so `document` always exists in
 * production. Node has no DOM, so a minimal stub is installed for the run. A component
 * touching `document` during setup is therefore not a defect here — but if one does,
 * its stack is printed once so it can be moved into `onMounted`.
 */

import { createServer } from 'vite';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve as resolvePath } from 'node:path';

const ROOT_DIR = resolvePath(dirname(fileURLToPath(import.meta.url)), '..');
const p = (...seg) => resolvePath(ROOT_DIR, ...seg);

// Framework packages are imported directly rather than through `ssrLoadModule`:
// Vite's SSR graph cannot evaluate Vue's CommonJS entry ("module is not defined"),
// while Node's own ESM resolution picks the right build via the "import" condition.
import { createSSRApp, h, effectScope } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { createRouter, createMemoryHistory } from 'vue-router';
import { createI18n } from 'vue-i18n';
import { findWithheld } from './withheld-names.mjs';

/* ── minimal DOM stub ──────────────────────────────────────────────────── */

const rootAttrs = { 'data-style': 'a', 'data-mode': 'light' };
const noop = () => {};

globalThis.document = {
  documentElement: {
    getAttribute: (k) => rootAttrs[k] ?? null,
    setAttribute: (k, v) => { rootAttrs[k] = v; },
    removeAttribute: (k) => { delete rootAttrs[k]; },
    classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
  },
  body: { style: {}, classList: { add: noop, remove: noop, toggle: noop } },
  addEventListener: noop,
  removeEventListener: noop,
  querySelector: () => null,
  querySelectorAll: () => [],
  contains: () => false,
  createElement: () => ({ style: {}, setAttribute: noop, appendChild: noop }),
  visibilityState: 'visible',
  title: '',
  activeElement: null,
};

globalThis.window = {
  matchMedia: () => ({ matches: false, addEventListener: noop, removeEventListener: noop }),
  innerWidth: 1280,
  addEventListener: noop,
  removeEventListener: noop,
  localStorage: {
    store: {},
    getItem(k) { return this.store[k] ?? null; },
    setItem(k, v) { this.store[k] = String(v); },
    removeItem(k) { delete this.store[k]; },
  },
};
globalThis.localStorage = globalThis.window.localStorage;

/* ── fixtures ──────────────────────────────────────────────────────────── */

const ROUTES = [
  ['/', 'home', 'HomePage', '/src/pages/HomePage.vue'],
  ['/services', 'services', 'ServicesPage', '/src/pages/ServicesPage.vue'],
  ['/about', 'about', 'AboutPage', '/src/pages/about/AboutPage.vue'],
  ['/about/timeline', 'timeline', 'TimelinePage', '/src/pages/about/timeline/TimelinePage.vue'],
  ['/about/skills', 'skills', 'SkillsPage', '/src/pages/about/skills/SkillsPage.vue'],
  ['/about/testimonials', 'testimonials', 'TestimonialsPage', '/src/pages/about/testimonial/TestimonialsPage.vue'],
  ['/about/testimonials/1', 'testimonialDetail', 'TestimonialDetail', '/src/pages/about/testimonial/TestimonialDetail.vue'],
  ['/projects', 'projects', 'ProjectsPage', '/src/pages/projects/ProjectsPage.vue'],
  ['/gallery', 'gallery', 'GalleryPage', '/src/pages/gallery/GalleryPage.vue'],
  ['/blog', 'blog', 'BlogPage', '/src/pages/blogs/BlogPage.vue'],
  ['/contact', 'contact', 'ContactPage', '/src/pages/ContactPage.vue'],
  ['/resume', 'resume', 'ResumePage (complete)', '/src/pages/ResumePage.vue'],
  ['/resume/web', 'resumeVariant', 'ResumePage (web)', '/src/pages/ResumePage.vue'],
  ['/nope-not-a-route', 'not-found', 'NotFoundPage', '/src/pages/NotFoundPage.vue'],
];

/*
 * The pages navigate with NAMED routes (`{ name: 'testimonialDetail' }`), so the test
 * router must register the same names as the real one — otherwise every named
 * `router-link` throws "No match" and the failure belongs to the harness, not the app.
 * Paths and names mirror src/router/index.js.
 */
const NAMED_ROUTES = [
  ['/', 'home'],
  ['/services', 'services'],
  ['/about', 'about'],
  ['/about/timeline', 'timeline'],
  ['/about/skills', 'skills'],
  ['/about/testimonials', 'testimonials'],
  ['/about/testimonials/:id', 'testimonialDetail'],
  ['/projects', 'projects'],
  ['/gallery', 'gallery'],
  ['/blog', 'blog'],
  ['/contact', 'contact'],
  ['/resume', 'resume'],
  ['/resume/:variant', 'resumeVariant'],
  ['/:catchAll(.*)', 'not-found'],
];

const COMBOS = [
  ['a', 'light'], ['a', 'dark'],
  ['b', 'light'], ['b', 'dark'],
  ['c', 'light'], ['c', 'dark'],
];

let failures = 0;
let checks = 0;
let printedStack = false;

const ok = (l, x = '') => { checks++; console.log(`  \x1b[32mPASS\x1b[0m  ${l}${x ? ` — ${x}` : ''}`); };
const bad = (l, x = '') => { checks++; failures++; console.log(`  \x1b[31mFAIL\x1b[0m  ${l}${x ? ` — ${x}` : ''}`); };

const Stub = { render: () => null };
const textOf = (html) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
/** How many service cards are in this fragment. */
const countCards = (html) => (html.match(/class="svc"/g) ?? []).length;

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
  ssr: { external: ['vue', 'vue-router', 'vue-i18n', '@vue/server-renderer'] },
});

/** One app + router + i18n, with `page` mounted at `path` and everything else stubbed. */
/**
 * One app + router + i18n, with `page` mounted at the route whose name is
 * `targetName` and every other route rendered as a stub. Registering the real names
 * is what lets `<router-link :to="{ name: '…' }">` resolve.
 *
 * `locale` and `messages` default to English, because that is what every other check in
 * this file wants. Section 8 passes `'zh'` to exercise the path a Chinese visitor takes.
 */
function mount(page, targetName, locale = 'en', messages = undefined) {
  const app = createSSRApp({ render: () => h(App) });
  const router = createRouter({
    history: createMemoryHistory(),
    routes: NAMED_ROUTES.map(([path, name]) => ({
      path,
      name,
      // The detail page reads its :id from props, exactly as the real router does.
      props: name === 'testimonialDetail',
      component: name === targetName ? page : Stub,
    })),
  });
  const i18n = createI18n({
    legacy: false,
    locale,
    // English stays the fallback, so a key a locale has not translated degrades to
    // English rather than to a bare key path — the same contract the app itself uses.
    fallbackLocale: 'en',
    messages: messages ?? { en },
  });
  app.use(router);
  app.use(i18n);
  return { app, router };
}

let en;
let zh;
let App;

try {
  en = (await vite.ssrLoadModule('/src/locales/en.js')).default;
  zh = (await vite.ssrLoadModule('/src/locales/zh.js')).default;
  App = (await vite.ssrLoadModule('/src/App.vue')).default;

  /* ── 1. every route, through the real App shell ─────────────────────── */

  console.log('\n\x1b[1mRendering every route through the real App shell\x1b[0m');

  for (const [path, routeName, name, modulePath] of ROUTES) {
    const page = (await vite.ssrLoadModule(modulePath)).default;
    const { app, router } = mount(page, routeName);

    try {
      await router.push(path);
      await router.isReady();
      const html = await renderToString(app);
      const text = textOf(html);

      if (text.length < 60) {
        bad(`${path} → ${name}`, `rendered almost no text (${text.length} chars)`);
        continue;
      }

      // No route may render a name that was deliberately withheld from the published
      // site. This is the surface that actually reaches a visitor, so it is checked
      // here and not only in the content layer.
      const withheld = findWithheld(text);
      if (withheld.length) {
        bad(`${path} → ${name}`, `renders a withheld name: ${withheld.join(', ')}`);
        continue;
      }

      // A dotted key path between tags means a missing translation rendered.
      const leak = html.match(/>\s*([a-z][A-Za-z]*\.[a-z][A-Za-z.]{3,})\s*</);
      if (leak) {
        bad(`${path} → ${name}`, `untranslated key rendered: ${leak[1]}`);
        continue;
      }

      ok(`${path} → ${name}`, `${text.length} chars`);
    } catch (error) {
      bad(`${path} → ${name}`, error.message.split('\n')[0]);
      if (!printedStack) {
        printedStack = true;
        console.log(`        \x1b[90m${(error.stack ?? '').split('\n').slice(1, 6).join('\n        ')}\x1b[0m`);
      }
    }
  }

  /* ── 2. home page across all six style x mode combinations ─────────── */

  console.log('\n\x1b[1mRendering the home page in all six style x mode combinations\x1b[0m');

  const homePage = (await vite.ssrLoadModule('/src/pages/HomePage.vue')).default;
  const lengths = new Set();

  for (const [style, mode] of COMBOS) {
    rootAttrs['data-style'] = style;
    rootAttrs['data-mode'] = mode;
    const { app, router } = mount(homePage, 'home');

    try {
      await router.push('/');
      await router.isReady();
      const text = textOf(await renderToString(app));
      lengths.add(text.length);
      if (text.length < 60) bad(`${style}/${mode}`, `almost no text (${text.length} chars)`);
      else ok(`${style}/${mode}`, `${text.length} chars`);
    } catch (error) {
      bad(`${style}/${mode}`, error.message.split('\n')[0]);
    }
  }

  /*
   * The DOM is identical by design across styles — what changes is the tokens applied
   * via data-style / data-mode on <html>. So the thing worth asserting is that the
   * server render is content-stable while the axis attributes differ, which the
   * assertions above already cover. A differing length would mean a style branch is
   * adding or dropping content, which would be a bug.
   */
  console.log('\n\x1b[1mContent is stable across styles (only tokens differ)\x1b[0m');
  if (lengths.size === 1) ok('all six combinations render identical content', `${[...lengths][0]} chars each`);
  else bad('content differs between styles — a style branch must not add or remove content', `lengths: ${[...lengths].join(', ')}`);

  /* ── 3. the visitor-identity axis really reorders and collapses ─────── */

  console.log('\n\x1b[1mAudience selection reorders and collapses (never hides)\x1b[0m');

  const servicesPage = (await vite.ssrLoadModule('/src/pages/ServicesPage.vue')).default;
  const EXPECTED = { all: [9, 0], events: [3, 6], trade: [4, 5], web: [2, 7], institutions: [4, 5] };

  for (const [audience, [wantVisible, wantCollapsed]] of Object.entries(EXPECTED)) {
    const { app, router } = mount(servicesPage, 'services');
    const target = audience === 'all' ? '/services' : `/services?for=${audience}`;

    try {
      await router.push(target);
      await router.isReady();
      const html = await renderToString(app);

      // ServiceCard renders <article class="svc">; anything inside <details> is the
      // collapsed remainder.
      const detailsAt = html.indexOf('<details');
      const visible = detailsAt === -1 ? countCards(html) : countCards(html.slice(0, detailsAt));
      const collapsed = detailsAt === -1 ? 0 : countCards(html.slice(detailsAt));
      const total = visible + collapsed;

      if (total !== 9) {
        bad(`${audience}`, `expected all 9 services in the DOM, found ${total}`);
      } else if (visible !== wantVisible || collapsed !== wantCollapsed) {
        bad(`${audience}`, `expected ${wantVisible} visible + ${wantCollapsed} collapsed, got ${visible} + ${collapsed}`);
      } else {
        ok(`${audience}`, `${visible} visible, ${collapsed} collapsed, all 9 present`);
      }
    } catch (error) {
      bad(`${audience}`, error.message.split('\n')[0]);
    }
  }

  /* ── 4. the full index really lists every project ─────────────────────── */

  console.log('\n\x1b[1mThe complete index hides nothing\x1b[0m');

  {
    const projectsPage = (await vite.ssrLoadModule('/src/pages/projects/ProjectsPage.vue')).default;
    const allProjects = (await vite.ssrLoadModule('/src/content/index.js')).projects;

    const { app, router } = mount(projectsPage, 'projects');
    await router.push('/projects');
    await router.isReady();
    const html = await renderToString(app);

    const rows = (html.match(/class="row__button"/g) ?? []).length;

    if (rows === allProjects.length) {
      ok('every project appears in the index', `${rows} of ${allProjects.length}`);
    } else {
      bad('the index is missing projects', `${rows} of ${allProjects.length} — triage must never hide work`);
    }

    // The triage tiers must not remove anything: a project only ever changes prominence.
    const tiers = new Set(allProjects.map((p) => p.tier));
    const unTiered = allProjects.filter((p) => !p.tier).length;
    if (unTiered === 0) ok('every project carries a tier', [...tiers].sort().join(', '));
    else bad('untiered projects', `${unTiered} would fall out of both halves`);
  }

  /* ── 5. the CV prints as text an ATS can actually read ───────────────── */

  console.log('\n\x1b[1mRésumé: printable and machine-readable\x1b[0m');

  {
    const resumePage = (await vite.ssrLoadModule('/src/pages/ResumePage.vue')).default;

    const renderResume = async (name) => {
      const { app, router } = mount(resumePage, name);
      await router.push(name === 'resume' ? '/resume' : '/resume/web');
      await router.isReady();
      return renderToString(app);
    };

    const full = await renderResume('resume');
    const web = await renderResume('resumeVariant');

    /*
     * Scope every check to the CV DOCUMENT, not the whole page. The first version of this
     * assertion tested the full render and failed on the navigation bar's SVG icons — which
     * are app chrome, hidden in print, and nothing to do with the CV. Testing the wrong
     * region produces a failure that teaches nothing.
     */
    const cvOnly = (html) => {
      const at = html.indexOf('class="cv"');
      if (at === -1) return '';
      const end = html.indexOf('</article>', at);
      return html.slice(at, end === -1 ? undefined : end);
    };

    const cvFull = cvOnly(full);
    const cvWeb = cvOnly(web);

    if (!cvFull) bad('could not isolate the CV document from the page');
    else ok('CV document isolated', `${cvFull.length} chars of markup`);

    // An ATS parses text. Images, icon fonts and drawn shapes are invisible to it.
    const IMAGE_OR_ICON = /<img\b|<svg\b|class="[^"]*\bfa[srlb]?\b|class="[^"]*\bicon-/i;
    if (IMAGE_OR_ICON.test(cvFull)) {
      bad('the CV document contains images or icon fonts', 'an ATS cannot read those');
    } else {
      ok('no images or icon fonts inside the CV document');
    }

    // Skill levels must be words, not a drawn bar.
    if (/role="progressbar"/.test(cvFull)) bad('the CV uses progress bars for skill levels');
    else ok('skill levels are stated in words, not drawn bars');

    // Contact details must be real text so they can be parsed out.
    for (const needle of ['@', '+86']) {
      if (cvFull.includes(needle)) ok('contact details present as text', `found "${needle}"`);
      else bad('contact details missing from the CV', `no "${needle}"`);
    }

    // Empty sections must be omitted, not printed empty. The web variant has no awards.
    const awardsHeading = (html) => /Competitions &amp; certificates|Competitions & certificates/.test(html);
    if (awardsHeading(cvWeb)) {
      bad('the web CV prints an empty awards heading', 'that variant legitimately has none');
    } else {
      ok('empty sections are omitted (web CV has no awards heading)');
    }
    if (awardsHeading(cvFull)) ok('the complete CV does include the awards section');
    else bad('the complete CV is missing its awards section');

    // Every variant must render a name, a title and some experience.
    for (const [label, html] of [['complete', cvFull], ['web', cvWeb]]) {
      const text = textOf(html);
      if (text.length < 800) bad(`${label} CV rendered too little text`, `${text.length} chars`);
      else ok(`${label} CV renders`, `${text.length} chars`);
    }
  }

  /* ── 6. testimonials are promoted on both pages, and do not repeat ───── */

  console.log('\n\x1b[1mTestimonials promoted on home and /about, without repeating\x1b[0m');

  {
    const homePage = (await vite.ssrLoadModule('/src/pages/HomePage.vue')).default;
    const aboutPage = (await vite.ssrLoadModule('/src/pages/about/AboutPage.vue')).default;
    const allTestimonials = (await vite.ssrLoadModule('/src/content/index.js')).testimonials;

    const render = async (page, name, path) => {
      const { app, router } = mount(page, name);
      await router.push(path);
      await router.isReady();
      return renderToString(app);
    };

    const homeHtml = await render(homePage, 'home', '/');
    const aboutHtml = await render(aboutPage, 'about', '/about');

    const quotesIn = (html) => (html.match(/<blockquote/g) ?? []).length;

    if (quotesIn(homeHtml) >= 2) ok('home page promotes testimonials', `${quotesIn(homeHtml)} quotes`);
    else bad('home page has too few testimonials', `${quotesIn(homeHtml)}`);

    if (quotesIn(aboutHtml) >= 2) ok('/about promotes testimonials', `${quotesIn(aboutHtml)} quotes`);
    else bad('/about has too few testimonials', `${quotesIn(aboutHtml)}`);

    /*
     * The two pages must not quote the SAME person: the second slot would then be spent on
     * something the reader has already read. This is the assertion that keeps the brief's
     * "promote them in both places" from degenerating into duplication.
     */
    /*
     * `name` sits at the TOP LEVEL of a testimonial, not inside `i18n` — it is a proper noun
     * and SCHEMA.md carves it out of the translatable half. Reading `i18n.en.name` returns
     * undefined for every entry, which made the overlap check pass because both lists were
     * empty. An assertion that cannot fail is worse than no assertion, so the resolved name
     * is asserted non-empty first.
     */
    const namesOn = (html) => allTestimonials
      .filter((x) => x.name && html.includes(x.name))
      .map((x) => x.name);

    const onHome = namesOn(homeHtml);
    const onAbout = namesOn(aboutHtml);
    const overlap = onHome.filter((n) => onAbout.includes(n));

    // Guard against the vacuous pass: if no names were detected the overlap test means nothing.
    if (onHome.length === 0 || onAbout.length === 0) {
      bad('could not identify the quoted testimonials', 'the overlap check would pass vacuously');
    } else if (overlap.length === 0) {
      ok('the two pages quote different people', `home: ${onHome.join(', ')} | about: ${onAbout.join(', ')}`);
    } else {
      bad('the same testimonial appears on both pages', overlap.join(', '));
    }
  }

  /* ── 7. the print stylesheet exists and is single-column ─────────────── */

  {
    const printCss = readFileSync(p('src/components/../pages/ResumePage.vue'), 'utf8');
    const block = printCss.slice(printCss.indexOf('@media print'));
    if (!block) bad('no @media print block in ResumePage.vue');
    else {
      const needs = ['break-inside', 'no-print'];
      const missing = needs.filter((n) => !block.includes(n));
      if (missing.length) bad('print stylesheet is incomplete', `missing: ${missing.join(', ')}`);
      else ok('print stylesheet sets page-break control and hides chrome');
      if (block.includes('grid-template-columns') || block.includes('column-count')) {
        bad('print stylesheet introduces columns', 'an ATS reads a single column only');
      } else {
        ok('print output stays single-column');
      }
    }
  }

  /* ── 7. the theme attribute actually reaches the document ───────────── */

  console.log('\n\x1b[1mTheme axes reach the document\x1b[0m');
  rootAttrs['data-style'] = 'c';
  rootAttrs['data-mode'] = 'dark';
  const { app: app3, router: router3 } = mount(homePage, 'home');
  await router3.push('/');
  await router3.isReady();
  await renderToString(app3);
  if (rootAttrs['data-style'] === 'c' && rootAttrs['data-mode'] === 'dark') {
    ok('data-style / data-mode survive a full render', `${rootAttrs['data-style']}/${rootAttrs['data-mode']}`);
  } else {
    bad('the render clobbered the theme attributes', JSON.stringify(rootAttrs));
  }
  /* ── 8. a Chinese visitor actually gets Chinese ──────────────────────── */

  /*
   * This suite rendered in English only for its whole life, so the six-language switcher
   * and the entire `zh` content layer were never exercised here — the same kind of blind
   * spot that let the dark-mode white-card bug ship. A missing Chinese string does not
   * throw: `pick()` quietly falls back to English, so a Chinese visitor is served an
   * English sentence inside a Chinese page and nothing anywhere reports it.
   *
   * The anchors are read out of the content layer at runtime instead of being hard-coded,
   * so they survive the next rewrite of the copy. For each route this finds the first
   * entry whose Chinese string genuinely differs from the English one, then asserts the
   * rendered page uses the Chinese and does NOT contain the English.
   */
  console.log('\n\x1b[1mA Chinese visitor gets Chinese, not an English fallback\x1b[0m');

  const ZH_CASES = [
    ['/services', 'services', 'services', '/src/pages/ServicesPage.vue',
      (await vite.ssrLoadModule('/src/content/services.js')).services, 'title'],
    ['/projects', 'projects', 'projects', '/src/pages/projects/ProjectsPage.vue',
      (await vite.ssrLoadModule('/src/content/projects.js')).projects, 'title'],
    ['/about/skills', 'skills', 'skills', '/src/pages/about/skills/SkillsPage.vue',
      (await vite.ssrLoadModule('/src/content/skills.js')).skills, 'description'],
    ['/about/timeline', 'timeline', 'timeline', '/src/pages/about/timeline/TimelinePage.vue',
      (await vite.ssrLoadModule('/src/content/timeline.js')).timeline, 'title'],
  ];

  for (const [path, routeName, label, modulePath, rows, key] of ZH_CASES) {
    const page = (await vite.ssrLoadModule(modulePath)).default;
    const { app, router } = mount(page, routeName, 'zh', { en, zh });
    await router.push(path);
    await router.isReady();
    const text = textOf(await renderToString(app));

    // A usable anchor: the two copies really differ, and the English string cannot show
    // up anywhere in ANY entry's Chinese prose (which would make the "no English leaked"
    // assertion below pass for the wrong reason). Punctuation is excluded because
    // renderToString escapes it, which would silently turn a leak into a pass.
    const anchor = rows.filter((e) => e.i18n?.zh?.[key] && e.i18n?.en?.[key]).find((e) => {
      const enV = e.i18n.en[key];
      const zhV = e.i18n.zh[key];
      if (typeof enV !== 'string' || typeof zhV !== 'string') return false;
      if (enV === zhV || zhV.includes(enV)) return false;
      if (enV.length < 8 || enV.length > 90) return false;
      if (/[&<>"']/.test(enV)) return false;
      return !rows.some((o) =>
        Object.values(o.i18n?.zh ?? {}).some((v) => typeof v === 'string' && v.includes(enV)));
    });

    if (!anchor) {
      bad(`${path} rendered in zh`, `no usable anchor in ${label}.${key} — cannot prove the zh copy renders`);
      continue;
    }

    const enV = anchor.i18n.en[key];
    const zhV = anchor.i18n.zh[key];

    const withheldZh = findWithheld(text);
    if (withheldZh.length) bad(`${path} rendered in zh leaks a withheld name`, withheldZh.join(', '));
    else ok(`${path} rendered in zh carries no withheld name`);

    if (text.includes(zhV)) ok(`${path} rendered in zh uses the zh copy`, zhV.slice(0, 22));
    else bad(`${path} rendered in zh is missing its zh copy`, `expected "${zhV}"`);

    if (text.includes(enV)) bad(`${path} rendered in zh fell back to English`, `"${enV}" leaked through`);
    else ok(`${path} rendered in zh did not fall back to English`, `"${enV.slice(0, 30)}" absent`);

    const han = (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
    if (han > 100) ok(`${path} rendered in zh is substantially Chinese`, `${han} Han characters`);
    else bad(`${path} rendered in zh is barely Chinese`, `${han} Han characters`);
  }

  /* ── 9. the site notice actually speaks six languages ────────────────── */

  /*
   * The whole claim of this component is that it carries the notice in every shipped
   * locale at once, not only the visitor's. That is not something to assert in a
   * comment — a pack that silently falls back to English would still render a
   * perfectly plausible strip. So it is rendered and counted here.
   */
  console.log('\n\x1b[1mThe site notice speaks all six languages\x1b[0m');

  {
    const packs = { en, zh };
    for (const code of ['fr', 'de', 'es', 'it']) {
      packs[code] = (await vite.ssrLoadModule(`/src/locales/${code}.js`)).default;
    }

    const { app, router } = mount(homePage, 'home', 'en', packs);
    await router.push('/');
    await router.isReady();
    const html = await renderToString(app);
    const text = textOf(html);

    const absent = Object.entries(packs)
      .filter(([, pack]) => !text.includes(pack.notice.building))
      .map(([code]) => code);
    if (absent.length) bad('the notice omits a language', absent.join(', '));
    else ok('the notice renders every shipped language', Object.keys(packs).join(' · '));

    // Counted exactly, because the marquee is duplicated for a seamless loop: every
    // language appears twice, and the active one appears a third time because its copy
    // is also the visually-hidden accessible sentence. (The first version of this check
    // expected two for everything and failed on the active locale — the assertion was
    // wrong, not the component.)
    const expected = Object.fromEntries(Object.keys(packs).map((code) => [code, code === 'en' ? 3 : 2]));
    const wrongCount = Object.entries(expected)
      .map(([code, want]) => [code, text.split(packs[code].notice.building).length - 1, want])
      .filter(([, got, want]) => got !== want)
      .map(([code, got, want]) => `${code}: ${got} (expected ${want})`);
    if (wrongCount.length) bad('the notice renders the wrong number of copies per language', wrongCount.join(', '));
    else ok('copy count is exactly right per language', '2 for the loop pair, 3 for the active locale');

    // Assistive tech must hear one sentence, not six repetitions of it.
    if (/class="site-notice__track"[^>]*aria-hidden="true"/.test(html)) {
      ok('the scrolling track is aria-hidden');
    } else {
      bad('the scrolling track is not aria-hidden', 'a screen reader would read the notice six times');
    }
    if (html.includes('visually-hidden')) ok('the accessible copy is exposed once, outside the track');
    else bad('no accessible copy for the notice', 'the only text would be the aria-hidden marquee');

    // Inside the header, not a sibling after it. The header is sticky, and that is what
    // keeps the strip attached to the nav it describes instead of scrolling away — the
    // whole reason it was moved in there.
    const noticeAt = html.indexOf('site-notice__track');
    const headerOpen = html.indexOf('<header');
    const headerClose = html.indexOf('</header>');
    if (headerOpen !== -1 && noticeAt > headerOpen && noticeAt < headerClose) {
      ok('the notice renders inside the nav header');
    } else {
      bad('the notice is not inside the nav header', 'it would scroll away from the nav');
    }

    // And the nav row must not be constrained to the centred page measure, which is what
    // squeezed the links and broke the row in the first place.
    if (/class="site-nav__inner"/.test(html) && !/class="[^"]*container[^"]*site-nav__inner/.test(html)) {
      ok('the nav row is not wrapped in .container');
    } else {
      bad('the nav row is still inside .container', 'the bar would stay confined to the middle of the screen');
    }

    /*
     * The brand must sit in DOM order BETWEEN the two flanking columns. That is not
     * cosmetic: the centring is produced by giving the left and right columns the same
     * width, so putting the brand anywhere else — or moving the style marker back beside
     * it — silently un-centres the bar with nothing to report it.
     */
    const navAt = html.indexOf('site-nav__nav');
    const brandAt = html.indexOf('site-nav__brand');
    const toolsAt = html.indexOf('site-nav__tools');
    if (navAt !== -1 && navAt < brandAt && brandAt < toolsAt) {
      ok('the brand sits between the two equal-width columns');
    } else {
      bad('the brand is not between the columns', `nav@${navAt} brand@${brandAt} tools@${toolsAt}`);
    }
    const styleAt = html.indexOf('site-nav__style-name');
    if (styleAt !== -1 && styleAt > toolsAt) {
      ok('the style marker sits in the right-hand column');
    } else {
      bad('the style marker is not in the right-hand column', `style@${styleAt} tools@${toolsAt}`);
    }

    // Every route, not just the one: the notice lives in the shell.
    const withoutNotice = [];
    for (const [path2, routeName, label, modulePath] of ROUTES) {
      const page = (await vite.ssrLoadModule(modulePath)).default;
      const { app: a2, router: r2 } = mount(page, routeName, 'en', packs);
      await r2.push(path2);
      await r2.isReady();
      const h = await renderToString(a2);
      if (!h.includes('site-notice__track')) withoutNotice.push(`${path2} (${label})`);
    }
    if (withoutNotice.length) bad('the notice is missing on some routes', withoutNotice.join(', '));
    else ok('the notice renders on every route', `${ROUTES.length} routes`);
  }

  /* ── 10. a pinned style is visible from the nav ───────────────────────── */

  /*
   * A pinned style permanently overrules the schedule, and while that state was written
   * only onto a chip inside the collapsed popover, a pinned visitor had no way to learn
   * that their schedule had stopped running — so the schedule itself got reported as
   * broken. Both states are asserted here: the shape of the fix, and its absence when
   * nothing is pinned, because a marker that is always on is as useless as one that is
   * never on.
   */
  console.log('\n\x1b[1mA pinned style is visible without opening the panel\x1b[0m');

  {
    const packs = { en, zh };
    for (const code of ['fr', 'de', 'es', 'it']) {
      packs[code] = (await vite.ssrLoadModule(`/src/locales/${code}.js`)).default;
    }

    /*
     * The pin is driven through the real composable rather than by seeding storage:
     * `useTimeTheme` keeps `styleOverride` as MODULE-LEVEL state, read once when the
     * module is first imported, so writing localStorage mid-process changes nothing.
     * (The load path itself is covered by `tests/theme-boot.test.mjs`, "a stored style
     * overrides the clock".) Driving `setStyle` — the same call the UI makes — is what
     * this section is actually about.
     */
    const themeApi = await vite.ssrLoadModule('/src/theme/useTimeTheme.js');
    const scope = effectScope();
    const theme = scope.run(() => themeApi.useTimeTheme());

    const renderHome = async () => {
      const page = (await vite.ssrLoadModule('/src/pages/HomePage.vue')).default;
      const { app, router } = mount(page, 'home', 'en', packs);
      await router.push('/');
      await router.isReady();
      return renderToString(app);
    };

    theme.setStyle('b');
    const pinnedHtml = await renderHome();

    theme.setStyle(themeApi.STYLE_AUTO);
    const autoHtml = await renderHome();

    scope.stop();

    if (autoHtml.includes(packs.en.theme.triggerAuto)) {
      ok('unpinned: the trigger says the clock is in charge');
    } else {
      bad('unpinned: the trigger does not say the clock is in charge');
    }

    if (pinnedHtml.includes(packs.en.theme.triggerPinned)) {
      ok('pinned: the trigger says so');
    } else {
      bad('pinned: the trigger does not say so', 'this is the state that silently disables the schedule');
    }

    if (pinnedHtml.includes('theme-control__pinned')) {
      ok('pinned: a visible marker renders on the trigger');
    } else {
      bad('pinned: the marker does not render');
    }

    if (autoHtml.includes('theme-control__pinned')) {
      bad('unpinned: the marker renders anyway', 'a marker that is always on carries no information');
    } else {
      ok('unpinned: no marker');
    }

    // Hand the theme back to the clock for anything that runs after this.
    theme.setStyle(themeApi.STYLE_AUTO);
  }

  /* ── 11. the footer's outgoing links actually go somewhere ───────────── */

  /*
   * The footer this replaced shipped anchors with no real destination: a click jumped to
   * the top of the page and a screen reader was told nothing about it. So the four rules
   * that defect broke are asserted here rather than assumed — a real href, an external
   * target, a safe rel, and a landmark named by the heading that is on screen.
   */
  console.log('\n\x1b[1mThe footer links go somewhere\x1b[0m');

  {
    const packs = { en, zh };
    for (const code of ['fr', 'de', 'es', 'it']) {
      packs[code] = (await vite.ssrLoadModule(`/src/locales/${code}.js`)).default;
    }
    const outgoing = (await vite.ssrLoadModule('/src/content/links.js')).links;

    const page = (await vite.ssrLoadModule('/src/pages/HomePage.vue')).default;
    const { app, router } = mount(page, 'home', 'en', packs);
    await router.push('/');
    await router.isReady();
    const html = await renderToString(app);

    const start = html.indexOf('site-footer__links');
    if (start === -1) {
      bad('the footer has no outgoing-links section');
    } else {
      ok('the footer renders the outgoing-links section');
      const slice = html.slice(start);

      const absent = outgoing.filter((l) => !slice.includes(l.url));
      if (absent.length) bad('a footer link is missing from the markup', absent.map((l) => l.id).join(', '));
      else ok('every footer link is rendered', `${outgoing.length} urls`);

      const targets = (slice.match(/target="_blank"/g) ?? []).length;
      if (targets >= outgoing.length) ok('every footer link opens in a new tab', `${targets}`);
      else bad('a footer link does not open in a new tab', `${targets} of ${outgoing.length}`);

      const rels = (slice.match(/rel="noopener noreferrer"/g) ?? []).length;
      if (rels >= outgoing.length) ok('every footer link carries a safe rel', `${rels}`);
      else bad('a footer link is missing rel="noopener noreferrer"', `${rels} of ${outgoing.length}`);

      if (html.includes('aria-labelledby="footer-links-heading"') && html.includes('id="footer-links-heading"')) {
        ok('the links landmark is named by its visible heading');
      } else {
        bad('the links landmark is not named by its heading');
      }
    }
  }

} finally {
  await vite.close();
  delete globalThis.document;
  delete globalThis.window;
  delete globalThis.localStorage;
}

console.log(`\n\x1b[1m${failures === 0 ? '\x1b[32mALL CHECKS PASSED' : `\x1b[31m${failures} CHECK(S) FAILED`}\x1b[0m  (${checks - failures}/${checks})`);
process.exit(failures === 0 ? 0 : 1);
