<template>
  <div class="testimonial-detail">
    <!-- 页面标题和基本信息 -->
    <section class="testimonial-header">
      <h1>{{ testimonial.name }}</h1>
      <p class="role">{{ testimonial.role }}</p>
      <p class="date">{{ testimonial.date }}</p>
    </section>

    <!-- 头像和推荐内容 -->
    <section class="testimonial-body">
      <img :src="testimonial.avatar" alt="Avatar" class="avatar" />
      <p>{{ testimonial.text }}</p>
    </section>

    <!-- 返回按钮 -->
    <div class="back-button">
      <router-link to="/about/testimonial" class="button">Go Back to Testimonial List</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestimonialDetail',
  props: ['id'],
  data() {
    return {
      testimonial: {},
    };
  },
  created() {
    this.loadTestimonial();
  },
  methods: {
    loadTestimonial() {
      // 假设这里是从 API 或本地数据加载推荐的详细信息
      const testimonials = [
        {
          id: 1,
          name: 'John Doe',
          role: 'Software Engineer at XYZ Company',
          date: '2023-12-15',
          text: 'An incredibly talented developer, always delivering high-quality work on time.',
          avatar: 'path_to_avatar_1.jpg',
        },
        {
          id: 2,
          name: 'Jane Smith',
          role: 'Project Manager at ABC Corp',
          date: '2023-11-25',
          text: 'A true team player with excellent problem-solving skills. Highly recommended.',
          avatar: 'path_to_avatar_2.jpg',
        },
        // 更多推荐数据...
      ];

      // 根据动态参数 id 查找对应的 testimonial
      this.testimonial = testimonials.find(item => item.id == this.id);
    },
  },
};
</script>

<style scoped>
.testimonial-detail {
  display: flex; /* 使用 flexbox 布局 */
  flex-direction: column; /* 垂直排列子元素 */
  align-items: center; /* 水平居中对齐子元素 */
  justify-content: top; /* 垂直居中对齐子元素 */
  height: 100vh; /* 高度占满整个视口 */
  background: linear-gradient(135deg, #2b2b2b, #3c3c3c); /* 设置渐变背景色，135度斜向 */
  color: white; /* 设置文本颜色为白色 */
  text-align: center; /* 设置文本居中对齐 */
  font-family: 'Arial', sans-serif; /* 设置字体为 Arial */
  background-size: cover; /* 背景覆盖整个容器，不拉伸 */
}

.testimonial-header {
  text-align: center;
  margin-bottom: 30px;
}

.testimonial-header h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.testimonial-header .role {
  font-size: 1.2rem;
  color: #777;
  margin-bottom: 5px;
}

.testimonial-header .date {
  font-size: 1rem;
  color: #aaa;
}

.testimonial-body {
  text-align: center;
  margin-bottom: 30px;
}

.testimonial-body .avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.testimonial-body p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: white;
}

.back-button {
  text-align: center;
}

.back-button .button {
  display: inline-block; /* 使按钮为行内块元素 */
  background-color: #ff6b6b; /* 设置按钮背景颜色 */
  color: white; /* 设置按钮文字颜色为白色 */
  padding: 12px 25px; /* 设置按钮的内边距 */
  font-size: 1.1rem; /* 设置按钮字体大小 */
  border-radius: 25px; /* 设置按钮圆角为 25px */
  text-decoration: none; /* 移除链接下划线 */
  transition: background-color 0.3s ease, transform 0.3s ease; /* 设置按钮的过渡效果 */
}

.back-button .button:hover {
  background-color: #ff4747; /* 鼠标悬停时，背景颜色变为深红色 */
  transform: translateY(-3px); /* 鼠标悬停时，按钮上移 3px */
}
</style>