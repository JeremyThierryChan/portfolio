/*
 * en.js — the reference locale. Every other locale falls back here per field, so
 * this file must be complete even when the others are not.
 *
 * Convention: an enum value's display label lives at
 *     <namespace>.<field>.<value>
 * e.g. projects.status.in-progress, skills.category.language
 * Use the `enumKey()` helper from @/content rather than string concatenation, so a
 * new enum value in the content layer becomes a visible missing key instead of a
 * silently rendered key path.
 *
 * Note: `timeline.category.*` and `posts.category.*` deliberately have the same
 * values; they are kept separate because the two pages may want different wording.
 */
export default {
  /* ── site chrome ─────────────────────────────────────────────────────── */
  nav: {
    home: 'Home',
    services: 'Services',
    resume: 'Résumé',
    about: 'About',
    aboutMe: 'About Me',
    timeline: 'Timeline',
    skills: 'Skills',
    testimonials: 'Testimonials',
    projects: 'Projects',
    gallery: 'Gallery',
    blog: 'Blog',
    contact: 'Contact',
    /* new */
    primaryLabel: 'Primary',
    aboutSubmenuLabel: 'About sections',
    languageLabel: 'Change language',
    languageCurrent: 'Language: {name}',
    themeLabel: 'Appearance',
    skipToContent: 'Skip to content',
    menu: 'Menu',
    closeMenu: 'Close menu',
  },

  /* ── shared vocabulary ───────────────────────────────────────────────── */
  common: {
    filterAll: 'All',
    readMore: 'Read more',
    viewAll: 'View all',
    back: 'Back',
    backTo: 'Back to {page}',
    empty: 'Nothing here yet.',
    externalLink: 'Opens in a new tab',
    notTranslated: 'Not translated yet — showing English.',
    placeholderImage: 'Placeholder image',
    dismiss: 'Dismiss',
    close: 'Close',
    learnMore: 'Learn more',
    optional: 'optional',
    /* Used as aria-valuetext on progress meters. Deliberately generic: the meter is
       shared by project progress and (formerly) skill levels, so it must not borrow a
       namespace belonging to one of them. */
    percentOf: '{value} out of {max}',
    required: 'required',
    copy: 'Copy',
    copied: 'Copied',
    showing: 'Showing {count} of {total}',
  },

  /* ── time units for the "alive for…" counter ─────────────────────────── */
  time: {
    days: 'days',
    hours: 'hours',
    minutes: 'minutes',
    seconds: 'seconds',
    day: 'day',
    hour: 'hour',
    minute: 'minute',
    second: 'second',
    and: 'and',
  },

  /* ── home ────────────────────────────────────────────────────────────── */
  home: {
    overline: 'Portfolio',
    title: 'Welcome To My Website',
    sub1: "Glad you're here. This is where you can find everything about me — my journey, skills, and work.",
    sub2: "Still a work in progress, but aren't we all.",
    liveLabel: 'Since 2002.3.22 6:23 AM, I have already lived',
    aboutTitle: 'About Me',
    aboutDesc: "Who I am, what I've done, and how I think. My background, journey, and the tools I use — all in one place.",
    projectsTitle: 'Projects',
    projectsDesc: "A collection of the things I've built — from software tools and systems to brands and side ventures.",
    blogTitle: 'Blog',
    blogDesc: 'Thoughts on technology, languages, culture, and whatever else is on my mind. Updated occasionally.',
    contactTitle: 'Contact',
    contactDesc: 'Want to work together or just say hello? Find all my contact details and social media links here.',
    exploreMore: 'Explore More',
    getInTouch: 'Get in Touch',
    indexLabel: 'Where to go next',
    /* The landing page is now an offer, not a greeting: hero → services → trust →
       index → contact. These are the section labels for that structure. */
    servicesLede: 'Nine things I can be hired for. Tell me which sounds like you and I will put those first.',
    trustTitle: 'What people say',
    trustLede: 'Written by people I have worked with — a school vice-principal, a colleague, two programme coordinators.',
    trustAll: 'All testimonials',
    closingTitle: 'Tell me what you need',
    closingBody: 'A project, a question, or a situation you are not sure how to handle. The first conversation costs nothing.',
  },

  /* ── about ───────────────────────────────────────────────────────────── */
  about: {
    overline: 'About',
    title: 'About Me',
    subtitle: 'Who Am I?',
    bio1: "Tsup! I'm Jeremy. My goal? To leave a trace of elegance in a world that's constantly rushing toward the next big thing. I think life is far too precious to spend doing things you don't love, just for things you don't need, to impress people you don't know. Call me idealistic, but I'd rather be broke and inspired than rich and bored. (Though I wouldn't mind being inspired and comfortable, let's be honest.)",
    bio2: 'Explore more about me below.',
    timelineTitle: 'My Timeline',
    timelineLived: 'Since 2002.3.22 6:23 AM, I have already lived',
    timelineDesc: "A full chronological account of where I've been, what I've done, and what's shaped me.",
    skillsTitle: 'My Skills',
    skillsDesc: 'Languages I speak, tools I use, and technologies I work with — rated honestly.',
    testimonialsTitle: 'Testimonials',
    testimonialsDesc: 'What colleagues, educators, and organisations have said about working with me.',
    viewTimeline: 'View Timeline',
    viewSkills: 'View Skills',
    viewTestimonials: 'View Testimonials',
  },

  /* ── timeline ────────────────────────────────────────────────────────── */
  timeline: {
    overline: 'Journey',
    title: 'My Journey',
    lede: "A full chronological account of where I've been, what I've done, and what's shaped me.",
    countLabel: '{count} entries',
    newestFirst: 'Newest first',
    categoryLabel: 'Category',
    category: {
      career: 'Career',
      personal: 'Personal',
      education: 'Education',
      hobby: 'Hobby',
    },
  },

  /* ── skills ──────────────────────────────────────────────────────────── */
  skills: {
    overline: 'Skills',
    title: 'My Skills',
    lede: 'Languages I speak, tools I use, and technologies I work with — rated honestly.',
    filterLabel: 'Filter skills by how they are used',
    /* `usage` says HOW a skill is used, not how good he is at it. It replaced a
       self-awarded percentage that no visitor could verify or act on. */
    usageLabel: 'How it is used',
    evidenceLabel: 'Evidence',
    countLabel: '{count} skills',
    usage: {
      professional: 'Client work depends on it',
      working: 'Built real things with it',
      learning: 'Currently studying',
    },
    usageShort: {
      professional: 'Professional',
      working: 'Working',
      learning: 'Learning',
    },
    filterAll: 'All',
    filterProgramming: 'Programming',
    filterLanguage: 'Language',
    filterOther: 'Other',
    category: {
      programming: 'Programming',
      language: 'Language',
      other: 'Other',
    },
  },

  /* ── testimonials ────────────────────────────────────────────────────── */
  testimonials: {
    overline: 'Testimonials',
    title: 'Testimonials',
    subtitle: "What people I've worked with have said.",
    lede: "What colleagues, educators, and organisations have said about working with me.",
    clickToRead: 'Click to read',
    readMore: 'Read Full Letter',
    readFull: 'Read the full letter',
    backBtn: 'Back to Testimonials',
    contextLabel: 'Context',
    notFoundTitle: 'Testimonial not found',
    notFoundBody: 'That testimonial does not exist, or the link is out of date.',
    notFoundCta: 'Back to all testimonials',
  },

  /* ── projects ────────────────────────────────────────────────────────── */
  projects: {
    overline: 'Work',
    title: 'My Projects',
    subtitle: 'A Collection of My Work',
    lede: "Here you'll find a curated collection of the work I've done across various fields, ranging from software development to creative design, and technology to entrepreneurship. Each project reflects my passion for innovation, creativity, and solving real-world problems.",
    intro: "Here you'll find a curated collection of the work I've done across various fields, ranging from software development to creative design, and technology to entrepreneurship. Each project reflects my passion for innovation, creativity, and solving real-world problems.",
    countLabel: '{count} projects',
    /* The page has two halves: a written-up selection, then the complete index. The index
       is the guarantee that triage hides nothing — every project is still listed, including
       the ones deliberately not promoted. */
    featuredTitle: 'Selected work',
    featuredLede: 'Six projects with enough substance to be worth reading about properly.',
    indexTitle: 'All projects',
    indexLede: 'The complete list, including the ones I have not written up. Deciding not to promote a project is not the same as removing it.',
    indexCount: '{count} in total',
    archivedNote: 'Not promoted',
    openLink: 'Open site',
    filterLabel: 'Filter projects by status',
    statusLabel: 'Status',
    progressLabel: 'Progress',
    techStack: 'Tech Stack',
    cofounder: 'Cofounder',
    cofounderLabel: 'Cofounder: {name}',
    stages: 'Project Stages',
    stageCompleted: 'Completed',
    stageInProgress: 'In Progress',
    stageOf: 'Stage {current} of {total}',
    viewProject: 'View Project',
    clickForMore: 'Click for details',
    openProject: 'Open project',
    noLink: 'No public link yet',
    comingSoon: 'Coming Soon',
    waitMore: 'Please wait for more...',
    filterAll: 'All',
    filterProgress: 'In Progress',
    filterPaused: 'Paused',
    filterCompleted: 'Completed',
    emptyTitle: 'No projects in this filter',
    emptyBody: 'Try a different status.',
    status: {
      'in-progress': 'In Progress',
      paused: 'Paused',
      completed: 'Completed',
    },
  },

  /* ── blog ────────────────────────────────────────────────────────────── */
  blog: {
    overline: 'Writing',
    title: 'My Blog',
    subtitle: "What You'll Find Here",
    lede: "Welcome to my corner of the internet! Here, I share my thoughts, insights, and stories on topics I'm passionate about. Whether you're here for tech tips, language learning, or a bit of inspiration — I hope you find something that resonates.",
    intro: "Welcome to my corner of the internet! Here, I share my thoughts, insights, and stories on topics I'm passionate about.",
    countLabel: '{count} posts',
    filterLabel: 'Filter posts by category',
    categoryLabel: 'Category',
    draftBadge: 'Draft',
    clickToRead: 'Click to read',
    clickForMore: 'Click for details',
    readMore: 'Read More',
    waitMore: 'Please wait for more...',
    filterAll: 'All',
    filterTech: 'Tech',
    filterLanguage: 'Language',
    filterCulture: 'Culture',
    filterLife: 'Life',
    emptyTitle: 'No posts in this category',
    emptyBody: 'Try a different category — or check back later.',
    category: {
      tech: 'Tech',
      language: 'Language',
      culture: 'Culture',
      life: 'Life',
    },
  },

  /* ── gallery ─────────────────────────────────────────────────────────── */
  gallery: {
    overline: 'Gallery',
    title: 'Gallery',
    subtitle: 'A visual record of events, travels, and moments.',
    lede: 'A visual record of events, travels, and moments.',
    countLabel: '{count} photos',
    filterLabel: 'Filter photos by category',
    placeholderNotice: 'These are placeholder images. Real photographs will replace them.',
    placeholderBadge: 'Placeholder',
    yearLabel: 'Year',
    locationLabel: 'Location',
    openPhoto: 'View photo',
    closePhoto: 'Close photo',
    filterAll: 'All',
    filterEvents: 'Events',
    filterSports: 'Sports',
    filterVolunteer: 'Volunteer',
    filterCampus: 'Campus',
    filterTravel: 'Travel',
    emptyTitle: 'No photos in this category',
    emptyBody: 'Try a different category.',
    empty: 'No photos in this category yet.',
    category: {
      events: 'Events',
      sports: 'Sports',
      volunteer: 'Volunteer',
      campus: 'Campus',
      travel: 'Travel',
    },
  },

  /* ── awards ────────────────────────────────────────────────────────────────
     Competitions, exams and certificates. `result` is what makes an entry evidence
     rather than a claim, so it is always rendered when present.
     ──────────────────────────────────────────────────────────────────────── */
  awards: {
    overline: 'Record',
    title: 'Competitions & certificates',
    lede: 'Third-party results — the part of this page you can check without taking my word for anything.',
    countLabel: '{count} entries',
    kindLabel: 'Kind',
    resultLabel: 'Result',
    /* `result: null` entries render without a result line rather than showing "pending". */
    kind: {
      exam: 'Exam',
      competition: 'Competition',
      certificate: 'Certificate',
      sport: 'Sport',
    },
  },

  /* ── resume ───────────────────────────────────────────────────────────────
     The CV is composed from the same content layer as the site, filtered per industry.
     Print output is text-based and single-column on purpose: an ATS parses text, and a
     two-column graphic PDF is invisible to it.
     ──────────────────────────────────────────────────────────────────────── */
  resume: {
    overline: 'CV',
    title: 'Résumé',
    lede: 'Five versions of the same record — the complete one, and four cut for a specific kind of work. Pick the one that matches why you are here; print or save it as a PDF.',
    variantLabel: 'Which version',
    print: 'Print / save as PDF',
    downloadJson: 'Download as JSON',
    /* Say why the printout is plain. Otherwise "boring" reads as "unfinished". */
    printNote: 'The printed version is deliberately plain and single-column so that applicant-tracking software can read it. The website version is the one with the design.',
    generatedNote: 'Generated from the same content as the website — editing either updates both.',
    sectionSummary: 'Summary',
    sectionServices: 'What I do',
    sectionExperience: 'Experience',
    sectionProjects: 'Selected projects',
    sectionEducation: 'Education',
    sectionSkills: 'Skills',
    sectionLanguages: 'Languages',
    sectionTechnical: 'Technical',
    sectionAwards: 'Competitions & certificates',
    present: 'Present',
  },

  /* ── audience (the visitor-identity axis) ─────────────────────────────────
     The control asks the visitor what they came for, so the copy is written as a
     question they would recognise — not as a category label sorting people into
     boxes. The per-audience labels and "what you need" lines live in
     src/content/audiences.js; these are the surrounding strings.
     ──────────────────────────────────────────────────────────────────────── */
  audience: {
    title: "I'm here about…",
    hint: 'Tell me and I will put what matters for you first. Nothing is hidden — everything else stays on the page, just further down.',
    allLabel: 'Everything',
    allNeed: 'Show the whole picture — no reordering.',
    showingFor: 'Putting what matters for {label} first.',
    showAll: 'Show everything',
    /* The collapsed group of things this visitor probably does not need. */
    otherTitle: 'Also available',
    otherCount: '{count} more',
    otherBody: 'Not what you came for — expand if you are curious.',
    otherExpand: 'Show {count} more',
    otherCollapse: 'Hide',
  },

  /* ── services ────────────────────────────────────────────────────────────
     The site's goal is inbound work, so this namespace carries the copy that
     answers "what can I hire you for". The service descriptions themselves live
     in src/content/services.js; these are the surrounding labels.

     NOTE: added after the six locales were aligned, so the other five fall back
     to English here until the wording is signed off — translating draft copy
     would be wasted work. `npm run verify:i18n` reports it as INFO, not a failure.
     ──────────────────────────────────────────────────────────────────────── */
  services: {
    overline: 'Services',
    title: 'What I do',
    lede: 'I work across languages, trade and technology. Most engagements use more than one of these — a supplier visit needs the interpreting and the paperwork, and then a site to sell it from.',
    filterLabel: 'Filter services by area',
    includesLabel: 'What that covers',
    countLabel: '{count} services',
    languagesLabel: 'Languages',
    ctaTitle: 'Not sure which of these you need?',
    ctaBody: 'Describe the situation and I will tell you what it involves — or whether you need me at all.',
    cta: 'Start a conversation',
    otherNote: 'Other types of work: just ask.',
    /* How an engagement is priced, without publishing numbers. */
    pricingTitle: 'How I work',
    pricingBody: 'Quoted per engagement — day rate for interpreting, fixed price for a website or a trade project, hourly for ongoing advisory. I will tell you the shape of the cost before you commit, and what is included.',
    travelNote: 'Based in Wenzhou, Zhejiang. Available for work across China and internationally.',
    domainLabel: 'Area',
    domain: {
      language: 'Language',
      trade: 'Trade',
      tech: 'Technology',
    },
  },

  /* ── contact ─────────────────────────────────────────────────────────── */
  contact: {
    overline: 'Contact',
    title: 'Contact Me',
    lede: 'Want to work together or just say hello? Find all my contact details and social media links here.',
    formTitle: 'Get in Touch',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send: 'Send Message',
    infoTitle: 'Or Reach Me Here',
    location: 'Location',
    phone: 'Phone',
    wechat: 'WeChat',
    followTitle: 'Follow Me',
    copyEmail: 'Copy email address',
    copyEmailValue: 'Copy {email}',
    copied: 'Copied to clipboard',
    copyFailed: 'Could not copy — select the address manually',
    /* Honest replacement for the old form, which only called alert() and cleared
       itself, so visitors believed a message had been sent when nothing was. */
    formUnavailableTitle: 'The form is not connected yet',
    formUnavailableBody: 'This site has no backend, so the form cannot deliver a message. Email works right now — it opens your mail client with the details filled in.',
    composeEmail: 'Write an email instead',
    noPublicProfile: '{name} — no public link yet',
    officialSite: '{name} — official site',
  },

  /* ── footer ──────────────────────────────────────────────────────────── */
  footer: {
    rights: '© 2025 Jeremy Thierry Chan. All rights reserved.',
    /* The site is unusual on purpose: say so, rather than letting it read as a bug. */
    themeNote: 'This site changes style with the time of day.',
    styleNow: 'Currently {style} · {window}',
    sourceLabel: 'Source',
    socialLabel: 'Social links',
  },

  /* ── 404 ─────────────────────────────────────────────────────────────── */
  notFound: {
    overline: 'Error 404',
    title: 'Page not found',
    body: "That page does not exist, or the link is out of date. But don't worry — I am working on it.",
    cta: 'Return home',
    hint: 'Check the address, or use the navigation above.',
  },

  /* ── appearance / the time-of-day feature ────────────────────────────── */
  theme: {
    label: 'Appearance',
    /* Style and light/dark are two independent axes. */
    styleAxisLabel: 'Visual style',
    modeAxisLabel: 'Light or dark',
    styleAuto: 'Follow the clock',
    styleAutoHint: 'Switches automatically through the day',
    modeFollowsStyle: 'As designed',
    modeFollowsStyleHint: "Each style's intended light level",
    light: 'Light',
    dark: 'Dark',
    currentStyle: 'Style: {name}',
    currentMode: 'Mode: {mode}',
    followsClock: 'Following the clock',
    pinned: 'Pinned',
    pin: 'Keep this look',
    pinHint: 'Stops the automatic switch',
    reset: 'Back to automatic',
    nextChange: 'Switches to {style} at {time}',
    nextChangeUnknown: 'Switch time unknown',
    scheduleLabel: 'Daily schedule',
    style: {
      a: {
        name: 'Editorial',
        blurb: 'Serif headings, hairline rules, quiet and formal.',
        rationale: 'Morning — professional and formal enquiries.',
      },
      b: {
        name: 'Terminal',
        blurb: 'Monospace metadata, sharp corners, made for late nights.',
        rationale: 'Evening and night — creative, younger traffic.',
      },
      c: {
        name: 'Magazine',
        blurb: 'Warm paper, serif text, image-led and unhurried.',
        rationale: 'Afternoon — a more personal, lifestyle-leaning audience.',
      },
    },
    explainer: {
      title: 'This site changes with the time of day',
      body: 'It is currently {time}, so you are seeing the {style} style. Later it will change on its own. Nothing is broken — it is meant to do that.',
      schedule: 'Morning is Editorial, afternoon is Magazine, and evening through night is Terminal.',
      keepThis: 'Keep this style',
      gotIt: 'Got it',
      settings: 'Appearance settings',
    },
  },
};
