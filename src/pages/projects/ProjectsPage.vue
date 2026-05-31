<template>
  <section class="page">
    <div class="content">
      <h2>{{ $t('projects.title') }}</h2>

      <div class="page-introduction">
        <h3>{{ $t('projects.subtitle') }}</h3>
        <p>{{ $t('projects.intro') }}</p>
      </div>

      <!-- 筛选按钮 -->
      <div class="filter-section">
        <button v-for="filter in filters"
                :key="filter.value"
                :class="['filter-btn', { active: selectedFilter === filter.value }]"
                @click="filterProjects(filter.value)">
          {{ $t(filter.labelKey) }}
        </button>
      </div>

      <!-- 项目列表 -->
      <div v-for="project in filteredProjects" :key="project.id" class="card">
        <h3>{{ project.title }}</h3>
        <p>{{ project.description }}</p>
        
        <p v-if="project.cofounder && project.cofounder.trim() !== ''" class="cofounder">
          <strong>{{ $t('projects.cofounder') }}:</strong> {{ project.cofounder }}
        </p>

        <p><strong>{{ $t('projects.techStack') }}:</strong> {{ project.tech }}</p>

        <div v-if="project.displayType === 'detailed'" class="detailed-view">
          <div class="progress-container">
            <progress :value="project.progress" max="100" class="progress-bar"></progress>
            <span class="progress-text">{{ project.progress }}%</span>
          </div>
          <div class="stages">
            <h4>{{ $t('projects.stages') }}</h4>
            <ul>
              <li v-for="stage in project.stages" :key="stage.name">
                <div class="stage-title">
                  <strong>{{ stage.name }}</strong>
                  <span :class="{'completed': stage.completed}">
                    {{ stage.completed ? $t('projects.stageCompleted') : $t('projects.stageInProgress') }}
                  </span>
                </div>
                <p>{{ stage.description }}</p>
              </li>
            </ul>
          </div>
        </div>

        <a v-if="project.link" :href="project.link" class="card-btn" target="_blank" rel="noopener noreferrer">
          {{ $t('projects.viewProject') }}
        </a>
      </div>

      <p class="wait-text">{{ $t('projects.waitMore') }}</p>
    </div>
  </section>
</template>

<script>
// 导入外部的项目数据
import { projects } from './projectsData.js';

export default {
  data() {
    return {
      projects,  // 将数据赋值给本地的 data
      selectedFilter: 'all',  // 默认筛选所有项目
      filteredProjects: projects,  // 默认展示所有项目
      filters: [
        { labelKey: 'projects.filterAll',      value: 'all' },
        { labelKey: 'projects.filterProgress', value: 'In Progress' },
        { labelKey: 'projects.filterPaused',   value: 'Paused' },
        { labelKey: 'projects.filterCompleted',value: 'Completed' },
      ]
    };
  },
  methods: {
    filterProjects(filterValue) {
      this.selectedFilter = filterValue;
      if (filterValue === 'all') {
        this.filteredProjects = this.projects;
      } else {
        this.filteredProjects = this.projects.filter(p => p.status === filterValue);
      }
    }
  },
};
</script>

<style scoped>
@import '@/css/public.css';
</style>
