<template>
  <section class="gallery-page">
    <div class="content">
      <h2>{{ $t('gallery.title') }}</h2>
      <p class="gallery-subtitle">{{ $t('gallery.subtitle') }}</p>

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

      <!-- Grid -->
      <div class="gallery-grid">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="gallery-item"
          @click="openModal(item)"
        >
          <img :src="item.image" :alt="item.title" loading="lazy" />
          <div class="overlay">
            <p class="item-title">{{ item.title }}</p>
            <p class="item-meta">{{ item.location }} · {{ item.year }}</p>
          </div>
        </div>
      </div>

      <p v-if="filteredItems.length === 0" class="wait-text">{{ $t('gallery.empty') }}</p>
    </div>

    <!-- Modal -->
    <div class="modal-backdrop" v-if="selected" @click.self="closeModal">
      <div class="modal">
        <button class="modal-close" @click="closeModal">✕</button>
        <img :src="selected.image" :alt="selected.title" />
        <div class="modal-body">
          <h3>{{ selected.title }}</h3>
          <p class="modal-meta">{{ selected.location }} · {{ selected.year }}</p>
          <p class="modal-desc">{{ selected.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { galleryItems } from './galleryData.js';

export default {
  name: 'GalleryPage',
  data() {
    return {
      galleryItems,
      selectedFilter: 'all',
      selected: null,
      filters: [
        { labelKey: 'gallery.filterAll',       value: 'all' },
        { labelKey: 'gallery.filterEvents',    value: 'events' },
        { labelKey: 'gallery.filterSports',    value: 'sports' },
        { labelKey: 'gallery.filterVolunteer', value: 'volunteer' },
        { labelKey: 'gallery.filterCampus',    value: 'campus' },
        { labelKey: 'gallery.filterTravel',    value: 'travel' },
      ],
    };
  },
  computed: {
    filteredItems() {
      if (this.selectedFilter === 'all') return this.galleryItems;
      return this.galleryItems.filter(i => i.category === this.selectedFilter);
    },
  },
  methods: {
    openModal(item) { this.selected = item; },
    closeModal()    { this.selected = null; },
  },
  mounted() {
    window.addEventListener('keydown', this.handleKey);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKey);
  },
  methods: {
    openModal(item) { this.selected = item; },
    closeModal()    { this.selected = null; },
    handleKey(e)    { if (e.key === 'Escape') this.closeModal(); },
  },
};
</script>

<style scoped>
.gallery-page {
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
  margin-bottom: 10px;
  animation: fadeIn 1.5s ease-in-out;
}

.gallery-subtitle {
  text-align: center;
  color: var(--text-muted);
  margin-bottom: 30px;
  font-size: 1.05rem;
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
  margin: 5px;
  transition: background-color 0.2s ease;
}

.filter-btn:hover  { background-color: #ff6b6b; color: #fff; }
.filter-btn.active { background-color: #ff4747; color: #fff; }

/* Grid */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.gallery-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 3 / 2;
  background: var(--bg-card);
  box-shadow: 0 4px 12px var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.gallery-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px var(--shadow);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.75));
  padding: 20px 14px 14px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.gallery-item:hover .overlay {
  transform: translateY(0);
}

.item-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  margin: 0 0 4px;
}

.item-meta {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.75);
  margin: 0;
}

.wait-text {
  text-align: center;
  color: var(--text-muted);
  font-style: italic;
  margin-top: 40px;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
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
  max-width: 720px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  position: relative;
}

.modal img {
  width: 100%;
  max-height: 420px;
  object-fit: cover;
  display: block;
}

.modal-body {
  padding: 20px 24px 24px;
}

.modal-body h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 6px;
  color: var(--text-primary);
}

.modal-meta {
  font-size: 0.85rem;
  color: #ff6b6b;
  margin: 0 0 10px;
}

.modal-desc {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-muted);
  margin: 0;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 14px;
  background: rgba(0,0,0,0.5);
  border: none;
  color: white;
  font-size: 1rem;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.modal-close:hover { background: #ff4747; }

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@media (max-width: 768px) {
  .gallery-page { padding: 20px; }
  h2 { font-size: 2rem; }
  .gallery-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
  .overlay { transform: translateY(0); }
}
</style>
