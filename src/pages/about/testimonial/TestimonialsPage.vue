<template>
  <div class="testimonials-page">
    <section class="header-section">
      <h1 class="section-title">{{ $t('testimonials.title') }}</h1>
      <p class="section-description">{{ $t('testimonials.subtitle') }}</p>
    </section>

    <section class="testimonials-list">
      <div v-for="t in testimonials" :key="t.id" class="testimonial-card">
        <div class="testimonial-header">
          <div class="avatar" :style="{ backgroundColor: t.color }">{{ t.initials }}</div>
          <div class="testimonial-info">
            <h3>{{ t.name }}</h3>
            <p class="role">{{ t.role }}</p>
            <p class="context">{{ t.context }}</p>
            <p class="date">{{ t.date }}</p>
          </div>
        </div>
        <p class="testimonial-text">"{{ t.excerpt }}"</p>
        <router-link :to="{ name: 'testimonialDetail', params: { id: t.id } }" class="read-more-btn">
          {{ $t('testimonials.readMore') }}
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import { testimonials } from './testimonialsData.js';

export default {
  name: 'TestimonialsPage',
  data() {
    return { testimonials };
  },
};
</script>

<style scoped>
.testimonials-page {
  background: var(--bg-gradient);
  color: var(--text-primary);
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
  padding: 40px;
  transition: background 0.3s ease, color 0.3s ease;
}

.section-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
  animation: fadeIn 1.5s ease-in-out;
}

.section-description {
  font-size: 1.3rem;
  line-height: 1.8;
  margin-bottom: 30px;
  text-align: center;
  color: var(--text-muted);
}

.testimonials-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.testimonial-card {
  background: var(--bg-card);
  padding: 24px;
  border-radius: 15px;
  box-shadow: 0 8px 20px var(--shadow);
  animation: slideUp 1s ease-out forwards;
  opacity: 0;
  transition: background 0.3s ease;
}

.testimonial-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  letter-spacing: 0.5px;
}

.testimonial-info h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 4px;
  color: var(--text-primary);
}

.testimonial-info .role {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0 0 3px;
}

.testimonial-info .context {
  font-size: 0.8rem;
  color: #ff6b6b;
  margin: 0 0 3px;
  font-style: italic;
}

.testimonial-info .date {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin: 0;
}

.testimonial-text {
  font-style: italic;
  color: var(--text-primary);
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 16px;
}

.read-more-btn {
  display: inline-block;
  padding: 8px 20px;
  background-color: #ff6b6b;
  color: white;
  font-size: 0.9rem;
  border-radius: 25px;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.read-more-btn:hover {
  background-color: #ff4747;
  transform: translateY(-2px);
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@media (max-width: 768px) {
  .testimonials-page { padding: 20px; }
  .section-title { font-size: 2rem; }
  .testimonials-list { grid-template-columns: 1fr; }
}
</style>
