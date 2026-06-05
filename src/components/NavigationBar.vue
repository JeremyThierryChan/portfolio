<template>
  <nav class="NavigationBar">
    <ul class="nav-links">
      <li><router-link to="/">{{ $t('nav.home') }}</router-link></li>

      <li class="dropdown" @mouseenter="showAboutDropdown" @mouseleave="hideAboutDropdown">
        <router-link to="/about">{{ $t('nav.about') }}</router-link>
        <ul class="dropdown-menu" v-show="isAboutDropdownVisible">
          <li><router-link to="/about">{{ $t('nav.aboutMe') }}</router-link></li>
          <li><router-link to="/about/timeline">{{ $t('nav.timeline') }}</router-link></li>
          <li><router-link to="/about/skills">{{ $t('nav.skills') }}</router-link></li>
          <li><router-link to="/about/testimonials">{{ $t('nav.testimonials') }}</router-link></li>
        </ul>
      </li>

      <li><router-link to="/projects">{{ $t('nav.projects') }}</router-link></li>
      <li><router-link to="/gallery">{{ $t('nav.gallery') }}</router-link></li>
      <li><router-link to="/blog">{{ $t('nav.blog') }}</router-link></li>
      <li><router-link to="/contact">{{ $t('nav.contact') }}</router-link></li>

      <!-- Language switcher -->
      <li class="lang-switcher" @mouseenter="showLangDropdown" @mouseleave="hideLangDropdown">
        <button class="lang-current">
          {{ currentLocale.toUpperCase() }} ▾
        </button>
        <ul class="lang-dropdown" v-show="isLangDropdownVisible">
          <li
            v-for="lang in languages"
            :key="lang.code"
            :class="{ active: currentLocale === lang.code }"
            @click="setLocale(lang.code)"
          >{{ lang.label }}</li>
        </ul>
      </li>

      <!-- Theme toggle -->
      <li>
        <button class="theme-btn" @click="toggleTheme" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'NavigationBar',
  setup() {
    const { locale } = useI18n();
    return { locale };
  },
  data() {
    return {
      isAboutDropdownVisible: false,
      isLangDropdownVisible: false,
      isDark: true,
      languages: [
        { code: 'en', label: 'EN — English' },
        { code: 'zh', label: '中 — 中文' },
        { code: 'fr', label: 'FR — Français' },
        { code: 'de', label: 'DE — Deutsch' },
        { code: 'es', label: 'ES — Español' },
        { code: 'it', label: 'IT — Italiano' },
      ],
    };
  },
  computed: {
    currentLocale() { return this.locale; },
  },
  created() {
    const saved = localStorage.getItem('theme') || 'dark';
    this.isDark = saved === 'dark';
  },
  methods: {
    showAboutDropdown() { this.isAboutDropdownVisible = true; },
    hideAboutDropdown() { this.isAboutDropdownVisible = false; },
    showLangDropdown() { this.isLangDropdownVisible = true; },
    hideLangDropdown() { this.isLangDropdownVisible = false; },
    setLocale(code) {
      this.locale = code;
      localStorage.setItem('locale', code);
    },
    toggleTheme() {
      this.isDark = !this.isDark;
      const theme = this.isDark ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    },
  },
};
</script>

<style scoped>
.NavigationBar {
  background-color: var(--bg-nav);
  padding: 15px 30px;
  box-shadow: 0 4px 10px var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color 0.3s ease;
}

.NavigationBar:hover { background-color: var(--bg-nav-hover); }

.nav-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 30px;
  justify-content: center;
  align-items: center;
}

.nav-links li {
  font-size: 12px;
  font-weight: bold;
  position: relative;
}

.nav-links a {
  color: var(--text-nav);
  text-decoration: none;
  padding: 10px 0;
  position: relative;
  transition: color 0.3s ease, transform 0.3s ease;
}

.nav-links a::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: #ffb86c;
  bottom: 5px;
  left: 0;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.nav-links a:hover { color: #ffb86c; transform: scale(1.1); }
.nav-links a:hover::after { transform: scaleX(1); }

.dropdown { position: relative; }

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--bg-nav);
  list-style: none;
  padding: 8px 0;
  padding-top: 12px; /* bridges gap so mouseleave doesn't fire mid-travel */
  margin: 0;
  box-shadow: 0 4px 10px var(--shadow-sm);
  border-radius: 5px;
  min-width: 140px;
  z-index: 99;
  border: 1px solid var(--border-color);
}

.dropdown-menu li { font-size: 12px; white-space: nowrap; }

.dropdown-menu li a {
  display: block;
  padding: 10px 20px;
  color: var(--text-nav);
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
  transform: none;
}

.dropdown-menu li a:hover {
  background-color: var(--bg-nav-hover);
  color: #ffb86c;
  transform: none;
}

.dropdown-menu li a::after { display: none; }

/* Language switcher */
.lang-switcher {
  position: relative;
  margin-left: 10px;
}

.lang-current {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 11px;
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.lang-current:hover {
  border-color: #ffb86c;
  color: #ffb86c;
}

.lang-dropdown {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--bg-nav);
  border: 1px solid var(--border-color);
  border-radius: 5px;
  list-style: none;
  padding: 4px 0;
  padding-top: 12px; /* bridges gap so mouseleave doesn't fire mid-travel */
  margin: 0;
  min-width: 130px;
  box-shadow: 0 4px 10px var(--shadow-sm);
  z-index: 99;
  text-align: left;
}

.lang-dropdown li {
  font-size: 11px;
  font-weight: bold;
  padding: 7px 14px;
  cursor: pointer;
  color: var(--text-nav);
  transition: background-color 0.2s ease, color 0.2s ease;
  white-space: nowrap;
}

.lang-dropdown li:hover { background-color: var(--bg-nav-hover); color: #ffb86c; }
.lang-dropdown li.active { color: #ff6b6b; }

/* Theme toggle */
.theme-btn {
  background: none;
  border: 1px solid var(--border-color);
  font-size: 14px;
  padding: 3px 7px;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease;
  line-height: 1.4;
}

.theme-btn:hover {
  border-color: #ffb86c;
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .nav-links { gap: 12px; flex-wrap: wrap; justify-content: center; }
  .dropdown-menu { min-width: 120px; }
}
</style>
