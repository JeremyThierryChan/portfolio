<template>
  <div class="contact">
    <h1 class="page-title">Contact Me</h1>
    
    <!-- Contact Form -->
    <div class="contact-form">
      <h2 class="form-title">Get in Touch</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" v-model="form.name" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="form.email" required />
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" v-model="form.message" required></textarea>
        </div>
        <button type="submit" class="submit-btn">Send Message</button>
      </form>
    </div>

    <!-- Contact Information -->
    <div class="contact-info">
      <h2 class="info-title">Or Reach Me Here</h2>
      <ul>
        <li>Email: <a href="mailto:jeremy.thierry.chan@gmail.com">jeremy.thierry.chan@gmail.com</a></li>
        <li>Phone: +86 138-6853-0992</li>
        <li>WeChat: JeremyThierryChan</li>
        <li>Location: Pingyang County, Wenzhou, Zhejiang, China</li>
      </ul>
    </div>

    <!-- Social Media Links -->
    <div class="social-media">
      <h2 class="social-title">Follow Me</h2>
      <div class="social-icons">
        <!-- Instagram -->
        <a href="https://www.instagram.com/jeremy.thierry.chan/" target="_blank" class="social-icon" title="Instagram">
          <img src="@/assets/icons/instagram-icon.png" alt="Instagram" class="icon" />
          <span class="info">Instagram<br>Jeremy Chan</span>
        </a>
        <!-- GitHub -->
        <a href="https://github.com/JeremyThierryChan" target="_blank" class="social-icon" title="GitHub">
          <img src="@/assets/icons/github-icon.png" alt="GitHub" class="icon" />
          <span class="info">GitHub<br>JeremyThierryChan</span>
        </a>
        <!-- Douyin -->
        <a href="https://www.douyin.com/user/JeremyTC" target="_blank" class="social-icon" title="Douyin">
          <img src="@/assets/icons/twitter-icon.png" alt="Douyin" class="icon" />
          <span class="info">Douyin<br>JeremyTC</span>
        </a>
        <!-- Xiaohongshu -->
        <a href="https://www.xiaohongshu.com/user/profile/JeremyTChan" target="_blank" class="social-icon" title="Xiaohongshu">
          <img src="@/assets/icons/instagram-icon.png" alt="Xiaohongshu" class="icon" />
          <span class="info">小红书<br>JeremyTChan</span>
        </a>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "ContactPage",
  data() {
    return {
      form: {
        name: "",
        email: "",
        message: "",
      },
    };
  },
  methods: {
    submitForm() {
      alert(`Message from ${this.form.name} has been sent!`);
      this.form.name = "";
      this.form.email = "";
      this.form.message = "";
    },
  },
};
</script>

<style scoped>
.contact {
  padding: 40px;
  background: linear-gradient(135deg, #2b2b2b, #333); /* 深色渐变背景 */
  color: white;
  font-family: 'Arial', sans-serif;
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 30px;
}

.contact-form,
.contact-info,
.social-media {
  margin-bottom: 40px;
}

.form-title,
.info-title,
.social-title {
  font-size: 1.8rem;
  margin-bottom: 20px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #444; /* 背景色调和整体设计相配 */
  color: white;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #ff6b6b; /* 高亮边框 */
  outline: none;
}

.form-group textarea {
  height: 150px;
}

.submit-btn {
  background-color: #ff6b6b;
  color: white;
  padding: 15px 30px;
  font-size: 1.2rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.submit-btn:hover {
  background-color: #ff4747;
  transform: translateY(-2px); /* 鼠标悬停时按钮上升 */
}

.contact-info ul {
  list-style-type: none;
  padding: 0;
}

.contact-info li {
  font-size: 1.2rem;
  margin-bottom: 12px;
}

/* 修改社交媒体布局 */
.social-media {
  text-align: center; /* 将图标居中对齐 */
}

.social-media {
  text-align: left; 
}

.social-icons {
  display: flex;
  gap: 20px;
  justify-content: center; /* 将社交图标水平居中 */
  margin-top: 20px; /* 增加顶部间距 */
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: #444;
  border-radius: 50px;
  height: 60px;
  width: 60px;
  position: relative;
  text-decoration: none;
  overflow: hidden;
  transition: width 0.4s ease; /* 扩展宽度 */
}

.social-icon:hover {
  width: 200px; /* 鼠标悬停时扩展宽度为药丸形 */
}

.social-icon .icon {
  width: 30px;
  height: 30px;
  transition: opacity 0.4s ease;
}

.social-icon .info {
  position: absolute;
  opacity: 0;
  color: white;
  margin-left: 10px;
  font-size: 1rem;
  transition: opacity 0.4s ease;
}

.social-icon:hover .info {
  opacity: 1; /* 显示用户名 */
}

.social-icon:hover .icon {
  opacity: 0; /* 隐藏图标 */
}

</style>
