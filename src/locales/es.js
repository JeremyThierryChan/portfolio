/*
 * es.js — español.
 *
 * en.js es la fuente de verdad: este archivo define exactamente el mismo
 * conjunto de claves, en el mismo orden. Una etiqueta de enum vive en
 *     <namespace>.<campo>.<valor>
 * p. ej. projects.status.in-progress, skills.category.language.
 */
export default {
  /* ── site notice ──────────────────────────────────────────────────────
     The slim strip at the top of every page. It is read by SiteNotice.vue,
     which renders this sentence in ALL six locales at once, not just the
     visitor's — so a missing translation would show up as an English line
     inside another language's slot. Keep every pack filled. */
  notice: {
    label: 'Estado del sitio',
    building: 'Este sitio aún se está construyendo: se actualiza a medida que avanza.',
  },

  /* ── estructura del sitio ────────────────────────────────────────────── */
  nav: {
    home: 'Inicio',
    services: 'Servicios',
    resume: 'Currículum',
    about: 'Sobre mí',
    aboutMe: 'Quién soy',
    timeline: 'Cronología',
    skills: 'Habilidades',
    testimonials: 'Recomendaciones',
    projects: 'Proyectos',
    gallery: 'Galería',
    blog: 'Blog',
    contact: 'Contacto',
    /* nuevas */
    primaryLabel: 'Principal',
    aboutSubmenuLabel: 'Secciones de «Sobre mí»',
    languageLabel: 'Cambiar de idioma',
    languageCurrent: 'Idioma: {name}',
    themeLabel: 'Apariencia',
    skipToContent: 'Saltar al contenido',
    menu: 'Menú',
    closeMenu: 'Cerrar menú',
  },

  /* ── vocabulario compartido ──────────────────────────────────────────── */
  common: {
    filterAll: 'Todos',
    readMore: 'Leer más',
    viewAll: 'Ver todo',
    back: 'Volver',
    backTo: 'Volver a {page}',
    empty: 'Aquí todavía no hay nada.',
    externalLink: 'Se abre en una pestaña nueva',
    notTranslated: 'Aún sin traducir — se muestra en inglés.',
    placeholderImage: 'Imagen provisional',
    dismiss: 'Descartar',
    close: 'Cerrar',
    learnMore: 'Saber más',
    optional: 'opcional',
    /* Se usa como aria-valuetext en los medidores de progreso. Deliberadamente
       genérico: el medidor lo comparten el progreso de los proyectos y (antes)
       los niveles de habilidad, así que no debe tomar prestado el espacio de
       nombres de ninguno de los dos. */
    percentOf: '{value} de {max}',
    required: 'obligatorio',
    copy: 'Copiar',
    copied: 'Copiado',
    showing: 'Mostrando {count} de {total}',
  },

  /* ── unidades del contador «vivo desde…» ─────────────────────────────── */
  time: {
    days: 'días',
    hours: 'horas',
    minutes: 'minutos',
    seconds: 'segundos',
    day: 'día',
    hour: 'hora',
    minute: 'minuto',
    second: 'segundo',
    and: 'y',
  },

  /* ── inicio ──────────────────────────────────────────────────────────── */
  home: {
    overline: 'Portafolio',
    title: 'Bienvenido a mi sitio web',
    sub1: 'Me alegra que estés aquí. Aquí encontrarás todo sobre mí — mi trayectoria, habilidades y trabajo.',
    sub2: 'Aún en construcción, pero ¿quién no lo está?',
    liveLabel: 'Desde el 22 de marzo de 2002 a las 6:23 AM, ya he vivido',
    aboutTitle: 'Sobre mí',
    aboutDesc: 'Quién soy, qué he hecho y cómo pienso. Mi trayectoria y las herramientas que uso — todo en un solo lugar.',
    projectsTitle: 'Proyectos',
    projectsDesc: 'Una colección de cosas que he creado — desde herramientas de software hasta marcas y proyectos paralelos.',
    blogTitle: 'Blog',
    blogDesc: 'Reflexiones sobre tecnología, idiomas, cultura y lo que sea que esté pensando. Actualizado ocasionalmente.',
    contactTitle: 'Contacto',
    contactDesc: '¿Quieres colaborar o simplemente saludar? Aquí encontrarás todos mis datos de contacto y redes sociales.',
    exploreMore: 'Explorar más',
    getInTouch: 'Contactar',
    indexLabel: 'Por dónde seguir',
    /* La portada ahora es una oferta, no un saludo: portada → servicios →
       confianza → índice → contacto. Estas son las etiquetas de esa estructura. */
    servicesLede: 'Nueve cosas por las que puedes contratarme. Dime cuál se parece a tu caso y pondré esas primero.',
    trustTitle: 'Lo que dicen',
    trustLede: 'Escrito por personas con las que he trabajado: un vicedirector de instituto, un colega y dos coordinadores de programas.',
    trustAll: 'Todas las recomendaciones',
    closingTitle: 'Dime qué necesitas',
    closingBody: 'Un proyecto, una duda o una situación que no sabes cómo resolver. La primera conversación no cuesta nada.',
  },

  /* ── sobre mí ────────────────────────────────────────────────────────── */
  about: {
    overline: 'Sobre mí',
    title: 'Sobre mí',
    subtitle: '¿Quién soy?',
    bio1: '¡Hola! Soy Jeremy. ¿Mi objetivo? Dejar una huella de elegancia en un mundo que corre constantemente hacia lo siguiente. Creo que la vida es demasiado preciosa para gastarla haciendo cosas que no amas, por cosas que no necesitas, para impresionar a personas que no conoces. Llámame idealista, pero prefiero estar sin dinero e inspirado que rico y aburrido. (Aunque inspirado y cómodo tampoco estaría mal, seamos honestos.)',
    bio2: 'Descubre más sobre mí a continuación.',
    timelineTitle: 'Mi trayectoria',
    timelineLived: 'Desde el 22 de marzo de 2002 a las 6:23 AM, ya he vivido',
    timelineDesc: 'Un recuento cronológico completo de mis experiencias y los momentos que me han formado.',
    skillsTitle: 'Mis habilidades',
    skillsDesc: 'Idiomas que hablo, herramientas que uso y tecnologías con las que trabajo — evaluados honestamente.',
    testimonialsTitle: 'Recomendaciones',
    testimonialsDesc: 'Lo que colegas, educadores y organizaciones han dicho sobre trabajar conmigo.',
    viewTimeline: 'Ver trayectoria',
    viewSkills: 'Ver habilidades',
    viewTestimonials: 'Ver recomendaciones',
  },

  /* ── cronología ──────────────────────────────────────────────────────── */
  timeline: {
    overline: 'Trayectoria',
    title: 'Mi trayectoria',
    lede: 'Un recuento cronológico completo de mis experiencias y los momentos que me han formado.',
    countLabel: '{count} entradas',
    newestFirst: 'Más recientes primero',
    categoryLabel: 'Categoría',
    category: {
      career: 'Carrera',
      personal: 'Personal',
      education: 'Formación',
      hobby: 'Aficiones',
    },
  },

  /* ── habilidades ─────────────────────────────────────────────────────── */
  skills: {
    overline: 'Habilidades',
    title: 'Mis habilidades',
    lede: 'Idiomas que hablo, herramientas que uso y tecnologías con las que trabajo — evaluados honestamente.',
    filterLabel: 'Filtrar habilidades según cómo se usan',
    /* `usage` dice CÓMO se usa una habilidad, no lo bueno que soy con ella.
       Sustituye a un porcentaje autoasignado que ningún visitante podía
       verificar ni usar para nada. */
    usageLabel: 'Cómo se usa',
    evidenceLabel: 'Evidencia',
    countLabel: '{count} habilidades',
    usage: {
      professional: 'El trabajo con clientes depende de ello',
      working: 'He construido cosas reales con ello',
      learning: 'Lo estoy estudiando ahora',
    },
    usageShort: {
      professional: 'Profesional',
      working: 'En uso',
      learning: 'Aprendiendo',
    },
    filterAll: 'Todos',
    filterProgramming: 'Programación',
    filterLanguage: 'Idiomas',
    filterOther: 'Otros',
    category: {
      programming: 'Programación',
      language: 'Idiomas',
      other: 'Otros',
    },
  },

  /* ── recomendaciones ─────────────────────────────────────────────────── */
  testimonials: {
    overline: 'Recomendaciones',
    title: 'Recomendaciones',
    subtitle: 'Lo que dicen las personas con las que he trabajado.',
    lede: 'Lo que colegas, educadores y organizaciones han dicho sobre trabajar conmigo.',
    clickToRead: 'Clic para leer',
    readMore: 'Leer carta completa',
    readFull: 'Leer la carta completa',
    backBtn: 'Volver a recomendaciones',
    contextLabel: 'Contexto',
    notFoundTitle: 'Recomendación no encontrada',
    notFoundBody: 'Esa recomendación no existe, o el enlace ya no está disponible.',
    notFoundCta: 'Volver a todas las recomendaciones',
  },

  /* ── proyectos ───────────────────────────────────────────────────────── */
  projects: {
    overline: 'Trabajo',
    title: 'Mis proyectos',
    subtitle: 'Mis trabajos',
    lede: 'Aquí encontrarás una selección de mis proyectos en diversos campos — desde desarrollo de software hasta diseño creativo, y tecnología hasta emprendimiento. Cada proyecto refleja mi pasión por la innovación, la creatividad y por resolver problemas reales.',
    intro: 'Aquí encontrarás una selección de mis proyectos en diversos campos — desde desarrollo de software hasta diseño creativo, y tecnología hasta emprendimiento. Cada proyecto refleja mi pasión por la innovación, la creatividad y por resolver problemas reales.',
    countLabel: '{count} proyectos',
    /* La página tiene dos mitades: una selección desarrollada por escrito y,
       después, el índice completo. El índice es la garantía de que el filtrado
       no oculta nada: todos los proyectos siguen listados, incluidos los que
       deliberadamente no se destacan. */
    featuredTitle: 'Trabajos seleccionados',
    featuredLede: 'Seis proyectos con suficiente sustancia como para merecer una lectura detenida.',
    indexTitle: 'Todos los proyectos',
    indexLede: 'La lista completa, incluidos aquellos sobre los que no he escrito nada. Decidir no destacar un proyecto no es lo mismo que eliminarlo.',
    indexCount: '{count} en total',
    archivedNote: 'Sin destacar',
    openLink: 'Abrir sitio',
    filterLabel: 'Filtrar proyectos por estado',
    statusLabel: 'Estado',
    progressLabel: 'Progreso',
    techStack: 'Tecnologías',
    cofounder: 'Cofundador',
    cofounderLabel: 'Cofundador: {name}',
    stages: 'Etapas del proyecto',
    stageCompleted: 'Completado',
    stageInProgress: 'En curso',
    stageOf: 'Etapa {current} de {total}',
    viewProject: 'Ver proyecto',
    clickForMore: 'Clic para detalles',
    openProject: 'Abrir proyecto',
    noLink: 'Aún sin enlace público',
    comingSoon: 'Próximamente',
    waitMore: 'Más contenido próximamente…',
    filterAll: 'Todos',
    filterProgress: 'En curso',
    filterPaused: 'En pausa',
    filterCompleted: 'Completado',
    emptyTitle: 'No hay proyectos en este filtro',
    emptyBody: 'Prueba con otro estado.',
    status: {
      'in-progress': 'En curso',
      paused: 'En pausa',
      completed: 'Completado',
    },
  },

  /* ── blog ────────────────────────────────────────────────────────────── */
  blog: {
    overline: 'Escritos',
    title: 'Mi blog',
    subtitle: 'Qué encontrarás aquí',
    lede: '¡Bienvenido a mi rincón de internet! Aquí comparto mis ideas, reflexiones e historias sobre los temas que me apasionan. Ya vengas buscando trucos de tecnología, aprendizaje de idiomas o un poco de inspiración, espero que encuentres algo que te resuene.',
    intro: '¡Bienvenido a mi rincón de internet! Aquí comparto mis pensamientos sobre temas que me apasionan — tecnología, idiomas, cultura y mucho más.',
    countLabel: '{count} entradas',
    filterLabel: 'Filtrar entradas por categoría',
    categoryLabel: 'Categoría',
    draftBadge: 'Borrador',
    clickToRead: 'Clic para leer',
    clickForMore: 'Clic para detalles',
    readMore: 'Leer más',
    waitMore: 'Más contenido próximamente…',
    filterAll: 'Todos',
    filterTech: 'Tecnología',
    filterLanguage: 'Idiomas',
    filterCulture: 'Cultura',
    filterLife: 'Vida',
    emptyTitle: 'No hay entradas en esta categoría',
    emptyBody: 'Prueba con otra categoría — o vuelve más tarde.',
    category: {
      tech: 'Tecnología',
      language: 'Idiomas',
      culture: 'Cultura',
      life: 'Vida',
    },
  },

  /* ── galería ─────────────────────────────────────────────────────────── */
  gallery: {
    overline: 'Galería',
    title: 'Galería',
    subtitle: 'Un registro visual de eventos, viajes y momentos.',
    lede: 'Un registro visual de eventos, viajes y momentos.',
    countLabel: '{count} fotos',
    filterLabel: 'Filtrar fotos por categoría',
    placeholderNotice: 'Estas son imágenes provisionales. Las fotografías reales las sustituirán.',
    placeholderBadge: 'Provisional',
    yearLabel: 'Año',
    locationLabel: 'Ubicación',
    openPhoto: 'Ver foto',
    closePhoto: 'Cerrar foto',
    filterAll: 'Todos',
    filterEvents: 'Eventos',
    filterSports: 'Deporte',
    filterVolunteer: 'Voluntariado',
    filterCampus: 'Campus',
    filterTravel: 'Viajes',
    emptyTitle: 'No hay fotos en esta categoría',
    emptyBody: 'Prueba con otra categoría.',
    empty: 'No hay fotos en esta categoría todavía.',
    category: {
      events: 'Eventos',
      sports: 'Deporte',
      volunteer: 'Voluntariado',
      campus: 'Campus',
      travel: 'Viajes',
    },
  },

  /* ── premios ───────────────────────────────────────────────────────────────
     Competiciones, exámenes y certificados. `result` es lo que convierte una
     entrada en evidencia y no en una afirmación, así que siempre se muestra
     cuando existe.
     ──────────────────────────────────────────────────────────────────────── */
  awards: {
    overline: 'Historial',
    title: 'Competiciones y certificados',
    lede: 'Resultados de terceros — la parte de esta página que puedes comprobar sin fiarte de mi palabra.',
    countLabel: '{count} entradas',
    kindLabel: 'Tipo',
    resultLabel: 'Resultado',
    /* Las entradas con `result: null` se muestran sin línea de resultado en vez
       de con un «pendiente». */
    kind: {
      exam: 'Examen',
      competition: 'Competición',
      certificate: 'Certificado',
      sport: 'Deporte',
    },
  },

  /* ── currículum ───────────────────────────────────────────────────────────
     El CV se compone a partir del mismo contenido que el sitio, filtrado por
     sector. La salida impresa es de texto y a una sola columna a propósito: un
     ATS analiza texto, y un PDF gráfico a dos columnas le resulta invisible.
     ──────────────────────────────────────────────────────────────────────── */
  resume: {
    overline: 'CV',
    title: 'Currículum',
    lede: 'Cinco versiones del mismo historial: la completa y cuatro recortadas para un tipo de trabajo concreto. Elige la que encaje con el motivo por el que estás aquí; imprímela o guárdala en PDF.',
    variantLabel: 'Qué versión',
    print: 'Imprimir / guardar en PDF',
    downloadJson: 'Descargar como JSON',
    /* Explica por qué lo impreso es sobrio. Si no, «aburrido» se lee como «sin terminar». */
    printNote: 'La versión impresa es sobria y a una sola columna a propósito, para que los sistemas de seguimiento de candidaturas (ATS) puedan leerla. La versión web es la que lleva el diseño.',
    generatedNote: 'Generado a partir del mismo contenido que el sitio web: editar cualquiera de los dos actualiza ambos.',
    sectionSummary: 'Resumen',
    sectionServices: 'Qué hago',
    sectionExperience: 'Experiencia',
    sectionProjects: 'Proyectos seleccionados',
    sectionEducation: 'Formación',
    sectionSkills: 'Habilidades',
    sectionLanguages: 'Idiomas',
    sectionTechnical: 'Técnico',
    sectionAwards: 'Competiciones y certificados',
    present: 'Actualidad',
  },

  /* ── audiencia (el eje de identidad del visitante) ──────────────────────
     El control pregunta al visitante a qué viene, así que el texto está escrito
     como una pregunta que reconocería — no como una etiqueta de categoría que
     reparte a la gente en casillas. Las etiquetas por audiencia y las líneas de
     «qué necesitas» viven en src/content/audiences.js; esto es lo que las rodea.
     ──────────────────────────────────────────────────────────────────────── */
  audience: {
    title: 'Vengo por…',
    hint: 'Dímelo y pondré primero lo que te importa. No se oculta nada: todo lo demás sigue en la página, solo que más abajo.',
    allLabel: 'Todo',
    allNeed: 'Mostrar el panorama completo, sin reordenar nada.',
    showingFor: 'Poniendo primero lo que importa para {label}.',
    showAll: 'Mostrar todo',
    /* El grupo plegado de cosas que probablemente este visitante no necesita. */
    otherTitle: 'También disponible',
    otherCount: '{count} más',
    otherBody: 'No es lo que buscabas — despliégalo si tienes curiosidad.',
    otherExpand: 'Mostrar {count} más',
    otherCollapse: 'Ocultar',
  },

  /* ── servicios ───────────────────────────────────────────────────────────
     El objetivo del sitio es atraer encargos, así que este espacio de nombres
     contiene el texto que responde a «para qué puedes contratarme». Las
     descripciones de los servicios están en src/content/services.js; esto son
     las etiquetas que las rodean.
     ──────────────────────────────────────────────────────────────────────── */
  services: {
    overline: 'Servicios',
    title: 'Qué hago',
    lede: 'Trabajo entre idiomas, comercio y tecnología. La mayoría de los encargos usan más de una de estas áreas: una visita a proveedores necesita la interpretación y el papeleo, y después un sitio web desde el que vender.',
    filterLabel: 'Filtrar servicios por área',
    includesLabel: 'Qué incluye',
    countLabel: '{count} servicios',
    languagesLabel: 'Idiomas',
    ctaTitle: '¿No sabes cuál de estos necesitas?',
    ctaBody: 'Cuéntame la situación y te diré qué implica — o si no me necesitas en absoluto.',
    cta: 'Empecemos a hablar',
    otherNote: 'Otros tipos de trabajo: solo tienes que preguntar.',
    /* Cómo se cobra un encargo, sin publicar cifras. */
    pricingTitle: 'Cómo trabajo',
    pricingBody: 'Presupuesto por encargo: tarifa por día para la interpretación, precio cerrado para una web o un proyecto comercial, y por horas para el asesoramiento continuo. Te diré qué forma tiene el coste antes de que te comprometas, y qué incluye.',
    travelNote: 'Con base en Wenzhou, Zhejiang. Disponible para trabajar en toda China y a nivel internacional.',
    domainLabel: 'Área',
    domain: {
      language: 'Idioma',
      trade: 'Comercio',
      tech: 'Tecnología',
    },
  },

  /* ── contacto ────────────────────────────────────────────────────────── */
  contact: {
    overline: 'Contacto',
    title: 'Contacto',
    lede: '¿Quieres colaborar o simplemente saludar? Aquí encontrarás todos mis datos de contacto y redes sociales.',
    formTitle: 'Escríbeme',
    name: 'Nombre',
    email: 'Correo electrónico',
    message: 'Mensaje',
    send: 'Enviar mensaje',
    infoTitle: 'O encuéntrame aquí',
    location: 'Ubicación',
    phone: 'Teléfono',
    wechat: 'WeChat',
    followTitle: 'Sígueme',
    copyEmail: 'Copiar la dirección de correo',
    copyEmailValue: 'Copiar {email}',
    copied: 'Copiado al portapapeles',
    copyFailed: 'No se pudo copiar — selecciona la dirección a mano',
    /* Reemplazo honesto del formulario antiguo, que solo llamaba a alert() y se
       vaciaba solo, así que la gente creía haber enviado un mensaje cuando no. */
    formUnavailableTitle: 'El formulario aún no está conectado',
    formUnavailableBody: 'Este sitio no tiene servidor, así que el formulario no puede entregar ningún mensaje. El correo sí funciona ahora mismo — abre tu cliente de correo con los datos ya rellenados.',
    composeEmail: 'Mejor escribir un correo',
    noPublicProfile: '{name} — aún sin enlace público',
    officialSite: '{name} — sitio oficial',
  },

  /* ── pie de página ───────────────────────────────────────────────────── */
  footer: {
    rights: '© 2025 Jeremy Thierry Chan. Todos los derechos reservados.',
    /* El sitio es raro a propósito: mejor decirlo que dejar que parezca un error. */
    themeNote: 'Este sitio cambia de estilo según la hora del día.',
    styleNow: 'Ahora mismo {style} · {window}',
    sourceLabel: 'Código fuente',
    socialLabel: 'Redes sociales',
    /* The footer's outgoing-links heading. It doubles as the nav landmark's
       accessible name via aria-labelledby, so it is the words on screen. */
    friendLinks: 'Enlaces',
  },

  /* ── 404 ─────────────────────────────────────────────────────────────── */
  notFound: {
    overline: 'Error 404',
    title: 'Página no encontrada',
    body: 'Esa página no existe, o el enlace ya no está disponible. Pero no te preocupes — estoy en ello.',
    cta: 'Volver al inicio',
    hint: 'Revisa la dirección, o usa la navegación de arriba.',
  },

  /* ── apariencia / la función de la hora del día ──────────────────────── */
  theme: {
    label: 'Apariencia',
    /* Estilo y claro/oscuro son dos ejes independientes. */
    styleAxisLabel: 'Estilo visual',
    modeAxisLabel: 'Claro u oscuro',
    styleAuto: 'Seguir el reloj',
    /* Said on the trigger itself, so a pinned style is visible without opening
       the panel. A pinned style silently overrules the schedule, and when that
       state is invisible the schedule gets reported as broken. */
    triggerAuto: 'Apariencia — sigue el reloj',
    triggerPinned: 'Apariencia — fijada, cambio automático en pausa',
    /* The switch notice's button: a momentary request, so the pin it writes
       lapses at the next boundary. The panel's button stays permanent. */
    keepForNow: 'Mantener por ahora',
    /* The panel chip for that kind of pin: it says when it ends rather than
       implying it lasts. The placeholder is 'HH:MM'. */
    pinnedUntil: 'Mantenido hasta {time}',
    styleAutoHint: 'Cambia solo a lo largo del día',
    modeFollowsStyle: 'Según el diseño',
    modeFollowsStyleHint: 'El nivel de luz previsto para cada estilo',
    light: 'Claro',
    dark: 'Oscuro',
    currentStyle: 'Estilo: {name}',
    currentMode: 'Modo: {mode}',
    followsClock: 'Siguiendo el reloj',
    pinned: 'Fijado',
    pin: 'Mantener este aspecto',
    pinHint: 'Detiene el cambio automático',
    reset: 'Volver a automático',
    nextChange: 'Cambia a {style} a las {time}',
    nextChangeUnknown: 'Hora del cambio desconocida',
    scheduleLabel: 'Horario diario',
    style: {
      a: {
        name: 'Editorial',
        blurb: 'Titulares con serifa, filetes finísimos, sobrio y formal.',
        rationale: 'Mañana — visitas profesionales y formales.',
      },
      b: {
        name: 'Terminal',
        blurb: 'Metadatos en monoespaciada, esquinas rectas, hecha para las noches largas.',
        rationale: 'Tarde y noche — público creativo y más joven.',
      },
      c: {
        name: 'Revista',
        blurb: 'Papel cálido, texto con serifa, con peso de las imágenes y sin prisa.',
        rationale: 'Tarde — un público más personal y cercano al estilo de vida.',
      },
    },
    explainer: {
      title: 'Este sitio cambia según la hora del día',
      body: 'Ahora mismo es {time}, así que estás viendo el estilo {style}. Más tarde cambiará solo. No hay nada roto — es justo lo que pretende hacer.',
      schedule: 'La mañana es Editorial, la tarde es Revista y del atardecer a la noche, Terminal.',
      keepThis: 'Mantener este estilo',
      gotIt: 'Entendido',
      settings: 'Ajustes de apariencia',
    },
  },
};
