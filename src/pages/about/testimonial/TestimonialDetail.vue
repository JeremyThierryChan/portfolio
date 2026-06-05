<template>
  <div class="testimonial-detail" v-if="testimonial">
    <section class="detail-header">
      <div class="avatar-lg" :style="{ backgroundColor: testimonial.color }">
        {{ testimonial.initials }}
      </div>
      <h1>{{ testimonial.name }}</h1>
      <p class="role">{{ testimonial.role }}</p>
      <p class="context">{{ testimonial.context }}</p>
      <p class="date">{{ testimonial.date }}</p>
    </section>

    <section class="detail-body">
      <p>"{{ testimonial.full }}"</p>
    </section>

    <div class="back-button">
      <router-link to="/about/testimonials" class="button">
        {{ $t('testimonials.backBtn') }}
      </router-link>
    </div>
  </div>

  <div class="testimonial-detail not-found" v-else>
    <p>Testimonial not found.</p>
    <router-link to="/about/testimonials" class="button">
      {{ $t('testimonials.backBtn') }}
    </router-link>
  </div>
</template>

<script>
import { testimonials } from './testimonialsData.js';

export default {
  name: 'TestimonialDetail',
  props: ['id'],
  computed: {
    testimonial() {
      return testimonials.find(t => t.id == this.id);
    },
  },
};
</script>

<style scoped>
.testimonial-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: var(--bg-gradient);
  color: var(--text-primary);
  font-family: 'Arial', sans-serif;
  padding: 60px 40px;
  text-align: center;
  transition: background 0.3s ease, color 0.3s ease;
}

.avatar-lg {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
}

.detail-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.detail-header .role {
  font-size: 1rem;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.detail-header .context {
  font-size: 0.9rem;
  color: #ff6b6b;
  font-style: italic;
  margin-bottom: 6px;
}

.detail-header .date {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 30px;
}

.detail-body {
  max-width: 720px;
  background: var(--bg-card);
  border-radius: 15px;
  padding: 32px;
  box-shadow: 0 8px 20px var(--shadow);
  margin-bottom: 36px;
  transition: background 0.3s ease;
}

.detail-body p {
  font-style: italic;
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--text-primary);
}

.button {
  display: inline-block;
  background-color: #ff6b6b;
  color: white;
  padding: 12px 28px;
  font-size: 1rem;
  border-radius: 25px;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.button:hover {
  background-color: #ff4747;
  transform: translateY(-3px);
}

.not-found { justify-content: center; gap: 20px; }

@media (max-width: 768px) {
  .testimonial-detail { padding: 40px 20px; }
  .detail-header h1 { font-size: 1.5rem; }
  .detail-body { padding: 20px; }
}
</style>
