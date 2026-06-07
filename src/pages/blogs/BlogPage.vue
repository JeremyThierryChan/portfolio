<template>
  <section class="blog-page">
    <div class="content">
      <h2>{{ $t('blog.title') }}</h2>

      <!-- Filter -->
      <div class="filter-section">
        <button
          v-for="f in filters"
          :key="f.value"
          :class="['filter-btn', { active: selectedFilter === f.value }]"
          @click="selectedFilter = f.value"
        >
          {{ $t(f.labelKey) }}
        </button>
      </div>

      <!-- Card grid -->
      <div class="blog-grid">
        <div
          v-for="post in filteredPosts"
          :key="post.id"
          class="blog-card"
          @click="openModal(post)"
        >
          <span class="cat-dot" :class="'cat-' + post.category"></span>

          <div class="card-default">
            <p class="post-date">{{ post.date }}</p>
            <h3 class="post-title">{{ post.title }}</h3>
          </div>

          <div class="card-hover">
            <p class="hover-excerpt">{{ post.excerpt }}</p>
            <span class="hint">{{ $t('blog.clickToRead') }}</span>
          </div>
        </div>
      </div>

      <p class="wait-text">{{ $t('blog.waitMore') }}</p>
    </div>

    <!-- Modal -->
    <div class="modal-backdrop" v-if="selected" @click.self="closeModal">
      <div class="modal">
        <button class="modal-close" @click="closeModal">✕</button>

        <div class="modal-header">
          <span class="modal-cat" :class="'cat-' + selected.category">
            {{ $t('blog.cat.' + selected.category) }}
          </span>
          <h2>{{ selected.title }}</h2>
          <p class="modal-date">{{ selected.date }}</p>
        </div>

        <div class="modal-body">
          <p>{{ selected.content }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { posts } from './postsData.js';

export default {
  data() {
    return {
      posts,
      selectedFilter: 'all',
      selected: null,
      filters: [
        { labelKey: 'blog.filterAll',      value: 'all' },
        { labelKey: 'blog.filterTech',     value: 'tech' },
        { labelKey: 'blog.filterLanguage', value: 'language' },
        { labelKey: 'blog.filterCulture',  value: 'culture' },
        { labelKey: 'blog.filterLife',     value: 'life' },
      ],
    };
  },
  computed: {
    filteredPosts() {
      if (this.selectedFilter === 'all') return this.posts;
      return this.posts.filter(p => p.category === this.selectedFilter);
    },
  },
  methods: {
    openModal(post)  { this.selected = post; },
    closeModal()     { this.selected = null; },
    handleKey(e)     { if (e.key === 'Escape') this.closeModal(); },
  },
  mounted()       { window.addEventListener('keydown', this.handleKey); },
  beforeUnmount() { window.removeEventListener('keydown', this.handleKey); },
};
</script>

<style scoped>
.blog-page {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-gradient);
  color: var(--text-primary);
  font-family: 'Arial', sans-serif;
  padding: 40px;
  transition: background 0.3s ease, color 0.3s ease;
}

.content {
  width: 100%;
  max-width: 1100px;
}

h2 {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 30px;
  animation: fadeIn 1.5s ease-in-out;
}

/* Filter */
.filter-section {
  text-align: center;
  margin-bottom: 32px;
}

.filter-btn {
  padding: 6px 14px;
  font-size: 0.75rem;
  border-radius: 5px;
  background-color: var(--bg-filter);
  color: var(--text-primary);
  border: 1px solid var(--border-filter);
  cursor: pointer;
  margin: 4px;
  transition: background-color 0.2s ease;
}
.filter-btn:hover  { background-color: #ff6b6b; color: #fff; }
.filter-btn.active { background-color: #ff4747; color: #fff; }

/* Grid */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

/* Card */
.blog-card {
  position: relative;
  background: var(--bg-card);
  border-radius: 12px;
  padding: 18px 16px;
  min-height: 130px;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 4px 12px var(--shadow);
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.3s ease;
}

.blog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px var(--shadow);
}

/* Category dot */
.cat-dot {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.cat-tech     { background: #4a90d9; }
.cat-language { background: #27ae60; }
.cat-culture  { background: #f39c12; }
.cat-life     { background: #9b59b6; }

/* Default */
.post-date {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin: 0 0 8px;
}

.post-title {
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.4;
  margin: 0;
  padding-right: 16px;
  color: var(--text-primary);
}

/* Hover overlay */
.card-hover {
  position: absolute;
  inset: 0;
  background: rgba(74, 144, 217, 0.92);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.25s ease, transform 0.25s ease;
  pointer-events: none;
}

.blog-card:hover .card-hover {
  opacity: 1;
  transform: translateY(0);
}

.hover-excerpt {
  font-size: 0.78rem;
  line-height: 1.5;
  color: white;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hint {
  font-size: 0.68rem;
  color: rgba(255,255,255,0.8);
  text-align: center;
  margin-top: 8px;
}

.wait-text {
  font-size: 1rem;
  font-style: italic;
  text-align: center;
  color: var(--text-muted);
  margin-top: 10px;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}

.modal {
  background: var(--bg-nav);
  border-radius: 16px;
  max-width: 640px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  position: relative;
  animation: slideUp 0.25s ease;
}

.modal-close {
  position: absolute;
  top: 14px;
  right: 16px;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.1rem;
  cursor: pointer;
  transition: color 0.2s ease;
  z-index: 1;
}
.modal-close:hover { color: #ff4747; }

.modal-header {
  padding: 28px 28px 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-cat {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  color: white;
  display: inline-block;
  margin-bottom: 10px;
}
.modal-cat.cat-tech     { background: #4a90d9; }
.modal-cat.cat-language { background: #27ae60; }
.modal-cat.cat-culture  { background: #f39c12; }
.modal-cat.cat-life     { background: #9b59b6; }

.modal-header h2 {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--text-primary);
  text-align: left;
  animation: none;
}

.modal-date {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
}

.modal-body {
  padding: 24px 28px 32px;
}

.modal-body p {
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--text-primary);
  margin: 0;
}

@keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

@media (max-width: 768px) {
  .blog-page  { padding: 20px; }
  h2          { font-size: 2rem; }
  .blog-grid  { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
  .modal-header, .modal-body { padding-left: 20px; padding-right: 20px; }
}
</style>
