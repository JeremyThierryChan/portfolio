/*
 * zh.js — 简体中文语言包。
 *
 * 键集合、层级与顺序与 en.js 严格一一对应：en.js 里没有的键一律不保留，
 * 否则它只会在本地悄悄存在，永远不会被渲染。
 *
 * 约定：枚举值的显示文案放在 <namespace>.<field>.<value>，
 * 例如 projects.status.in-progress、skills.category.language。
 *
 * 占位符（{count}、{total}、{name}、{style}、{time}、{window}、{current}、
 * {page}、{email}、{mode}、{label}、{date}、{value}、{max}）一律逐字保留，只调整中文语序。
 * 专有名词（Jeremy Thierry Chan、Vue.js、JavaScript、Python、Instagram、GitHub、
 * Vite、Astro、Node.js、WeChat、ATS、JSON Resume 等）保持原文。
 */
export default {
  /* ── site notice ──────────────────────────────────────────────────────
     The slim strip at the top of every page. It is read by SiteNotice.vue,
     which renders this sentence in ALL six locales at once, not just the
     visitor's — so a missing translation would show up as an English line
     inside another language's slot. Keep every pack filled. */
  notice: {
    label: '站点状态',
    building: '本站仍在持续制作中，完成一部分就更新一部分。',
  },

  quote: {
    heading: '怎么报价',
    lede: '从你写下需求，到手上有一份报价，中间会发生什么。',
    step1Title: '说明你的需求',
    step1Body: '用途、时间、语种、地点；如果有大致的预算区间也一并说明，能省掉一轮来回。',
    step2Title: '我回复报价与范围',
    step2Body: '写明包含什么、不包含什么，以及什么时候能交付。',
    step3Title: '确认后排期',
    step3Body: '报价与范围确认后，我给出排期并进入准备。',
    noNumbers: '这里没有价目表，是刻意的。这九项服务的计价单位不一样——按天、按场、按字数、按项目、按课时、按成单佣金——挂一个数字，误导的成分比帮助更大。把需求说清楚，你会拿到一个确定的数字。',
    cta: '把需求发给我',
  },

  tutoring: {
    overline: '教学与辅导',
    title: '课时报价',
    lede: '一对一与小班教学的课时单价，覆盖小学到高中课内学科、雅思、语言、编程与建模。',
    unit: '人民币 / 每小时',
    courseColumn: '课程',
    howTitle: '计价方式',
    howBody: '每门课只有一个一对一单价，另外三列是它乘以人数系数后四舍五入到十位——两人时每人付 70%，三人时每人付 60%，人数更多时每人付 50%。',
    quotedOnRequest: '议价',
    cta: '咨询课程',
  },

  /* ── 站点框架 ────────────────────────────────────────────────────────── */
  nav: {
    home: '首页',
    services: '服务',
    resume: '简历',
    about: '关于我',
    aboutMe: '个人简介',
    timeline: '时间轴',
    skills: '技能',
    testimonials: '推荐信',
    projects: '项目',
    gallery: '相册',
    blog: '博客',
    contact: '联系我',
    /* 新增 */
    primaryLabel: '主导航',
    aboutSubmenuLabel: '关于我的分节',
    languageLabel: '切换语言',
    languageCurrent: '语言：{name}',
    themeLabel: '外观',
    skipToContent: '跳到主要内容',
    menu: '菜单',
    closeMenu: '关闭菜单',
  },

  /* ── 通用词汇 ────────────────────────────────────────────────────────── */
  common: {
    filterAll: '全部',
    readMore: '阅读更多',
    viewAll: '查看全部',
    back: '返回',
    backTo: '返回{page}',
    empty: '这里还什么都没有。',
    externalLink: '在新标签页中打开',
    notTranslated: '尚未翻译——显示英文原文。',
    placeholderImage: '占位图片',
    dismiss: '关闭',
    close: '关闭',
    learnMore: '了解更多',
    optional: '选填',
    /* 用在进度条的 aria-valuetext 上。刻意写得中性：这个进度条同时被项目进度
       （早先还有技能熟练度）复用，不能借用其中任何一方自己的说法。 */
    percentOf: '共 {max}，当前 {value}',
    required: '必填',
    copy: '复制',
    copied: '已复制',
    showing: '显示 {count} 项，共 {total} 项',
  },

  /* ── 「我已经活了…」计时器的单位 ─────────────────────────────────────── */
  time: {
    days: '天',
    hours: '小时',
    minutes: '分钟',
    seconds: '秒',
    day: '天',
    hour: '小时',
    minute: '分钟',
    second: '秒',
    and: '零',
  },

  /* ── 首页 ────────────────────────────────────────────────────────────── */
  home: {
    overline: '作品集',
    title: '欢迎来到我的网站',
    sub1: '很高兴你来了。这里有关于我的一切——我的经历、技能和作品。',
    sub2: '网站还在持续完善中，不过我们不都是这样吗。',
    liveLabel: '自2002年3月22日早上6:23，我已经活了',
    aboutTitle: '关于我',
    aboutDesc: '我是谁，我做过什么，我怎么思考。我的背景、经历和工具——全在这里。',
    projectsTitle: '项目',
    projectsDesc: '我做过的事情——从软件工具和系统，到品牌和副业。',
    blogTitle: '博客',
    blogDesc: '关于技术、语言、文化，以及我脑子里随时在想的事情。不定期更新。',
    contactTitle: '联系我',
    contactDesc: '想合作或者只是打个招呼？这里有我所有的联系方式和社交媒体。',
    exploreMore: '了解更多',
    getInTouch: '联系我',
    indexLabel: '接下来去哪里',
    /* 现在首页是一份「报价」而不是打招呼：首屏 → 服务 → 口碑 → 目录 → 联系。
       下面是这个结构里各段落的标题。 */
    servicesLede: '九件可以请我来做的事。告诉我哪一件听起来像你的处境，我就把它排在前面。',
    trustTitle: '大家怎么说',
    trustLede: '由与我共事过的人写下的——一位学校副校长、一位同事、两位项目协调人。',
    trustAll: '全部推荐信',
    closingTitle: '告诉我你需要什么',
    closingBody: '一个项目、一个问题，或者一个你还没想好该怎么处理的局面。第一次聊，不收费。',
  },

  /* ── 关于我 ──────────────────────────────────────────────────────────── */
  about: {
    overline: '关于我',
    title: '关于我',
    subtitle: '我是谁？',
    bio1: '嗨！我是Jeremy。我的目标？在这个不断向前冲的世界里留下一丝优雅的痕迹。我觉得生命太宝贵了，不该花在做自己不喜欢的事情上，只为了买用不上的东西，去讨好根本不认识的人。你可以叫我理想主义者，但我宁愿穷得有灵感，也不要富得无聊。（当然，又有灵感又生活优渥也不是不行，说实话。）',
    bio2: '在下面继续了解我。',
    timelineTitle: '我的时间轴',
    timelineLived: '自2002年3月22日早上6:23，我已经活了',
    timelineDesc: '我走过的路、做过的事、塑造了我的经历——完整的时间线记录。',
    skillsTitle: '我的技能',
    skillsDesc: '我会说的语言、用的工具、掌握的技术——诚实评分。',
    testimonialsTitle: '推荐信',
    testimonialsDesc: '与我共事过的同事、教育工作者和机构对我的评价。',
    viewTimeline: '查看时间轴',
    viewSkills: '查看技能',
    viewTestimonials: '查看推荐信',
  },

  /* ── 时间轴 ──────────────────────────────────────────────────────────── */
  timeline: {
    overline: '历程',
    title: '我的历程',
    lede: '我走过的路、做过的事、塑造了我的经历——完整的时间线记录。',
    countLabel: '{count} 条记录',
    newestFirst: '最新在前',
    categoryLabel: '分类',
    category: {
      career: '职业',
      personal: '个人',
      education: '教育',
      hobby: '爱好',
    },
  },

  /* ── 技能 ────────────────────────────────────────────────────────────── */
  skills: {
    overline: '技能',
    title: '我的技能',
    lede: '我会说的语言、用的工具、掌握的技术——诚实评分。',
    filterLabel: '按使用方式筛选技能',
    /* `usage` 说的是这项技能「怎么用」，不是「有多强」。它替代了原先那个自评百分比
       ——那种分数访客既没法核实，也没法据此做什么。 */
    usageLabel: '使用方式',
    evidenceLabel: '凭据',
    countLabel: '{count} 项技能',
    usage: {
      professional: '客户交付依赖它',
      working: '用它做出过真实的东西',
      learning: '正在学',
    },
    usageShort: {
      professional: '专业',
      working: '实际使用',
      learning: '学习中',
    },
    filterAll: '全部',
    filterProgramming: '编程',
    filterLanguage: '语言',
    filterOther: '其他',
    category: {
      programming: '编程',
      language: '语言',
      other: '其他',
    },
  },

  /* ── 推荐信 ──────────────────────────────────────────────────────────── */
  testimonials: {
    overline: '推荐信',
    title: '推荐信',
    subtitle: '与我共事过的人的评价。',
    lede: '与我共事过的同事、教育工作者和机构对我的评价。',
    clickToRead: '点击阅读',
    readMore: '阅读完整推荐信',
    readFull: '阅读完整信件内容',
    backBtn: '返回推荐信列表',
    contextLabel: '背景',
    notFoundTitle: '未找到这封推荐信',
    notFoundBody: '这封推荐信不存在，或者链接已经失效。',
    notFoundCta: '返回全部推荐信',
  },

  /* ── 项目 ────────────────────────────────────────────────────────────── */
  projects: {
    overline: '作品',
    title: '我的项目',
    subtitle: '我的作品集',
    lede: '这里汇集了我在各个领域做过的项目——从软件开发到创意设计，从技术到创业。每个项目都反映了我对创新和解决实际问题的热情。',
    intro: '这里汇集了我在各个领域做过的项目——从软件开发到创意设计，从技术到创业。每个项目都反映了我对创新和解决实际问题的热情。',
    countLabel: '{count} 个项目',
    /* 这一页分成两半：先是写成文字的介绍，然后是完整的清单。清单是「筛选不等于
       隐藏」的保证——每个项目仍然在列，包括那些刻意没有被放到前面的。 */
    featuredTitle: '精选作品',
    featuredLede: '六个分量足够、值得认真读一读的项目。',
    indexTitle: '全部项目',
    indexLede: '完整清单，包括我还没写成文字的那些。不把一个项目放到前面，不等于把它拿掉。',
    indexCount: '共 {count} 个',
    archivedNote: '未重点展示',
    openLink: '打开网站',
    filterLabel: '按状态筛选项目',
    statusLabel: '状态',
    progressLabel: '进度',
    techStack: '技术栈',
    cofounder: '联合创始人',
    cofounderLabel: '联合创始人：{name}',
    stages: '项目阶段',
    stageCompleted: '已完成',
    stageInProgress: '进行中',
    stageOf: '第 {current} 阶段，共 {total} 阶段',
    viewProject: '查看项目',
    clickForMore: '点击查看详情',
    openProject: '打开项目',
    noLink: '暂无公开链接',
    comingSoon: '即将上线',
    waitMore: '更多内容即将上线…',
    filterAll: '全部',
    filterProgress: '进行中',
    filterPaused: '已暂停',
    filterCompleted: '已完成',
    emptyTitle: '该筛选下暂无项目',
    emptyBody: '换个状态试试。',
    status: {
      'in-progress': '进行中',
      paused: '已暂停',
      completed: '已完成',
    },
  },

  /* ── 博客 ────────────────────────────────────────────────────────────── */
  blog: {
    overline: '写作',
    title: '我的博客',
    subtitle: '你能在这里找到什么',
    lede: '欢迎来到我在互联网的角落！这里记录着我对技术、语言学习、文化以及各种感兴趣话题的思考。希望你能找到有共鸣的内容。',
    intro: '欢迎来到我在互联网的角落！这里记录着我对技术、语言学习、文化以及各种感兴趣话题的思考。希望你能找到有共鸣的内容。',
    countLabel: '{count} 篇文章',
    filterLabel: '按分类筛选文章',
    categoryLabel: '分类',
    draftBadge: '草稿',
    clickToRead: '点击阅读',
    clickForMore: '点击查看详情',
    readMore: '阅读全文',
    waitMore: '更多内容即将上线…',
    filterAll: '全部',
    filterTech: '技术',
    filterLanguage: '语言',
    filterCulture: '文化',
    filterLife: '生活',
    emptyTitle: '该分类暂无文章',
    emptyBody: '换个分类试试——或者过段时间再来看看。',
    category: {
      tech: '技术',
      language: '语言',
      culture: '文化',
      life: '生活',
    },
  },

  /* ── 相册 ────────────────────────────────────────────────────────────── */
  gallery: {
    overline: '相册',
    title: '相册',
    subtitle: '活动、旅行与生活瞬间的影像记录。',
    lede: '活动、旅行与生活瞬间的影像记录。',
    countLabel: '{count} 张照片',
    filterLabel: '按分类筛选照片',
    placeholderNotice: '这些是占位图片，之后会换成真实照片。',
    placeholderBadge: '占位',
    yearLabel: '年份',
    locationLabel: '地点',
    openPhoto: '查看照片',
    closePhoto: '关闭照片',
    filterAll: '全部',
    filterEvents: '活动',
    filterSports: '运动',
    filterVolunteer: '义工',
    filterCampus: '校园',
    filterTravel: '旅行',
    emptyTitle: '该分类暂无照片',
    emptyBody: '换个分类试试。',
    empty: '该分类暂无照片。',
    category: {
      events: '活动',
      sports: '运动',
      volunteer: '义工',
      campus: '校园',
      travel: '旅行',
    },
  },

  /* ── 获奖与证书 ──────────────────────────────────────────────────────────
     竞赛、考试和证书。`result` 才是让一条记录成为「凭据」而不是「自称」的东西，
     所以只要它有值就一定会渲染出来。
     ────────────────────────────────────────────────────────────────────── */
  awards: {
    overline: '记录',
    title: '竞赛与证书',
    lede: '第三方给出的结果——这一页里不需要听我一面之词就能核实的那部分。',
    countLabel: '{count} 条记录',
    kindLabel: '类型',
    resultLabel: '结果',
    /* `result: null` 的条目不渲染结果那一行，而不是显示「待公布」。 */
    kind: {
      exam: '考试',
      competition: '竞赛',
      certificate: '证书',
      sport: '体育',
    },
  },

  /* ── 简历 ────────────────────────────────────────────────────────────────
     这份简历和网站用的是同一层内容，只是按行业做了筛选。打印版刻意做成纯文本、
     单栏：ATS（简历筛选系统）读的是文字，而双栏的图形化 PDF 它根本看不见。
     ────────────────────────────────────────────────────────────────────── */
  resume: {
    overline: 'CV',
    title: '简历',
    lede: '同一份履历的五个版本——一份完整的，以及四份为某类工作专门裁过的。挑一份贴合你此刻用途的，打印出来或者存成 PDF。',
    variantLabel: '选择版本',
    print: '打印／存为 PDF',
    downloadJson: '下载为 JSON',
    /* 要说清楚打印版为什么这么朴素。否则「朴素」会被读成「没做完」。 */
    printNote: '打印出来的版本是刻意做得朴素、单栏的，为的是让简历筛选系统（ATS）能读得出来。有设计的那一版，是网站上这个。',
    generatedNote: '和网站用的是同一份内容——改任何一边，两边都会更新。',
    sectionSummary: '简介',
    sectionServices: '我能做什么',
    sectionExperience: '经历',
    sectionProjects: '精选项目',
    sectionEducation: '教育背景',
    sectionSkills: '技能',
    sectionLanguages: '语言',
    sectionTechnical: '技术',
    sectionAwards: '竞赛与证书',
    present: '至今',
  },

  /* ── 访客身份轴 ──────────────────────────────────────────────────────────
     这个控件是在问访客「你来看什么」，所以文案写成访客自己会说的话——而不是
     给人分类贴标签。各身份自己的名称和「你需要什么」那句话在
     src/content/audiences.js 里，这里只是外围文案。
     ────────────────────────────────────────────────────────────────────── */
  audience: {
    title: '我来看的是…',
    hint: '告诉我，我就把你关心的放在前面。什么都不会被藏起来——其余内容依然在这一页上，只是排在后面。',
    allLabel: '全部',
    allNeed: '看全貌——不做任何重排。',
    showingFor: '已把对{label}最重要的内容排在前面。',
    showAll: '显示全部',
    /* 折叠起来的那组——这位访客大概用不到的内容。 */
    otherTitle: '这里还有',
    otherCount: '还有 {count} 项',
    otherBody: '这些不是为你这次的来意准备的——好奇的话可以展开看看。',
    otherExpand: '展开另外 {count} 项',
    otherCollapse: '收起',
  },

  /* ── 服务 ────────────────────────────────────────────────────────────────
     这个网站的目标是带来合作，所以这个命名空间承载的是「你可以请我做什么」的
     文案。各项服务本身的描述在 src/content/services.js 里，这里只是外围标签。

     注意：这是在六个语言包对齐之后才加的，所以措辞定稿前其余五个语言包在这里
     会回落成英文。`npm run verify:i18n` 会把它报成 INFO，而不是失败。
     ────────────────────────────────────────────────────────────────────── */
  services: {
    overline: '服务',
    title: '我能做什么',
    lede: '我做的事横跨语言、贸易和技术。多数合作会同时用到其中不止一项——去一趟供应商那里，需要现场口译，也需要文件上的处理，之后还得有个网站把货卖出去。',
    filterLabel: '按领域筛选服务',
    includesLabel: '包含哪些内容',
    billingLabel: '计价方式',
    countLabel: '{count} 项服务',
    languagesLabel: '语言',
    ctaTitle: '不确定自己需要哪一项？',
    ctaBody: '把情况说给我听，我会告诉你这件事涉及什么——或者你到底需不需要我。',
    cta: '聊一聊',
    otherNote: '其他类型的事情：直接问我就好。',
    /* 不公布数字，只说清楚合作是怎么定价的。 */
    pricingTitle: '我的合作方式',
    pricingBody: '每次合作单独报价——口译按天，网站或贸易项目按一口价，长期咨询按小时。在你决定之前，我会先告诉你费用大概是什么形状，以及包含哪些内容。',
    travelNote: '常驻浙江温州，可承接中国各地及海外的合作。',
    domainLabel: '领域',
    domain: {
      language: '语言',
      trade: '贸易',
      tech: '技术',
    },
  },

  /* ── 联系我 ──────────────────────────────────────────────────────────── */
  contact: {
    overline: '联系',
    title: '联系我',
    lede: '想合作或者只是打个招呼？这里有我所有的联系方式和社交媒体。',
    formTitle: '发送消息',
    name: '姓名',
    email: '邮箱',
    message: '消息内容',
    send: '发送',
    infoTitle: '或者直接找我',
    location: '所在地',
    phone: '电话',
    wechat: '微信',
    followTitle: '关注我',
    copyEmail: '复制邮箱地址',
    copyEmailValue: '复制 {email}',
    copied: '已复制到剪贴板',
    copyFailed: '复制失败——请手动选中地址',
    /* 旧表单只会弹个 alert() 然后自己清空，让人以为消息发成功了，其实没有。
       这里如实说明。 */
    formUnavailableTitle: '表单还没有接通',
    formUnavailableBody: '这个网站没有后端，表单发不出消息。现在可以直接用邮件——点一下会打开你的邮件客户端，内容都填好了。',
    composeEmail: '改用邮件联系',
    noPublicProfile: '{name}——暂无公开链接',
    officialSite: '{name}——官方网站',
  },

  /* ── 页脚 ────────────────────────────────────────────────────────────── */
  footer: {
    rights: '© 2025 Jeremy Thierry Chan. 保留所有权利。',
    /* 这个网站是故意做成这样的：说明白，而不是让人以为是 bug。 */
    themeNote: '这个网站会随着一天的时间改变风格。',
    styleNow: '当前是{style} · {window}',
    sourceLabel: '源代码',
    socialLabel: '社交链接',
    /* The footer's outgoing-links heading. It doubles as the nav landmark's
       accessible name via aria-labelledby, so it is the words on screen. */
    friendLinks: '友情链接',
  },

  /* ── 404 ─────────────────────────────────────────────────────────────── */
  notFound: {
    overline: '错误 404',
    title: '页面不存在',
    body: '这个页面不存在，或者链接已经失效。不过别担心——我正在处理。',
    cta: '返回首页',
    hint: '检查一下地址，或者用上面的导航。',
  },

  /* ── 外观／随一天时间变化的功能 ──────────────────────────────────────── */
  theme: {
    label: '外观',
    /* 视觉风格与明暗是两个独立的维度。 */
    styleAxisLabel: '视觉风格',
    modeAxisLabel: '浅色还是深色',
    styleAuto: '跟随时间',
    /* Said on the trigger itself, so a pinned style is visible without opening
       the panel. A pinned style silently overrules the schedule, and when that
       state is invisible the schedule gets reported as broken. */
    triggerAuto: '外观 — 跟随时间变化',
    triggerPinned: '外观 — 已固定，自动切换已暂停',
    /* The switch notice's button: a momentary request, so the pin it writes
       lapses at the next boundary. The panel's button stays permanent. */
    keepForNow: '本次先不变',
    /* The panel chip for that kind of pin: it says when it ends rather than
       implying it lasts. The placeholder is 'HH:MM'. */
    pinnedUntil: '保持至 {time}',
    styleAutoHint: '一天之中自动切换',
    modeFollowsStyle: '按设计',
    modeFollowsStyleHint: '每种风格预设的明暗程度',
    light: '浅色',
    dark: '深色',
    currentStyle: '风格：{name}',
    currentMode: '模式：{mode}',
    followsClock: '跟随时间变化',
    pinned: '已固定',
    pin: '保持这个外观',
    pinHint: '停止自动切换',
    reset: '恢复自动',
    nextChange: '{time} 切换为{style}',
    nextChangeUnknown: '切换时间未知',
    scheduleLabel: '每日时间表',
    style: {
      a: {
        name: '编辑排版',
        blurb: '衬线标题、发丝般纤细的分隔线，安静而正式。',
        rationale: '早晨——专业、正式的问询。',
      },
      b: {
        name: '终端风格',
        blurb: '等宽字体的元信息、锋利的直角，为深夜而生。',
        rationale: '傍晚与夜间——更有创意、更年轻的访客。',
      },
      c: {
        name: '杂志风',
        blurb: '暖调纸张、衬线正文，以图为主，不慌不忙。',
        rationale: '午后——更个人化、偏生活方式的读者。',
      },
    },
    explainer: {
      title: '这个网站会随一天的时间变化',
      body: '现在是{time}，所以你看到的是{style}风格。稍后它会自己切换。什么都没坏——它本来就该这样。',
      schedule: '早上是编辑排版，下午是杂志风，傍晚到深夜是终端风格。',
      keepThis: '保持这个风格',
      gotIt: '知道了',
      settings: '外观设置',
    },
  },
};
