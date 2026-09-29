// Content layer — timeline.
// Migrated from src/pages/about/timeline/eventsData.js.
// Copy (title/description/dateLabel) is preserved verbatim; no wording was changed.
// Ordered strictly newest-first: `date` is an ISO prefix, so lexicographic
// descending order is chronological descending order. The undated entry
// ('Started Learning to Speak') sorts last and carries `dateLabel` instead.

export const timeline = [
  {
    id: 'moved-back-to-wenzhou',
    category: 'personal',
    date: '2025-01',
    datePrecision: 'month',
    i18n: {
      en: {
        title: 'Moved back to Wenzhou, the hometown',
        description: 'Moved back to Wenzhou, Zhejiang, China, marking the start of a new chapter.',
      },
      zh: {
        title: '回到家乡温州',
        description: '回到中国浙江温州，开始新的一章。',
      },
    },
  },
  {
    id: 'in-china-affairs-advisor-le-lostec',
    audiences: ['trade'],
    category: 'career',
    date: '2025',
    ongoing: true,
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'In-China Affairs Advisor — Le Lostec Family, Lorient, France',
        description: "Working remotely as the general advisor for the Le Lostec family's affairs in China, primarily as a translator. The relationship began at the 2023 IRONMAN Wenzhou race, where Jeremy served as chief translator and met Mr. Le Lostec and his son Milan, who is planning to start a business in China.",
      },
      zh: {
        title: '中国事务顾问 — Le Lostec 家族，法国洛里昂',
        description: '远程担任 Le Lostec 家族中国事务的总顾问，主要做翻译工作。这段关系始于 2023 年 IRONMAN 温州站的比赛，Jeremy 在那场比赛中担任首席翻译，结识了 Le Lostec 先生和他计划在中国创业的儿子 Milan。',
      },
    },
  },
  {
    id: 'senior-assistant-to-chairman-zhejiang-yunchuang',
    audiences: ['trade'],
    category: 'career',
    date: '2025',
    ongoing: true,
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Senior Assistant to Chairman — Zhejiang Yunchuang Printing Technology Co., Ltd.',
        description: 'Serving as Senior Assistant to the Chairman and Foreign Affairs Specialist at Zhejiang Yunchuang Printing Technology Co., Ltd. in Wenzhou, handling international communications and day-to-day executive support.',
      },
      zh: {
        title: '董事长高级助理 — 浙江云创印刷科技有限公司',
        description: '在温州的浙江云创印刷科技有限公司担任董事长高级助理兼外事专员，负责国际沟通与日常高管支持工作。',
      },
    },
  },
  {
    id: 'co-founded-carpe-lucem-brand',
    audiences: ['trade','web'],
    category: 'career',
    date: '2025',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Co-founded Carpe Lucem Brand',
        description: 'Co-founded the Carpe Lucem brand in Hangzhou, focused on imported food and international lifestyle products targeting high-net-worth clients. Currently in the planning and development phase.',
      },
      zh: {
        title: '联合创立 Carpe Lucem 品牌',
        description: '在杭州联合创立 Carpe Lucem 品牌，面向高净值客户，专注进口食品与国际生活方式产品。目前处于规划与开发阶段。',
      },
    },
  },
  {
    id: 'arbitrage-trading-system-engineer',
    category: 'career',
    date: '2025',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Arbitrage Trading System Engineer',
        description: 'Developed and maintained an arbitrage trading system as part of a fintech project based in Wenzhou, Zhejiang.',
      },
      zh: {
        title: '套利交易系统工程师',
        description: '作为浙江温州一个金融科技项目的一部分，开发并维护了一套套利交易系统。',
      },
    },
  },
  {
    id: 'qingdao-beer-festival-english-translator-event-planner',
    audiences: ['events'],
    category: 'career',
    date: '2025',
    datePrecision: 'year',
    i18n: {
      en: {
        title: '2025 Qingdao Beer Festival — English Translator & Event Planner',
        description: 'Served as English translator and peripheral event planner for the 2025 Qingdao Beer Festival · "Flavour Trilogy" event, Qingdao, Shandong.',
      },
      zh: {
        title: '2025 青岛啤酒节 — 英语翻译与活动策划',
        description: '在山东青岛担任 2025 青岛啤酒节 · “Flavour Trilogy” 活动的英语翻译与周边活动策划。',
      },
    },
  },
  {
    id: 'hisense-plaza-black-gold-member-event',
    audiences: ['events'],
    category: 'career',
    date: '2025',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Hisense Plaza Black Gold Member Event — Translator & Event Planner',
        description: 'Served as English translator and event planner for the Hisense Plaza Black Gold VIP Member Event "Three Seas · Amber Promise", Qingdao.',
      },
      zh: {
        title: '海信广场黑金会员活动 — 翻译与活动策划',
        description: '在青岛担任海信广场黑金 VIP 会员活动 “Three Seas · Amber Promise” 的英语翻译与活动策划。',
      },
    },
  },
  {
    id: 'great-wall-cigars-maybach-north-china-event',
    audiences: ['events'],
    category: 'career',
    date: '2025',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Great Wall Cigars × Maybach — North China Car Owner Event Planner',
        description: 'Planned and coordinated the Great Wall Cigars × Maybach North China car owner exclusive event in Qingdao.',
      },
      zh: {
        title: 'Great Wall Cigars × Maybach — 华北车主活动策划',
        description: '在青岛策划并协调 Great Wall Cigars × Maybach 华北车主专属活动。',
      },
    },
  },
  {
    id: 'al-bahlaoui-family-china-affairs-advisor',
    audiences: ['trade'],
    category: 'career',
    date: '2025',
    ongoing: true,
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'General Advisor to the Al-Bahlaoui Family — Morocco (in-China affairs)',
        description: 'General advisor and accompanying interpreter for the Al-Bahlaoui family of Morocco in their affairs in China, from 2022 and ongoing, working from Qingdao and remotely.',
      },
      zh: {
        title: 'Al-Bahlaoui 家族总顾问 — 摩洛哥（中国事务）',
        description: '为摩洛哥 Al-Bahlaoui 家族在中国的事务担任总顾问兼随行翻译，自 2022 年起持续至今，在青岛及远程工作。',
      },
    },
  },

  {
    id: 'chinese-cigar-industry-export-specialist',
    audiences: ['trade'],
    category: 'career',
    date: '2025',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Foreign Trade Specialist — Chinese Cigar Industry Export, Hangzhou',
        description: 'Worked as a foreign trade specialist on a project taking the Chinese cigar industry to overseas markets, based in Hangzhou, Zhejiang.',
      },
      zh: {
        title: '外贸专员 — 中国雪茄产业出口，杭州',
        description: '在浙江杭州参与一个把中国雪茄产业推向海外市场的项目，担任外贸专员。',
      },
    },
  },

  {
    id: 'graduated-shandong-university-science-technology',
    audiences: ['institutions'],
    category: 'career',
    date: '2024-06',
    datePrecision: 'month',
    i18n: {
      en: {
        title: 'Graduated from Shandong University of Science and Technology',
        description: "Graduated in 2024 from Shandong University of Science and Technology with a Bachelor's degree in Surveying Engineering and Technology (Marine Direction — Hydrographic Surveying), marking the completion of the formal academic path.",
      },
      zh: {
        title: '毕业于山东科技大学',
        description: '2024 年毕业于山东科技大学，获测绘工程与技术专业学士学位（海洋方向 — 海道测量），标志正规学业阶段的完成。',
      },
    },
  },
  {
    id: 'industrial-ai-engineer',
    category: 'career',
    date: '2024',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Industrial AI Engineer',
        description: 'Worked as an Industrial Artificial Intelligence Engineer on a project based in Hangzhou, Zhejiang, developing and integrating AI systems for industrial applications.',
      },
      zh: {
        title: '工业人工智能工程师',
        description: '在浙江杭州的一个项目中担任工业人工智能工程师，开发并整合面向工业应用的 AI 系统。',
      },
    },
  },
  {
    id: 'mercedes-amg-g-class-test-drive-translator',
    audiences: ['events'],
    category: 'career',
    date: '2024',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Mercedes-AMG & G-Class Test Drive — English Translator & VIP Guest',
        description: 'Served as English interpreter and special invited guest at the 2024 Mercedes-AMG and G-Class full-range test drive event in Qingdao.',
      },
      zh: {
        title: 'Mercedes-AMG 与 G-Class 试驾 — 英语翻译与 VIP 嘉宾',
        description: '在青岛举办的 2024 年 Mercedes-AMG 与 G-Class 全系试驾活动中担任英语口译与特邀嘉宾。',
      },
    },
  },
  {
    id: 'taishan-cigars-international-brand-ambassador',
    audiences: ['events'],
    category: 'career',
    date: '2024',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Taishan Cigars — International Brand Ambassador',
        description: 'Appointed as International Brand Ambassador for Taishan Cigars, Qingdao, representing the brand in international communications and events.',
      },
      zh: {
        title: 'Taishan Cigars — 国际品牌大使',
        description: '被任命为青岛 Taishan Cigars 的国际品牌大使，代表品牌参与国际沟通与活动。',
      },
    },
  },
  {
    id: 'taishan-cigars-qingdao-whisky-festival-translator',
    audiences: ['events'],
    category: 'career',
    date: '2024',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Taishan Cigars × Qingdao International Whisky Festival — Translator & VIP Guest',
        description: 'Served as English translator and special invited guest at the Taishan Cigars Qingdao International Whisky Festival.',
      },
      zh: {
        title: 'Taishan Cigars × 青岛国际威士忌节 — 翻译与 VIP 嘉宾',
        description: '在 Taishan Cigars 青岛国际威士忌节上担任英语翻译与特邀嘉宾。',
      },
    },
  },
  {
    id: 'great-wall-cigars-cameroon-formula-french-translator',
    audiences: ['events'],
    category: 'career',
    date: '2024',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Great Wall Cigars Cameroon Formula — French Translator & VIP Guest',
        description: 'Served as French translator and special invited guest at the Great Wall Cigars Cameroon International Formula domestic tasting tour in Qingdao.',
      },
      zh: {
        title: 'Great Wall Cigars Cameroon Formula — 法语翻译与 VIP 嘉宾',
        description: '在青岛举办的 Great Wall Cigars Cameroon International Formula 国内品鉴巡演中担任法语翻译与特邀嘉宾。',
      },
    },
  },
  {
    id: 'lamborghini-urus-se-launch-translator',
    audiences: ['events'],
    category: 'career',
    date: '2024',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Lamborghini Urus SE Launch — English Translator & VIP Guest',
        description: '"Dare To Live More" — Lamborghini Urus SE new car launch event, Qingdao. Served as English interpreter and special invited guest.',
      },
      zh: {
        title: 'Lamborghini Urus SE 上市 — 英语翻译与 VIP 嘉宾',
        description: '“Dare To Live More” — Lamborghini Urus SE 新车上市活动，青岛。担任英语口译与特邀嘉宾。',
      },
    },
  },
  {
    id: 'ferrari-certified-pre-owned-day-translator',
    audiences: ['events'],
    category: 'career',
    date: '2024',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Ferrari Certified Pre-Owned Day — English Translator & VIP Guest',
        description: '"A Ferrari Day" certified pre-owned experience event, Qingdao. Served as English interpreter and special invited guest.',
      },
      zh: {
        title: 'Ferrari 认证二手车日 — 英语翻译与 VIP 嘉宾',
        description: '“A Ferrari Day” 认证二手车体验活动，青岛。担任英语口译与特邀嘉宾。',
      },
    },
  },
  {
    id: 'porsche-new-panamera-launch-german-translator',
    audiences: ['events'],
    category: 'career',
    date: '2024',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Porsche New Panamera Launch — German Translator',
        description: 'Served as German interpreter at the all-new Porsche Panamera launch event in Qingdao.',
      },
      zh: {
        title: 'Porsche 全新 Panamera 上市 — 德语翻译',
        description: '在青岛举办的 Porsche 全新 Panamera 上市活动中担任德语口译。',
      },
    },
  },
  {
    id: 'whitty-family-china-affairs-interpreter',
    audiences: ['trade'],
    category: 'career',
    date: '2024',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Interpreter to the Whitty Family — London, UK (in-China affairs)',
        description: 'Accompanying interpreter for the Whitty family of London for their affairs in China, from 2020 to 2024.',
      },
      zh: {
        title: 'Whitty 家族翻译 — 英国伦敦（中国事务）',
        description: '为伦敦 Whitty 家族在中国的事务担任随行翻译，时间从 2020 年到 2024 年。',
      },
    },
  },

  {
    id: 'sdust-international-student-interpreter',
    audiences: ['institutions', 'events'],
    category: 'career',
    date: '2024',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Interpreter for International Students — Shandong University of Science and Technology',
        description: 'Provided interpreting so international students at SDUST could live, seek medical care and study in China, and organised cross-cultural events and student societies. From 2020 to 2024.',
      },
      zh: {
        title: '国际学生翻译 — 山东科技大学',
        description: '为 SDUST 的国际学生提供口译服务，帮助他们在中国生活、就医和学习，并组织跨文化活动与学生社团。时间从 2020 年到 2024 年。',
      },
    },
  },

  {
    id: 'ironman-wenzhou-chief-translator',
    audiences: ['events','trade'],
    category: 'career',
    date: '2023',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'IRONMAN China Wenzhou — Chief Translator (EN/FR/ZH)',
        description: 'Served as Chief Translator (Chinese, English, French) at the 2023 IRONMAN China · Wenzhou Long-Distance Triathlon International Open. Met the Le Lostec family from Lorient, France, which led to an ongoing professional relationship.',
      },
      zh: {
        title: 'IRONMAN China 温州 — 首席翻译（英/法/中）',
        description: '在 2023 年 IRONMAN China · 温州长距离铁人三项国际公开赛中担任首席翻译（中文、英语、法语）。结识了来自法国洛里昂的 Le Lostec 家族，由此开始了一段持续至今的合作关系。',
      },
    },
  },
  {
    id: 'police-interpreter-qingdao-economic-development-zone',
    audiences: ['events'],
    category: 'career',
    date: '2023',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Police Interpreter — Qingdao Economic Development Zone',
        description: 'Served as interpreter for a Bangladeshi witness statement recording at the Qingdao Economic and Technological Development Zone Public Security Bureau.',
      },
      zh: {
        title: '警务翻译 — 青岛经济技术开发区',
        description: '在 Qingdao Economic and Technological Development Zone Public Security Bureau 为一名孟加拉国证人的证词笔录录制担任翻译。',
      },
    },
  },
  {
    id: 'founded-yicai-fencheng-innovation-studio',
    audiences: ['institutions'],
    category: 'career',
    date: '2023',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Founded "Yicai Fencheng" Innovation Studio & Transplendid Society',
        description: 'Founded the "译彩纷呈" (Yicai Fencheng) innovation and entrepreneurship studio, the Transplendid multilingual interest society, and the "United Nations" international exchange club at Shandong University of Science and Technology.',
      },
      zh: {
        title: '创立 “译彩纷呈” 创新工作室与 Transplendid 社团',
        description: '在山东科技大学创立了 “译彩纷呈” 创新创业工作室、Transplendid 多语言兴趣社团，以及 “United Nations” 国际交流俱乐部。',
      },
    },
  },
  {
    id: 'english-teacher-nas-system-builder',
    audiences: ['institutions','web'],
    category: 'career',
    date: '2023',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'English Teacher & NAS System Builder — SE Research Society',
        description: 'Taught English and wrote question banks, and built an internal NAS system for the SE Research Society in Qingdao. Left voluntarily — the pay was low relative to the workload.',
      },
      zh: {
        title: '英语教师与 NAS 系统搭建 — SE Research Society',
        description: '在青岛的 SE Research Society 教授英语、编写题库，并为其搭建了一套内部 NAS 系统。主动离职 —— 相对工作量而言薪资偏低。',
      },
    },
  },
  {
    id: 'started-developing-personal-website',
    audiences: ['web'],
    category: 'career',
    date: '2023',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Started Developing My Personal Website',
        description: 'Started developing a personal portfolio website using Vue.js, showcasing skills, projects, and achievements.',
      },
      zh: {
        title: '开始开发个人网站',
        description: '开始使用 Vue.js 开发个人作品集网站，展示技能、项目与成果。',
      },
    },
  },
  {
    id: 'container-shipping-translator-qingdao-weigang',
    audiences: ['trade'],
    category: 'career',
    date: '2022',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Container Shipping Translator — Qingdao Weigang',
        description: 'Worked as translator and foreign affairs specialist at Qingdao Weigang Container Transportation Co., Ltd.',
      },
      zh: {
        title: '集装箱航运翻译 — 青岛维港集装箱运输有限公司',
        description: '在青岛维港集装箱运输有限公司担任翻译与外事专员。',
      },
    },
  },
  {
    id: 'full-subject-tutor-international-student-coordinator',
    audiences: ['institutions'],
    category: 'career',
    date: '2022',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Full-Subject Tutor & International Student Activity Coordinator',
        description: 'Taught all subjects at Hangzhi Education, and served as general coordinator for international student activities at Shandong University of Science and Technology — organising on-campus events during the pandemic lockdown, which were later cancelled as restrictions eased.',
      },
      zh: {
        title: '全科家教与国际学生活动协调人',
        description: '在 Hangzhi Education 教授各科课程，并担任山东科技大学国际学生活动的总协调人 —— 在疫情封控期间组织校内活动，这些活动后来随限制放宽而被取消。',
      },
    },
  },
  {
    id: 'private-in-home-full-subject-tutor',
    audiences: ['institutions'],
    category: 'career',
    date: '2022',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Private In-Home Tutor — all school subjects, Qingdao',
        description: 'Provided in-home tutoring across all school subjects.',
      },
      zh: {
        title: '私人上门家教 — 全科，青岛',
        description: '提供覆盖全部学校科目的上门家教。',
      },
    },
  },

  {
    id: 'head-sommelier-sunac-aduo-village-resort',
    category: 'career',
    date: '2021',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Head Sommelier — Sunac Aduo Village Resort',
        description: 'Served as Head Sommelier at the Sunac Aduo Village resort in Qingdao. Alongside the role, built a drinks reference: around 140 notes on wine, spirits, beer and sake, including a classical-cocktail collection of 108 recipes. It is a working reference rather than a deliverable.',
      },
      zh: {
        title: '首席侍酒师 — 融创·阿朵小镇',
        description: '在青岛的融创·阿朵小镇担任首席侍酒师。任职期间自建了一套酒类资料库：约 140 篇笔记，涵盖葡萄酒、烈酒、啤酒与清酒，其中一部经典鸡尾酒集收录 108 个配方。属于自用参考资料，不是交付物。',
      },
    },
  },
  {
    id: 'luna-education-full-subject-tutor',
    audiences: ['institutions'],
    category: 'career',
    date: '2021',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Full-Subject Tutor — Luna Education, Wenzhou',
        description: 'Tutored middle-school students during school holidays, covering homework support and previewing upcoming material. Left to study in Qingdao.',
      },
      zh: {
        title: '全科家教 — Luna Education，温州',
        description: '在学校假期为初中生辅导，包括作业辅导与即将学习内容的预习。后为到青岛求学而离开。',
      },
    },
  },

  {
    id: 'took-the-gaokao',
    audiences: ['institutions'],
    category: 'education',
    date: '2020-07',
    datePrecision: 'month',
    i18n: {
      en: {
        title: 'Took the Gaokao (Chinese National College Entrance Exam)',
        description: 'Took the Gaokao in July 2020, which was postponed due to the COVID-19 pandemic. Scored 135/150 in English. A key milestone in the academic journey.',
      },
      zh: {
        title: '参加高考（中国全国大学入学考试）',
        description: '2020 年 7 月参加高考，考试因 COVID-19 疫情而推迟。英语成绩 135/150 分。这是学业历程中的一个关键节点。',
      },
    },
  },
  {
    id: 'shareholder-ja-poultry-farm-uganda',
    audiences: ['trade'],
    category: 'career',
    date: '2020',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Shareholder — JA Poultry Farm, Uganda',
        description: 'Became a Chinese shareholder in JA Poultry Farm, Wakiso, Uganda, participating in an overseas agricultural investment.',
      },
      zh: {
        title: '股东 — JA Poultry Farm，乌干达',
        description: '成为乌干达瓦基索的 JA Poultry Farm 的中方股东，参与一项海外农业投资。',
      },
    },
  },
  {
    id: 'founded-jtc-atelier',
    audiences: ['trade'],
    category: 'career',
    date: '2020',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Founded JTC Atelier — Custom Leather & Jewelry Brand',
        description: 'Founded JTC Atelier in March 2020, a personal brand specialising in custom leather goods and jewellery, based in Wenzhou. The brand was profitable; development was paused for study.',
      },
      zh: {
        title: '创立 JTC Atelier — 定制皮具与珠宝品牌',
        description: '2020 年 3 月在温州创立个人品牌 JTC Atelier，专注定制皮具与珠宝。品牌是盈利的；为求学而暂停发展。',
      },
    },
  },
  {
    id: 'bike-flying-heroes-club-technician',
    category: 'career',
    date: '2020',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Bicycle Technician — Bike Flying Heroes Club',
        description: 'Provided bicycle repair, servicing and personalised fitting for club members and customers, from 2018 to 2020.',
      },
      zh: {
        title: '自行车技师 — Bike Flying Heroes Club',
        description: '为俱乐部会员与客户提供自行车维修、保养与个性化调校，时间从 2018 年到 2020 年。',
      },
    },
  },

  {
    id: 'wenzhou-puluotuo-machinery-engineer',
    category: 'career',
    date: '2020',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Engineer — Wenzhou Puluotuo Electromechanical Co., Ltd.',
        description: 'Inspected and signed off construction sites, verified landscaping stock, and reviewed construction drawings. Left to study in Qingdao.',
      },
      zh: {
        title: '工程师 — 温州普露托机电有限公司',
        description: '对施工现场进行查验与签认，核对景观苗木库存，并审阅施工图纸。后为到青岛求学而离开。',
      },
    },
  },

  {
    id: 'international-volunteer-ivhq-green-lion-bali',
    audiences: ['institutions'],
    category: 'personal',
    date: '2019',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'International Volunteer — IVHQ & The Green Lion, Bali, Indonesia',
        description: 'Served as an international volunteer with IVHQ and The Green Lion in Tampaksiring, Ubud, Bali, Indonesia. One of the formative international experiences.',
      },
      zh: {
        title: '国际志愿者 — IVHQ 与 The Green Lion，印度尼西亚巴厘岛',
        description: '在印度尼西亚巴厘岛乌布的 Tampaksiring 担任 IVHQ 与 The Green Lion 的国际志愿者。这是具有塑造意义的国际经历之一。',
      },
    },
  },
  {
    id: 'first-aid-certification-american-heart-association',
    category: 'personal',
    date: '2019',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'First Aid Certification — American Heart Association HeartSaver',
        description: 'Completed American Heart Association HeartSaver first aid training at the Shanghai Yuean Health Promotion Centre, earning an internationally recognised first aid certificate.',
      },
      zh: {
        title: '急救认证 — American Heart Association HeartSaver',
        description: '在上海悦安健康促进中心完成 American Heart Association HeartSaver 急救培训，获得一项国际认可的急救证书。',
      },
    },
  },

  {
    id: 'hosting-german-exchange-students-eisenach',
    audiences: ['institutions','events'],
    category: 'personal',
    date: '2018-09',
    datePrecision: 'month',
    i18n: {
      en: {
        title: 'Hosting German Exchange Students from Martin Luther Gymnasium, Eisenach',
        description: 'Serving as the general planner and chief translator for the hosting of German exchange students at Pingyang High School, Wenzhou.',
      },
      zh: {
        title: '接待来自 Martin Luther Gymnasium（Eisenach）的德国交换生',
        description: '在温州 Pingyang High School 担任接待德国交换生的总策划与首席翻译。',
      },
    },
  },
  {
    id: 'started-german-language-learning',
    audiences: ['institutions'],
    category: 'education',
    date: '2018-06',
    datePrecision: 'month',
    i18n: {
      en: {
        title: 'Started German Language Learning',
        description: 'Started learning German in high school as a fourth language, alongside English, Mandarin, and French, to broaden linguistic and cultural horizons.',
      },
      zh: {
        title: '开始学习德语',
        description: '高中时开始把德语作为第四语言学习，与英语、普通话和法语并行，以拓宽语言与文化视野。',
      },
    },
  },
  {
    id: 'won-icct-cross-cultural-communication-competition',
    audiences: ['institutions'],
    category: 'education',
    date: '2018',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Won ICCT Cross-Cultural Communication Competition — Provincial 2nd Prize',
        description: 'Won the Provincial Second Prize at the ICCT Cross-Cultural Communication Competition, recognising bilingual communication and intercultural competency.',
      },
      zh: {
        title: '获得 ICCT Cross-Cultural Communication Competition 省级二等奖',
        description: '在 ICCT Cross-Cultural Communication Competition 中获得省级二等奖，该奖项认可双语沟通与跨文化能力。',
      },
    },
  },
  {
    id: 'wenzhou-junior-road-cycling-champion',
    category: 'hobby',
    date: '2017',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Wenzhou Junior Road Cycling Champion — three consecutive years',
        description: 'Won the Wenzhou junior road cycling championship three years running, from 2014 to 2017.',
      },
      zh: {
        title: '温州青少年公路自行车冠军 — 连续三年',
        description: '从 2014 年到 2017 年，连续三年获得温州青少年公路自行车赛冠军。',
      },
    },
  },

  {
    id: 'graduated-from-middle-school',
    category: 'education',
    date: '2016',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Graduated from Middle School',
        description: 'Officially graduated from Kunyang Second Middle School, completing the junior high education phase after early entry of high school.',
      },
      zh: {
        title: '初中毕业',
        description: '从昆阳第二中学正式毕业，在提前进入高中之后完成初中学业阶段。',
      },
    },
  },
  {
    id: 'entered-high-school-early',
    audiences: ['institutions'],
    category: 'education',
    date: '2016',
    datePrecision: 'year',
    i18n: {
      en: {
        title: 'Entered High School early due to academic excellence',
        description: 'Entered Pingyang High School early due to academic excellence, starting the senior high education phase one semester earlier than ordinary students.',
      },
      zh: {
        title: '因学业优异提前进入高中',
        description: '因学业优异提前进入 Pingyang High School，比普通学生早一个学期开始高中学业阶段。',
      },
    },
  },
  {
    id: 'started-french-language-learning',
    audiences: ['institutions'],
    category: 'education',
    date: '2014-10',
    datePrecision: 'month',
    i18n: {
      en: {
        title: 'Started French Language Learning',
        description: 'Started learning French as a third language in middle school to explore the beauty of the language and culture.',
      },
      zh: {
        title: '开始学习法语',
        description: '初中时开始把法语作为第三语言学习，以探索语言与文化之美。',
      },
    },
  },
  {
    id: 'entered-middle-school',
    category: 'education',
    date: '2014-09',
    datePrecision: 'month',
    i18n: {
      en: {
        title: 'Entered Middle School',
        description: 'Entered Kunyang Second Middle School in the hometown, starting the junior high education phase.',
      },
      zh: {
        title: '进入初中',
        description: '进入家乡的昆阳第二中学，开始初中学业阶段。',
      },
    },
  },
  {
    id: 'graduated-from-primary-school',
    category: 'education',
    date: '2014-06',
    datePrecision: 'month',
    i18n: {
      en: {
        title: 'Graduated from Primary School',
        description: 'Graduated from Kunyang Third Primary School in the hometown, marking the completion of the primary education phase.',
      },
      zh: {
        title: '小学毕业',
        description: '从家乡的昆阳第三小学毕业，完成小学教育阶段。',
      },
    },
  },
  {
    id: 'entered-primary-school',
    category: 'education',
    date: '2008-06',
    datePrecision: 'month',
    i18n: {
      en: {
        title: 'Entered Primary School',
        description: 'Entered Kunyang Third Primary School in the hometown, starting the journey of formal education.',
      },
      zh: {
        title: '进入小学',
        description: '进入家乡的昆阳第三小学，开始正式教育的历程。',
      },
    },
  },
  {
    id: 'born-wenzhou',
    category: 'personal',
    date: '2002-03-22',
    datePrecision: 'day',
    i18n: {
      en: {
        title: 'Born in Wenzhou, China',
        description: 'Born on March 22, 2002, at 6:23 AM in Pingyang County, Wenzhou, Zhejiang, China. The journey began here.',
      },
      zh: {
        title: '出生于中国温州',
        description: '2002 年 3 月 22 日早上 6:23 出生于中国浙江温州平阳县。旅程从这里开始。',
      },
    },
  },
  {
    id: 'started-learning-to-speak',
    category: 'personal',
    date: null,
    datePrecision: 'none',
    i18n: {
      en: {
        title: 'Started Learning to Speak',
        description: 'Started learning to speak and communicate with the world in both English and Mandarin, marking the beginning of the journey of language acquisition.',
        dateLabel: 'The Time for Learning to Speak',
      },
      zh: {
        title: '开始学说话',
        description: '开始用英语和普通话学习说话、与世界交流，标志语言习得历程的起点。',
        dateLabel: '学习说话的时期',
      },
    },
  },
];
