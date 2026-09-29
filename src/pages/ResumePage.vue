<script setup>
/**
 * ResumePage — the CV, composed from the same content layer as the site.
 *
 * THREE THINGS THIS PAGE IS CAREFUL ABOUT
 *
 * 1. PRINT OUTPUT IS TEXT, NOT A PICTURE. The whole point of a CV here is that a recruiter
 *    can send it to applicant-tracking software, and ATS parses text in reading order — it
 *    cannot see a two-column layout, a sidebar, an icon-as-image, or a skill bar. So the
 *    printed form is single-column, uses no images or icon fonts, states levels in words,
 *    and keeps headings in the document flow. `scripts/verify-print.mjs` asserts all of
 *    that against the rendered markup rather than trusting it.
 *
 * 2. EMPTY SECTIONS ARE OMITTED, NOT PRINTED EMPTY. The web-development variant legitimately
 *    has no awards and the interpreting variant no projects; a heading with nothing under it
 *    reads as an oversight.
 *
 * 3. THE VARIANTS COME FROM THE AUDIENCE AXIS. `/resume/web` and the site's "I'm here about →
 *    Business owners" view are two renderings of one decision, so they cannot drift apart.
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { buildResume, variantOptions, isVariantId, DEFAULT_VARIANT } from '@/content/resume.js';
import PageShell from '@/components/layout/PageShell.vue';
import AppButton from '@/components/ui/AppButton.vue';

const { t, locale } = useI18n();
const route = useRoute();

const variants = computed(() => variantOptions(locale.value));

/*
 * A URL that names no known variant — `/resume` (no param at all) or a stale
 * `/resume/<unknown>` — falls back to the complete CV. Both branches of the ternary
 * that used to sit here returned DEFAULT_VARIANT, so the route-name test decided
 * nothing and was removed rather than left as a claim about variant routing.
 */
const activeId = computed(() => {
  const raw = route.params.variant;
  const id = Array.isArray(raw) ? raw[0] : raw;
  return isVariantId(id) ? id : DEFAULT_VARIANT;
});

const doc = computed(() => buildResume(activeId.value, locale.value));

const activeVariant = computed(
  () => variants.value.find((v) => v.id === activeId.value) ?? variants.value[0],
);

/** The JSON Resume export lives next to the app as a static file, regenerated on every build. */
const jsonHref = computed(() => `${import.meta.env.BASE_URL}resume.json`);

function print() {
  window.print();
}
</script>

<template>
  <PageShell>
    <!-- ── header + controls (all of this is hidden when printing) ────────── -->
    <header class="cv-head no-print">
      <p class="cv-head__overline">{{ t('resume.overline') }}</p>
      <h1 class="cv-head__title">{{ t('resume.title') }}</h1>
      <p class="cv-head__lede">{{ t('resume.lede') }}</p>

      <nav class="cv-variants" :aria-label="t('resume.variantLabel')">
        <RouterLink
          v-for="variant in variants"
          :key="variant.id"
          class="cv-variant"
          :class="{ 'is-active': variant.id === activeId }"
          :to="variant.id === DEFAULT_VARIANT ? '/resume' : `/resume/${variant.id}`"
          :aria-current="variant.id === activeId ? 'page' : undefined"
        >
          <span class="cv-variant__label">{{ variant.label }}</span>
          <span class="cv-variant__blurb">{{ variant.blurb }}</span>
        </RouterLink>
      </nav>

      <div class="cv-actions">
        <AppButton variant="primary" @click="print">{{ t('resume.print') }}</AppButton>
        <AppButton variant="secondary" :href="jsonHref">{{ t('resume.downloadJson') }}</AppButton>
      </div>

      <p class="cv-note">{{ t('resume.printNote') }}</p>
    </header>

    <!-- ── the document ───────────────────────────────────────────────────── -->
    <article class="cv" :data-variant="doc.variant.id">
      <header class="cv-identity">
        <h2 class="cv-identity__name">
          <span v-if="doc.name.native" class="cv-identity__native">{{ doc.name.native }}</span>
          <span class="cv-identity__english">{{ doc.name.english }}</span>
        </h2>
        <p class="cv-identity__title">{{ doc.title }}</p>

        <ul class="cv-contact">
          <li v-for="email in doc.contact.emails" :key="email">
            <a :href="`mailto:${email}`">{{ email }}</a>
          </li>
          <li><a :href="`tel:${doc.contact.phone.replace(/\s+/g, '')}`">{{ doc.contact.phone }}</a></li>
          <li v-if="doc.contact.wechat">{{ doc.contact.wechat }}</li>
          <li>{{ doc.contact.location }}</li>
        </ul>
      </header>

      <section v-if="doc.summary" class="cv-section">
        <h3 class="cv-section__title">{{ t('resume.sectionSummary') }}</h3>
        <p class="cv-prose">{{ doc.summary }}</p>
      </section>

      <section v-if="doc.services.length" class="cv-section">
        <h3 class="cv-section__title">{{ t('resume.sectionServices') }}</h3>
        <ul class="cv-list">
          <li v-for="service in doc.services" :key="service.id" class="cv-entry">
            <p class="cv-entry__head">
              <span class="cv-entry__name">{{ service.title }}</span>
              <span v-if="service.languages" class="cv-entry__meta">{{ service.languages }}</span>
            </p>
            <p class="cv-entry__body">{{ service.summary }}</p>
          </li>
        </ul>
      </section>

      <section v-if="doc.experience.length" class="cv-section">
        <h3 class="cv-section__title">{{ t('resume.sectionExperience') }}</h3>
        <ul class="cv-list">
          <li v-for="entry in doc.experience" :key="entry.id" class="cv-entry">
            <p class="cv-entry__head">
              <span class="cv-entry__name">{{ entry.title }}</span>
              <span class="cv-entry__date">
                {{ entry.ongoing ? `${entry.date} — ${t('resume.present')}` : entry.date }}
              </span>
            </p>
            <p class="cv-entry__body">{{ entry.description }}</p>
          </li>
        </ul>
      </section>

      <section v-if="doc.projects.length" class="cv-section">
        <h3 class="cv-section__title">{{ t('resume.sectionProjects') }}</h3>
        <ul class="cv-list">
          <li v-for="project in doc.projects" :key="project.id" class="cv-entry">
            <p class="cv-entry__head">
              <span class="cv-entry__name">{{ project.title }}</span>
              <span v-if="project.tech?.length" class="cv-entry__meta">{{ project.tech.join(' · ') }}</span>
            </p>
            <p class="cv-entry__body">{{ project.description }}</p>
            <!-- Plain text URLs so a printed copy is still usable and an ATS can read them. -->
            <p v-if="project.link" class="cv-entry__link">{{ project.link }}</p>
          </li>
        </ul>
      </section>

      <section v-if="doc.education.length" class="cv-section">
        <h3 class="cv-section__title">{{ t('resume.sectionEducation') }}</h3>
        <ul class="cv-list">
          <li v-for="entry in doc.education" :key="entry.id" class="cv-entry">
            <p class="cv-entry__head">
              <span class="cv-entry__name">{{ entry.title }}</span>
              <span class="cv-entry__date">{{ entry.date }}</span>
            </p>
            <p class="cv-entry__body">{{ entry.description }}</p>
          </li>
        </ul>
      </section>

      <section v-if="doc.skills.languages.length || doc.skills.technical.length" class="cv-section">
        <h3 class="cv-section__title">{{ t('resume.sectionSkills') }}</h3>

        <template v-if="doc.skills.languages.length">
          <h4 class="cv-subhead">{{ t('resume.sectionLanguages') }}</h4>
          <ul class="cv-facts">
            <li v-for="skill in doc.skills.languages" :key="skill.id">
              <strong>{{ skill.name }}</strong> — {{ skill.description }}
            </li>
          </ul>
        </template>

        <template v-if="doc.skills.technical.length">
          <h4 class="cv-subhead">{{ t('resume.sectionTechnical') }}</h4>
          <ul class="cv-facts">
            <li v-for="skill in doc.skills.technical" :key="skill.id">
              <strong>{{ skill.name }}</strong> — {{ skill.description }}
            </li>
          </ul>
        </template>
      </section>

      <section v-if="doc.awards.length" class="cv-section">
        <h3 class="cv-section__title">{{ t('resume.sectionAwards') }}</h3>
        <ul class="cv-list">
          <li v-for="award in doc.awards" :key="award.id" class="cv-entry cv-entry--compact">
            <p class="cv-entry__head">
              <span class="cv-entry__name">{{ award.title }}</span>
              <span class="cv-entry__date">{{ award.year }}</span>
            </p>
            <!-- A result is what makes an award evidence rather than a claim, so it is
                 stated when known and simply omitted when the source has none. -->
            <p v-if="award.result" class="cv-entry__result">
              {{ award.result }}<template v-if="award.issuer"> · {{ award.issuer }}</template>
            </p>
            <p v-else-if="award.issuer" class="cv-entry__result">{{ award.issuer }}</p>
          </li>
        </ul>
      </section>
    </article>

    <p class="cv-generated no-print">{{ t('resume.generatedNote') }}</p>
  </PageShell>
</template>

<style scoped>
/* ── controls (screen only) ────────────────────────────────────────────── */

.cv-head {
  padding-block-end: var(--space-lg);
  margin-block-end: var(--space-xl);
  border-block-end: var(--border-width) solid var(--line);
}

.cv-head__overline {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  font-weight: var(--weight-strong);
  text-transform: var(--overline-transform);
  letter-spacing: var(--overline-spacing);
  color: var(--accent);
  margin-block-end: var(--space-xs);
}

.cv-head__title {
  font-size: var(--step-3);
  margin-block-end: var(--space-sm);
}

.cv-head__lede {
  font-size: var(--step-0);
  line-height: var(--leading-loose);
  color: var(--fg-muted);
  max-inline-size: var(--measure-read);
  margin-block-end: var(--space-lg);
}

.cv-variants {
  display: grid;
  gap: var(--space-xs);
  margin-block-end: var(--space-md);
}

.cv-variants { grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr)); }

.cv-variant {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xs);
  padding: var(--space-sm);
  text-decoration: none;
  background-color: var(--card-bg);
  border: var(--border-width) solid var(--card-border);
  border-radius: var(--card-radius);
  transition: border-color var(--dur-fast) var(--ease-out);
}

.cv-variant:hover { border-color: var(--accent); }

.cv-variant:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}

.cv-variant.is-active {
  border-color: var(--accent);
  box-shadow: inset 0 0 0 var(--border-width) var(--accent);
  background-color: var(--accent-soft);
}

.cv-variant__label {
  font-family: var(--font-display);
  font-size: var(--step-0);
  font-weight: var(--weight-strong);
  color: var(--fg);
}

.cv-variant__blurb {
  font-size: var(--step--1);
  line-height: var(--leading);
  color: var(--fg-muted);
}

.cv-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-block-end: var(--space-sm);
}

.cv-note,
.cv-generated {
  font-size: var(--step--1);
  line-height: var(--leading);
  color: var(--fg-faint);
  max-inline-size: var(--measure-read);
}

.cv-generated {
  margin-block-start: var(--space-xl);
  padding-block-start: var(--space-md);
  border-block-start: var(--border-width) solid var(--line);
}

/* ── the document ──────────────────────────────────────────────────────── */

.cv {
  max-inline-size: var(--measure-read);
  color: var(--fg);
}

.cv-identity {
  margin-block-end: var(--space-lg);
}

.cv-identity__name {
  font-size: var(--step-2);
  margin-block-end: var(--space-3xs);
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-xs);
}

.cv-identity__native {
  font-size: var(--step-1);
  color: var(--fg-muted);
}

.cv-identity__title {
  font-size: var(--step-0);
  color: var(--accent);
  margin-block-end: var(--space-xs);
}

.cv-contact {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2xs) var(--space-sm);
  list-style: none;
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--fg-muted);
}

.cv-contact a {
  color: inherit;
  text-decoration: none;
}

.cv-section {
  margin-block-start: var(--space-lg);
}

.cv-section__title {
  font-size: var(--step-1);
  padding-block-end: var(--space-3xs);
  border-block-end: var(--border-width) solid var(--line);
  margin-block-end: var(--space-sm);
}

.cv-subhead {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--fg-faint);
  margin-block: var(--space-sm) var(--space-2xs);
}

.cv-prose {
  font-size: var(--step--1);
  line-height: var(--leading-loose);
  color: var(--fg-muted);
}

.cv-list,
.cv-facts {
  display: flex;
  flex-direction: column;
  list-style: none;
}

.cv-list { gap: var(--space-sm); }
.cv-facts { gap: var(--space-3xs); }

.cv-facts li {
  font-size: var(--step--1);
  line-height: var(--leading);
  color: var(--fg-muted);
}

.cv-facts strong { color: var(--fg); }

.cv-entry {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xs);
}

.cv-entry__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-2xs) var(--space-sm);
}

.cv-entry__name {
  font-family: var(--font-display);
  font-size: var(--step-0);
  font-weight: var(--weight-strong);
  color: var(--fg);
}

.cv-entry__date,
.cv-entry__meta {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  color: var(--fg-faint);
}

.cv-entry__body,
.cv-entry__result,
.cv-entry__link {
  font-size: var(--step--1);
  line-height: var(--leading);
  color: var(--fg-muted);
}

.cv-entry__result { color: var(--fg); }
.cv-entry__link { font-family: var(--font-mono); color: var(--accent); word-break: break-all; }

/* ── print: plain, single column, text only ────────────────────────────── */

@media print {
  .no-print { display: none !important; }

  .cv {
    max-inline-size: none;
    color: #000;
  }

  /* Force the plainest possible presentation: an ATS reads text in document order, so
     nothing may rely on colour, columns, or rounded boxes to be understood. */
  .cv-section__title {
    font-size: 12pt;
    border-block-end: 1pt solid #000;
    break-after: avoid;
  }

  .cv-identity__name { font-size: 16pt; }
  .cv-identity__title { font-size: 11pt; color: #000; }
  .cv-identity__native { font-size: 12pt; }

  .cv-entry { break-inside: avoid; page-break-inside: avoid; }

  .cv-contact,
  .cv-prose,
  .cv-entry__body,
  .cv-entry__result,
  .cv-facts li,
  .cv-entry__date,
  .cv-entry__meta,
  .cv-entry__link {
    font-size: 10pt;
    color: #000;
  }

  .cv-contact a,
  .cv-entry__link { color: #000; }

  .cv-section { margin-block-start: 12pt; }
}
</style>
