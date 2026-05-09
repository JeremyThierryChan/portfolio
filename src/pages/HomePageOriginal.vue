<template>
  <!-- 页面主要内容区域 -->
  <section class="page-section">
    <div class="section-content">
      <h1 class="section-title">Welcome to My Site</h1> <!-- 页面标题 -->
      <p class="section-description">I am Jeremy Thierry Chan, a devoted tech advocate, passionate life enthusiast and polyglot.</p> <!-- 个人介绍 -->
      <p class="section-cta">
        Explore my <a href="/projects" class="cta-link">projects</a> and get to know more <a href="/about" class="cta-link">about me</a>!
      </p> <!-- 呼吁用户探索我的项目，点击进入 -->
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomePage', // 组件名称
};
</script>

<style scoped>
/* 页面整体样式 */
.page-section {
  display: flex; /* 使用 flexbox 布局 */
  flex-direction: column; /* 垂直排列子元素 */
  align-items: center; /* 水平居中对齐子元素 */
  justify-content: center; /* 垂直居中对齐子元素 */
  height: 100vh; /* 高度占满整个视口 */
  background: linear-gradient(135deg, #2b2b2b, #3c3c3c); /* 设置渐变背景色，135度斜向 */
  color: white; /* 设置文本颜色为白色 */
  text-align: center; /* 设置文本居中对齐 */
  font-family: 'Arial', sans-serif; /* 设置字体为 Arial */
  background-size: cover; /* 背景覆盖整个容器，不拉伸 */
}

/* 页面内容区域样式 */
.section-content {
  max-width: 600px; /* 设置最大宽度为600px */
  padding: 30px; /* 内边距 30px */
  background: rgba(0, 0, 0, 0.6); /* 半透明黑色背景，提高对比度 */
  border-radius: 15px; /* 设置圆角，圆角半径为15px */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5); /* 设置阴影效果，带有深度感 */
  transform: translateY(20px); /* 初始时向下偏移20px */
  animation: slideUp 1s ease-out forwards; /* 应用 slideUp 动画，持续1秒，缓动效果 */
}

/* 页面标题样式 */
.section-title {
  font-size: 3rem; /* 设置字体大小为3rem */
  font-weight: 700; /* 设置字体加粗 */
  margin-bottom: 20px; /* 底部外边距为20px */
  letter-spacing: 2px; /* 设置字母间距为2px */
  animation: fadeIn 1.5s ease-in-out; /* 应用 fadeIn 动画，持续1.5秒，渐显效果 */
}

/* 段落样式，描述和正文内容 */
.section-description {
  font-size: 1.3rem; /* 设置段落文本的字体大小为1.3rem */
  line-height: 1.8; /* 设置行高为1.8，改善行间距 */
  margin-bottom: 20px; /* 设置底部外边距为20px */
}

/* 呼吁文本样式 */
.section-cta {
  font-style: italic; /* 设置斜体样式 */
  font-size: 1.2rem; /* 设置字体大小为1.2rem */
}

/* 超链接样式 */
.cta-link {
  color: white; /* 设置超链接颜色为红色 */
  text-decoration: none; /* 去除下划线 */
  font-weight: bold; /* 设置字体加粗 */
  transition: color 0.3s ease; /* 颜色的过渡效果 */
}

.cta-link:hover {
  color: #ffb86c; /* 悬停时变为亮红色 */
}

/* slideUp 动画：元素从下方滑入 */
@keyframes slideUp {
  from {
    transform: translateY(50px); /* 动画开始时，元素向下偏移50px */
    opacity: 0; /* 动画开始时透明度为0 */
  }
  to {
    transform: translateY(0); /* 动画结束时，元素恢复到原始位置 */
    opacity: 1; /* 动画结束时透明度为1 */
  }
}

/* fadeIn 动画：元素渐变显示 */
@keyframes fadeIn {
  from {
    opacity: 0; /* 动画开始时透明度为0 */
  }
  to {
    opacity: 1; /* 动画结束时透明度为1 */
  }
}

/* 屏幕宽度小于768px时的响应式调整 */
@media (max-width: 768px) {
  .page-section {
    padding: 20px; /* 在屏幕宽度小于768px时，调整内边距为20px */
  }

  .section-title {
    font-size: 2.5rem; /* 在小屏幕上调整标题字体大小为2.5rem */
  }

  .section-description {
    font-size: 1rem; /* 在小屏幕上调整段落字体大小为1rem */
  }
}
</style>