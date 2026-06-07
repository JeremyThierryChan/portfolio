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
        <li><i class="fa-solid fa-envelope"></i> <a href="mailto:jeremy.thierry.chan@gmail.com">jeremy.thierry.chan@gmail.com</a></li>
        <li><i class="fa-solid fa-phone"></i> +86 138-6853-0992</li>
        <li><i class="fa-brands fa-weixin"></i> WeChat: JeremyThierryChan</li>
        <li><i class="fa-solid fa-location-dot"></i> {{ $t('contact.location') }}: Pingyang County, Wenzhou, Zhejiang, China</li>
      </ul>
    </div>

    <!-- Social Media Links -->
    <div class="social-media">
      <h2 class="social-title">{{ $t('contact.followTitle') }}</h2>
      <div class="social-icons">

        <a v-for="s in socials" :key="s.id"
           :href="s.url || '#'"
           :target="s.url ? '_blank' : '_self'"
           rel="noopener noreferrer"
           class="social-icon"
           :style="{ '--brand': s.color, '--text': s.darkText ? '#000' : '#fff' }">
          <svg viewBox="0 0 24 24" class="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path v-if="s.svgPath" :d="s.svgPath"/>
            <template v-else>
              <rect x="3" y="2" width="18" height="20" rx="3"/>
              <line x1="8.5" y1="11" x2="15.5" y2="11" stroke="white" stroke-width="2.2" stroke-linecap="round" fill="none"/>
              <line x1="12" y1="7.5" x2="12" y2="14.5" stroke="white" stroke-width="2.2" stroke-linecap="round" fill="none"/>
              <line x1="7" y1="17" x2="17" y2="17" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.6" fill="none"/>
            </template>
          </svg>
          <span class="tooltip">{{ s.name }}<span v-if="s.handle" class="tooltip-handle">{{ s.handle }}</span></span>
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
      socials: [
        {
          id: 'instagram',
          name: 'Instagram',
          handle: 'jeremy.thierry.chan',
          url: 'https://www.instagram.com/jeremy.thierry.chan/',
          color: '#E1306C',
          svgPath: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12c0 3.259.014 3.668.072 4.948.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24c3.259 0 3.668-.014 4.948-.072 1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
        },
        {
          id: 'github',
          name: 'GitHub',
          handle: 'jeremythierrychan',
          url: 'https://github.com/jeremythierrychan',
          color: '#24292e',
          svgPath: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
        },
        {
          id: 'douyin',
          name: '抖音 Douyin',
          handle: 'JeremyTC',
          url: 'https://www.douyin.com/user/JeremyTC',
          color: '#010101',
          svgPath: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
        },
        {
          id: 'wechat',
          name: 'WeChat 微信',
          handle: 'JeremyThierryChan',
          url: null,
          color: '#07C160',
          svgPath: 'M8.667 11.753c-.56 0-1.013-.453-1.013-1.013s.454-1.013 1.013-1.013c.56 0 1.013.453 1.013 1.013s-.453 1.013-1.013 1.013zm6.666 0c-.56 0-1.013-.453-1.013-1.013s.453-1.013 1.013-1.013 1.013.453 1.013 1.013-.453 1.013-1.013 1.013zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.003 18.947c-1.375 0-2.69-.303-3.865-.842l-4.271 1.37 1.13-3.617C3.735 14.728 3 13.098 3 11.333c0-3.72 4.029-6.733 9-6.733s9 3.013 9 6.733c0 3.721-4.029 7.614-8.997 7.614z',
        },
        {
          id: 'xhs',
          name: '小红书',
          handle: 'JeremyTChan',
          url: 'https://www.xiaohongshu.com/user/profile/JeremyTChan',
          color: '#FF2442',
          svgPath: null,
        },
        {
          id: 'qq',
          name: 'QQ',
          handle: '741352970',
          url: null,
          color: '#EB1923',
          svgPath: 'M20.25 13.5c-.316-.527-.684-1.048-1.063-1.465A8.948 8.948 0 0 0 19.5 9c0-4.142-3.358-7.5-7.5-7.5S4.5 4.858 4.5 9c0 1.09.21 2.133.594 3.09-.41.437-.793.978-1.094 1.535C3.195 14.637 3 16.015 3.75 16.72c.276.259.636.405 1.023.405.886 0 1.917-.626 2.75-1.807.44.153.948.28 1.504.362l-.107.64c-.095.569.27 1.096.818 1.096h.286c.547 0 .913-.527.818-1.096l-.107-.64c.556-.082 1.064-.209 1.504-.362.833 1.181 1.864 1.807 2.75 1.807.387 0 .747-.146 1.023-.405.75-.705.555-2.083-.257-3.22z',
        },
        {
          id: 'bilibili',
          name: 'bilibili',
          handle: null,
          url: null,
          color: '#00A1D6',
          svgPath: 'M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 19.858 0 18.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z',
        },
        {
          id: 'youtube',
          name: 'YouTube',
          handle: null,
          url: null,
          color: '#FF0000',
          svgPath: 'M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z',
        },
        {
          id: 'twitter',
          name: 'X / Twitter',
          handle: null,
          url: null,
          color: '#000000',
          svgPath: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.763l7.737-8.835L2.252 2.25h6.775l4.258 5.629 5.259-5.629zm-1.161 17.52h1.833L7.084 4.126H5.117z',
        },
        {
          id: 'snapchat',
          name: 'Snapchat',
          handle: null,
          url: null,
          color: '#FFFC00',
          darkText: true,
          svgPath: 'M12.017 0C8.396.002 5.835 3.017 5.835 6.614v.72c0 .063-.04.12-.099.143l-.397.183c-.293.117-.61.18-.94.18-.252 0-.476-.047-.664-.12-.215-.082-.41-.199-.57-.348a.137.137 0 0 0-.093-.038.145.145 0 0 0-.062.015c-.059.027-.091.093-.079.158.104.568.46.994.913 1.214l.005.002c.088.042.099.154.025.21-.487.369-.806.91-.806 1.514 0 1.027.896 1.888 2.07 1.991.01.001.02.006.026.013a.038.038 0 0 1 .009.028c-.111 1.62-1.523 2.75-3.258 3.079-.073.013-.121.083-.103.156.02.076.097.122.174.103.388-.098.76-.206 1.105-.326.1-.034.202-.07.3-.108a12.89 12.89 0 0 1 1.254-.398c.128-.03.26-.057.396-.076.184-.026.374-.037.567-.018.344.03.65.126.924.27.478.252.84.614 1.24.893.4.279.855.471 1.379.471.524 0 .979-.192 1.379-.471.4-.279.762-.641 1.24-.893.274-.144.58-.24.924-.27.193-.02.383-.008.567.018.136.02.268.047.396.076.452.106.87.245 1.254.398.098.038.2.074.3.108.345.12.717.228 1.105.326.077.019.154-.027.174-.103.018-.073-.03-.143-.103-.156-1.735-.328-3.147-1.459-3.258-3.079-.001-.011.002-.021.009-.028a.038.038 0 0 1 .026-.013c1.174-.103 2.07-.964 2.07-1.991 0-.604-.319-1.145-.806-1.514-.074-.056-.063-.168.025-.21l.005-.002c.453-.22.809-.646.913-1.214.012-.065-.02-.131-.079-.158a.145.145 0 0 0-.062-.015.137.137 0 0 0-.093.038 1.944 1.944 0 0 1-.57.348c-.188.073-.412.12-.664.12-.33 0-.647-.063-.94-.18l-.396-.183a.152.152 0 0 1-.099-.143v-.72C18.199 3.017 15.638.002 12.017 0z',
        },
        {
          id: 'whatsapp',
          name: 'WhatsApp',
          handle: null,
          url: null,
          color: '#25D366',
          svgPath: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z',
        },
      ],
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
  max-width: 700px;
  margin: 0 auto 40px;
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
  box-sizing: border-box;
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
.submit-btn:hover { background-color: #ff4747; transform: translateY(-2px); }

.contact-info ul { list-style: none; padding: 0; }
.contact-info li {
  font-size: 1.1rem;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.contact-info li i { width: 20px; text-align: center; color: #ff6b6b; }
.contact-info li a { color: var(--text-primary); text-decoration: none; }
.contact-info li a:hover { color: #ff6b6b; }

/* Social icons */
.social-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin-top: 20px;
  /* 6 icons × 54px + 5 gaps × 16px = 324 + 80 = 404px */
  max-width: 404px;
  margin-left: auto;
  margin-right: auto;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--brand, #444);
  border-radius: 50%;
  height: 54px;
  width: 54px;
  flex-shrink: 0;
  position: relative;
  text-decoration: none;
  box-shadow: 0 3px 10px rgba(0,0,0,0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.social-icon:hover {
  transform: translateY(-4px) scale(1.08);
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}

.icon-svg {
  width: 26px;
  height: 26px;
  color: var(--text, white);
  flex-shrink: 0;
}

.tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: rgba(0,0,0,0.8);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
  white-space: nowrap;
  padding: 6px 10px;
  border-radius: 8px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 10;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: rgba(0,0,0,0.8);
}

.tooltip-handle {
  display: block;
  font-weight: 400;
  font-size: 0.72rem;
  opacity: 0.8;
}

.social-icon:hover .tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

@media (max-width: 768px) {
  .contact { padding: 20px; }
  .social-icons { gap: 12px; }
}
</style>
