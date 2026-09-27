<script setup>
/**
 * SiteFooter — the site footer.
 *
 * Replaces `components/PageFooter.vue`, whose defects this fixes:
 *   1. Only two socials were listed, both hard-coded, and both pointing at
 *      `@/assets/icons/*.png` images with an `alt` duplicating the `aria-label`.
 *      The list now comes from `useContent().profile.socials`.
 *   2. Seven of those eleven socials have `url: null`. The old footer pattern —
 *      an anchor with no real destination — would have turned them into links
 *      that jump to the top of the page: a dead control that looks live and
 *      lies to a screen reader. They are rendered here as plain,
 *      non-interactive `<span>`s whose accessible name says there is no public
 *      profile yet.
 *   3. The clock-driven styling was invisible. `footer.themeNote` and
 *      `footer.styleNow` say what the site is doing and why it changed look.
 *
 * Colour comes from tokens only: brand colours from the content layer are
 * deliberately not used, because they cannot follow the style/mode axis.
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useContent } from '@/content';
import { formatMinutes, scheduleSummary } from '@/theme/schedule.js';
import { useTimeTheme } from '@/theme/useTimeTheme.js';

const { t } = useI18n();
const { profile, links } = useContent();
const { style, styleMeta } = useTimeTheme();

/*
 * Every social, in content order. `url: null` is meaningful data here — not an
 * oversight — so both cases are rendered from this one list.
 */
const socials = computed(() => profile.value.socials ?? []);

/*
 * The outgoing links row. Ordered by the content layer's curated `order`, and hidden
 * entirely when there is nothing to show — an empty heading with no list under it reads
 * as a broken section.
 */
const friendLinks = computed(() => links.value ?? []);

/* Static: there is exactly one footer, so a generated id would only add indirection. */
const linksHeadingId = 'footer-links-heading';

/** Link text is the name and its note; the accessible name adds where it goes. */
function linkLabel(link) {
  const parts = [link.name, link.note].filter(Boolean);
  return `${parts.join(' — ')} — ${t('common.externalLink')}`;
}

/** Current schedule window, shown next to the style name. */
const currentSlot = computed(
  () => scheduleSummary().find((slot) => slot.style === style.value) ?? null,
);

const currentWindow = computed(() => {
  const slot = currentSlot.value;
  if (!slot) return '';
  return `${formatMinutes(slot.start)}–${formatMinutes(slot.end)}`;
});

const styleNow = computed(
  () => t('footer.styleNow', { style: styleMeta.value.name, window: currentWindow.value }),
);

/** First glyph of the name, for socials whose `icon` path is null (e.g. 小红书). */
function initial(name) {
  return (name ?? '?').trim().charAt(0).toUpperCase();
}

/** Icon-only link: the name plus the "new tab" hint is the accessible name. */
function linkedLabel(social) {
  return `${social.name} — ${t('common.externalLink')}`;
}

function unlinkedLabel(social) {
  return t('contact.noPublicProfile', { name: social.name });
}
</script>

<template>
  <footer class="site-footer" role="contentinfo">
    <div class="container site-footer__inner">
      <div class="site-footer__meta">
        <p class="site-footer__rights">{{ t('footer.rights') }}</p>
        <p class="site-footer__note">{{ t('footer.themeNote') }}</p>
        <p v-if="currentWindow" class="site-footer__style">{{ styleNow }}</p>
      </div>

      <nav class="site-footer__socials" :aria-label="t('footer.socialLabel')">
        <ul class="site-footer__list">
          <li v-for="social in socials" :key="social.id" class="site-footer__item">
            <!-- Has a real destination. -->
            <a
              v-if="social.url"
              class="social social--linked"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="linkedLabel(social)"
              :title="t('common.externalLink')"
            >
              <svg
                v-if="social.icon"
                class="social__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path :d="social.icon" fill="currentColor" />
              </svg>
              <span v-else class="social__initial" aria-hidden="true">{{ initial(social.name) }}</span>
              <span class="social__name">{{ social.name }}</span>
            </a>

            <!-- No public profile: an inert span, never an anchor without a
                 destination. The visible name is hidden from the accessibility
                 tree so the label is announced once, with the reason attached. -->
            <span
              v-else
              class="social social--unlinked"
              :aria-label="unlinkedLabel(social)"
            >
              <svg
                v-if="social.icon"
                class="social__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path :d="social.icon" fill="currentColor" />
              </svg>
              <span v-else class="social__initial" aria-hidden="true">{{ initial(social.name) }}</span>
              <span class="social__name" aria-hidden="true">{{ social.name }}</span>
              <span class="visually-hidden">{{ unlinkedLabel(social) }}</span>
            </span>
          </li>
        </ul>
      </nav>

      <!--
        "友情链接". A real <nav> with a heading the visitor can see, labelled by that
        heading rather than by a bare aria-label, so the landmark is announced with the
        same words that are on screen.
      -->
      <nav
        v-if="friendLinks.length"
        class="site-footer__links"
        :aria-labelledby="linksHeadingId"
      >
        <h2 :id="linksHeadingId" class="site-footer__links-heading">
          {{ t('footer.friendLinks') }}
        </h2>
        <ul class="site-footer__links-list">
          <li v-for="link in friendLinks" :key="link.id">
            <a
              class="friend-link"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="linkLabel(link)"
              :title="t('common.externalLink')"
            >
              <span class="friend-link__name">{{ link.name }}</span>
              <span v-if="link.note" class="friend-link__note">{{ link.note }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  --tap-target: 2.75rem;

  background-color: var(--bg-sunken);
  color: var(--fg-muted);
  border-block-start: var(--border-width) solid var(--line);
  padding-block: var(--space-xl);

  font-family: var(--font-body);
  font-size: var(--step--1);
}

.site-footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-lg);
}

.site-footer__meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xs);
  max-inline-size: var(--measure-read);
}

.site-footer__rights,
.site-footer__note,
.site-footer__style {
  margin: 0;
}

.site-footer__rights {
  color: var(--fg);
}

.site-footer__style {
  font-family: var(--font-mono);
  color: var(--fg-faint);
}

/* ── outgoing links (友情链接) ─────────────────────────────────────────────── */

.site-footer__links {
  min-inline-size: 0;
}

.site-footer__links-heading {
  margin: 0 0 var(--space-2xs);
  font-family: var(--font-mono);
  font-size: var(--step--1);
  font-weight: var(--weight-strong);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--fg-faint);
}

.site-footer__links-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xs);
  margin: 0;
  padding: 0;
  list-style: none;
}

.friend-link {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-2xs);
  min-block-size: var(--tap-target);
  padding-inline: var(--space-xs);

  border: var(--border-width) solid transparent;
  border-radius: var(--radius-sm);
  color: var(--fg-muted);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease-out),
              background-color var(--dur-fast) var(--ease-out),
              border-color var(--dur-fast) var(--ease-out);
}

.friend-link:hover {
  background-color: var(--bg-raised);
  border-color: var(--line);
  color: var(--fg);
}

.friend-link:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}

.friend-link__name {
  font-weight: var(--weight-strong);
  white-space: nowrap;
}

/* The note gives way first when the column is narrow. */
.friend-link__note {
  color: var(--fg-faint);
}

/* ── socials ─────────────────────────────────────────────────────────────── */

.site-footer__list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin: 0;
  padding: 0;
  list-style: none;
}

.site-footer__item {
  display: flex;
}

.social {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  min-block-size: var(--tap-target);
  padding-inline: var(--space-sm);

  border: var(--border-width) solid var(--line);
  border-radius: var(--radius-full);
  font-size: var(--step--1);
  text-decoration: none;
}

.social__icon {
  inline-size: 1.125rem;
  block-size: 1.125rem;
  flex: none;
  fill: currentColor;
}

/* Fallback for a social with no `icon` path. */
.social__initial {
  display: inline-grid;
  place-items: center;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  flex: none;

  background-color: var(--accent-soft);
  color: var(--fg);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: var(--step--1);
  line-height: 1;
}

.social__name {
  white-space: nowrap;
}

.social--linked {
  background-color: var(--bg-raised);
  color: var(--fg-muted);
  transition: background-color var(--dur-fast) var(--ease-out),
              border-color var(--dur-fast) var(--ease-out),
              color var(--dur-fast) var(--ease-out);
}

.social--linked:hover {
  background-color: var(--accent-soft);
  border-color: var(--line-strong);
  color: var(--fg);
}

/* Not a control: no hover lift, no pointer affordance, muted on purpose. */
.social--unlinked {
  background-color: transparent;
  border-style: dashed;
  color: var(--fg-faint);
  cursor: default;
}

.social--linked:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}

@media (min-width: 768px) {
  .site-footer__links {
    flex: 1 1 12rem;
  }

  .site-footer__socials {
    flex: 1 1 22rem;
  }

  .site-footer__list {
    justify-content: flex-end;
  }
}
</style>
