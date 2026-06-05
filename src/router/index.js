import { createRouter, createWebHistory } from 'vue-router';

import Home         from '../pages/HomePage.vue';
import About        from '../pages/about/AboutPage.vue';
import Timeline     from '@/pages/about/timeline/TimelinePage.vue';
import Skills       from '../pages/about/skills/SkillsPage.vue';
import Testimonials from '@/pages/about/testimonial/TestimonialsPage.vue';
import TestimonialDetail from '@/pages/about/testimonial/TestimonialDetail.vue';
import Projects     from '../pages/projects/ProjectsPage.vue';
import Blog         from '../pages/blogs/BlogPage.vue';
import Gallery      from '../pages/gallery/GalleryPage.vue';
import Contact      from '../pages/ContactPage.vue';
import NotFound     from '../pages/404NotFoundPage.vue';

const routes = [
  { path: '/',                          name: 'home',             component: Home },
  { path: '/about',                     name: 'about',            component: About },
  { path: '/about/timeline',            name: 'timeline',         component: Timeline },
  { path: '/about/skills',              name: 'skills',           component: Skills },
  { path: '/about/testimonials',        name: 'testimonials',     component: Testimonials },
  { path: '/about/testimonials/:id',    name: 'testimonialDetail',component: TestimonialDetail, props: true },
  { path: '/projects',                  name: 'projects',         component: Projects },
  { path: '/gallery',                   name: 'gallery',          component: Gallery },
  { path: '/blog',                      name: 'blog',             component: Blog },
  { path: '/contact',                   name: 'contact',          component: Contact },
  { path: '/:catchAll(.*)',             name: 'not-found',        component: NotFound },
];

const router = createRouter({
  history: createWebHistory('/portfolio/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

export default router;
