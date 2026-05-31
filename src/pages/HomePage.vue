<template>
  <section class="page">
    <div class="content">
      <div class="page-introduction">
        <h3>{{ $t('home.title') }}</h3>
        <p>{{ $t('home.sub1') }}</p>
        <p>{{ $t('home.sub2') }}</p>
      </div>

      <div class="card">
        <h3>{{ $t('home.aboutTitle') }}</h3>
        <p>{{ $t('home.aboutDesc') }}</p>
        <router-link to="/about" class="card-btn">{{ $t('home.exploreMore') }}</router-link>
      </div>

      <div class="card">
        <h3>{{ $t('home.projectsTitle') }}</h3>
        <p>{{ $t('home.projectsDesc') }}</p>
        <router-link to="/projects" class="card-btn">{{ $t('home.exploreMore') }}</router-link>
      </div>

      <div class="card">
        <h3>{{ $t('home.blogTitle') }}</h3>
        <p>{{ $t('home.blogDesc') }}</p>
        <router-link to="/blog" class="card-btn">{{ $t('home.exploreMore') }}</router-link>
      </div>

      <div class="card">
        <h3>{{ $t('home.contactTitle') }}</h3>
        <p>{{ $t('home.contactDesc') }}</p>
        <router-link to="/contact" class="card-btn">{{ $t('home.getInTouch') }}</router-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomePage',
};
</script>

<style scoped>
@import '@/css/public.css';

.page-introduction h3 {
  font-size: 3rem;
}

@media (max-width: 768px) {
  .page-introduction h3 {
    font-size: 2rem;
  }
}
</style>
