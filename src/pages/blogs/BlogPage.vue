<template>
  <section class="page">
    <div class="content">
      <h2>{{ $t('blog.title') }}</h2>

      <div class="page-introduction">
        <h3>{{ $t('blog.subtitle') }}</h3>
        <p>{{ $t('blog.intro') }}</p>
      </div>

      <div v-for="post in posts" :key="post.id" class="card">
        <h3>{{ post.title }}</h3>
        <p>{{ post.excerpt }}</p>
        <router-link :to="'/post/' + post.id" class="card-btn">{{ $t('blog.readMore') }}</router-link>
      </div>

      <p class="wait-text">{{ $t('blog.waitMore') }}</p>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      posts: [
        { id: 1, title: 'How to Build a Portfolio Website', excerpt: 'In this article, I share my journey of building a personal portfolio website using Vue.js and other modern web technologies.' },
        { id: 2, title: 'Understanding Vue.js Directives', excerpt: 'Vue.js directives are the building blocks of dynamic web pages. In this post, I explain the most commonly used directives in Vue.js.' },
        { id: 3, title: 'Exploring the Power of CSS Grid', excerpt: 'CSS Grid has become an essential tool for modern web design. This article dives into its powerful layout capabilities.' },
      ],
    };
  },
};
</script>

<style scoped>
@import '@/css/public.css';
</style>
