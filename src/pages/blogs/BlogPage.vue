<template>
  <section class="page">
    <div class="content">
      <h2>My Blog</h2>

      <div class="page-introduction">
          <h3>What You’ll Find Here</h3>
          <p>Welcome to my corner of the internet! 
            Here, I share my thoughts, insights, and stories on a wide variety of topics that I’m passionate about. 
            Whether you’re here for tech tips, personal development advice, or just a bit of inspiration. 
            I hope you find something that resonates with you.
          </p>
      </div>

      <div v-for="post in posts" :key="post.id" class="card">
        <h3>{{ post.title }}</h3>
        <p>{{ post.excerpt }}</p>
        <!-- 使用 router-link 来跳转到不存在的页面 -->
        <router-link :to="'/post/' + post.id" class="card-btn">Read More</router-link>
      </div>

      <!-- 敬请期待的文字 -->
      <p class="wait-text">Please wait for more...</p>
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