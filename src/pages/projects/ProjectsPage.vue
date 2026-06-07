<template>
  <section class="projects-page">
    <div class="content">
      <h2>{{ $t('projects.title') }}</h2>

      <!-- Filter -->
      <div class="filter-section">
        <button
          v-for="filter in filters"
          :key="filter.value"
          :class="['filter-btn', { active: selectedFilter === filter.value }]"
          @click="filterProjects(filter.value)"
        >
          {{ $t(filter.labelKey) }}
        </button>
      </div>

      <!-- Small card grid -->
      <div class="projects-grid">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="project-card"
          @click="openModal(project)"
        >
          <!-- Status dot -->
          <span class="status-dot" :class="statusClass(project.status)"></span>

          <!-- Default content -->
          <div class="card-default">
            <h3 class="card-title">{{ project.title }}</h3>
            <div class="tech-tags">
              <span v-for="t in techList(project.tech)" :key="t" class="tag">{{ t }}</span>
            </div>
          </div>

          <!-- Hover overlay -->
          <div class="card-hover">
            <p class="hover-desc">{{ project.description }}</p>
            <div class="hover-progress" v-if="project.progress !== undefined">
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: project.progress + '%' }"></div>
              </div>
              <span class="progress-num">{{ project.progress }}%</span>
            </div>
            <span class="hint">{{ $t('projects.clickForMore') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal-backdrop" v-if="selected" @click.self="closeModal">
      <div class="modal">
        <button class="modal-close" @click="closeModal">✕</button>

        <div class="modal-header">
          <span class="modal-status" :class="statusClass(selected.status)">
            {{ $t('projects.status.' + selected.status.replace(' ', '')) }}
          </span>
          <h2>{{ selected.title }}</h2>
          <p class="modal-tech">{{ selected.tech }}</p>
        </div>

        <div class="modal-body">
          <p class="modal-desc">{{ selected.description }}</p>

          <p v-if="selected.cofounder && selected.cofounder.trim()">
            <strong>{{ $t('projects.cofounder') }}:</strong> {{ selected.cofounder }}
          </p>

          <!-- Progress -->
          <div class="modal-progress">
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: selected.progress + '%' }"></div>
            </div>
            <span class="progress-num">{{ selected.progress }}%</span>
          </div>

          <!-- Stages -->
          <div v-if="selected.displayType === 'detailed' && selected.stages" class="modal-stages">
            <h4>{{ $t('projects.stages') }}</h4>
            <ul>
              <li v-for="stage in selected.stages" :key="stage.name" :class="{ done: stage.completed }">
                <span class="stage-check">{{ stage.completed ? '✓' : '○' }}</span>
                <div>
                  <strong>{{ stage.name }}</strong>
                  <p>{{ stage.description }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="modal-footer">
          <a v-if="selected.link" :href="selected.link" class="btn-primary" target="_blank" rel="noopener noreferrer">
            {{ $t('projects.viewProject') }}
          </a>
          <span v-else class="btn-disabled">{{ $t('projects.comingSoon') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { projects } from './projectsData.js';

export default {
  data() {
    return {
      projects,
      selectedFilter: 'all',
      filteredProjects: projects,
      selected: null,
      filters: [
        { labelKey: 'projects.filterAll',       value: 'all' },
        { labelKey: 'projects.filterProgress',  value: 'In Progress' },
        { labelKey: 'projects.filterPaused',    value: 'Paused' },
        { labelKey: 'projects.filterCompleted', value: 'Completed' },
      ],
    };
  },
  methods: {
    filterProjects(value) {
      this.selectedFilter = value;
      this.filteredProjects = value === 'all'
        ? this.projects
        : this.projects.filter(p => p.status === value);
    },
    openModal(project)  { this.selected = project; },
    closeModal()        { this.selected = null; },
    handleKey(e)        { if (e.key === 'Escape') this.closeModal(); },
    statusClass(status) {
      return {
        'status-progress':  status === 'In Progress',
        'status-paused':    status === 'Paused',
        'status-completed': status === 'Completed',
      };
    },
    techList(tech) {
      return tech.split(',').map(t => t.trim()).slice(0, 3);
    },
  },
  mounted()      { window.addEventListener('keydown', this.handleKey); },
  beforeUnmount(){ window.removeEventListener('keydown', this.handleKey); },
};
</script>

<style scoped>
.projects-page {
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

/* ── Filter ─────────────────────────────── */
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

/* ── Card grid ──────────────────────────── */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.project-card {
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

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px var(--shadow);
}

/* Status dot */
.status-dot {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.status-progress  { background: #ff6b6b; }
.status-paused    { background: #f39c12; }
.status-completed { background: #4caf50; }

/* Default card content */
.card-default {
  transition: opacity 0.25s ease;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 10px;
  padding-right: 16px;
  color: var(--text-primary);
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  font-size: 0.65rem;
  background: var(--bg-filter);
  color: var(--text-muted);
  padding: 2px 7px;
  border-radius: 4px;
  border: 1px solid var(--border-filter);
  white-space: nowrap;
}

/* Hover overlay */
.card-hover {
  position: absolute;
  inset: 0;
  background: rgba(255, 107, 107, 0.92);
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

.project-card:hover .card-hover {
  opacity: 1;
  transform: translateY(0);
}

.hover-desc {
  font-size: 0.78rem;
  line-height: 1.5;
  color: white;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hover-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.progress-track {
  flex: 1;
  height: 4px;
  background: rgba(255,255,255,0.3);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: white;
  border-radius: 2px;
}

.progress-num {
  font-size: 0.7rem;
  color: white;
  font-weight: 700;
  white-space: nowrap;
}

.hint {
  font-size: 0.68rem;
  color: rgba(255,255,255,0.8);
  text-align: center;
  margin-top: 6px;
}

/* ── Modal ──────────────────────────────── */
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
  max-width: 600px;
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

.modal-status {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  color: white;
  display: inline-block;
  margin-bottom: 10px;
  letter-spacing: 0.3px;
}
.modal-status.status-progress  { background: #ff6b6b; }
.modal-status.status-paused    { background: #f39c12; }
.modal-status.status-completed { background: #4caf50; }

.modal-header h2 {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--text-primary);
  text-align: left;
  animation: none;
}

.modal-tech {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
}

.modal-body {
  padding: 20px 28px;
}

.modal-desc {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.modal-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.modal-progress .progress-track {
  flex: 1;
  height: 6px;
  background: var(--skill-bg);
  border-radius: 3px;
}

.modal-progress .progress-fill {
  height: 100%;
  background: #ff6b6b;
  border-radius: 3px;
}

.modal-progress .progress-num {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 700;
  white-space: nowrap;
}

.modal-stages h4 {
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.modal-stages ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.modal-stages li {
  display: flex;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
  opacity: 0.5;
}

.modal-stages li.done { opacity: 1; }

.stage-check {
  font-size: 0.9rem;
  color: #4caf50;
  flex-shrink: 0;
  width: 16px;
}

.modal-stages li strong {
  font-size: 0.85rem;
  color: var(--text-primary);
  display: block;
}

.modal-stages li p {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin: 3px 0 0;
}

.modal-footer {
  padding: 16px 28px 24px;
}

.btn-primary {
  display: inline-block;
  background-color: #ff6b6b;
  color: white;
  padding: 10px 24px;
  border-radius: 25px;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background-color 0.2s ease, transform 0.2s ease;
}
.btn-primary:hover {
  background-color: #ff4747;
  transform: translateY(-2px);
}

.btn-disabled {
  display: inline-block;
  background: var(--bg-filter);
  color: var(--text-muted);
  padding: 10px 24px;
  border-radius: 25px;
  font-size: 0.9rem;
  border: 1px solid var(--border-filter);
}

@keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

@media (max-width: 768px) {
  .projects-page { padding: 20px; }
  h2 { font-size: 2rem; }
  .projects-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
  .modal { max-height: 90vh; }
  .modal-header, .modal-body, .modal-footer { padding-left: 20px; padding-right: 20px; }
}
</style>
