import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * GitHub Pages SPA fallback.
 *
 * This app uses `createWebHistory`, so `/portfolio/about` is a client-side route with
 * no file behind it. GitHub Pages is static hosting: it looks for `about/index.html`,
 * does not find it, and returns **its own** 404 page — the router's catch-all never
 * runs. So every route except `/` would 404 on a refresh, a shared link, or a
 * bookmark, while working perfectly in dev (Vite's dev server does the rewrite).
 *
 * Copying the built `index.html` to `404.html` is the standard fix: GitHub Pages
 * serves `404.html` for any unmatched path, that file boots the same bundle, and the
 * router then resolves the path and renders the real page — or its own NotFound page
 * for a genuinely bad URL.
 *
 * Asset URLs are absolute (`/portfolio/assets/…`) because of `base`, so the copy
 * loads the identical bundle without rewriting anything.
 */
function ghPagesSpaFallback() {
  return {
    name: 'gh-pages-spa-fallback',
    apply: 'build',
    closeBundle() {
      const dist = resolve(process.cwd(), 'dist')
      copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
    },
  }
}

export default defineConfig({
  plugins: [vue(), ghPagesSpaFallback()],
  base: '/portfolio/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'vue-i18n'],
    holdUntilCrawlEnd: false,
  },
  server: {
    host: 'localhost',
  },
})
