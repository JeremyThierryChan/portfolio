/**
 * useElapsed — "Since 2002.3.22 6:23 AM, I have already lived …"
 *
 * The old implementation lived inside AboutPage and had three problems:
 *
 *   1. It ran a 1-second `setInterval` that never paused, so a backgrounded tab kept
 *      waking up to recompute a number nobody could see.
 *   2. The units were hard-coded English ("days, hours, minutes, seconds") while the
 *      surrounding sentence came from the locale files — so a Chinese or German
 *      visitor got a half-translated sentence.
 *   3. It put the ticking text in a live region's path, which would make a screen
 *      reader announce a new value every single second.
 *
 * Here: the unit labels come from the `time.*` locale keys, the interval stops while
 * the tab is hidden, and the seconds field is marked `aria-hidden` so only the stable
 * parts are read out.
 */

import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

/** @param {string|Date} start ISO timestamp of birth */
export function useElapsed(start) {
  const { t } = useI18n();

  const startMs = (start instanceof Date ? start : new Date(start)).getTime();
  const now = ref(Date.now());

  let timer = null;

  const stop = () => {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };

  const startTicking = () => {
    stop();
    now.value = Date.now();
    timer = setInterval(() => { now.value = Date.now(); }, 1000);
  };

  const onVisibility = () => {
    if (document.visibilityState === 'visible') startTicking();
    else stop();
  };

  onMounted(() => {
    // Mount can land in an already-hidden document (a restored background tab), where
    // starting unconditionally would re-create the always-on interval this file exists
    // to remove. The listener below still catches every change after that.
    if (typeof document === 'undefined') return;
    if (document.visibilityState === 'visible') startTicking();
    document.addEventListener('visibilitychange', onVisibility);
  });

  onUnmounted(() => {
    stop();
    if (typeof document === 'undefined') return;
    document.removeEventListener('visibilitychange', onVisibility);
  });

  // Recompute immediately if the clock is nudged (tests, or a timezone change).
  watch(now, () => {});

  const parts = computed(() => {
    const totalSeconds = Math.max(0, Math.floor((now.value - startMs) / 1000));
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  });

  /** Localised unit labels, so the sentence is fully translated. */
  const units = computed(() => ({
    days: t('time.days'),
    hours: t('time.hours'),
    minutes: t('time.minutes'),
    seconds: t('time.seconds'),
  }));

  /** Days only — a stable value safe to expose as the accessible name. */
  const daysOnly = computed(() => parts.value.days);

  return { parts, units, daysOnly, startMs };
}
