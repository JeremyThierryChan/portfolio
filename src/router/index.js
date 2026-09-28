/**
 * Router.
 *
 * Three changes from the previous version:
 *
 *  1. LAZY ROUTES. Every page used to be a static import, so all thirteen landed in
 *     one entry chunk — a visitor downloading the home page also downloaded the
 *     40-entry timeline, the gallery and the 521-line projects page. Each route is
 *     now a dynamic import, so only the current page's code and CSS load.
 *
 *  2. DOCUMENT TITLE PER ROUTE. `document.title` was static, so every page in the
 *     tab list, history and bookmarks carried the same name. `meta.titleKey` is
 *     resolved against the active locale in App.vue instead.
 *
 *  3. HISTORY BASE. Unchanged and load-bearing: it must stay `/portfolio/` to match
 *     the GitHub Pages deployment. `vite.config.js` sets the same value as `base`.
 *
 * Directory names are kept as they were (`blogs`, `testimonial`) to avoid pointless
 * churn; only the files inside them changed.
 */
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/HomePage.vue'),
    meta: { titleKey: 'nav.home' },
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('../pages/ServicesPage.vue'),
    meta: { titleKey: 'nav.services' },
  },
  {
    /*
     * The tutoring rate card. Its own route because a 27-row price table cannot live inside
     * one card of a nine-card grid; the teaching service points here.
     */
    path: '/tutoring',
    name: 'tutoring',
    component: () => import('../pages/TutoringPage.vue'),
    meta: { titleKey: 'tutoring.title' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../pages/about/AboutPage.vue'),
    meta: { titleKey: 'nav.aboutMe' },
  },
  {
    path: '/about/timeline',
    name: 'timeline',
    component: () => import('../pages/about/timeline/TimelinePage.vue'),
    meta: { titleKey: 'nav.timeline' },
  },
  {
    path: '/about/skills',
    name: 'skills',
    component: () => import('../pages/about/skills/SkillsPage.vue'),
    meta: { titleKey: 'nav.skills' },
  },
  {
    path: '/about/testimonials',
    name: 'testimonials',
    component: () => import('../pages/about/testimonial/TestimonialsPage.vue'),
    meta: { titleKey: 'nav.testimonials' },
  },
  {
    path: '/about/testimonials/:id',
    name: 'testimonialDetail',
    component: () => import('../pages/about/testimonial/TestimonialDetail.vue'),
    props: true,
    meta: { titleKey: 'nav.testimonials' },
  },
  {
    path: '/projects',
    name: 'projects',
    // `/work` is an ALIAS, not a second route: same component, same instance, no redirect
    // hop. The navigation calls it "Projects", but "work" is what a client types and what
    // the URL reads as in a shared link, so both resolve.
    alias: '/work',
    component: () => import('../pages/projects/ProjectsPage.vue'),
    meta: { titleKey: 'nav.projects' },
  },
  {
    path: '/gallery',
    name: 'gallery',
    component: () => import('../pages/gallery/GalleryPage.vue'),
    meta: { titleKey: 'nav.gallery' },
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../pages/blogs/BlogPage.vue'),
    meta: { titleKey: 'nav.blog' },
  },
  {
    path: '/resume',
    name: 'resume',
    component: () => import('../pages/ResumePage.vue'),
    meta: { titleKey: 'resume.title' },
  },
  {
    /* One route per industry cut. The variant id matches `audiences[].resumeVariant`, so
       the CV and the matching view of the site are two renderings of one decision. */
    path: '/resume/:variant',
    name: 'resumeVariant',
    component: () => import('../pages/ResumePage.vue'),
    meta: { titleKey: 'resume.title' },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../pages/ContactPage.vue'),
    meta: { titleKey: 'nav.contact' },
  },
  {
    path: '/:catchAll(.*)',
    name: 'not-found',
    component: () => import('../pages/NotFoundPage.vue'),
    meta: { titleKey: 'notFound.title' },
  },
];

const router = createRouter({
  history: createWebHistory('/portfolio/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: 'smooth' };
    return { top: 0 };
  },
});

export default router;
