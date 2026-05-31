import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import router from './router';
import en from './locales/en.js';
import zh from './locales/zh.js';
import fr from './locales/fr.js';
import de from './locales/de.js';
import es from './locales/es.js';
import it from './locales/it.js';

// Init theme before app mounts to avoid flash
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

const savedLocale = localStorage.getItem('locale') || 'en';

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: { en, zh, fr, de, es, it },
});

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount('#app');
