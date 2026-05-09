<template>
    <section class="skills">
      <div class="content">
        <h2>My Skills</h2>
  
        <!-- 筛选按钮 -->
        <div class="filter">
          <button v-for="filter in filters" 
                  :key="filter.value" 
                  :class="['filter-btn', { active: selectedFilter === filter.value }]"
                  @click="filterSkills(filter.value)">
            {{ filter.label }}
          </button>
        </div>
  
        <!-- 技能列表 - 网格展示 -->
        <div class="skills-grid">
          <div v-for="skill in filteredSkills" :key="skill.id" class="skill-card">
            <h3>{{ skill.name }}</h3>
            <p>{{ skill.description }}</p>
            <div class="skill-level">
              <div class="level-bar" :style="{ width: skill.level + '%' }"></div>
            </div>
          </div>
        </div>
  
      </div>
    </section>
  </template>
  
  <script>
  export default {
    data() {
      return {
        skills: [
          { id: 1, name: 'Vue.js', description: 'JavaScript framework for building user interfaces. Used to build this portfolio website and several SPA projects with multi-language support and dark mode.', level: 90, category: 'Programming Language' },
          { id: 2, name: 'JavaScript', description: 'Core language for dynamic and interactive web applications, used across frontend and backend projects.', level: 85, category: 'Programming Language' },
          { id: 3, name: 'CSS / HTML', description: 'Styling and markup for responsive, modern web interfaces. Comfortable with animations, grid, and flexbox layouts.', level: 80, category: 'Programming Language' },
          { id: 4, name: 'Node.js', description: 'Server-side JavaScript runtime for building backend services and APIs.', level: 70, category: 'Programming Language' },
          { id: 5, name: 'Python', description: 'Used for automation, data processing, AI model integration, and open-source project customisation (OpenClaw, Ollama, etc.).', level: 75, category: 'Programming Language' },
          { id: 6, name: 'C', description: 'General-purpose language widely used for system programming, embedded systems and low-level development.', level: 80, category: 'Programming Language' },
          { id: 7, name: 'C++', description: 'Extension of C with object-oriented capabilities, used for performance-critical applications.', level: 75, category: 'Programming Language' },
          { id: 8, name: 'Java', description: 'Used for server-side development and applications including Minecraft server setup and plugin management.', level: 65, category: 'Programming Language' },
          { id: 9, name: 'Matlab', description: 'High-level environment for numerical computing, data analysis, and algorithm development. Used during university coursework.', level: 70, category: 'Programming Language' },
          { id: 10, name: 'Microsoft Office / LibreOffice', description: 'Full proficiency across Word, Excel, PowerPoint, and their open-source equivalents.', level: 92, category: 'Other' },
          { id: 11, name: 'Docker', description: 'Container-based deployment for application isolation and reproducible environments.', level: 65, category: 'Other' },
          { id: 12, name: 'Git / GitHub', description: 'Version control and team collaboration. All projects maintained on GitHub with structured branching and commit history.', level: 85, category: 'Other' },
          { id: 13, name: 'NAS & Home Server Setup', description: 'Built and maintained internal NAS systems using OpenMediaVault. Experience with Fedora, Ubuntu, Debian, and Kali Linux.', level: 70, category: 'Other' },
          { id: 14, name: 'AI Integration (Ollama / OpenClaw)', description: 'Secondary development and application of open-source AI models. Planning to train specialised models for Chinese and French language teaching.', level: 68, category: 'Other' },
          { id: 15, name: 'English', description: 'Native-level proficiency. IELTS 8.0 (expired). Gaokao 135/150. University English 91/100. Simultaneous and consecutive interpretation experience across high-profile events.', level: 97, category: 'Language' },
          { id: 16, name: 'Mandarin Chinese', description: 'Native language. Also speaks Wenzhou dialect, Shanghai dialect, Sichuan dialect, and Shandong dialect.', level: 99, category: 'Language' },
          { id: 17, name: 'French', description: 'Self-taught. Conversational proficiency. Served as French interpreter at IRONMAN China Wenzhou (2023) and Great Wall Cigars Cameroon Formula tasting event (2024). ETIC Advanced: Pass.', level: 68, category: 'Language' },
          { id: 18, name: 'German', description: 'Self-taught. Working proficiency. Served as German interpreter at the Porsche new Panamera launch (2024). Hosted German exchange students from Martin Luther Gymnasium, Eisenach (2018).', level: 62, category: 'Language' },
          { id: 19, name: 'Spanish', description: 'Currently learning. Beginner level.', level: 20, category: 'Language' },
          { id: 20, name: 'Italian', description: 'Currently learning. Beginner level.', level: 15, category: 'Language' },
          { id: 21, name: 'Arabic', description: 'Currently learning. Beginner level.', level: 10, category: 'Language' },
        ],
        selectedFilter: 'all',
        filteredSkills: [],
        filters: [
          { label: 'All', value: 'all' },
          { label: 'Programming', value: 'Programming Language' },
          { label: 'Language', value: 'Language' },
          { label: 'Other', value: 'Other' }
        ]
      };
    },
    methods: {
      filterSkills(filterValue) {
        this.selectedFilter = filterValue;
        
        if (filterValue === 'Programming Language') {
          // 筛选编程语言
          this.filteredSkills = this.skills.filter(skill => skill.category === 'Programming Language');
        } else if (filterValue === 'Language') {
          // 筛选语言
          this.filteredSkills = this.skills.filter(skill => skill.category === 'Language');
        } else if (filterValue === 'Other') {
          // 筛选其他技能
          this.filteredSkills = this.skills.filter(skill => skill.category === 'Other');
        } else {
          // 如果选择了所有技能，显示所有技能
          this.filteredSkills = this.skills;
        }
      }
    },
    created() {
      this.filteredSkills = this.skills;  // 初始化时显示所有技能
    }
  };
  </script>
  
  <style scoped>
  .skills {
    display: flex;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #2b2b2b, #3c3c3c);
    color: white;
    font-family: 'Arial', sans-serif;
    padding: 40px;
  }
  
  .content {
    width: 100%;
    max-width: 1000px;
  }
  
  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 30px;
    text-align: center;
    animation: fadeIn 1.5s ease-in-out;
  }
  
  .filter {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .filter-btn {
    padding: 6px 10px;
    font-size: 0.8rem;
    border-radius: 5px;
    background-color: #444;
    color: white;
    border: 1px solid #666;
    cursor: pointer;
    margin: 10px;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  .filter-btn:hover {
    background-color: #ff6b6b;
  }
  
  .filter-btn.active {
    background-color: #ff4747;
  }
  
  /* 网格布局 */
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* 根据屏幕宽度自动调整列数 */
    gap: 20px;
  }
  
  .skill-card {
    background: rgba(0, 0, 0, 0.7);
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
    transform: translateY(20px);
    animation: slideUp 1s ease-out forwards;
  }
  
  .skill-card h3 {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  .skill-card p {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 10px;
  }
  
  .skill-level {
    width: 100%;
    background-color: #444;
    border-radius: 25px;
    height: 10px;
    margin-top: 10px;
  }
  
  .level-bar {
    height: 100%;
    background-color: #ff6b6b;
    border-radius: 25px;
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    .skills {
      padding: 20px;
    }
  
    h2 {
      font-size: 2rem;
    }
  
    .skill-card {
      padding: 15px;
    }
  }
  </style>