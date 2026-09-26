// Content layer — structure at top level, all display copy under i18n.en (see SCHEMA.md).
export const projects = [
  {
    id: 1,
    /* `tier` decides presentation only — every project stays in the content layer and
       appears in the full index on /projects, including the archived ones. Nothing is
       deleted; 'archived' means "not promoted", not "hidden". */
    tier: 'featured',
    audiences: ['web'],
    slug: 'jeremys-portfolio-website',
    status: 'in-progress',
    progress: 99,
    link: 'https://jeremythierrychan.github.io/portfolio/',
    tech: ['Vue.js', 'CSS', 'JavaScript'],
    cofounder: null,
    stages: [],
    i18n: {
      en: {
        title: "Jeremy's Portfolio Website",
        description:
          'Personal portfolio website built with Vue.js, showcasing skills, work history, timeline and projects. Continuously updated.',
      },
      zh: {
        title: 'Jeremy 的个人作品集网站',
        description:
          '使用 Vue.js 构建的个人作品集网站，展示技能、工作经历、时间线与项目。持续更新中。',
      },
    },
  },

  {
    id: 2,
    /* `tier` decides presentation only — every project stays in the content layer and
       appears in the full index on /projects, including the archived ones. Nothing is
       deleted; 'archived' means "not promoted", not "hidden". */
    tier: 'featured',
    audiences: ['trade','web'],
    slug: 'carpe-lucem-brand',
    status: 'in-progress',
    progress: 15,
    link: 'https://jeremythierrychan.github.io/CarpeLucem/',
    tech: ['Brand Strategy', 'International Trade', 'Product Sourcing'],
    cofounder: null,
    stages: [
      {
        id: 'concept-branding',
        completed: true,
        i18n: {
          en: {
            name: 'Concept & Branding',
            description: 'Defining brand identity, values, and target market.',
          },
          zh: {
            name: '概念与品牌',
            description: '确定品牌定位、价值观与目标市场。',
          },
        },
      },
      {
        id: 'product-sourcing',
        completed: false,
        i18n: {
          en: {
            name: 'Product Sourcing',
            description: 'Identifying and establishing relationships with international suppliers.',
          },
          zh: {
            name: '产品采购',
            description: '寻找并建立与国际供应商的合作关系。',
          },
        },
      },
      {
        id: 'market-entry',
        completed: false,
        i18n: {
          en: {
            name: 'Market Entry',
            description: 'Launching the first product line in the Chinese market.',
          },
          zh: {
            name: '市场进入',
            description: '在中国市场推出第一条产品线。',
          },
        },
      },
      {
        id: 'growth',
        completed: false,
        i18n: {
          en: {
            name: 'Growth',
            description: 'Expanding the product catalogue and customer base.',
          },
          zh: {
            name: '增长',
            description: '扩充产品品类与客户群体。',
          },
        },
      },
    ],
    i18n: {
      en: {
        title: 'Carpe Lucem Brand',
        description:
          'Co-founded Carpe Lucem, an imported food and drink brand for high-net-worth clients. What exists today is a complete operating kit rather than a concept: an eleven-category product knowledge base of 19 documents and roughly 6,000 lines, running from Iberian ham through caviar to wine; a 289-line SKU ledger with origins and supply-chain costs; dossiers on six suppliers; a 124-page bilingual product catalogue; a brand identity extended across cigar bands, a wax seal, business cards and event material; a membership scheme; and seven tasting-event templates with six fully written run-sheets. Still outstanding: most of the ledger has no supplier or retail price recorded, and there is no product photography yet.',
      },
      zh: {
        title: 'Carpe Lucem 品牌',
        description:
          '联合创立 Carpe Lucem，一个面向高净值客户的进口食品与酒水品牌。目前沉淀下来的不是概念，而是一整套可复用的经营工具：11 个品类的产品知识库，19 份文档约 6,000 行，从伊比利亚火腿写到鱼子酱与葡萄酒；289 条 SKU 台账，记录产地与供应链成本；6 家供应商资料；124 页中英双语产品名录；延伸到雪茄标、火漆印章、名片与活动物料的品牌视觉；一套会员方案；以及 7 种品鉴会模板与 6 份完整执行方案。尚待补齐的部分也一并写明：台账中大部分条目还没有登记供应商与零售价，产品图目前一张都没有。',
      },
    },
  },

  {
    id: 3,
    /* ── TODO(verify): what the audit of this project could NOT establish ──────────
       These came out of a read-only audit of the source tree (2026-09) and are recorded
       here so they are not lost, because every one of them is a claim the public copy
       deliberately does NOT make. Decide per item whether to fix it, or to disclose it.

       1. `README.md` advertises three strategies — funding-rate, cross-exchange spread and
          cash-and-carry. Only the cross-exchange spread strategy EXISTS: `strategies/`
          holds base.py, runner.py and spread.py, and the runner registers `spread` alone.
          The public description names only the spread strategy for that reason.

       2. The four files under `tests/` each REDEFINE the function they test instead of
          importing it, so they cannot fail when production code drifts. That is worse than
          having no tests, because it looks like coverage. Worth either fixing or deleting.

       3. `logs/arbitrage.log` contains 23 lines from three starts on one day, and every
          start failed to connect to all three exchanges ("已连接交易所: []"). There is no
          record of a successful data pull or fill anywhere in the repo. So: no credible
          claim of having run live, and none is made on the site.

       4. One commit ("first commit"), with no iteration history, and `git status` was
          never confirmed clean (iCloud enumeration timed out during the audit).

       Next question for Jeremy: should this be presented as a working system with an
       unproven live record, or as an engineering exercise? The copy currently does the
       former without the latter's claims. */
    /* `tier` decides presentation only — every project stays in the content layer and
       appears in the full index on /projects, including the archived ones. Nothing is
       deleted; 'archived' means "not promoted", not "hidden". */
    tier: 'featured',
    slug: 'arbitrage-trading-system',
    status: 'in-progress',
    progress: 70,
    link: null,
    tech: ['Python', 'FastAPI', 'React', 'SQLAlchemy', 'ccxt', 'Docker'],
    cofounder: null,
    stages: [
      {
        id: 'research',
        completed: true,
        i18n: {
          en: {
            name: 'Research',
            description: 'Analysing arbitrage strategies and market data sources.',
          },
          zh: {
            name: '研究',
            description: '分析套利策略与市场数据来源。',
          },
        },
      },
      {
        id: 'development',
        completed: true,
        i18n: {
          en: {
            name: 'Development',
            description: 'Building the core trading engine and API integrations.',
          },
          zh: {
            name: '开发',
            description: '构建核心交易引擎与 API 对接。',
          },
        },
      },
      {
        id: 'testing',
        completed: false,
        i18n: {
          en: {
            name: 'Testing',
            description: 'Backtesting strategies and stress-testing the system.',
          },
          zh: {
            name: '测试',
            description: '对策略进行回测，并对系统做压力测试。',
          },
        },
      },
      {
        id: 'deployment',
        completed: false,
        i18n: {
          en: {
            name: 'Deployment',
            description: 'Live deployment and ongoing monitoring.',
          },
          zh: {
            name: '部署',
            description: '实盘部署与持续监控。',
          },
        },
      },
    ],
    i18n: {
      en: {
        title: 'Arbitrage Trading System',
        description:
          'Cross-exchange perpetual-futures arbitrage system, built end to end. A FastAPI backend of 46 Python modules (about 6,400 lines) handles async SQLAlchemy storage, ccxt exchange adapters and WebSocket market data; a ten-page React console (about 5,500 lines) covers opportunity scanning, spread analysis, positions, orders and backtesting. Risk control is explicit rather than implied: a 10% stop on combined leg P and L, position size taken from the smaller of the two exchange balances so both legs stay equal, funding-imbalance alerts, spread thresholds derived from rolling 15-minute statistics, and gradient entry in 1:2:4:8 steps as the spread widens. Runs in paper, testnet or live mode, with a separate arming switch that must be turned on before any real order can be sent. Deploys three ways: a local script, Docker Compose, or a NAS overlay that detects a stale bind mount and recreates the container.',
      },
      zh: {
        title: '套利交易系统',
        description:
          '跨交易所永续合约套利系统，前后端全部自建。后端为 FastAPI，46 个 Python 模块约 6,400 行，负责异步 SQLAlchemy 存储、ccxt 交易所适配与 WebSocket 行情；前端是十个页面的 React 控制台（约 5,500 行），覆盖机会扫描、价差分析、仓位、订单与回测。风控写得很明确，而不是含糊带过：两腿合计盈亏达到 10% 止损；仓位数取自两所余额中较小的一个，确保两腿等量；资金失衡告警；价差阈值由滚动 15 分钟统计得出；价差扩大时按 1:2:4:8 梯度加仓。支持模拟盘、测试网与实盘三种模式，且实盘另有一道「武装」开关，不打开就绝不会发出真实订单。部署有三条路径：本地脚本、Docker Compose，以及一个能识别绑定挂载失效并重建容器的 NAS overlay。',
      },
    },
  },

  {
    id: 4,
    /* `tier` decides presentation only — every project stays in the content layer and
       appears in the full index on /projects, including the archived ones. Nothing is
       deleted; 'archived' means "not promoted", not "hidden". */
    tier: 'archived',
    slug: 'forex-strategy-system',
    status: 'in-progress',
    progress: 60,
    link: null,
    tech: ['Python', 'Numbers', 'Trading Platforms'],
    cofounder: null,
    stages: [],
    i18n: {
      en: {
        title: 'Forex Strategy System',
        description:
          'A personal forex trading system built around an equidistant price grid and a moving-average ribbon. The interesting part is not the indicator but the verification: a Python backtester formalises a rule that until then existed only as a hand-maintained spreadsheet — a five-digit pattern over four prior prices, with a palindromic A-B-C-B-A match marking the breakout level — and it reproduced the spreadsheet without matching it exactly (63.5% against 64.4%). The gap was traced rather than waved away: 91 placeholder rows in the sheet were generating spurious hits. A companion generator emits 3,000 grid lines per script using exact decimal formatting, because the Pine parser on TradingView rejects scientific notation.',
      },
      zh: {
        title: '外汇策略系统',
        description:
          '一套个人外汇交易系统，围绕等距价格网格与均线带（MA Ribbon）搭建。真正值得讲的不是指标，而是验证：一个 Python 回测脚本把此前只存在于手工表格里的规则形式化——用前四个价格的五位性质码做匹配，命中回文结构 A-B-C-B-A 即判定该位为突破位——复现结果与手工表格接近但并不相同（代码 63.5%，手工 64.4%）。这个差异没有被敷衍过去，而是被查清并写了下来：表格里有 91 个占位行产生了伪命中。配套生成器每个脚本输出 3,000 条网格线，并采用精确十进制格式化，因为 TradingView 的 Pine 解析器不接受科学计数法。',
      },
    },
  },

  {
    id: 5,
    /* `tier` decides presentation only — every project stays in the content layer and
       appears in the full index on /projects, including the archived ones. Nothing is
       deleted; 'archived' means "not promoted", not "hidden". */
    tier: 'featured',
    audiences: ['trade'],
    slug: 'russia-cat-food-export-project',
    status: 'in-progress',
    progress: 25,
    link: null,
    tech: ['International Trade', 'Russian', 'Documentation'],
    cofounder: null,
    stages: [
      {
        id: 'market-research',
        completed: true,
        i18n: {
          en: {
            name: 'Market Research',
            description: 'Identifying product requirements and Russian market demand.',
          },
          zh: {
            name: '市场调研',
            description: '明确产品要求与俄罗斯市场需求。',
          },
        },
      },
      {
        id: 'procurement-specification',
        completed: true,
        i18n: {
          en: {
            name: 'Procurement Specification',
            description: 'Drafting Chinese and Russian product sourcing documents.',
          },
          zh: {
            name: '采购规格',
            description: '起草中俄双语的产品采购文件。',
          },
        },
      },
      {
        id: 'supplier-matching',
        completed: false,
        i18n: {
          en: {
            name: 'Supplier Matching',
            description: 'Finding and vetting suitable domestic suppliers.',
          },
          zh: {
            name: '供应商匹配',
            description: '寻找并筛选合适的国内供应商。',
          },
        },
      },
      {
        id: 'export-logistics',
        completed: false,
        i18n: {
          en: {
            name: 'Export & Logistics',
            description: 'Coordinating shipping and customs documentation.',
          },
          zh: {
            name: '出口与物流',
            description: '协调运输与报关文件。',
          },
        },
      },
    ],
    i18n: {
      en: {
        title: 'Russia Cat Food Export Project',
        description:
          'Sourcing and export project for hypoallergenic baked cat food aimed at the Russian market. The Russian party opened with a requirement it could not itself specify — a dry food that neutralises the Fel D1, D2 and D4 cat allergens — and the work has been turning that into something a factory can actually make: a bilingual specification covering two formulas with guaranteed analysis, ingredient and additive tables and price schedules; a written request to the manufacturer for the exact composition, which the buyer had said it was unable to provide; and a pushed-for written answer to four technical questions, including whether the anti-allergen antibodies survive the high-temperature extrusion process. The answer came back that they are applied as a final coating after the main process. Technical documentation is complete; clearance paperwork has not been started.',
      },
      zh: {
        title: '俄罗斯猫粮出口项目',
        description:
          '面向俄罗斯市场的低敏烘焙猫粮采购与出口项目。俄方带着一个自己都说不清的需求找上门——一款能中和 Fel D1、D2、D4 猫过敏原的干粮——这项工作的实质，就是把它变成工厂真正能生产的东西：为两个配方产出双语规格书，含保证分析值、原料与添加剂表及价格明细；向厂家索要精确配方成分，而这恰恰是采购方自称提供不了的；并推动厂家就四个技术问题给出书面答复，其中包括抗过敏抗体能否经受高温膨化工艺。答复是：抗体在主工艺之后做最终表面包衣。技术文档已完成，清关单证尚未启动。',
      },
    },
  },

  {
    id: 6,
    /* `tier` decides presentation only — every project stays in the content layer and
       appears in the full index on /projects, including the archived ones. Nothing is
       deleted; 'archived' means "not promoted", not "hidden". */
    tier: 'featured',
    audiences: ['web'],
    slug: 'parallel-offset-band-website',
    status: 'in-progress',
    progress: 30,
    link: 'https://jeremythierrychan.github.io/ParallelOffset/',
    tech: ['Next.js', 'React', 'TypeScript', 'next-intl'],
    cofounder: null,
    stages: [
      {
        id: 'design',
        completed: true,
        i18n: {
          en: {
            name: 'Design',
            description: 'Defining the visual identity and layout for the band website.',
          },
          zh: {
            name: '设计',
            description: '确定乐队网站的视觉风格与版面布局。',
          },
        },
      },
      {
        id: 'development',
        /* Marked complete because the site is built and serving: every one of the eight
           locales returns HTTP 200 at the live URL. Leaving this false next to a working
           link was the more misleading option. `content` stays open and `progress` is
           left for Jeremy to set — only he knows whether the band still owes material. */
        completed: true,
        i18n: {
          en: {
            name: 'Development',
            description: 'Building the site structure and pages.',
          },
          zh: {
            name: '开发',
            description: '搭建网站结构与页面。',
          },
        },
      },
      {
        id: 'content',
        completed: false,
        i18n: {
          en: {
            name: 'Content',
            description: 'Adding discography, members, and media.',
          },
          zh: {
            name: '内容',
            description: '添加作品目录、成员信息与媒体素材。',
          },
        },
      },
      {
        id: 'launch',
        completed: true,
        i18n: {
          en: {
            name: 'Launch',
            description: 'Publishing and promoting the site.',
          },
          zh: {
            name: '上线',
            description: '发布并推广网站。',
          },
        },
      },
    ],
    i18n: {
      en: {
        title: 'Parallel Offset — Band Website',
        description:
          'Official website for Parallel Offset. Built with Next.js and React, and genuinely multilingual rather than an English site with a switcher bolted on: eight locales ship, including Arabic with full right-to-left layout. About 1,350 lines covering the band biography, discography and release pages, deployed to GitHub Pages and live at the link below, where every locale answers.',
      },
      zh: {
        title: 'Parallel Offset — 乐队网站',
        description:
          '平行偏移乐队的官方网站。用 Next.js 与 React 构建，是真正的多语言站点，而不是英文站加一个切换按钮：一共上线 8 种语言，其中包含需要完整从右到左排版的阿拉伯语。乐队简介、作品目录与专辑页面合计约 1,350 行，部署在 GitHub Pages 上，下方链接可直接访问，各语言版本均能正常打开。',
      },
    },
  },

  {
    id: 7,
    /* `tier` decides presentation only — every project stays in the content layer and
       appears in the full index on /projects, including the archived ones. Nothing is
       deleted; 'archived' means "not promoted", not "hidden". */
    tier: 'listed',
    audiences: ['web'],
    slug: 'designer-portfolio-website',
    status: 'in-progress',
    progress: 50,
    /* Link withheld: the URL is the client's own name, which defeats the point of
       describing her anonymously. See scripts/withheld-names.mjs. */
    link: null,
    tech: ['Vue.js', 'CSS', 'JavaScript'],
    cofounder: null,
    stages: [],
    i18n: {
      en: {
        title: 'A Designer Portfolio Website',
        description: 'A portfolio website built for a designer friend, using Vue.js. Currently in active development.',
      },
      zh: {
        title: '某设计师的作品集网站',
        description: '为一位设计师朋友制作的个人作品集网站，使用 Vue.js。目前正在积极开发中。',
      },
    },
  },

  {
    id: 8,
    /* `tier` decides presentation only — every project stays in the content layer and
       appears in the full index on /projects, including the archived ones. Nothing is
       deleted; 'archived' means "not promoted", not "hidden". */
    tier: 'listed',
    audiences: ['web'],
    slug: 'research-institute-web-tool',
    status: 'in-progress',
    progress: 35,
    /* Link withheld — it is the client's name. See scripts/withheld-names.mjs. */
    link: null,
    tech: ['JavaScript', 'Vue.js'],
    cofounder: null,
    stages: [],
    i18n: {
      en: {
        title: 'Research Institute Web Tool',
        description:
          'A web application tool currently under active development. The most recently updated project in the workspace.',
      },
      zh: {
        title: '某研究机构内部工具',
        description:
          '一个正在积极开发中的 Web 应用工具。是工作区中最近更新的项目。',
      },
    },
  },

  {
    id: 9,
    /* `tier` decides presentation only — every project stays in the content layer and
       appears in the full index on /projects, including the archived ones. Nothing is
       deleted; 'archived' means "not promoted", not "hidden". */
    tier: 'archived',
    audiences: ['institutions'],
    slug: 'family-tutoring-centre',
    status: 'in-progress',
    progress: 20,
    link: null,
    tech: ['Research', 'Curriculum Design', 'Documentation'],
    cofounder: null,
    stages: [],
    i18n: {
      en: {
        title: 'Family Tutoring Centre',
        description:
          'Supporting the planning and curriculum development for a family-run tutoring centre. Covers subject categorisation, university preparation tracks, and learning resources.',
      },
      zh: {
        title: '家庭补习中心',
        description:
          '为一家家庭经营的补习中心提供筹备规划与课程开发支持。涵盖科目分类、升学备考方向与学习资源。',
      },
    },
  },

  {
    id: 10,
    /* `tier` decides presentation only — every project stays in the content layer and
       appears in the full index on /projects, including the archived ones. Nothing is
       deleted; 'archived' means "not promoted", not "hidden". */
    tier: 'archived',
    audiences: ['web'],
    slug: 'recipe-generator',
    status: 'in-progress',
    progress: 10,
    link: null,
    tech: ['Vue', 'Axios', 'Recipe API'],
    cofounder: null,
    stages: [
      {
        id: 'planning',
        completed: true,
        i18n: {
          en: {
            name: 'Planning',
            description: 'Defining app features and selecting recipe APIs.',
          },
          zh: {
            name: '规划',
            description: '确定应用功能并选择菜谱 API。',
          },
        },
      },
      {
        id: 'ui-ux',
        completed: false,
        i18n: {
          en: {
            name: 'UI/UX',
            description: 'Designing the user interface and experience.',
          },
          zh: {
            name: 'UI/UX',
            description: '设计用户界面与使用体验。',
          },
        },
      },
      {
        id: 'api-integration',
        completed: false,
        i18n: {
          en: {
            name: 'API Integration',
            description: 'Integrating the recipe API to fetch suggestions based on ingredients.',
          },
          zh: {
            name: 'API 对接',
            description: '接入菜谱 API，根据食材获取推荐结果。',
          },
        },
      },
      {
        id: 'testing',
        completed: false,
        i18n: {
          en: {
            name: 'Testing',
            description: 'Testing recipe generation and UI functionality.',
          },
          zh: {
            name: '测试',
            description: '测试菜谱生成与界面功能。',
          },
        },
      },
    ],
    i18n: {
      en: {
        title: 'Recipe Generator',
        description: 'An app that automatically generates recipes based on available ingredients.',
      },
      zh: {
        title: '菜谱生成器',
        description: '一款根据现有食材自动生成菜谱的应用。',
      },
    },
  },

  {
    id: 17,
    /* `tier` decides presentation only — every project stays in the content layer and
       appears in the full index on /projects, including the archived ones. Nothing is
       deleted; 'archived' means "not promoted", not "hidden". */
    tier: 'listed',
    audiences: ['institutions','web'],
    slug: 'training-centre-intranet-website',
    status: 'in-progress',
    progress: 80,
    link: null,
    tech: ['Vue.js', 'CSS', 'JavaScript'],
    cofounder: null,
    stages: [],
    i18n: {
      en: {
        title: 'Training Centre — Intranet Website',
        description:
          "Internal promotional website built for a local training centre. Deployed on the organisation's intranet. No public URL.",
      },
      zh: {
        title: '培训机构 — 内网网站',
        description:
          '为一家本地培训机构制作的对内宣传网站。部署在该机构的内网环境中。没有公开网址。',
      },
    },
  },

  {
    id: 18,
    /* `tier` decides presentation only — every project stays in the content layer and
       appears in the full index on /projects, including the archived ones. Nothing is
       deleted; 'archived' means "not promoted", not "hidden". */
    tier: 'listed',
    audiences: ['web'],
    slug: 'taoist-culture-website',
    status: 'in-progress',
    progress: 15,
    link: 'https://jeremythierrychan.github.io/Taoism/',
    tech: ['Next.js', 'JavaScript'],
    cofounder: null,
    stages: [],
    i18n: {
      en: {
        title: 'Taoist Culture Website',
        description:
          'Bilingual website for a professional fortune-teller and practitioner of Taoist culture, live and navigable at the link below: four pages (home, services, consultation, about) in Chinese and English, on the Next.js App Router with a locale segment and message catalogues. About 1,170 lines of application code plus the bilingual copy, deployed through GitHub Actions. All three commits are the author own, and the framework template survives in only the first of them — the two unused default SVGs still sitting in the public folder are the trace of a business layer written by hand on top of a scaffold. What remains is content rather than code: the site is complete and online while the practitioner is still supplying his material.',
      },
      zh: {
        title: '道家文化网站',
        description:
          '为一位职业命理师、道家文化实践者制作的网站。下方链接可直接访问：首页、服务、预约、关于四个页面，中英双语，基于 Next.js App Router 的 locale 路由与语言包实现。应用代码约 1,170 行，另有双语文案，通过 GitHub Actions 自动部署。三次提交全部由本人完成，脚手架只存在于第一次提交里——public 目录下至今躺着两个未被引用的默认 SVG，正是业务层在脚手架上手写留下的痕迹。剩下的工作是内容而非代码：网站已完成并上线，命理师本人的素材仍在陆续提供。',
      },
    },
  },

  {
    id: 19,
    /* `tier` decides presentation only — every project stays in the content layer and
       appears in the full index on /projects, including the archived ones. Nothing is
       deleted; 'archived' means "not promoted", not "hidden". */
    tier: 'featured',
    audiences: ['trade','web'],
    slug: 'lacquora-lacquer-art-guitar',
    status: 'in-progress',
    progress: 30,
    link: 'https://jeremythierrychan.github.io/Lacquora/',
    tech: ['Vue.js', 'Node.js', 'Docker'],
    cofounder: 'A local heritage lacquer-art studio',
    stages: [],
    i18n: {
      en: {
        title: 'Lacquora — Lacquer Art Guitar',
        description:
          'A niche project combining traditional intangible cultural heritage lacquer art with custom electric guitars. A collaboration between Jeremy and a local studio working in intangible cultural heritage lacquer art. Includes a showcase website, product pages, and a backend server.',
      },
      zh: {
        title: 'Lacquora — 漆艺吉他',
        description:
          '将传统非物质文化遗产漆艺与定制电吉他结合的小众项目。由 Jeremy 与一家本地非遗漆艺工作室合作开展。包含展示网站、产品页面与一个后端服务器。',
      },
    },
  },

  {
    id: 20,
    /* `tier` decides presentation only — every project stays in the content layer and
       appears in the full index on /projects, including the archived ones. Nothing is
       deleted; 'archived' means "not promoted", not "hidden". */
    tier: 'listed',
    audiences: ['web'],
    slug: 'printing-company-official-website',
    status: 'paused',
    progress: 60,
    /* Link withheld — it is the client's name. See scripts/withheld-names.mjs. */
    link: null,
    tech: ['Astro', 'CSS', 'JavaScript'],
    cofounder: null,
    stages: [],
    i18n: {
      en: {
        title: 'Printing Company — Official Website',
        description: 'Official website for a printing company, built with Astro. Live on GitHub Pages.',
      },
      zh: {
        title: '印刷企业 — 官方网站',
        description: '为一家印刷企业制作的官方网站，使用 Astro 构建。已在 GitHub Pages 上线。',
      },
    },
  },

  {
    id: 11,
    /* `tier` decides presentation only — every project stays in the content layer and
       appears in the full index on /projects, including the archived ones. Nothing is
       deleted; 'archived' means "not promoted", not "hidden". */
    tier: 'archived',
    audiences: ['institutions'],
    slug: 'family-genealogy-website',
    status: 'paused',
    progress: 20,
    link: null,
    tech: ['Vue.js', 'JavaScript', 'XMind'],
    cofounder: null,
    stages: [],
    i18n: {
      en: {
        title: 'Family Genealogy Website',
        description:
          'Digitising and presenting a family genealogy spanning sixteen generations. The website carries a relationship engine that resolves the most recent common ancestor between any two recorded people and renders the resulting Chinese kinship term, plus a lineage tree of 369 nodes drawn as hand-written SVG with pan, zoom and in-tree search. The underlying records are a private family archive, so the project is described here rather than linked.',
      },
      zh: {
        title: '家族谱牒网站',
        description:
          '把一份跨越十六代的家族谱系数字化并加以呈现。网站包含一个关系查询引擎：求出任意两位族人之间最近的共同祖先，并给出对应的中文亲属称谓；另有一棵 369 个节点的世系树，用手写 SVG 绘制，支持平移、缩放与树内搜索。族谱数据属于家族私密资料，因此这里只作说明，不提供访问入口。',
      },
    },
  },

  {
    id: 12,
    /* `tier` decides presentation only — every project stays in the content layer and
       appears in the full index on /projects, including the archived ones. Nothing is
       deleted; 'archived' means "not promoted", not "hidden". */
    tier: 'archived',
    audiences: ['web'],
    slug: 'food-supplier-brand-website',
    status: 'paused',
    progress: 30,
    link: null,
    tech: ['Vue.js', 'CSS', 'JavaScript'],
    cofounder: null,
    stages: [],
    i18n: {
      en: {
        title: 'Food Supplier Brand Website',
        description:
          'Full website project for a food supplier brand, including frontend client and site planning.',
      },
      zh: {
        title: '食品供应商品牌网站',
        description:
          '为一家食品供应商品牌打造的完整网站项目，包含前端客户端与站点规划。',
      },
    },
  },

  {
    id: 13,
    /* `tier` decides presentation only — every project stays in the content layer and
       appears in the full index on /projects, including the archived ones. Nothing is
       deleted; 'archived' means "not promoted", not "hidden". */
    tier: 'archived',
    audiences: ['web'],
    slug: 'ceramic-studio-website',
    status: 'paused',
    progress: 25,
    link: null,
    tech: ['Vue.js', 'CSS'],
    cofounder: null,
    stages: [],
    i18n: {
      en: {
        title: 'Ceramic Studio Website',
        description:
          'Website project for a ceramic kiln and studio. Includes site architecture planning and frontend development.',
      },
      zh: {
        title: '陶艺工作室网站',
        description:
          '为一家陶瓷窑口与工作室制作的网站项目。包含站点架构规划与前端开发。',
      },
    },
  },

  {
    id: 14,
    /* `tier` decides presentation only — every project stays in the content layer and
       appears in the full index on /projects, including the archived ones. Nothing is
       deleted; 'archived' means "not promoted", not "hidden". */
    tier: 'archived',
    audiences: ['institutions','web'],
    slug: 'lacquerware-gallery',
    status: 'paused',
    progress: 15,
    link: null,
    tech: ['OpenMediaVault', 'NAS', 'Web Design'],
    cofounder: null,
    stages: [],
    i18n: {
      en: {
        title: 'Lacquerware Gallery',
        description:
          'Planning and technical setup for a lacquerware gallery, including an NAS infrastructure proposal and website design.',
      },
      zh: {
        title: '漆器馆',
        description:
          '为一家漆器馆进行规划与技术搭建，包含 NAS 基础设施方案与网站设计。',
      },
    },
  },

  {
    id: 15,
    /* `tier` decides presentation only — every project stays in the content layer and
       appears in the full index on /projects, including the archived ones. Nothing is
       deleted; 'archived' means "not promoted", not "hidden". */
    tier: 'listed',
    slug: 'minecraft-server',
    status: 'completed',
    progress: 100,
    link: null,
    tech: ['Java', 'Minecraft Server'],
    cofounder: 'A co-admin',
    stages: [],
    i18n: {
      en: {
        title: 'Minecraft Server',
        description:
          'A continuously running Minecraft server with plugin configuration, performance optimisation, and load balancing.',
      },
      zh: {
        title: 'Minecraft 服务器',
        description:
          '一台持续运行的 Minecraft 服务器，包含插件配置、性能优化与负载均衡。',
      },
    },
  },

  {
    id: 16,
    /* `tier` decides presentation only — every project stays in the content layer and
       appears in the full index on /projects, including the archived ones. Nothing is
       deleted; 'archived' means "not promoted", not "hidden". */
    tier: 'listed',
    audiences: ['institutions','web'],
    slug: 'internal-nas-system-se-research-society',
    status: 'completed',
    progress: 100,
    link: null,
    tech: ['OpenMediaVault', 'Linux', 'Networking'],
    cofounder: null,
    stages: [],
    i18n: {
      en: {
        title: 'Internal NAS System — SE Research Society',
        description:
          'Designed and built an internal NAS system for the SE Research Society at Shandong University of Science and Technology, enabling secure file sharing and team collaboration.',
      },
      zh: {
        title: '内部 NAS 系统 — SE Research Society',
        description:
          '为山东科技大学 SE Research Society 设计并搭建内部 NAS 系统，实现安全的文件共享与团队协作。',
      },
    },
  },
  {
    id: 21,
    /* `tier` decides presentation only — every project stays in the content layer and
       appears in the full index on /projects, including the archived ones. Nothing is
       deleted; 'archived' means "not promoted", not "hidden". */
    tier: 'listed',
    slug: 'csdn-teaching-blog',
    audiences: ['web', 'institutions'],
    status: 'in-progress',
    link: 'https://blog.csdn.net/JeremyTC',
    tech: ['Python', 'Technical writing'],
    cofounder: null,
    stages: [],
    i18n: {
      en: {
        title: 'CSDN Teaching Blog',
        description:
          'Technical articles on Python and programming, written in Chinese for a Chinese developer audience. The same teaching work as the public GitHub Python repository, and still being added to.',
      },
      zh: {
        title: 'CSDN 教学博客',
        description:
          '关于 Python 与编程的技术文章，用中文撰写，面向中文开发者读者。与公开的 GitHub Python 仓库属于同一项教学工作，目前仍在持续更新。',
      },
    },
  },
  {
    id: 22,
    tier: 'listed',
    slug: 'tarot-knowledge-system-and-course',
    audiences: ['institutions', 'events'],
    status: 'in-progress',
    link: null,
    tech: ['Obsidian', 'CorelDraw', 'XMind', 'Knowledge base design'],
    cofounder: null,
    stages: [],
    /* TODO(verify): no percentage is set on purpose — an audit found the project stalled
       with no measurable completion, so a number would be invented. The two things that
       would move it are both content: the 78 cards have no artwork, and the course has no
       written introduction (项目介绍.md is a 0-byte file). */
    i18n: {
      en: {
        title: 'Tarot Knowledge System & Course Design',
        description:
          'A tarot practice treated as a structured body of work rather than a hobby. The knowledge base runs to 97 documents: all 78 cards written up individually, plus nineteen methodology notes on spreads, reversed readings, the symbol vocabulary, astrological and Kabbalistic correspondences, reading cases and a learning path. On top of that sits a designed course — a recorded-course outline and its content plan, each as a mind map — and two CorelDraw pieces: a Tree of Life diagram and, more usefully, a divination cloth that re-lays that diagram as a layout you can actually deal onto. Stated plainly: the cards have text but no artwork, the course introduction was never written, and nothing has been sold.',
      },
      zh: {
        title: '塔罗知识体系与课程设计',
        description:
          '把塔罗当成一套成体系的东西来做，而不是当爱好。知识库共 97 篇文档：78 张牌逐张成文，另有 19 篇方法论，涵盖牌阵、逆位解读、符号辞典、占星与卡巴拉对应、解读案例与学习路径。在此之上是一套设计过的课程——录播课大纲与具体内容计划各一份思维导图——以及两件 CorelDraw 设计稿：一幅卡巴拉生命之树，以及更有用处的——一块把生命之树重新编排成能真正在布面上摊牌使用的占卜桌布。如实说明进度：78 张牌只有文字、没有配图，课程的项目介绍从未落笔，至今没有产生任何销售。',
      },
    },
  },
  {
    id: 23,
    tier: 'listed',
    slug: 'custom-guitar-design-engineering',
    audiences: ['trade', 'web'],
    status: 'in-progress',
    link: null,
    tech: ['CorelDraw', 'Parametric design', 'Python', 'XMind'],
    cofounder: null,
    stages: [],
    /* TODO(verify): two open questions from the audit. (1) The drawings are 27 .cdr files
       — CorelDraw's own format, which no browser and no Mac preview can open. Until they
       are exported to PNG/SVG/PDF this entry has no visual evidence at all, so the entry
       currently argues from design decisions alone. (2) The internal brand name used in
       the source files (JTC) was never confirmed as Jeremy's own, so it is deliberately
       not named here. */
    i18n: {
      en: {
        title: 'Custom Guitar Design Engineering',
        description:
          'The engineering behind a self-directed line of custom electric guitars. The strongest evidence is a set of design decisions rather than a finished instrument: twenty-seven CorelDraw drawings covering bodies, necks, fret spacing and string spacing, including a nine-string whose multi-scale (fan-fret) lengths are derived from the Fibonacci sequence rather than copied from an existing combination, and a body drawn to accept a Jackson 57.5 mm neck — cross-brand parts compatibility, not decoration. A separate folder holds eleven designs under revision, one of which records its own failure in its filename: string spacing too wide. Supporting it are a product and BOM workbook, a scale-length pairing table, a string-gauge and tension table, and a library organised by string count from five strings to a Bass VI. Stated plainly: no finished instrument has been photographed or delivered, the drawings need exporting before they can be shown, and the only script in the project — nineteen lines of Python solving the first string position on a multi-scale bridge with Pythagoras — is a first step, not a generator.',
      },
      zh: {
        title: '定制电吉他设计工程',
        description:
          '一套自研定制电吉他背后的设计工程。最硬的证据不是成品琴，而是一批设计决策：27 张 CorelDraw 图纸，覆盖琴体、琴颈、品距与弦距，其中包括一把九弦琴——它的多弦长（扇品）尺寸由斐波那契数列推导得出，而不是照抄现成的弦长组合——以及一个为容纳 Jackson 57.5mm 琴颈而绘制的琴体，这是跨品牌零件兼容性设计，不是装饰。另有一个目录收着 11 张「需调整」的设计稿，其中一张干脆把失败写进了文件名：弦距过宽。支撑材料包括产品与 BOM 表、弦长搭配表、琴弦规格与张力表，以及一个按弦数切分产品线的资料库，从五弦一直到 Bass VI。如实说明：没有任何成品琴被拍过照或交付过，图纸是 CorelDraw 格式、必须先导出才能展示，而项目里唯一的脚本——19 行 Python，用勾股关系解出多弦长琴桥处第一弦的位置——是第一步，不是生成器。',
      },
    },
  },
];
