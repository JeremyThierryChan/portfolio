<script setup>
/**
 * ContactPage — with the form safely degraded.
 *
 * WHAT WAS WRONG: the old form's submit handler only called `alert('Message from
 * {name} has been sent!')` and cleared the fields. There is no backend, so nothing
 * was ever sent, but the visitor was told it had been. That is worse than having no
 * form at all.
 *
 * THE FIX, in order of preference:
 *   1. The form now composes a real `mailto:` message from its fields, so submitting
 *      it genuinely delivers the message through the visitor's own mail client.
 *   2. A clear, translated notice states that there is no server, and offers the
 *      plain email address as the primary route.
 *   3. The email address is copyable in one click, for people who do not use a
 *      desktop mail client.
 *
 * SOCIALS: `profile.socials` contains 11 entries, 7 of which have `url: null` —
 * wired-up accounts with no public address. The old build rendered all 11 as
 * `<a href="#">`, so clicking them jumped to the top of the page. Here, entries
 * without a URL render as a non-interactive `<span>` with an explanatory accessible
 * name, and entries with a URL get `rel="noopener noreferrer"` and a new-tab hint.
 */
import { ref, computed, reactive, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useContent } from '@/content/index.js';
import { pick } from '@/content/resolve.js';
import PageShell from '@/components/layout/PageShell.vue';
import PageHeader from '@/components/layout/PageHeader.vue';
import AppButton from '@/components/ui/AppButton.vue';
import QuoteProcess from '@/components/content/QuoteProcess.vue';

const { t, locale } = useI18n();
const { profile } = useContent();

/*
 * `useContent()` hands back REFS, so a bare `profile.contact.email` in this block is
 * `undefined.contact.email` — a TypeError, not a value. The TEMPLATE auto-unwraps, so the
 * same expression is correct there; that asymmetry is exactly why this went unnoticed.
 * Three things were broken and none of them showed on the rendered page:
 *   - `copyEmail()` threw before touching the clipboard and fell into its own `catch`, so
 *     the button reported "copy failed" on every click;
 *   - `submit()` threw, so the form never handed the message to a mail client;
 *   - `socials` resolved to `[]`, so the entire social list rendered empty.
 *
 * `contact` is PICKED rather than read off `profile`, because `location` lives inside
 * `contact.i18n` and `pick(profile, …)` flattens only the top level — reading it raw
 * printed nothing beside the Location label.
 */
const contact = computed(() => pick(profile.value.contact, locale.value));

const form = reactive({ name: '', email: '', message: '' });
const copied = ref(false);
const copyError = ref(false);

/** True for the accounts with no public profile URL. */
const isUnlinked = (social) => !social.url;

/**
 * Build a mailto: URL from the form. This is the whole "backend": it hands the
 * message to the visitor's mail client, which can actually send it.
 */
const mailtoHref = computed(() => {
  const subject = `Portfolio enquiry${form.name ? ` — ${form.name}` : ''}`;
  const body = [
    form.message,
    '',
    '—',
    form.name,
    form.email,
  ].filter(Boolean).join('\n');
  return `mailto:${profile.value.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

function submit() {
  window.location.href = mailtoHref.value;
}

/** Pending "copied" revert, held so a second copy restarts the delay instead of racing it. */
let copyTimer = null;

async function copyEmail() {
  copyError.value = false;
  try {
    await navigator.clipboard.writeText(profile.value.contact.email);
    copied.value = true;
    // Each click owns the label for the full 2.4s: without clearing the previous timer,
    // it fires early and reverts a label that has just been re-set.
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { copied.value = false; }, 2400);
  } catch {
    // Clipboard access is refused in some browsers and all insecure contexts.
    copyError.value = true;
  }
}

// A queued timer would otherwise write to a ref whose component is already gone.
onUnmounted(() => clearTimeout(copyTimer));

const socials = computed(() => profile.value.socials ?? []);
</script>

<template>
  <PageShell>
    <PageHeader
      :overline="t('contact.overline')"
      :title="t('contact.title')"
      :lede="t('contact.lede')"
    />

    <div class="contact-grid">
      <!-- ── message form ─────────────────────────────────────────────── -->
      <section class="panel" aria-labelledby="contact-form-title">
        <h2 id="contact-form-title" class="panel__title">{{ t('contact.formTitle') }}</h2>

        <p class="notice" role="note">
          <strong>{{ t('contact.formUnavailableTitle') }}</strong>
          {{ t('contact.formUnavailableBody') }}
        </p>

        <form class="form" @submit.prevent="submit">
          <div class="field">
            <label for="cf-name">{{ t('contact.name') }}</label>
            <input id="cf-name" v-model="form.name" type="text" autocomplete="name" required />
          </div>

          <div class="field">
            <label for="cf-email">{{ t('contact.email') }}</label>
            <input id="cf-email" v-model="form.email" type="email" autocomplete="email" required />
          </div>

          <div class="field">
            <label for="cf-message">{{ t('contact.message') }}</label>
            <textarea id="cf-message" v-model="form.message" rows="6" required />
          </div>

          <AppButton type="submit" variant="primary">
            {{ t('contact.composeEmail') }}
          </AppButton>
        </form>
      </section>

      <!-- ── direct details ───────────────────────────────────────────── -->
      <section class="panel" aria-labelledby="contact-info-title">
        <h2 id="contact-info-title" class="panel__title">{{ t('contact.infoTitle') }}</h2>

        <dl class="details">
          <dt>{{ t('contact.email') }}</dt>
          <dd>
            <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
            <AppButton variant="ghost" size="sm" @click="copyEmail">
              {{ copied ? t('contact.copied') : t('contact.copyEmail') }}
            </AppButton>
            <span class="sr-status" role="status" aria-live="polite">
              <span v-if="copied">{{ t('contact.copied') }}</span>
              <span v-else-if="copyError">{{ t('contact.copyFailed') }}</span>
            </span>
          </dd>

          <dt>{{ t('contact.phone') }}</dt>
          <dd><a :href="`tel:${contact.phone.replace(/\s+/g, '')}`">{{ contact.phone }}</a></dd>

          <dt>{{ t('contact.wechat') }}</dt>
          <dd>{{ contact.wechat }}</dd>

          <dt>{{ t('contact.location') }}</dt>
          <dd>{{ contact.location }}</dd>
        </dl>
      </section>
    </div>

    <!--
      Only here, not on /services. That page already closes with its own ask plus a "how I
      work" panel that states the billing basis, so a second pricing block there would be
      the third one on the same screen. This page had none at all, and it is the page where
      a visitor is deciding whether to send the form above.
    -->
    <QuoteProcess />

    <!-- ── socials, with the unlinked ones degraded ───────────────────── -->
    <section class="socials" aria-labelledby="contact-social-title">
      <h2 id="contact-social-title" class="panel__title">{{ t('contact.followTitle') }}</h2>

      <ul class="socials__list">
        <li v-for="social in socials" :key="social.id" class="socials__item">
          <a
            v-if="!isUnlinked(social)"
            class="socials__link"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            :style="{ '--brand': social.color, '--brand-fg': social.darkText ? '#000' : '#fff' }"
            :aria-label="t('contact.officialSite', { name: social.name })"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="20" height="20">
              <path v-if="social.icon" :d="social.icon" fill="currentColor" />
              <text v-else x="12" y="16" text-anchor="middle" font-size="11" fill="currentColor">
                {{ social.name.slice(0, 1) }}
              </text>
            </svg>
            <span class="socials__name">{{ social.name }}</span>
          </a>

          <!-- No public URL: not a link, and not a dead `href="#"`. -->
          <span
            v-else
            class="socials__link socials__link--unlinked"
            :style="{ '--brand': social.color, '--brand-fg': social.darkText ? '#000' : '#fff' }"
            :aria-label="t('contact.noPublicProfile', { name: social.name })"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="20" height="20">
              <path v-if="social.icon" :d="social.icon" fill="currentColor" />
              <text v-else x="12" y="16" text-anchor="middle" font-size="11" fill="currentColor">
                {{ social.name.slice(0, 1) }}
              </text>
            </svg>
            <span class="socials__name">{{ social.name }}</span>
            <span class="visually-hidden">— {{ t('projects.noLink') }}</span>
          </span>
        </li>
      </ul>
    </section>
  </PageShell>
</template>

<style scoped>
.contact-grid {
  display: grid;
  gap: var(--space-lg);
  margin-block-end: var(--space-2xl);
}

.contact-grid {
  grid-template-columns: repeat(auto-fit, minmax(min(22rem, 100%), 1fr));
  align-items: start;
}

.panel {
  padding: var(--space-lg);
  background-color: var(--card-bg);
  border: var(--border-width) solid var(--card-border);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
}

.panel__title {
  font-size: var(--step-1);
  margin-block-end: var(--space-md);
}

.notice {
  padding: var(--space-sm);
  margin-block-end: var(--space-md);
  font-size: var(--step--1);
  line-height: var(--leading);
  color: var(--fg-muted);
  background-color: var(--warn-soft);
  border-inline-start: 2px solid var(--warn);
  border-radius: var(--radius-sm);
}

.notice strong {
  display: block;
  color: var(--fg);
  margin-block-end: var(--space-3xs);
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xs);
}

.field label {
  font-size: var(--step--1);
  font-weight: var(--weight-strong);
  color: var(--fg-muted);
}

.field textarea {
  resize: vertical;
  min-block-size: 8rem;
}

.details {
  display: grid;
  gap: var(--space-sm);
  margin: 0;
}

.details dt {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--fg-faint);
}

.details dd {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-xs);
  color: var(--fg);
}

.details a {
  color: var(--accent);
  text-decoration: none;
}

.details a:hover {
  text-decoration: underline;
}

.sr-status {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--ok);
}

/* ── socials ───────────────────────────────────────────────────────────── */

.socials__list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  list-style: none;
}

.socials__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  min-block-size: var(--control-height-sm);
  font-size: var(--step--1);
  color: var(--brand-fg, var(--fg-inverse));
  background-color: var(--brand, var(--bg-sunken));
  border: var(--border-width) solid transparent;
  border-radius: var(--radius-full);
  text-decoration: none;
  transition: transform var(--dur-fast) var(--ease-out);
}

a.socials__link:hover {
  transform: translateY(var(--hover-lift));
}

a.socials__link:focus-visible {
  outline: var(--focus-width) solid var(--focus);
  outline-offset: var(--focus-offset);
}

/* Visibly inert: no pointer, reduced contrast — but still readable and announced. */
.socials__link--unlinked {
  cursor: default;
  opacity: 0.5;
  /* The brand fill would imply interactivity, so the unlinked chips drop it. */
  background-color: var(--bg-sunken);
  border-color: var(--line);
  color: var(--fg-muted);
}

.socials__name {
  white-space: nowrap;
}
</style>
