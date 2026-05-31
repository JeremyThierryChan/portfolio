<template>
  <div class="contact">
    <h1 class="page-title">{{ $t('contact.title') }}</h1>

    <!-- Contact Form -->
    <div class="contact-form">
      <h2 class="form-title">{{ $t('contact.formTitle') }}</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name">{{ $t('contact.name') }}</label>
          <input type="text" id="name" v-model="form.name" required />
        </div>
        <div class="form-group">
          <label for="email">{{ $t('contact.email') }}</label>
          <input type="email" id="email" v-model="form.email" required />
        </div>
        <div class="form-group">
          <label for="message">{{ $t('contact.message') }}</label>
          <textarea id="message" v-model="form.message" required></textarea>
        </div>
        <button type="submit" class="submit-btn">{{ $t('contact.send') }}</button>
      </form>
    </div>

    <!-- Contact Information -->
    <div class="contact-info">
      <h2 class="info-title">{{ $t('contact.infoTitle') }}</h2>
      <ul>
        <li>Email: <a href="mailto:jeremy.thierry.chan@gmail.com">jeremy.thierry.chan@gmail.com</a></li>
        <li>Phone: +86 138-6853-0992</li>
        <li>WeChat: JeremyThierryChan</li>
        <li>{{ $t('contact.location') }}: Pingyang County, Wenzhou, Zhejiang, China</li>
      </ul>
    </div>

    <!-- Social Media Links -->
    <div class="social-media">
      <h2 class="social-title">{{ $t('contact.followTitle') }}</h2>
      <div class="social-icons">
        <a href="https://www.instagram.com/jeremy.thierry.chan/" target="_blank" class="social-icon" title="Instagram">
          <img src="@/assets/icons/instagram-icon.png" alt="Instagram" class="icon" />
          <span class="info">Instagram<br>jeremy.thierry.chan</span>
        </a>
        <a href="https://github.com/JeremyThierryChan" target="_blank" class="social-icon" title="GitHub">
          <img src="@/assets/icons/github-icon.png" alt="GitHub" class="icon" />
          <span class="info">GitHub<br>JeremyThierryChan</span>
        </a>
        <a href="https://www.douyin.com/user/JeremyTC" target="_blank" class="social-icon" title="Douyin">
          <img src="@/assets/icons/twitter-icon.png" alt="Douyin" class="icon" />
          <span class="info">Douyin<br>JeremyTC</span>
        </a>
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
  name: 'ContactPage',
  data() {
    return {
      form: { name: '', email: '', message: '' },
    };
  },
  methods: {
    submitForm() {
      alert(this.$t('contact.alertMsg', { name: this.form.name }));
      this.form.name = '';
      this.form.email = '';
      this.form.message = '';
    },
  },
};
</script>

<style scoped>
.contact {
  padding: 40px;
  background: var(--bg-gradient);
  color: var(--text-primary);
  font-family: 'Arial', sans-serif;
  min-height: 100vh;
  transition: background 0.3s ease, color 0.3s ease;
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

.form-group { margin-bottom: 20px; }

.form-group label { display: block; margin-bottom: 8px; }

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background-color: var(--bg-input);
  color: var(--text-primary);
  transition: background 0.3s ease, border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #ff6b6b;
  outline: none;
}

.form-group textarea { height: 150px; }

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
  transform: translateY(-2px);
}

.contact-info ul { list-style-type: none; padding: 0; }
.contact-info li { font-size: 1.2rem; margin-bottom: 12px; }

.social-icons {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: var(--bg-social);
  transition: background-color 0.3s ease;
  border-radius: 50px;
  height: 60px;
  width: 60px;
  position: relative;
  text-decoration: none;
  overflow: hidden;
  transition: width 0.4s ease;
}

.social-icon:hover { width: 200px; }

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

.social-icon:hover .info { opacity: 1; }
.social-icon:hover .icon { opacity: 0; }
</style>
