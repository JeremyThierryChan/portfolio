<template>
  <div id="app">
    <Navbar />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import Navbar from './components/NavigationBar.vue';
import Footer from './components/PageFooter.vue';

export default {
  components: { Navbar, Footer },
};
</script>

<style>
/* ── Theme variables ─────────────────────────────────────── */
:root,
[data-theme="dark"] {
  --bg-gradient:    linear-gradient(135deg, #2b2b2b, #3c3c3c);
  --bg-nav:         #2b2b2b;
  --bg-nav-hover:   #3c3c3c;
  --bg-card:        rgba(0, 0, 0, 0.7);
  --bg-input:       #444;
  --bg-filter:      #444;
  --bg-footer:      #333;
  --bg-social:      #444;
  --text-primary:   #ffffff;
  --text-nav:       #dcdcdc;
  --text-muted:     #aaa;
  --text-role:      #777;
  --text-footer:    #ffffff;
  --border-color:   #555;
  --border-filter:  #666;
  --shadow:         rgba(0, 0, 0, 0.5);
  --shadow-sm:      rgba(0, 0, 0, 0.3);
  --skill-bg:       #444;
}

[data-theme="light"] {
  --bg-gradient:    linear-gradient(135deg, #e8eaf0, #f0f2f8);
  --bg-nav:         #ffffff;
  --bg-nav-hover:   #f0f0f0;
  --bg-card:        rgba(255, 255, 255, 0.92);
  --bg-input:       #f0f0f0;
  --bg-filter:      #e4e4e4;
  --bg-footer:      #ebebeb;
  --bg-social:      #e0e0e0;
  --text-primary:   #1a1a1a;
  --text-nav:       #333333;
  --text-muted:     #666666;
  --text-role:      #888888;
  --text-footer:    #333333;
  --border-color:   #cccccc;
  --border-filter:  #bbbbbb;
  --shadow:         rgba(0, 0, 0, 0.12);
  --shadow-sm:      rgba(0, 0, 0, 0.08);
  --skill-bg:       #d8d8d8;
}

/* ── Base ────────────────────────────────────────────────── */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background: var(--bg-gradient);
  color: var(--text-primary);
  transition: background 0.3s ease, color 0.3s ease;
}
</style>
