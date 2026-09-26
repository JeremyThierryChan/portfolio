// posts.js — i18n content layer (see SCHEMA.md).
// Migrated verbatim from src/pages/blogs/postsData.js — no wording was changed.
//
// NOTE: `excerpt` is the first sentence of `content` and was copied twice on purpose
// (duplication is preserved from the source; de-duplication is a later content decision).
//
// NOTE: `draft: true` reflects the SOURCE file's own header — "Add real articles here when
// ready." — i.e. these three are author-supplied samples, not published pieces. It is NOT a
// date-based judgement: their dates (2026-03/04/05) are already in the past as of 2026-09.
// Drop the flag when real articles replace them.
export const posts = [
  {
    id: 1,
    category: 'tech',
    date: '2026-05-10',
    draft: true,
    i18n: {
      en: {
        title: 'How to Build a Portfolio Website',
        excerpt: 'In this article, I share my journey of building a personal portfolio website using Vue.js and other modern web technologies.',
        content: 'In this article, I share my journey of building a personal portfolio website using Vue.js and other modern web technologies. Starting from scratch, I chose Vue.js for its component-based architecture and ease of use. I configured Vue Router for navigation, set up a clean folder structure, and deployed the whole thing to GitHub Pages using GitHub Actions for automatic continuous deployment. The biggest challenges were getting the routing to work correctly with a base URL, and migrating from Vue CLI (webpack) to Vite for dramatically faster development startup times.',
      },
      zh: {
        title: '如何搭建一个作品集网站',
        excerpt: '在这篇文章中，我分享了自己使用 Vue.js 以及其他现代 Web 技术搭建个人作品集网站的历程。',
        content: '在这篇文章中，我分享了自己使用 Vue.js 以及其他现代 Web 技术搭建个人作品集网站的历程。从零开始，我因为 Vue.js 基于组件的架构和易用性而选择了它。我为导航配置了 Vue Router，建立起清晰的文件夹结构，并使用 GitHub Actions 将整个项目部署到 GitHub Pages 上，实现自动持续部署。最大的挑战在于让路由在带有 base URL 的情况下正确工作，以及从 Vue CLI（webpack）迁移到 Vite，从而大幅缩短开发启动时间。',
      },
    },
  },
  {
    id: 2,
    category: 'language',
    date: '2026-04-18',
    draft: true,
    i18n: {
      en: {
        title: 'What It Feels Like to Speak Seven Languages',
        excerpt: 'Growing up bilingual in Chinese and English, and later self-teaching French and German — here is what that journey actually feels like from the inside.',
        content: "Growing up bilingual in Chinese and English, and later self-teaching French and German — here is what that journey actually feels like from the inside. Each language rewires a small part of your brain. Chinese taught me precision in context. English gave me a global framework. French showed me that elegance has a grammar. German revealed that compound words are the greatest invention in human history. The hardest part isn't vocabulary or grammar — it's the moment you stop translating in your head and start dreaming in the new language. I'm still waiting for that moment with Spanish, Italian, and Arabic.",
      },
      zh: {
        title: '会说七种语言是什么感觉',
        excerpt: '从小在中文和英语的双语环境中长大，后来又自学了法语和德语——这就是那段历程从内部看究竟是什么感觉。',
        content: "从小在中文和英语的双语环境中长大，后来又自学了法语和德语——这就是那段历程从内部看究竟是什么感觉。每一种语言都会重新连接你大脑的一小部分。中文教会我在语境中追求精确。英语给了我一个全球性的框架。法语让我看到优雅也有它的语法。德语则揭示了复合词是人类历史上最伟大的发明。最难的部分不是词汇或语法——而是你不再在脑子里翻译、开始用新语言做梦的那一刻。对于西班牙语、意大利语和阿拉伯语，我仍在等待那一刻。",
      },
    },
  },
  {
    id: 3,
    category: 'life',
    date: '2026-03-05',
    draft: true,
    i18n: {
      en: {
        title: 'One Week Teaching English in Bali',
        excerpt: 'In July 2019, I volunteered at a local primary school in Ubud, Bali. No projector, no printed materials — just a blackboard and thirty curious kids.',
        content: 'In July 2019, I volunteered at a local primary school in Ubud, Bali as part of the IVHQ and Green Lion programme. No projector, no printed materials — just a blackboard and thirty curious kids who had never met a Chinese person before. I woke up at 6 AM every morning to write lesson plans by hand in both Balinese and English, then copy them by hand at the volunteer camp. What I learned there had nothing to do with teaching methods. It had everything to do with showing up, being present, and letting the children lead. The week changed something in me that I am still unable to fully describe.',
      },
      zh: {
        title: '在巴厘岛教英语的一周',
        excerpt: '2019 年 7 月，我在巴厘岛乌布的一所本地小学做志愿者。没有投影仪，没有印刷材料——只有一块黑板和三十个充满好奇的孩子。',
        content: '2019 年 7 月，我作为 IVHQ 和 Green Lion 项目的一员，在巴厘岛乌布的一所本地小学做志愿者。没有投影仪，没有印刷材料——只有一块黑板和三十个从未见过中国人的充满好奇的孩子。我每天早上 6 点起床，手写巴厘语和英语两种语言的教案，然后在志愿者营地里把它们抄写下来。我在那里学到的东西与教学方法无关。它完全关乎到场、全情投入，以及让孩子们来主导。那一周改变了我内在的某些东西，至今我仍无法完全描述。',
      },
    },
  },
];
