/**
 * Skills content — 21 entries.
 *
 * Structure (top level): id, name, category, usage.
 *   - `name` is a proper noun (technology / language name), so it stays
 *     locale-neutral at the top level. `i18n.<locale>.name` overrides it where a
 *     locale genuinely translates the name — every skill below has a real Chinese
 *     name, so `zh` supplies one. That is the one sanctioned use of the exception.
 *   - `category` is the lowercase enum from SCHEMA.md, NOT the old display
 *     string: 'Programming Language' → 'programming', 'Language' → 'language',
 *     'Other' → 'other'.
 * Copy: `i18n.<locale>.description` (the prose blurb) and `i18n.<locale>.evidence[]`
 * (the checkable facts).
 *
 * WHY `evidence` MOVED UNDER `i18n` (2026-09): it used to sit at the top level, which
 * broke the schema's own first rule — "never put a user-visible sentence at the top
 * level". The consequence was invisible until the site became bilingual: a Chinese
 * visitor got a Chinese page carrying a list of English sentences, with no way to
 * translate them, because the resolver only reads copy from inside `i18n`. The fix is
 * a move, not a new concept; `pick()` spreads `evidence` back onto the flat object, so
 * consumers such as SkillsPage.vue still read `skill.evidence` unchanged.
 *
 * `usage` ('professional' | 'working' | 'learning') says HOW the skill is used, not how
 * good he is at it — a fact about whether client work depends on it, rather than a
 * self-awarded score. It replaced a `level: 90` percentage, which no visitor could verify.
 * `evidence` lists checkable facts, each taken from the CVs or verifiable in this repo.
 *
 * Migrated verbatim from the inline `skills: [...]` block in
 * src/pages/about/skills/SkillsPage.vue. Order and ids preserved.
 */

export const skills = [
  {
    id: 1,
    name: 'Vue.js',
    category: 'programming',
    usage: 'professional',
    i18n: {
      en: {
        description: 'JavaScript framework for building user interfaces. Used to build this portfolio website and several SPA projects with multi-language support and dark mode.',
        evidence: [
          'Every site in this portfolio is built with it, including the six-language version you are reading',
          'Multilingual routing and a full design-token layer written by hand',
        ],
      },
      zh: {
        description: '用于构建用户界面的 JavaScript 框架。本站与多个单页应用都用它开发，支持多语言与深色模式。',
        evidence: [
          '这个作品集里的每一个站点都用它构建，包括你正在读的六语言版本',
          '多语言路由与一整套手写设计令牌层',
        ],
      },
    },
  },
  {
    id: 2,
    name: 'JavaScript',
    category: 'programming',
    usage: 'professional',
    i18n: {
      en: {
        description: 'Core language for dynamic and interactive web applications, used across frontend and backend projects.',
        evidence: [
          'Powers the front end of this site with no framework beyond Vue itself',
          'Used for build tooling, export scripts and small Node utilities',
        ],
      },
      zh: {
        description: '构建动态、可交互 Web 应用的核心语言，前端与后端项目都在用。',
        evidence: [
          '本站前端除 Vue 之外没有引入任何框架，全部由它驱动',
          '用于构建工具、导出脚本与小型 Node 工具',
        ],
      },
    },
  },
  {
    id: 3,
    name: 'CSS / HTML',
    category: 'programming',
    usage: 'professional',
    i18n: {
      en: {
        description: 'Styling and markup for responsive, modern web interfaces. Comfortable with animations, grid, and flexbox layouts.',
        evidence: [
          'This site: three visual styles and two light levels from one token set, no CSS framework',
          'Grid, flexbox, container queries, and a reduced-motion path throughout',
        ],
      },
      zh: {
        description: '响应式现代网页的样式与结构。熟悉动画、Grid 与 Flexbox 布局。',
        evidence: [
          '本站：三套视觉风格 × 明暗两种模式，共用一套设计令牌，没有使用任何 CSS 框架',
          '全站用到 Grid、Flexbox、容器查询，并单独处理了「减少动态效果」偏好',
        ],
      },
    },
  },
  {
    id: 4,
    name: 'Node.js',
    category: 'programming',
    usage: 'working',
    i18n: {
      en: {
        description: 'Server-side JavaScript runtime for building backend services and APIs.',
        evidence: [
          'Build tooling and verification scripts for this site',
          'Backend services and APIs on earlier projects',
        ],
      },
      zh: {
        description: '服务端 JavaScript 运行时，用于搭建后端服务与接口。',
        evidence: [
          '本站的构建工具与校验脚本',
          '早期项目中的后端服务与接口',
        ],
      },
    },
  },
  {
    id: 5,
    name: 'Python',
    category: 'programming',
    usage: 'professional',
    i18n: {
      en: {
        description: 'Used for automation, data processing, AI model integration, and open-source project customisation (OpenClaw, Ollama, etc.).',
        evidence: [
          'Public teaching repository on GitHub (Python-Projects)',
          'Technical articles published on CSDN',
          'Arbitrage strategy research and backtesting',
          'Local AI model deployment and open-source tooling work',
        ],
      },
      zh: {
        description: '用于自动化、数据处理、AI 模型接入，以及开源项目的二次开发（OpenClaw、Ollama 等）。',
        evidence: [
          'GitHub 上的公开教学仓库（Python-Projects）',
          '在 CSDN 上发布的技术文章',
          '套利策略研究与回测',
          '本地 AI 模型部署与开源工具二次开发',
        ],
      },
    },
  },
  {
    id: 6,
    name: 'C',
    category: 'programming',
    usage: 'working',
    i18n: {
      en: {
        description: 'General-purpose language widely used for system programming, embedded systems and low-level development.',
        evidence: [
          'University coursework — surveying engineering programme',
        ],
      },
      zh: {
        description: '通用编程语言，广泛用于系统编程、嵌入式与底层开发。',
        evidence: [
          '大学课程——测绘工程专业',
        ],
      },
    },
  },
  {
    id: 7,
    name: 'C++',
    category: 'programming',
    usage: 'working',
    i18n: {
      en: {
        description: 'Extension of C with object-oriented capabilities, used for performance-critical applications.',
        evidence: [
          'University coursework — surveying engineering programme',
        ],
      },
      zh: {
        description: '在 C 基础上扩展出面向对象能力的语言，用于对性能要求高的场景。',
        evidence: [
          '大学课程——测绘工程专业',
        ],
      },
    },
  },
  {
    id: 8,
    name: 'Java',
    category: 'programming',
    usage: 'working',
    i18n: {
      en: {
        description: 'Used for server-side development and applications including Minecraft server setup and plugin management.',
        evidence: [
          'Minecraft server: plugin configuration, performance tuning and load balancing',
          'Server-side development coursework',
        ],
      },
      zh: {
        description: '用于服务端开发，包括 Minecraft 服务器的搭建与插件管理。',
        evidence: [
          'Minecraft 服务器：插件配置、性能调优与负载均衡',
          '服务端开发课程',
        ],
      },
    },
  },
  {
    id: 9,
    name: 'Matlab',
    category: 'programming',
    usage: 'working',
    i18n: {
      en: {
        description: 'High-level environment for numerical computing, data analysis, and algorithm development. Used during university coursework.',
        evidence: [
          'Numerical computing, data analysis and algorithm coursework',
        ],
      },
      zh: {
        description: '用于数值计算、数据分析与算法开发的高级环境。大学课程期间使用。',
        evidence: [
          '数值计算、数据分析与算法课程',
        ],
      },
    },
  },
  {
    id: 10,
    name: 'Microsoft Office / LibreOffice',
    category: 'other',
    usage: 'professional',
    i18n: {
      en: {
        description: 'Full proficiency across Word, Excel, PowerPoint, and their open-source equivalents.',
        evidence: [
          'Bilingual trade documentation: quotations, specifications and export papers',
          'Used daily for client-facing documents in three languages',
        ],
      },
      zh: {
        description: '熟练使用 Word、Excel、PowerPoint 及其开源替代品。',
        evidence: [
          '双语贸易单证：报价单、规格书与出口文件',
          '日常用三种语言处理对外客户文件',
        ],
      },
    },
  },
  {
    id: 11,
    name: 'Docker',
    category: 'other',
    usage: 'working',
    i18n: {
      en: {
        description: 'Container-based deployment for application isolation and reproducible environments.',
        evidence: [
          'Container deployment for the Lacquora project (Vue, Node.js, Docker)',
        ],
      },
      zh: {
        description: '基于容器的部署，用于应用隔离与可复现的运行环境。',
        evidence: [
          'Lacquora 项目的容器化部署（Vue、Node.js、Docker）',
        ],
      },
    },
  },
  {
    id: 12,
    name: 'Git / GitHub',
    category: 'other',
    usage: 'professional',
    i18n: {
      en: {
        description: 'Version control and team collaboration. All projects maintained on GitHub with structured branching and commit history.',
        evidence: [
          'Every project in this portfolio is public on GitHub',
          'Structured branching and commit history across team and solo work',
        ],
      },
      zh: {
        description: '版本控制与团队协作。所有项目都托管在 GitHub 上，有规范的分支与提交记录。',
        evidence: [
          '本作品集中的每个项目都在 GitHub 上公开',
          '个人与协作项目都保持了规范的分支与提交历史',
        ],
      },
    },
  },
  {
    id: 13,
    name: 'NAS & Home Server Setup',
    category: 'other',
    usage: 'professional',
    i18n: {
      en: {
        description: 'Built and maintained internal NAS systems using OpenMediaVault. Experience with Fedora, Ubuntu, Debian, and Kali Linux.',
        evidence: [
          'OpenMediaVault and TrueNAS deployments, including an internal file server for a university research society',
          'Debian, Ubuntu and Manjaro, with KDE, GNOME, MATE and Cinnamon',
        ],
      },
      zh: {
        description: '用 OpenMediaVault 搭建并维护内部 NAS 系统。熟悉 Fedora、Ubuntu、Debian 与 Kali Linux。',
        evidence: [
          'OpenMediaVault 与 TrueNAS 部署，其中包括为高校科研社团搭建的内部文件服务器',
          '使用过 Debian、Ubuntu 与 Manjaro，以及 KDE、GNOME、MATE、Cinnamon 桌面环境',
        ],
      },
    },
  },
  {
    id: 14,
    name: 'AI Integration (Ollama / OpenClaw)',
    category: 'other',
    usage: 'working',
    i18n: {
      en: {
        description: 'Secondary development and application of open-source AI models. Planning to train specialised models for Chinese and French language teaching.',
        evidence: [
          'Local model deployment with Ollama',
          'Secondary development and application of open-source AI tooling',
        ],
      },
      zh: {
        description: '开源 AI 模型的二次开发与应用。计划为中文与法语教学训练专用模型。',
        evidence: [
          '用 Ollama 做本地模型部署',
          '开源 AI 工具的二次开发与应用',
        ],
      },
    },
  },
  {
    id: 15,
    name: 'English',
    category: 'language',
    usage: 'professional',
    i18n: {
      en: {
        description: 'Native-level proficiency. IELTS 8.0. Gaokao English 135/150. University English 91/100 — full marks on every section except the essay. ETIC International English Test: Advanced Pass (2023); Intermediate and Basic both Pass with Merit. CET-6 583, CET-4 599. SIA Shanghai Advanced Interpreting Exam. Consecutive and simultaneous interpretation at IRONMAN China, a police witness statement, and brand launches.',
        evidence: [
          'IELTS 8.0',
          'ETIC International English Test — Advanced: Pass (2023); Intermediate and Basic both Pass with Merit',
          'CET-6 583 / CET-4 599',
          'Gaokao English 135/150 · University English 91/100',
          'Chief interpreter, IRONMAN China Wenzhou 2023',
          'SIA Shanghai Advanced Interpreting Exam',
        ],
      },
      zh: {
        name: '英语',
        description: '母语级水平。雅思 8.0。高考英语 135/150。大学英语 91/100——除作文外各单项满分。ETIC 国际人才英语考试：高级通过（2023），中级与初级均为优秀通过。CET-6 583 分，CET-4 599 分。SIA 上海高级口译考试。在 IRONMAN 中国赛、警方笔录以及品牌发布会上担任交传与同传。',
        evidence: [
          '雅思 8.0',
          'ETIC 国际人才英语考试——高级通过（2023）；中级与初级均为优秀通过',
          'CET-6 583 分 / CET-4 599 分',
          '高考英语 135/150 · 大学英语 91/100',
          '2023 IRONMAN 中国温州站首席翻译',
          'SIA 上海高级口译考试',
        ],
      },
    },
  },
  {
    id: 16,
    name: 'Mandarin Chinese',
    category: 'language',
    usage: 'professional',
    i18n: {
      en: {
        description: 'Native language. Also speaks Wenzhou dialect, Shanghai dialect, Sichuan dialect, and Shandong dialect.',
        evidence: [
          'Native speaker',
          'Also speaks Wenzhou, Shanghai, Sichuan and Shandong dialects',
        ],
      },
      zh: {
        name: '普通话',
        description: '母语。另可使用温州话、上海话、四川话与山东话。',
        evidence: [
          '母语使用者',
          '另可使用温州话、上海话、四川话与山东话',
        ],
      },
    },
  },
  {
    id: 17,
    name: 'French',
    category: 'language',
    usage: 'working',
    i18n: {
      en: {
        description: 'Self-taught, conversational proficiency. Served as French interpreter at IRONMAN China Wenzhou (2023) and at the Great Wall Cigars Cameroon Formula tasting tour (2024).',
        evidence: [
          'French interpreter, IRONMAN China Wenzhou 2023',
          'French interpreter, Great Wall Cigars Cameroon Formula tasting tour 2024',
        ],
      },
      zh: {
        name: '法语',
        description: '自学，可日常交流。曾在 IRONMAN 中国温州站（2023）与长城雪茄喀麦隆配方品鉴巡展（2024）担任法语翻译。',
        evidence: [
          '法语翻译，2023 IRONMAN 中国温州站',
          '法语翻译，2024 长城雪茄喀麦隆配方品鉴巡展',
        ],
      },
    },
  },
  {
    id: 18,
    name: 'German',
    category: 'language',
    usage: 'working',
    i18n: {
      en: {
        description: 'Self-taught. Working proficiency. Served as German interpreter at the Porsche new Panamera launch (2024). Hosted German exchange students from Martin Luther Gymnasium, Eisenach (2018).',
        evidence: [
          'German interpreter, Porsche new Panamera launch 2024',
          'Hosted German exchange students from Martin Luther Gymnasium, Eisenach 2018',
        ],
      },
      zh: {
        name: '德语',
        description: '自学。可胜任工作场景。曾在保时捷全新 Panamera 发布会（2024）担任德语翻译。2018 年接待来自艾森纳赫马丁·路德文理中学的德国交换生。',
        evidence: [
          '德语翻译，2024 保时捷全新 Panamera 发布会',
          '2018 年接待来自艾森纳赫 Martin Luther Gymnasium 的德国交换生',
        ],
      },
    },
  },
  {
    id: 19,
    name: 'Spanish',
    category: 'language',
    usage: 'learning',
    i18n: {
      en: {
        description: 'Currently learning. Beginner level.',
        evidence: [
          'Beginner — actively studying',
        ],
      },
      zh: {
        name: '西班牙语',
        description: '正在学习，入门水平。',
        evidence: [
          '入门水平——在学',
        ],
      },
    },
  },
  {
    id: 20,
    name: 'Italian',
    category: 'language',
    usage: 'learning',
    i18n: {
      en: {
        description: 'Currently learning. Beginner level.',
        evidence: [
          'Beginner — actively studying',
        ],
      },
      zh: {
        name: '意大利语',
        description: '正在学习，入门水平。',
        evidence: [
          '入门水平——在学',
        ],
      },
    },
  },
  {
    id: 21,
    name: 'Arabic',
    category: 'language',
    usage: 'learning',
    i18n: {
      en: {
        description: 'Currently learning. Beginner level.',
        evidence: [
          'Beginner — actively studying',
        ],
      },
      zh: {
        name: '阿拉伯语',
        description: '正在学习，入门水平。',
        evidence: [
          '入门水平——在学',
        ],
      },
    },
  },
];
