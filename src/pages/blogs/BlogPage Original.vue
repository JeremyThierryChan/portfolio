<template>
  <div class="blog">
    <h1 class="page-title">My Blog</h1>
    
    <!-- Blog Article List -->
    <div class="article-list">
      <div class="article" v-for="(article, index) in articles" :key="index">
        <router-link :to="'/blog/' + article.id" class="article-link">
          <h2 class="article-title">{{ article.title }}</h2>
        </router-link>
        <p class="article-summary">{{ article.summary }}</p>
        <span class="article-date">{{ article.date }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BlogPage",
  data() {
    return {
      articles: [
        {
          id: 1,
          title: "Introduction to Vue.js",
          summary: "In this post, we explore the basics of Vue.js...",
          date: "2025-01-01",
        },
        {
          id: 2,
          title: "Understanding Vue Router",
          summary: "Vue Router is the official router for Vue.js...",
          date: "2025-01-10",
        },
        {
          id: 3,
          title: "Building SPAs with Vue and Tailwind CSS",
          summary: "This article discusses how to build Single Page Applications (SPAs)...",
          date: "2025-01-20",
        },
      ],
    };
  },
};
</script>

<style scoped>
.blog {
  padding: 40px;
  background: linear-gradient(135deg, #2b2b2b, #3c3c3c); /* 深色背景渐变 */
  color: white;
  height: 100vh;
  font-family: 'Arial', sans-serif;
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 30px;
  letter-spacing: 2px;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.article {
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.7); /* 半透明背景，增强对比度 */
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article:hover {
  transform: translateY(-5px); /* 鼠标悬停时向上浮动 */
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2); /* 鼠标悬停时增加阴影 */
}

.article-link {
  text-decoration: none;
  color: #ffb86c; /* PyCharm主题的橙色 */
  transition: color 0.3s ease;
}

.article-link:hover {
  color: #ff6b6b; /* 鼠标悬停时变为红色 */
}

.article-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffb86c; /* PyCharm主题的橙色 */
  margin: 0;
  letter-spacing: 1px;
  transition: color 0.3s ease;
}

.article-title:hover {
  color: #ff6b6b; /* 鼠标悬停时变为红色 */
}

.article-summary {
  font-size: 1.1rem;
  color: #ddd;
  margin: 10px 0;
}

.article-date {
  font-size: 0.9rem;
  color: #999;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .blog {
    padding: 20px;
  }

  .page-title {
    font-size: 2rem;
  }

  .article-title {
    font-size: 1.5rem;
  }

  .article-summary {
    font-size: 1rem;
  }
}
</style>
