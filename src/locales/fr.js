/*
 * fr.js — locale française. Miroir exact de en.js : mêmes clés, même ordre.
 * Les tournures déjà validées lors de la version précédente du site sont
 * reprises telles quelles ; seules les chaînes réellement nouvelles ont été
 * traduites pour la première fois (résumé, services, audience, palmarès,
 * refonte des compétences et des projets).
 */
export default {
  /* ── site notice ──────────────────────────────────────────────────────
     The slim strip at the top of every page. It is read by SiteNotice.vue,
     which renders this sentence in ALL six locales at once, not just the
     visitor's — so a missing translation would show up as an English line
     inside another language's slot. Keep every pack filled. */
  notice: {
    label: 'État du site',
    building: 'Ce site est encore en construction — il est mis à jour au fur et à mesure.',
  },

  quote: {
    heading: 'Comment j\'établis un devis',
    lede: 'Ce qui se passe entre le moment où vous m\'écrivez et celui où vous avez un prix en main.',
    step1Title: 'Dites-moi ce qu\'il vous faut',
    step1Body: 'Usage, dates, langues, lieu — et une fourchette de budget approximative si vous en avez une, ce qui évite un aller-retour.',
    step2Title: 'Je réponds avec un prix et un périmètre',
    step2Body: 'Par écrit, en précisant ce qui est inclus, ce qui ne l\'est pas, et quand ce serait livré.',
    step3Title: 'Vous confirmez, et je réserve le créneau',
    step3Body: 'Une fois le prix et le périmètre acceptés, je confirme les dates et je passe à la préparation.',
    noNumbers: 'Il n\'y a pas de grille tarifaire ici, et c\'est volontaire. Ces neuf services se facturent dans des unités différentes — à la journée, par événement, au mot, au projet, par cours, sur commission pour les commandes conclues — donc un chiffre unique serait plus trompeur qu\'utile. Décrivez ce dont vous avez besoin et vous obtiendrez un chiffre ferme.',
    cta: 'Envoyez-moi votre demande',
  },

  /* ── la grille tarifaire des cours ─────────────────────────────────────
     La page /tutoring et ses tarifs horaires. Les chiffres vivent dans la
     couche de contenu (content/tutoring.js) ; ici, c'est l'habillage. */
  tutoring: {
    overline: 'Enseignement et cours particuliers',
    title: 'Tarifs horaires',
    lede: 'Tarifs horaires pour les cours individuels et en petit groupe, du primaire jusqu\'à l\'IELTS, aux langues, à la programmation et à la modélisation.',
    unit: 'CNY par heure',
    courseColumn: 'Cours',
    howTitle: 'Comment le tarif est calculé',
    howBody: 'Chaque cours n\'a qu\'un seul tarif, celui du cours individuel. Les trois autres colonnes s\'obtiennent en multipliant ce tarif par le coefficient de taille du groupe, puis en arrondissant à la dizaine — dans un duo, chaque personne paie 70 %, 60 % à trois, et 50 % en groupe plus nombreux.',
    quotedOnRequest: 'Sur demande',
    cta: 'Se renseigner sur un cours',
  },

  /* ── habillage du site ───────────────────────────────────────────────── */
  nav: {
    home: 'Accueil',
    services: 'Services',
    resume: 'CV',
    about: 'À propos',
    aboutMe: 'Qui suis-je',
    timeline: 'Parcours',
    skills: 'Compétences',
    testimonials: 'Recommandations',
    projects: 'Projets',
    gallery: 'Galerie',
    blog: 'Blog',
    contact: 'Contact',
    /* nouveau */
    primaryLabel: 'Navigation principale',
    aboutSubmenuLabel: 'Sections « À propos »',
    languageLabel: 'Changer de langue',
    languageCurrent: 'Langue : {name}',
    themeLabel: 'Apparence',
    skipToContent: 'Aller au contenu',
    menu: 'Menu',
    closeMenu: 'Fermer le menu',
  },

  /* ── vocabulaire partagé ─────────────────────────────────────────────── */
  common: {
    filterAll: 'Tout',
    readMore: 'Lire la suite',
    viewAll: 'Tout voir',
    back: 'Retour',
    backTo: 'Retour à {page}',
    empty: 'Rien ici pour l\'instant.',
    externalLink: 'S\'ouvre dans un nouvel onglet',
    notTranslated: 'Pas encore traduit — affichage en anglais.',
    placeholderImage: 'Image de remplacement',
    dismiss: 'Masquer',
    close: 'Fermer',
    learnMore: 'En savoir plus',
    optional: 'facultatif',
    /* Utilisé comme aria-valuetext sur les jauges de progression. Volontairement
       générique : la jauge sert aussi bien à l'avancement d'un projet qu'aux
       compétences, elle ne doit donc pas emprunter le vocabulaire d'un seul. */
    percentOf: '{value} sur {max}',
    required: 'obligatoire',
    copy: 'Copier',
    copied: 'Copié',
    showing: 'Affichage de {count} sur {total}',
  },

  /* ── unités de temps du compteur « j'ai déjà vécu… » ─────────────────── */
  time: {
    days: 'jours',
    hours: 'heures',
    minutes: 'minutes',
    seconds: 'secondes',
    day: 'jour',
    hour: 'heure',
    minute: 'minute',
    second: 'seconde',
    and: 'et',
  },

  /* ── accueil ─────────────────────────────────────────────────────────── */
  home: {
    overline: 'Portfolio',
    title: 'Bienvenue sur mon site',
    sub1: 'Ravi de vous accueillir. Vous trouverez ici tout ce qu\'il faut savoir sur moi — mon parcours, mes compétences et mes réalisations.',
    sub2: 'Toujours en cours de construction, mais qui ne l\'est pas ?',
    liveLabel: 'Depuis le 22 mars 2002 à 6h23, j\'ai déjà vécu',
    aboutTitle: 'À propos de moi',
    aboutDesc: 'Qui je suis, ce que j\'ai accompli, et ma façon de penser. Mon parcours, mes expériences et mes outils — tout en un seul endroit.',
    projectsTitle: 'Projets',
    projectsDesc: 'Un aperçu de ce que j\'ai créé — des outils logiciels aux systèmes, en passant par des marques et des projets parallèles.',
    blogTitle: 'Blog',
    blogDesc: 'Réflexions sur la technologie, les langues, la culture et tout ce qui me passe par la tête. Mis à jour de temps en temps.',
    contactTitle: 'Contact',
    contactDesc: 'Envie de collaborer ou simplement de dire bonjour ? Retrouvez ici toutes mes coordonnées et mes réseaux sociaux.',
    exploreMore: 'En savoir plus',
    getInTouch: 'Me contacter',
    indexLabel: 'Où aller ensuite',
    /* L'accueil est désormais une proposition, pas une salutation :
       accroche → services → recommandations → index → contact. */
    servicesLede: 'Neuf choses pour lesquelles vous pouvez faire appel à moi. Dites-moi ce qui vous ressemble et je le mettrai en avant.',
    trustTitle: 'Ce que l\'on dit de moi',
    trustLede: 'Écrit par des personnes avec qui j\'ai travaillé — un directeur adjoint d\'école, un collègue, deux coordinateurs de programme.',
    trustAll: 'Toutes les recommandations',
    closingTitle: 'Dites-moi ce dont vous avez besoin',
    closingBody: 'Un projet, une question, ou une situation que vous ne savez pas trop comment aborder. La première conversation ne coûte rien.',
  },

  /* ── à propos ────────────────────────────────────────────────────────── */
  about: {
    overline: 'À propos',
    title: 'À propos de moi',
    subtitle: 'Qui suis-je ?',
    bio1: "Salut ! Je suis Jeremy. Mon objectif ? Laisser une trace d'élégance dans un monde qui court sans cesse vers la prochaine grande chose. Je pense que la vie est bien trop précieuse pour la passer à faire des choses qu'on n'aime pas, pour des choses dont on n'a pas besoin, pour impressionner des gens qu'on ne connaît pas. Appelez-moi idéaliste, mais je préfère être fauché et inspiré que riche et ennuyé. (Bien qu'inspiré et à l'aise ne serait pas pour me déplaire, soyons honnêtes.)",
    bio2: 'Découvrez-en plus sur moi ci-dessous.',
    timelineTitle: 'Mon parcours',
    timelineLived: 'Depuis le 22 mars 2002 à 6h23, j\'ai déjà vécu',
    timelineDesc: 'Un récit chronologique complet de mes expériences, réalisations et moments qui m\'ont forgé.',
    skillsTitle: 'Mes compétences',
    skillsDesc: 'Les langues que je parle, les outils que j\'utilise, et les technologies que je maîtrise — évaluation honnête.',
    testimonialsTitle: 'Recommandations',
    testimonialsDesc: 'Ce que mes collègues, enseignants et organisations ont dit de notre collaboration.',
    viewTimeline: 'Voir le parcours',
    viewSkills: 'Voir les compétences',
    viewTestimonials: 'Voir les recommandations',
  },

  /* ── parcours ────────────────────────────────────────────────────────── */
  timeline: {
    overline: 'Parcours',
    title: 'Mon parcours',
    lede: 'Un récit chronologique complet de mes expériences, réalisations et moments qui m\'ont forgé.',
    countLabel: '{count} entrées',
    newestFirst: 'Plus récents d\'abord',
    categoryLabel: 'Catégorie',
    category: {
      career: 'Carrière',
      personal: 'Personnel',
      education: 'Formation',
      hobby: 'Loisir',
    },
  },

  /* ── compétences ─────────────────────────────────────────────────────── */
  skills: {
    overline: 'Compétences',
    title: 'Mes compétences',
    lede: 'Les langues que je parle, les outils que j\'utilise, et les technologies que je maîtrise — évaluation honnête.',
    /* NOTE : la version anglaise dit désormais « by how they are used », alors que
       cette chaîne parle encore de catégorie. Valeur déjà validée : laissée telle
       quelle, à revoir lors d'une prochaine passe de relecture. */
    filterLabel: 'Filtrer les compétences selon leur usage',
    /* `usage` dit COMMENT une compétence est utilisée, pas à quel point elle est
       maîtrisée. Il remplace un pourcentage auto-attribué que personne ne pouvait
       ni vérifier ni utiliser. */
    usageLabel: 'Comment je m\'en sers',
    evidenceLabel: 'Preuves',
    countLabel: '{count} compétences',
    usage: {
      professional: 'Du travail client en dépend',
      working: 'J\'ai construit de vraies choses avec',
      learning: 'En cours d\'apprentissage',
    },
    usageShort: {
      professional: 'Professionnel',
      working: 'En pratique',
      learning: 'En cours',
    },
    filterAll: 'Tout',
    filterProgramming: 'Programmation',
    filterLanguage: 'Langues',
    filterOther: 'Autre',
    category: {
      programming: 'Programmation',
      language: 'Langue',
      other: 'Autre',
    },
  },

  /* ── recommandations ─────────────────────────────────────────────────── */
  testimonials: {
    overline: 'Recommandations',
    title: 'Recommandations',
    subtitle: 'Ce que disent ceux qui ont travaillé avec moi.',
    lede: 'Ce que mes collègues, enseignants et organisations ont dit de notre collaboration.',
    clickToRead: 'Cliquer pour lire',
    readMore: 'Lire la lettre complète',
    readFull: 'Lire la lettre en entier',
    backBtn: 'Retour aux recommandations',
    contextLabel: 'Contexte',
    notFoundTitle: 'Recommandation introuvable',
    notFoundBody: 'Cette recommandation n\'existe pas, ou le lien n\'est plus valable.',
    notFoundCta: 'Retour à toutes les recommandations',
  },

  /* ── projets ─────────────────────────────────────────────────────────── */
  projects: {
    overline: 'Réalisations',
    title: 'Mes projets',
    subtitle: 'Mes réalisations',
    lede: 'Voici une sélection de mes projets dans divers domaines — du développement logiciel au design créatif, de la technologie à l\'entrepreneuriat. Chaque projet reflète ma passion pour l\'innovation et la résolution de problèmes concrets.',
    intro: 'Voici une sélection de mes projets dans divers domaines — du développement logiciel au design créatif, de la technologie à l\'entrepreneuriat. Chaque projet reflète ma passion pour l\'innovation et la résolution de problèmes concrets.',
    countLabel: '{count} projets',
    /* La page a deux moitiés : une sélection rédigée, puis l'index complet. L'index
       garantit que le tri n'escamote rien — chaque projet y figure, y compris ceux
       volontairement non mis en avant. */
    featuredTitle: 'Sélection de projets',
    featuredLede: 'Six projets assez consistants pour mériter une vraie lecture.',
    indexTitle: 'Tous les projets',
    indexLede: 'La liste complète, y compris les projets que je n\'ai pas détaillés. Ne pas mettre un projet en avant, ce n\'est pas la même chose que le supprimer.',
    indexCount: '{count} au total',
    archivedNote: 'Non mis en avant',
    openLink: 'Ouvrir le site',
    filterLabel: 'Filtrer les projets par statut',
    statusLabel: 'Statut',
    progressLabel: 'Avancement',
    techStack: 'Technologies',
    cofounder: 'Cofondateur',
    cofounderLabel: 'Cofondateur : {name}',
    stages: 'Étapes du projet',
    stageCompleted: 'Terminé',
    stageInProgress: 'En cours',
    stageOf: 'Étape {current} sur {total}',
    viewProject: 'Voir le projet',
    clickForMore: 'Cliquer pour détails',
    openProject: 'Ouvrir le projet',
    noLink: 'Pas encore de lien public',
    comingSoon: 'Bientôt disponible',
    waitMore: 'Plus de contenu à venir…',
    filterAll: 'Tout',
    filterProgress: 'En cours',
    filterPaused: 'En pause',
    filterCompleted: 'Terminé',
    emptyTitle: 'Aucun projet pour ce filtre',
    emptyBody: 'Essayez un autre statut.',
    status: {
      'in-progress': 'En cours',
      paused: 'En pause',
      completed: 'Terminé',
    },
  },

  /* ── blog ────────────────────────────────────────────────────────────── */
  blog: {
    overline: 'Écrits',
    title: 'Mon blog',
    subtitle: 'Ce que vous trouverez ici',
    lede: 'Bienvenue dans mon coin d\'internet ! Je partage ici mes réflexions sur des sujets variés qui me passionnent — technologie, langues, culture et bien plus encore. J\'espère que vous trouverez quelque chose qui vous parle.',
    intro: 'Bienvenue dans mon coin d\'internet ! Je partage ici mes réflexions sur des sujets variés qui me passionnent.',
    countLabel: '{count} articles',
    filterLabel: 'Filtrer les articles par catégorie',
    categoryLabel: 'Catégorie',
    draftBadge: 'Brouillon',
    clickToRead: 'Cliquer pour lire',
    clickForMore: 'Cliquer pour détails',
    readMore: 'Lire la suite',
    waitMore: 'Plus de contenu à venir…',
    filterAll: 'Tout',
    filterTech: 'Tech',
    filterLanguage: 'Langues',
    filterCulture: 'Culture',
    filterLife: 'Vie',
    emptyTitle: 'Aucun article dans cette catégorie',
    emptyBody: 'Essayez une autre catégorie — ou revenez plus tard.',
    category: {
      tech: 'Tech',
      language: 'Langues',
      culture: 'Culture',
      life: 'Vie',
    },
  },

  /* ── galerie ─────────────────────────────────────────────────────────── */
  gallery: {
    overline: 'Galerie',
    title: 'Galerie',
    subtitle: 'Un témoignage visuel d\'événements, de voyages et de moments.',
    lede: 'Un témoignage visuel d\'événements, de voyages et de moments.',
    countLabel: '{count} photos',
    filterLabel: 'Filtrer les photos par catégorie',
    placeholderNotice: 'Ces images sont provisoires. De vraies photographies viendront les remplacer.',
    placeholderBadge: 'Provisoire',
    yearLabel: 'Année',
    locationLabel: 'Lieu',
    openPhoto: 'Voir la photo',
    closePhoto: 'Fermer la photo',
    filterAll: 'Tout',
    filterEvents: 'Événements',
    filterSports: 'Sport',
    filterVolunteer: 'Bénévolat',
    filterCampus: 'Campus',
    filterTravel: 'Voyages',
    emptyTitle: 'Aucune photo dans cette catégorie',
    emptyBody: 'Essayez une autre catégorie.',
    empty: 'Aucune photo dans cette catégorie pour l\'instant.',
    category: {
      events: 'Événements',
      sports: 'Sport',
      volunteer: 'Bénévolat',
      campus: 'Campus',
      travel: 'Voyages',
    },
  },

  /* ── palmarès ─────────────────────────────────────────────────────────────
     Concours, examens et certificats. `result` est ce qui fait d'une entrée une
     preuve plutôt qu'une affirmation : il est donc toujours affiché s'il existe.
     ──────────────────────────────────────────────────────────────────────── */
  awards: {
    overline: 'Palmarès',
    title: 'Compétitions et certificats',
    lede: 'Des résultats vérifiables auprès de tiers — la partie de cette page que vous pouvez contrôler sans me croire sur parole.',
    countLabel: '{count} entrées',
    kindLabel: 'Nature',
    resultLabel: 'Résultat',
    /* Une entrée avec `result: null` s'affiche sans ligne de résultat, plutôt
       qu'avec la mention « en attente ». */
    kind: {
      exam: 'Examen',
      competition: 'Compétition',
      certificate: 'Certificat',
      sport: 'Sport',
    },
  },

  /* ── CV ───────────────────────────────────────────────────────────────────
     Le CV est composé à partir de la même couche de contenu que le site, filtrée
     par secteur. La version imprimée est textuelle et sur une seule colonne à
     dessein : un ATS lit du texte, un PDF graphique en deux colonnes lui échappe.
     ──────────────────────────────────────────────────────────────────────── */
  resume: {
    overline: 'CV',
    title: 'Mon CV',
    lede: 'Cinq versions du même parcours — la complète, et quatre adaptées à un type de travail précis. Choisissez celle qui correspond à ce qui vous amène ; imprimez-la ou enregistrez-la en PDF.',
    variantLabel: 'Quelle version',
    print: 'Imprimer / enregistrer en PDF',
    downloadJson: 'Télécharger en JSON',
    /* Dire pourquoi l'impression est sobre. Sinon, « fade » se lit comme « inachevé ». */
    printNote: 'La version imprimée est volontairement sobre et sur une seule colonne, pour que les logiciels de suivi des candidatures (ATS) puissent la lire. C\'est la version du site qui porte le design.',
    generatedNote: 'Généré à partir du même contenu que le site — modifier l\'un met à jour l\'autre.',
    sectionSummary: 'Résumé',
    sectionServices: 'Ce que je fais',
    sectionExperience: 'Expérience',
    sectionProjects: 'Projets sélectionnés',
    sectionEducation: 'Formation',
    sectionSkills: 'Compétences',
    sectionLanguages: 'Langues',
    sectionTechnical: 'Technique',
    sectionAwards: 'Compétitions et certificats',
    present: 'aujourd\'hui',
  },

  /* ── audience (l'axe « qui est le visiteur ») ─────────────────────────────
     Le contrôle demande au visiteur ce qu'il vient chercher : le texte est donc
     écrit comme une question qu'il se reconnaîtrait à poser, et non comme une
     étiquette qui range les gens dans des cases. Les libellés par audience et
     les lignes « ce dont vous avez besoin » vivent dans
     src/content/audiences.js ; ici, ce sont les chaînes qui les entourent.
     ──────────────────────────────────────────────────────────────────────── */
  audience: {
    title: 'Je viens pour…',
    hint: 'Dites-le-moi et je mettrai en avant ce qui compte pour vous. Rien n\'est caché : tout le reste demeure sur la page, simplement un peu plus bas.',
    allLabel: 'Tout',
    allNeed: 'Voir l\'ensemble — sans rien réordonner.',
    showingFor: 'Ce qui compte pour {label} passe en premier.',
    showAll: 'Tout afficher',
    /* Le groupe replié de ce dont ce visiteur n'a probablement pas besoin. */
    otherTitle: 'Également disponible',
    otherCount: '{count} de plus',
    otherBody: 'Pas ce qui vous amène — dépliez si la curiosité vous tient.',
    otherExpand: 'Afficher {count} de plus',
    otherCollapse: 'Masquer',
  },

  /* ── services ────────────────────────────────────────────────────────────
     L'objectif du site est de susciter des demandes : ce namespace porte le texte
     qui répond à « pour quoi puis-je vous engager ». Les descriptions de services
     elles-mêmes vivent dans src/content/services.js ; ici, ce sont les libellés
     qui les entourent.
     ──────────────────────────────────────────────────────────────────────── */
  services: {
    overline: 'Services',
    title: 'Ce que je fais',
    lede: 'Je travaille à la croisée des langues, du commerce et de la technologie. La plupart des missions en combinent plusieurs — une visite chez un fournisseur demande l\'interprétation et les documents, puis un site pour vendre.',
    filterLabel: 'Filtrer les services par domaine',
    includesLabel: 'Ce que cela comprend',
    billingLabel: 'Mode de facturation',
    countLabel: '{count} services',
    languagesLabel: 'Langues',
    ctaTitle: 'Vous ne savez pas ce qu\'il vous faut ?',
    ctaBody: 'Décrivez la situation et je vous dirai ce qu\'elle implique — ou si vous avez vraiment besoin de moi.',
    cta: 'Engager la conversation',
    otherNote: 'D\'autres types de missions ? Demandez, tout simplement.',
    /* Comment une mission est facturée, sans publier de chiffres. */
    pricingTitle: 'Comment je travaille',
    pricingBody: 'Devis au cas par cas — tarif journalier pour l\'interprétation, prix forfaitaire pour un site ou un projet commercial, tarif horaire pour un accompagnement régulier. Je vous annonce la forme du coût avant tout engagement, et ce qui est inclus.',
    travelNote: 'Basé à Wenzhou, dans le Zhejiang. Disponible pour des missions partout en Chine et à l\'international.',
    domainLabel: 'Domaine',
    domain: {
      language: 'Langue',
      trade: 'Commerce',
      tech: 'Technologie',
    },
  },

  /* ── contact ─────────────────────────────────────────────────────────── */
  contact: {
    overline: 'Contact',
    title: 'Me contacter',
    lede: 'Envie de collaborer ou simplement de dire bonjour ? Retrouvez ici toutes mes coordonnées et mes réseaux sociaux.',
    formTitle: 'Envoyer un message',
    name: 'Nom',
    email: 'E-mail',
    message: 'Message',
    send: 'Envoyer',
    infoTitle: 'Ou retrouvez-moi ici',
    location: 'Localisation',
    phone: 'Téléphone',
    wechat: 'WeChat',
    followTitle: 'Me suivre',
    copyEmail: 'Copier l\'adresse e-mail',
    copyEmailValue: 'Copier {email}',
    copied: 'Copié dans le presse-papiers',
    copyFailed: 'Copie impossible — sélectionnez l\'adresse à la main',
    /* Remplacement honnête de l'ancien formulaire, qui se contentait d'un alert()
       avant de se vider : les visiteurs croyaient avoir envoyé un message. */
    formUnavailableTitle: 'Le formulaire n\'est pas encore connecté',
    formUnavailableBody: 'Ce site n\'a pas de serveur : le formulaire ne peut donc transmettre aucun message. L\'e-mail, lui, fonctionne tout de suite — il ouvre votre logiciel de messagerie avec les informations déjà remplies.',
    composeEmail: 'Écrire un e-mail à la place',
    noPublicProfile: '{name} — pas encore de lien public',
    officialSite: '{name} — site officiel',
  },

  /* ── pied de page ────────────────────────────────────────────────────── */
  footer: {
    rights: '© 2025 Jeremy Thierry Chan. Tous droits réservés.',
    /* Le site est volontairement inhabituel : autant le dire, plutôt que de
       laisser croire à un bug. */
    themeNote: 'Ce site change de style selon l\'heure de la journée.',
    styleNow: 'Actuellement {style} · {window}',
    sourceLabel: 'Code source',
    socialLabel: 'Réseaux sociaux',
    /* The footer's outgoing-links heading. It doubles as the nav landmark's
       accessible name via aria-labelledby, so it is the words on screen. */
    friendLinks: 'Liens',
  },

  /* ── 404 ─────────────────────────────────────────────────────────────── */
  notFound: {
    overline: 'Erreur 404',
    title: 'Page introuvable',
    body: 'Cette page n\'existe pas, ou le lien n\'est plus valable. Mais pas d\'inquiétude — j\'y travaille.',
    cta: 'Retour à l\'accueil',
    hint: 'Vérifiez l\'adresse, ou utilisez la navigation ci-dessus.',
  },

  /* ── apparence / le style selon l'heure de la journée ────────────────── */
  theme: {
    label: 'Apparence',
    /* Le style et le mode clair/sombre sont deux axes indépendants. */
    styleAxisLabel: 'Style visuel',
    modeAxisLabel: 'Clair ou sombre',
    styleAuto: 'Suivre l\'horloge',
    /* Said on the trigger itself, so a pinned style is visible without opening
       the panel. A pinned style silently overrules the schedule, and when that
       state is invisible the schedule gets reported as broken. */
    triggerAuto: 'Apparence — suit l\'horloge',
    triggerPinned: 'Apparence — épinglée, changement automatique en pause',
    /* The switch notice's button: a momentary request, so the pin it writes
       lapses at the next boundary. The panel's button stays permanent. */
    keepForNow: 'Garder pour l\'instant',
    /* The panel chip for that kind of pin: it says when it ends rather than
       implying it lasts. The placeholder is 'HH:MM'. */
    pinnedUntil: 'Conservé jusqu\'à {time}',
    styleAutoHint: 'Change automatiquement au fil de la journée',
    modeFollowsStyle: 'Tel que conçu',
    modeFollowsStyleHint: 'Le niveau de luminosité prévu pour chaque style',
    light: 'Clair',
    dark: 'Sombre',
    currentStyle: 'Style : {name}',
    currentMode: 'Mode : {mode}',
    followsClock: 'Suit l\'horloge',
    pinned: 'Épinglé',
    pin: 'Garder cette apparence',
    pinHint: 'Empêche le changement automatique',
    reset: 'Revenir à l\'automatique',
    nextChange: 'Passe à {style} à {time}',
    nextChangeUnknown: 'Heure de changement inconnue',
    scheduleLabel: 'Programme quotidien',
    style: {
      a: {
        name: 'Éditorial',
        blurb: 'Titres à empattements, filets fins, discret et formel.',
        rationale: 'Le matin — demandes professionnelles et formelles.',
      },
      b: {
        name: 'Terminal',
        blurb: 'Métadonnées en chasse fixe, angles nets, pensé pour les nuits tardives.',
        rationale: 'Le soir et la nuit — public créatif et plus jeune.',
      },
      c: {
        name: 'Magazine',
        blurb: 'Papier chaleureux, texte à empattements, porté par l\'image et sans hâte.',
        rationale: 'L\'après-midi — une audience plus personnelle, sensible au lifestyle.',
      },
    },
    explainer: {
      title: 'Ce site change selon l\'heure de la journée',
      body: 'Il est actuellement {time}, vous voyez donc le style {style}. Plus tard, il changera tout seul. Rien n\'est cassé — c\'est voulu.',
      schedule: 'Le matin, c\'est Éditorial ; l\'après-midi, Magazine ; le soir et la nuit, Terminal.',
      keepThis: 'Garder ce style',
      gotIt: 'Compris',
      settings: 'Réglages d\'apparence',
    },
  },
};
