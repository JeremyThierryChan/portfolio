<template>
  <section class="page">
    <div class="content">
      <div class="page-introduction">
        <h3>Welcome To My Website</h3>
        <p>Glad you're here. This is where you can find everything about me — my journey, skills, and work.</p>
        <p>Still a work in progress, but aren't we all.</p>
      </div>

      <div class="card">
        <h3>About Me</h3>
        <p>Who I am, what I've done, and how I think. My background, journey, and the tools I use — all in one place.</p>
        <router-link to="/about" class="card-btn">Explore More</router-link>
      </div>

      <div class="card">
        <h3>Projects</h3>
        <p>A collection of the things I've built — from software tools and systems to brands and side ventures.</p>
        <router-link to="/projects" class="card-btn">Explore More</router-link>
      </div>

      <div class="card">
        <h3>Blog</h3>
        <p>Thoughts on technology, languages, culture, and whatever else is on my mind. Updated occasionally.</p>
        <router-link to="/blog" class="card-btn">Explore More</router-link>
      </div>

      <div class="card">
        <h3>Contact</h3>
        <p>Want to work together or just say hello? Find all my contact details and social media links here.</p>
        <router-link to="/contact" class="card-btn">Get in Touch</router-link>
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

.page-introduction {
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  transform: translateY(20px);
  animation: slideUp 1s ease-out forwards;
}

.page-introduction h3 {
  font-size: 3rem;
  font-weight: 600;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
}

.card {
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  transform: translateY(20px);
  animation: slideUp 1s ease-out forwards;
}

.card h3 {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.card-btn {
  display: inline-block;
  background-color: #ff6b6b;
  color: white;
  padding: 12px 25px;
  font-size: 1.1rem;
  border-radius: 25px;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.card-btn:hover {
  background-color: #ff4747;
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  .page-introduction h3 {
    font-size: 2rem;
  }
}
</style>
