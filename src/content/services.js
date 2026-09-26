// services.js — what Jeremy sells, as opposed to what he has built.
//
// WHY THIS EXISTS: `projects.js` answers "what have you made", which is a portfolio
// question. The site's actual goal is inbound work, which needs a different question
// answered: "what can I hire you for, and what does that include". Those are not the
// same list, so they are not the same file.
//
// `domain` is a FILTER FACET (`language` | `trade` | `tech`), not a ranking. The brief
// was explicit that the nine services are all equally important and should not be
// presented in tiers — the facet exists only so the card grid can be filtered down.
//
// ────────────────────────────────────────────────────────────────────────────────
// BILINGUAL BY DESIGN (decided 2026-09).
//
// Every entry carries both `en` and `zh` copy. `en` is not a translation of `zh`:
// the Chinese is written for the Chinese client who is deciding whether to make
// contact, and the English for the international one. Same facts, same promises,
// different argument — which is why the two are not mechanically parallel.
//
// `pick()` in resolve.js flattens this with per-field fallback to `en`, so a locale
// missing here degrades to English rather than to a bare key path.
//
// DRAFT COPY — still awaiting Jeremy's corrections. These descriptions are written
// from the evidence already in the content layer (the timeline, the projects, the
// skills entries and the testimonials). They deliberately make NO numeric claims,
// because none have been supplied yet. Anything that could be quantified is marked
// with `TODO(verify)` so it is obvious where real numbers belong.
// ────────────────────────────────────────────────────────────────────────────────

export const services = [
  {
    id: 'business-interpreting',
    audiences: ['events','trade'],
    domain: 'language',
    // Order here is the order the cards render in; it is deliberately the order a
    // prospective client is most likely to be shopping for.
    order: 1,
    featured: true,
    i18n: {
      en: {
        title: 'Business interpreting',
        languages: 'Chinese ↔ English · French · German',
        summary: 'Consecutive and whispered interpreting for meetings, negotiations, factory visits and trade shows — where getting the nuance wrong costs money.',
        includes: [
          'Meetings, negotiations and contract discussions',
          'Supplier and factory visits, technical walkthroughs',
          'Trade fairs and exhibition-booth support',
          'Police, legal and official statement interpreting',
        ],
        // TODO(verify): how many interpreting engagements in total?
      },
      zh: {
        title: '商务口译',
        languages: '中文 ↔ 英语 · 法语 · 德语',
        summary: '会议、谈判、验厂、展会上的交传与耳语同传——这些场合里，一个词译偏了就是真金白银。',
        includes: [
          '会议、谈判与合同洽谈',
          '供应商走访、工厂验厂与技术讲解',
          '展会现场与展位支持',
          '警务、法律与官方笔录口译',
        ],
      },
    },
  },
  {
    id: 'event-interpreting',
    audiences: ['events'],
    domain: 'language',
    order: 2,
    featured: true,
    i18n: {
      en: {
        title: 'Premium event interpreting',
        languages: 'Chinese ↔ English · French · German',
        summary: 'Interpreting at launches, tastings and VIP evenings, where the audience is small, the stakes are high and the script has to sound natural.',
        includes: [
          'Product launches and press events',
          'Brand tastings, VIP receptions and private viewings',
          'On-site coordination with the client’s own team',
          'Pre-event briefing and terminology preparation',
        ],
        // TODO(verify): were the motor launches commissioned by the brand directly or
        // through a PR / event agency? That changes who the ideal client is.
      },
      zh: {
        title: '高端活动口译',
        languages: '中文 ↔ 英语 · 法语 · 德语',
        summary: '发布会、品鉴会、VIP 晚宴上的口译——场子小、分量重，而且译出来的话得听着像人话。',
        includes: [
          '产品发布会与媒体活动',
          '品牌品鉴会、VIP 接待与私人导览',
          '现场与客户自有团队对接',
          '活动前沟通与术语准备',
        ],
      },
    },
  },
  {
    id: 'event-planning',
    audiences: ['events'],
    domain: 'language',
    order: 3,
    i18n: {
      en: {
        title: 'Event planning & on-site execution',
        languages: 'CN / EN / FR / DE',
        summary: 'Not only the language: planning the run of the event and running it on the day, from vendor coordination to handling international guests.',
        includes: [
          'Concept, run-sheet and contingency planning',
          'Vendor, venue and supplier coordination',
          'International guest handling and hospitality',
          'Bilingual hosting material and on-the-day MC support',
        ],
      },
      zh: {
        title: '活动策划与现场执行',
        languages: '中 / 英 / 法 / 德',
        summary: '不只是语言：从流程策划到当天落地，从供应商协调到国际嘉宾接待，一起管。',
        includes: [
          '方案构思、流程表与应急预案',
          '供应商、场地与搭建方协调',
          '国际嘉宾接待与全程陪同',
          '双语主持材料与当天主持支持',
        ],
      },
    },
  },
  {
    id: 'china-market-advisory',
    audiences: ['trade'],
    domain: 'trade',
    order: 4,
    i18n: {
      en: {
        title: 'China market advisory & business accompaniment',
        languages: 'CN / EN / FR / DE',
        summary: 'Ongoing advice and accompaniment for foreign individuals and firms handling affairs in China — the role of a trusted local counterpart rather than a one-off translator.',
        includes: [
          'Market entry research and partner screening',
          'Meeting accompaniment, negotiation support',
          'Cross-cultural and regulatory navigation',
          'Ongoing remote advisory between visits',
        ],
        // TODO(verify): scope and duration of the Le Lostec family engagement — this is
        // currently the strongest proof for this service.
      },
      zh: {
        title: '中国市场顾问与商务陪同',
        languages: '中 / 英 / 法 / 德',
        summary: '为在中国办事的外国个人和企业提供长期顾问与陪同——做你在国内信得过的对接口，而不是一次性的翻译。',
        includes: [
          '市场进入调研与合作伙伴筛选',
          '会议陪同与谈判支持',
          '跨文化与合规路径指引',
          '两次来访之间的远程顾问',
        ],
      },
    },
  },
  {
    id: 'cross-border-trade',
    audiences: ['trade'],
    domain: 'trade',
    order: 5,
    i18n: {
      en: {
        title: 'Cross-border trade — sourcing, documentation, logistics',
        languages: 'CN / EN / RU-aware',
        summary: 'End-to-end handling of an export or import line: finding the supplier, agreeing the specification, and getting the paperwork and shipping right.',
        includes: [
          'Supplier sourcing, vetting and quotation comparison',
          'Bilingual product specifications and documentation',
          'Logistics, customs and certificate coordination',
          'Quality inspection liaison and issue resolution',
        ],
        // TODO(verify): supplier counts, target volumes, current stage — for both the
        // cat-food export line and Carpe Lucem.
      },
      zh: {
        title: '跨境贸易——采购、单证、物流',
        languages: '中 / 英 / 具备俄语业务处理能力',
        summary: '一条进出口业务从头接到尾：找供应商、谈定规格、把单证和运输都办对。',
        includes: [
          '供应商开发、资质核查与报价比价',
          '双语产品规格书与各类单证',
          '物流、清关与证书协调',
          '验货对接与问题处理',
        ],
      },
    },
  },
  {
    id: 'websites',
    audiences: ['web','institutions'],
    domain: 'tech',
    order: 6,
    i18n: {
      en: {
        title: 'Websites for brands and small businesses',
        languages: 'CN / EN',
        summary: 'Company sites, brand sites and intranets — built to be handed over, not to lock you into a subscription.',
        includes: [
          'Company, brand and studio websites',
          'Multilingual builds with real language switching',
          'Hosting, deployment and domain setup',
          'Handover documentation and content updates',
        ],
        // TODO(verify): roughly how many sites delivered, and how many are live.
      },
      zh: {
        title: '品牌与中小企业网站',
        languages: '中 / 英',
        summary: '公司站、品牌站与内部系统——做完能交接给你，不靠订阅费把你绑住。',
        includes: [
          '公司、品牌与工作室网站',
          '真正能切换的多语言站点',
          '托管、部署与域名配置',
          '交接文档与后续内容维护',
        ],
      },
    },
  },
  {
    id: 'translation',
    audiences: ['institutions','trade'],
    domain: 'language',
    order: 7,
    i18n: {
      en: {
        title: 'Document translation',
        languages: 'CN ↔ EN · FR · DE',
        summary: 'Business and product material translated with the terminology kept consistent across a whole document set, not sentence by sentence.',
        includes: [
          'Business correspondence, contracts and tenders',
          'Product, packaging and marketing copy',
          'Technical and academic documents',
          'Bilingual layout checks and proofreading',
        ],
      },
      zh: {
        title: '文档翻译',
        languages: '中 ↔ 英 · 法 · 德',
        summary: '商务与产品材料翻译，术语在一整套文件里保持统一，而不是一句一句地各译各的。',
        includes: [
          '商务函件、合同与投标文件',
          '产品、包装与营销文案',
          '技术与学术文档',
          '双语排版核对与审校',
        ],
      },
    },
  },
  {
    id: 'language-teaching',
    audiences: ['institutions'],
    domain: 'language',
    order: 8,
    i18n: {
      en: {
        title: 'Language teaching — English, French, German',
        languages: 'For Chinese speakers',
        summary: 'One-to-one and small-group teaching, including exam preparation and the business language you actually need in a meeting.',
        includes: [
          'One-to-one tutoring and small-group sessions',
          'Exam and interview preparation',
          'Business and professional language coaching',
          'Curriculum design for tutoring centres',
        ],
      },
      zh: {
        title: '语言教学——英语、法语、德语',
        languages: '面向中文母语者',
        summary: '一对一与小班授课，包含应试准备，以及开会时真正用得上的那部分商务语言。',
        includes: [
          '一对一辅导与小班课',
          '考试与面试准备',
          '商务与职业语言训练',
          '培训机构课程体系设计',
        ],
      },
    },
  },
  {
    id: 'local-it',
    audiences: ['web','institutions'],
    domain: 'tech',
    order: 9,
    i18n: {
      en: {
        title: 'Local servers & on-premise AI',
        languages: 'CN / EN',
        summary: 'Private infrastructure for businesses that would rather not put their files in someone else’s cloud: internal file servers, and locally hosted AI models.',
        includes: [
          'NAS setup, internal file sharing and permissions',
          'Backup strategy and access control',
          'On-premise AI model deployment (Ollama and similar)',
          'Staff handover, documentation and support',
        ],
      },
      zh: {
        title: '本地服务器与私有化 AI',
        languages: '中 / 英',
        summary: '给不愿意把文件放进别人云里的企业做私有基础设施：内部文件服务器，以及跑在自己机器上的 AI 模型。',
        includes: [
          'NAS 搭建、内部文件共享与权限设置',
          '备份策略与访问控制',
          '本地部署 AI 模型（Ollama 等）',
          '员工交接、文档与后续支持',
        ],
      },
    },
  },
];

/**
 * Filter facets for the card grid. Kept beside the data so a new domain value cannot
 * be added without its label being accounted for (verify-i18n checks the enum labels).
 */
export const SERVICE_DOMAINS = ['language', 'trade', 'tech'];
