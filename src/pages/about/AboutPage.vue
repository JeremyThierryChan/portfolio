<template>
  <section class="page">
    <div class="content">
      <h2>{{ $t('about.title') }}</h2>

      <div class="page-introduction">
        <h3>{{ $t('about.subtitle') }}</h3>
        <p>{{ $t('about.bio1') }}</p>
        <p>{{ $t('about.bio2') }}</p>
      </div>

      <div class="card">
        <h3>{{ $t('about.timelineTitle') }}</h3>
        <p>{{ $t('about.timelineLived') }} {{ timeElapsed }}.</p>
        <p>{{ $t('about.timelineDesc') }}</p>
        <router-link to="/about/timeline" class="card-btn">{{ $t('about.viewTimeline') }}</router-link>
      </div>

      <div class="card">
        <h3>{{ $t('about.skillsTitle') }}</h3>
        <p>{{ $t('about.skillsDesc') }}</p>
        <router-link to="/about/skills" class="card-btn">{{ $t('about.viewSkills') }}</router-link>
      </div>

      <div class="card">
        <h3>{{ $t('about.testimonialsTitle') }}</h3>
        <p>{{ $t('about.testimonialsDesc') }}</p>
        <router-link to="/about/testimonials" class="card-btn">{{ $t('about.viewTestimonials') }}</router-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AboutPage',
  data() {
    return {
      timeElapsed: '',
      timer: null,
    };
  },
  methods: {
    updateElapsedTime() {
      const startTime = new Date('2002-03-22T06:23:00');
      const now = new Date();
      const diff = now - startTime;
      const seconds = Math.floor(diff / 1000);
      const days = Math.floor(seconds / (60 * 60 * 24));
      const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((seconds % (60 * 60)) / 60);
      const secs = seconds % 60;
      this.timeElapsed = `${days} days, ${hours} hours, ${minutes} minutes, ${secs} seconds`;
    },
  },
  mounted() {
    this.updateElapsedTime();
    this.timer = setInterval(this.updateElapsedTime, 1000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped>
@import '@/css/public.css';

@media (max-width: 768px) {
  .page-introduction h3 {
    text-align: center;
  }
}
</style>
