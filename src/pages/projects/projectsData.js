// src/projectsData.js
export const projects = [
    /* 长期维护的项目 */
    {
      id: 1,
      title: "Jeremy's Portfolio Website",
      description: 'A personal portfolio website built with Vue.js, showcasing skills, work history, projects, and an interactive timeline. Supports multi-language content and is continuously updated.',
      tech: 'Vue.js, CSS, JavaScript',
      link: 'https://jeremythierrychan.github.io/portfolio/',
      status: 'In Progress',
      progress: 99,
      stages: [
        { name: 'Design', description: 'Creating the layout and design for the website.', completed: true },
        { name: 'Development', description: 'Building the core functionality with Vue.js.', completed: true },
        { name: 'Content', description: 'Populating all sections with up-to-date information.', completed: false },
        { name: 'Testing', description: 'Testing for bugs and responsiveness.', completed: false },
      ],
      displayType: 'simple',
      cofounder: '',
    },

    /* 已完成的项目 */
    {
      id: 2,
      title: 'Minecraft Server',
      description: 'A continuously running Minecraft server with plugin configuration, performance optimisation, and load balancing. Co-built with Henry Young.',
      tech: 'Java, Minecraft Server',
      link: '',
      status: 'Completed',
      progress: 100,
      stages: [
        { name: 'Setup', description: 'Setting up the server and configuring plugins.', completed: true },
        { name: 'Optimisation', description: 'Optimising server performance and load balancing.', completed: true },
        { name: 'Maintenance', description: 'Ongoing maintenance and updates.', completed: true },
      ],
      displayType: 'simple',
      cofounder: 'Henry Young',
    },

    {
      id: 3,
      title: 'Internal NAS System — SE Research Society',
      description: 'Designed and built an internal NAS (Network Attached Storage) system for the SE Research Society at Shandong University of Science and Technology, enabling secure file sharing and team collaboration across the organisation.',
      tech: 'OpenMediaVault, Linux, Networking',
      link: '',
      status: 'Completed',
      progress: 100,
      stages: [
        { name: 'Planning', description: 'Defining storage requirements and selecting hardware/software stack.', completed: true },
        { name: 'Setup', description: 'Installing and configuring OpenMediaVault on the server.', completed: true },
        { name: 'Deployment', description: 'Deploying and granting access to society members.', completed: true },
      ],
      displayType: 'simple',
      cofounder: '',
    },

    /* 正在进行的项目 */
    {
      id: 4,
      title: 'Arbitrage Trading System',
      description: 'A fintech project focused on building and maintaining an automated arbitrage trading system. Responsible for system engineering, strategy implementation, and performance monitoring.',
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
      id: 5,
      title: 'Carpe Lucem Brand',
      description: 'Co-founded Carpe Lucem, a brand focused on imported food and international lifestyle products targeting high-net-worth clients. Currently in early-stage planning and product sourcing.',
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
      id: 6,
      title: 'Recipe Generator',
      description: 'An app that automatically generates recipes based on available ingredients.',
      tech: 'Vue, Axios, Recipe API',
      link: '',
      status: 'In Progress',
      progress: 10,
      stages: [
        { name: 'Planning', description: 'Defining app features and selecting recipe APIs.', completed: true },
        { name: 'UI/UX', description: 'Designing the user interface and user experience for easy navigation.', completed: false },
        { name: 'API Integration', description: 'Integrating the recipe API to fetch recipe suggestions based on ingredients.', completed: false },
        { name: 'Testing', description: 'Conducting tests to ensure accurate recipe generation and UI functionality.', completed: false },
      ],
      displayType: 'detailed',
      cofounder: '',
    },
];
