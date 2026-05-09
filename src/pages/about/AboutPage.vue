<template>
  <section class="page">
    <div class="content">
      <h2>About Me</h2>

      <div class="page-introduction">
        <h3>Who Am I?</h3>
        <p>
          Tsup! I'm Jeremy. My goal? To leave a trace of elegance in a world that's constantly rushing toward the next big thing.
          I think life is far too precious to spend doing things you don't love, just for things you don't need, to impress people you don't know.
          Call me idealistic, but I'd rather be broke and inspired than rich and bored.
          (Though I wouldn't mind being inspired and comfortable, let's be honest.)
        </p>
        <p>Explore more about me below.</p>
      </div>

      <div class="card">
        <h3>My Timeline</h3>
        <p>Since 2002.3.22 6:23 AM, I have already lived {{ timeElapsed }}.</p>
        <p>A full chronological account of where I've been, what I've done, and what's shaped me.</p>
        <router-link to="/about/timeline" class="card-btn">View Timeline</router-link>
      </div>

      <div class="card">
        <h3>My Skills</h3>
        <p>Languages I speak, tools I use, and technologies I work with — rated honestly.</p>
        <router-link to="/about/skills" class="card-btn">View Skills</router-link>
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
