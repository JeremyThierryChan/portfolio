<template>
  <div class="testimonials-page">
    <!-- 页面头部 -->
    <section class="header-section">
      <h1 class="section-title">What People Say About Me</h1>
      <p class="section-description">Your feedback means the world to me. Here's what others have said!</p>
    </section>

    <!-- 推荐列表 -->
    <section class="testimonials-list">
      <div v-for="testimonial in testimonials" :key="testimonial.id" class="testimonial-card">
        <!-- 卡片内容部分 -->
        <div class="testimonial-header">
          <img :src="testimonial.avatar" alt="Avatar" class="avatar">
          <div class="testimonial-info">
            <h3>{{ testimonial.name }}</h3>
            <p class="role">{{ testimonial.role }}</p>
            <p class="date">{{ testimonial.date }}</p>
          </div>
        </div>
        <p class="testimonial-text">"{{ testimonial.text }}"</p>

        <!-- 只在 Read More 按钮点击时跳转 -->
        <router-link :to="{ name: 'testimonialDetail', params: { id: testimonial.id } }" class="read-more-btn">Read More</router-link>
      </div>
    </section>

    <!-- 提交评价按钮 -->
    <section class="cta-section">
      <p>Would you like to share your thoughts? <router-link to="/contact" class="cta-link">Contact me</router-link>!</p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'TestimonialsPage',
  data() {
    return {
      testimonials: [
        {
          id: 1,
          name: 'John Doe',
          role: 'Software Engineer at XYZ Company',
          date: '2023-12-15',
          text: 'An incredibly talented developer, always delivering high-quality work on time.',
          avatar: 'path_to_avatar_1.jpg'
        },
        {
          id: 2,
          name: 'Jane Smith',
          role: 'Project Manager at ABC Corp',
          date: '2023-11-25',
          text: 'A true team player with excellent problem-solving skills. Highly recommended.',
          avatar: 'path_to_avatar_2.jpg'
        },
        // 其他推荐数据...
      ]
    };
  }
};
</script>

<style scoped>
/* 页面整体样式 */
.testimonials-page {
  background: linear-gradient(135deg, #2b2b2b, #3c3c3c);
  color: white;
  height: 100vh;
  text-align: center;
  font-family: 'Arial', sans-serif;
  padding: 20px;
}

/* 页面标题样式 */
.section-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: 2px;
  animation: fadeIn 1.5s ease-in-out;
}

/* 段落样式，描述和正文内容 */
.section-description {
  font-size: 1.3rem;
  line-height: 1.8;
  margin-bottom: 20px;
}

/* 推荐列表样式 */
.testimonials-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

/* 推荐卡片样式 */
.testimonial-card {
  background-color: rgba(0, 0, 0, 0.6);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  transform: translateY(20px);
  animation: slideUp 1s ease-out forwards;
}

/* 推荐卡片头部样式 */
.testimonial-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

/* 头像样式 */
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
}

/* 推荐人信息样式 */
.testimonial-info h3 {
  font-size: 18px;
  color: white;
  margin: 0;
}

.testimonial-info .role {
  font-size: 14px;
  color: #777;
}

.testimonial-info .date {
  font-size: 12px;
  color: #aaa;
}

/* 推荐文本样式 */
.testimonial-text {
  font-style: italic;
  color: white;
  font-size: 16px;
}

/* Read More 按钮样式 */
.read-more-btn {
  display: inline-block;
  margin-top: 15px;
  padding: 8px 20px;
  background-color: #ff6b6b;
  color: white;
  font-size: 1rem;
  border-radius: 25px;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.3s ease; ;
}

.read-more-btn:hover {
  background-color: #ff4747;
  transform: translateY(-3px); /* 鼠标悬停时，按钮上移 3px */
}

/* 呼吁文本样式 */
.cta-section {
  font-style: italic;
  margin-top: 40px;
}

.cta-section p {
  font-size: 18px;
}

/* 超链接样式 */
.cta-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.cta-link:hover {
  color: #ffb86c;
}

/* slideUp 动画：元素从下方滑入 */
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

/* fadeIn 动画：元素渐变显示 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 屏幕宽度小于768px时的响应式调整 */
@media (max-width: 768px) {
  .testimonials-page {
    padding: 20px;
  }

  .section-title {
    font-size: 2.5rem;
  }

  .section-description {
    font-size: 1rem;
  }
}
</style>