// src/projectsData.js
export const projects = [

  // ── In Progress ──────────────────────────────────────────────

  {
    id: 1,
    title: "Jeremy's Portfolio Website",
    description: 'Personal portfolio website built with Vue.js, showcasing skills, work history, timeline and projects. Continuously updated.',
    tech: 'Vue.js, CSS, JavaScript',
    link: 'https://jeremythierrychan.github.io/portfolio/',
    status: 'In Progress',
    progress: 99,
    displayType: 'simple',
    cofounder: '',
  },

  {
    id: 2,
    title: 'Carpe Lucem Brand',
    description: 'Co-founded Carpe Lucem, a brand focused on imported food and international lifestyle products targeting high-net-worth clients. Currently in planning and product sourcing phase.',
    tech: 'Brand Strategy, International Trade, Product Sourcing',
    link: '',
    status: 'In Progress',
    progress: 15,
    stages: [
      { name: 'Concept & Branding', description: 'Defining brand identity, values, and target market.', completed: true },
      { name: 'Product Sourcing', description: 'Identifying and establishing relationships with international suppliers.', completed: false },
      { name: 'Market Entry', description: 'Launching the first product line in the Chinese market.', completed: false },
      { name: 'Growth', description: 'Expanding the product catalogue and customer base.', completed: false },
    ],
    displayType: 'detailed',
    cofounder: 'Co-founder',
  },

  {
    id: 3,
    title: 'Arbitrage Trading System',
    description: 'Automated arbitrage trading system covering strategy research, engine development, backtesting, and live monitoring.',
    tech: 'Python, Financial APIs',
    link: '',
    status: 'In Progress',
    progress: 70,
    stages: [
      { name: 'Research', description: 'Analysing arbitrage strategies and market data sources.', completed: true },
      { name: 'Development', description: 'Building the core trading engine and API integrations.', completed: true },
      { name: 'Testing', description: 'Backtesting strategies and stress-testing the system.', completed: false },
      { name: 'Deployment', description: 'Live deployment and ongoing monitoring.', completed: false },
    ],
    displayType: 'detailed',
    cofounder: '',
  },

  {
    id: 4,
    title: 'Forex Strategy System',
    description: 'An active personal forex trading system built around the 369 strategy and MA Ribbon indicators. Includes strategy code, data tracking, and ongoing iteration.',
    tech: 'Python, Numbers, Trading Platforms',
    link: '',
    status: 'In Progress',
    progress: 60,
    displayType: 'simple',
    cofounder: '',
  },

  {
    id: 5,
    title: 'Russia Cat Food Export Project',
    description: 'Sourcing and export project for cat food products to the Russian market. Handling procurement specifications, supplier liaison, and documentation in both Chinese and Russian.',
    tech: 'International Trade, Russian, Documentation',
    link: '',
    status: 'In Progress',
    progress: 25,
    stages: [
      { name: 'Market Research', description: 'Identifying product requirements and Russian market demand.', completed: true },
      { name: 'Procurement Specification', description: 'Drafting Chinese and Russian product sourcing documents.', completed: true },
      { name: 'Supplier Matching', description: 'Finding and vetting suitable domestic suppliers.', completed: false },
      { name: 'Export & Logistics', description: 'Coordinating shipping and customs documentation.', completed: false },
    ],
    displayType: 'detailed',
    cofounder: '',
  },

  {
    id: 6,
    title: 'Parallel Offset — Band Website',
    description: 'Official website for Parallel Offset, a progressive metal band. Includes band info, discography, and album details.',
    tech: 'Vue.js, CSS, JavaScript',
    link: '',
    status: 'In Progress',
    progress: 30,
    stages: [
      { name: 'Design', description: 'Defining the visual identity and layout for the band website.', completed: true },
      { name: 'Development', description: 'Building the site structure and pages.', completed: false },
      { name: 'Content', description: 'Adding discography, members, and media.', completed: false },
      { name: 'Launch', description: 'Publishing and promoting the site.', completed: false },
    ],
    displayType: 'detailed',
    cofounder: '',
  },

  {
    id: 7,
    title: "Catherine's Portfolio Website",
    description: "A portfolio website built for a friend, using Vue.js. Currently in active development.",
    tech: 'Vue.js, CSS, JavaScript',
    link: '',
    status: 'In Progress',
    progress: 50,
    displayType: 'simple',
    cofounder: '',
  },

  {
    id: 8,
    title: 'LetterResearchINST',
    description: 'A web application tool currently under active development. The most recently updated project in the workspace.',
    tech: 'JavaScript, Vue.js',
    link: '',
    status: 'In Progress',
    progress: 35,
    displayType: 'simple',
    cofounder: '',
  },

  {
    id: 9,
    title: 'Family Tutoring Centre',
    description: "Supporting the planning and curriculum development for a family-run tutoring centre. Covers subject categorisation, university preparation tracks, and learning resources.",
    tech: 'Research, Curriculum Design, Documentation',
    link: '',
    status: 'In Progress',
    progress: 20,
    displayType: 'simple',
    cofounder: '',
  },

  {
    id: 10,
    title: 'Recipe Generator',
    description: 'An app that automatically generates recipes based on available ingredients.',
    tech: 'Vue, Axios, Recipe API',
    link: '',
    status: 'In Progress',
    progress: 10,
    stages: [
      { name: 'Planning', description: 'Defining app features and selecting recipe APIs.', completed: true },
      { name: 'UI/UX', description: 'Designing the user interface and experience.', completed: false },
      { name: 'API Integration', description: 'Integrating the recipe API to fetch suggestions based on ingredients.', completed: false },
      { name: 'Testing', description: 'Testing recipe generation and UI functionality.', completed: false },
    ],
    displayType: 'detailed',
    cofounder: '',
  },

  {
    id: 17,
    title: 'Muyang Education — Intranet Website',
    description: 'Internal promotional website built for Muyang Education (沐阳教育), a local training centre. Deployed on the organisation\'s intranet. No public URL.',
    tech: 'Vue.js, CSS, JavaScript',
    link: '',
    status: 'In Progress',
    progress: 80,
    displayType: 'simple',
    cofounder: '',
  },

  {
    id: 18,
    title: 'Qianyuan — Taoist Culture Website',
    description: 'Website for Qianyuan (乾元), a professional fortune-teller and practitioner of Taoist culture. Currently in early development with content being gradually populated.',
    tech: 'Next.js, JavaScript',
    link: '',
    status: 'In Progress',
    progress: 15,
    displayType: 'simple',
    cofounder: '',
  },

  {
    id: 19,
    title: 'Lacquora — Lacquer Art Guitar',
    description: 'A niche project combining traditional intangible cultural heritage lacquer art with custom electric guitars. A collaboration between Jeremy and Pingyang Lacquer Art (平阳漆器), a local ICH studio. Includes a showcase website, product pages, and a backend server.',
    tech: 'Vue.js, Node.js, Docker',
    link: '',
    status: 'In Progress',
    progress: 30,
    displayType: 'simple',
    cofounder: 'Pingyang Lacquer Art (平阳漆器)',
  },

  // ── Paused ───────────────────────────────────────────────────

  {
    id: 11,
    title: 'Family Genealogy Website (陳氏宗譜)',
    description: 'Digitising and presenting the Chen family genealogy spanning multiple generations. Includes a website for browsing lineage records and an XMind knowledge map of historical clan information.',
    tech: 'Vue.js, JavaScript, XMind',
    link: '',
    status: 'Paused',
    progress: 20,
    displayType: 'simple',
    cofounder: '',
  },

  {
    id: 12,
    title: 'Wokete Brand Website',
    description: 'Full website project for the Wokete (沃可特) brand, including frontend client and site planning.',
    tech: 'Vue.js, CSS, JavaScript',
    link: '',
    status: 'Paused',
    progress: 30,
    displayType: 'simple',
    cofounder: '',
  },

  {
    id: 13,
    title: 'Qing Shan Kiln Website (箐山隐)',
    description: 'Website project for a ceramic kiln and studio. Includes site architecture planning and frontend development.',
    tech: 'Vue.js, CSS',
    link: '',
    status: 'Paused',
    progress: 25,
    displayType: 'simple',
    cofounder: '',
  },

  {
    id: 14,
    title: 'Wenzhou Lacquerware Gallery',
    description: 'Planning and technical setup for the Wenzhou Lacquerware Gallery (昆阳), including NAS infrastructure proposal and website design.',
    tech: 'OpenMediaVault, NAS, Web Design',
    link: '',
    status: 'Paused',
    progress: 15,
    displayType: 'simple',
    cofounder: '',
  },

  // ── Completed ─────────────────────────────────────────────────

  {
    id: 15,
    title: 'Minecraft Server',
    description: 'A continuously running Minecraft server with plugin configuration, performance optimisation, and load balancing.',
    tech: 'Java, Minecraft Server',
    link: '',
    status: 'Completed',
    progress: 100,
    displayType: 'simple',
    cofounder: 'Henry Young',
  },

  {
    id: 16,
    title: 'Internal NAS System — SE Research Society',
    description: 'Designed and built an internal NAS system for the SE Research Society at Shandong University of Science and Technology, enabling secure file sharing and team collaboration.',
    tech: 'OpenMediaVault, Linux, Networking',
    link: '',
    status: 'Completed',
    progress: 100,
    displayType: 'simple',
    cofounder: '',
  },

];
