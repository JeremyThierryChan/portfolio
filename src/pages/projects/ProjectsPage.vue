<template>
  <section class="page">
    <div class="content">
      <h2>My Projects</h2>

      <div class="page-introduction">
          <h3>A Collection of My Work</h3>
          <p>Welcome to my Projects page! 
            Here, you’ll find a curated collection of the work I’ve done across various fields, 
            ranging from software development to creative design, 
            and technology to entrepreneurship. 
            Each project reflects my passion for innovation, creativity, and solving real-world problems. 
            I am always eager to take on new challenges and contribute to impactful projects.
          </p>
      </div>

      <!-- 筛选按钮 -->
      <div class="filter-section">
        <button v-for="filter in filters" 
                :key="filter.value" 
                :class="['filter-btn', { active: selectedFilter === filter.value }]"
                @click="filterProjects(filter.value)">
          {{ filter.label }}
        </button>
      </div>

      <!-- 项目列表 -->
      <div v-for="project in filteredProjects" :key="project.id" class="card">
        <h3>{{ project.title }}</h3>
        <p>{{ project.description }}</p>
        
        <!-- 添加cofounder的内容，只有当cofounder字段不为空时才显示 -->
        <p v-if="project.cofounder && project.cofounder.trim() !== ''" class="cofounder">
          <strong>Cofounder:</strong> {{ project.cofounder }}
        </p>

        <p><strong>Tech Stack:</strong> {{ project.tech }}</p>

        <!-- 根据 displayType 动态展示不同内容 -->
        <div v-if="project.displayType === 'detailed'" class="detailed-view">
          <div class="progress-container">
            <progress :value="project.progress" max="100" class="progress-bar"></progress>
            <span class="progress-text">{{ project.progress }}%</span>
          </div>
          <div class="stages">
            <h4>Project Stages</h4>
            <ul>
              <li v-for="stage in project.stages" :key="stage.name">
                <div class="stage-title">
                  <strong>{{ stage.name }}</strong>
                  <span :class="{'completed': stage.completed}">{{ stage.completed ? 'Completed' : 'In Progress' }}</span>
                </div>
                <p>{{ stage.description }}</p>
              </li>
            </ul>
          </div>
        </div>

        <div v-if="project.displayType === 'simple'" class="simple-view">
          <!-- 简洁版展示，仅展示项目标题和技术栈 -->
        </div>

        <!-- 链接按钮 -->
        <a :href="project.link" class="card-btn" target="_blank" rel="noopener noreferrer">View Project</a>
      </div>
      
      <!-- 敬请期待的文字 -->
      <p class="wait-text">Please wait for more...</p>
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
        { label: 'All', value: 'all' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Completed', value: 'Completed' },
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
