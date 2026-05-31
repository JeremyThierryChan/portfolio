<template>
  <section class="timeline">
    <div class="content">
      <h2>{{ $t('timeline.title') }}</h2>
      <div v-for="(event, index) in events" :key="index" :class="['timeline-item', event.type]" :style="event.style">
        <div class="timeline-date">
          <p>{{ event.date }}</p>
        </div>
        <div class="timeline-content">
          <h3>{{ event.title }}</h3>
          <p>{{ event.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
  
<script>
// 导入外部事件数据
import { events } from './eventsData.js';

export default {
  data() {
    return {
      events, // 使用导入的事件数据
    };
  },
};
</script>
  
<style scoped>
.timeline {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: var(--bg-gradient);
  color: var(--text-primary);
  font-family: 'Arial', sans-serif;
  padding: 40px;
  transition: background 0.3s ease, color 0.3s ease;
}

.content {
  width: 100%; /* 容器宽度为 100% */
  max-width: 1000px; /* 最大宽度为 1000px */
}

h2 {
  font-size: 2.5rem; /* 设置标题字体大小为 2.5rem */
  font-weight: 700; /* 设置字体加粗 */
  margin-bottom: 30px; /* 底部外边距 30px */
  text-align: center; /* 文本居中对齐 */
  animation: fadeIn 1.5s ease-in-out; /* 动画效果 */
}

.timeline-item {
  display: flex;
  flex-direction: row; /* 保持水平排列 */
  justify-content: flex-start; /* 左对齐所有项目 */
  align-items: center; /* 垂直居中 */
  margin-bottom: 30px;
  opacity: 0;
  animation: slideUp 1s ease-out forwards;
  width: 100%; /* 使时间轴项占满宽度 */
}

.timeline-item.personal {
  flex-direction: row; /* 个人事件按正常顺序显示 */
}

.timeline-item.career {
  flex-direction: row; /* 职业事件按正常顺序显示 */
}

.timeline-content {
  background: var(--bg-card);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 20px var(--shadow);
  width: 70%;
  max-width: 800px;
  transition: background 0.3s ease;
}

.timeline-date {
  font-size: 1.2rem;
  color: #ff6b6b;
  font-weight: bold;
  width: 100px;
  text-align: left;
  margin-right: 20px; /* 在日期和内容之间添加间距 */
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
  .timeline {
    padding: 20px;
  }

  h2 {
    font-size: 2rem;
  }

  .timeline-item {
    flex-direction: column; /* 小屏时垂直排列 */
  }

  .timeline-content {
    width: 100%;
  }

  .timeline-date {
    margin-top: 10px;
    text-align: center;
  }
}
</style>