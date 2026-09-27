/*
 * de.js — deutsche Locale. Struktur, Reihenfolge und Key-Satz folgen en.js, der
 * einzigen Wahrheit. Bereits geprüfte Übersetzungen wurden wörtlich übernommen;
 * dieser Durchgang schließt die Lücke zu en.js (resume, audience, services,
 * awards sowie Ergänzungen in skills, projects, home, nav und common) und
 * entfernt die veralteten Keys skills.levelLabel und skills.levelOf.
 */
export default {
  /* ── site notice ──────────────────────────────────────────────────────
     The slim strip at the top of every page. It is read by SiteNotice.vue,
     which renders this sentence in ALL six locales at once, not just the
     visitor's — so a missing translation would show up as an English line
     inside another language's slot. Keep every pack filled. */
  notice: {
    label: 'Status der Website',
    building: 'Diese Website wird noch gebaut — sie wird laufend ergänzt.',
  },

  /* ── site chrome ─────────────────────────────────────────────────────── */
  nav: {
    home: 'Startseite',
    services: 'Leistungen',
    resume: 'Lebenslauf',
    about: 'Über mich',
    aboutMe: 'Wer ich bin',
    timeline: 'Zeitstrahl',
    skills: 'Fähigkeiten',
    testimonials: 'Empfehlungen',
    projects: 'Projekte',
    gallery: 'Galerie',
    blog: 'Blog',
    contact: 'Kontakt',
    /* neu */
    primaryLabel: 'Hauptnavigation',
    aboutSubmenuLabel: 'Abschnitte über mich',
    languageLabel: 'Sprache wechseln',
    languageCurrent: 'Sprache: {name}',
    themeLabel: 'Erscheinungsbild',
    skipToContent: 'Zum Inhalt springen',
    menu: 'Menü',
    closeMenu: 'Menü schließen',
  },

  /* ── gemeinsamer Wortschatz ──────────────────────────────────────────── */
  common: {
    filterAll: 'Alle',
    readMore: 'Weiterlesen',
    viewAll: 'Alle ansehen',
    back: 'Zurück',
    backTo: 'Zurück zu {page}',
    empty: 'Noch nichts hier.',
    externalLink: 'Öffnet in einem neuen Tab',
    notTranslated: 'Noch nicht übersetzt — Englisch wird angezeigt.',
    placeholderImage: 'Platzhalterbild',
    dismiss: 'Ausblenden',
    close: 'Schließen',
    learnMore: 'Mehr erfahren',
    optional: 'optional',
    /* Wird als aria-valuetext an Fortschrittsanzeigen verwendet. Bewusst generisch:
       die Anzeige wird von Projektfortschritt und (früher) Fähigkeitsstufen geteilt
       und darf deshalb keinen Namensraum eines der beiden übernehmen. */
    percentOf: '{value} von {max}',
    required: 'erforderlich',
    copy: 'Kopieren',
    copied: 'Kopiert',
    showing: '{count} von {total} angezeigt',
  },

  /* ── Zeiteinheiten für den „lebe seit…“-Zähler ───────────────────────── */
  time: {
    days: 'Tage',
    hours: 'Stunden',
    minutes: 'Minuten',
    seconds: 'Sekunden',
    day: 'Tag',
    hour: 'Stunde',
    minute: 'Minute',
    second: 'Sekunde',
    and: 'und',
  },

  /* ── Startseite ──────────────────────────────────────────────────────── */
  home: {
    overline: 'Portfolio',
    title: 'Willkommen auf meiner Website',
    sub1: 'Schön, dass Sie hier sind. Hier finden Sie alles über mich — meinen Werdegang, meine Fähigkeiten und meine Arbeit.',
    sub2: 'Noch im Aufbau, aber wer ist das nicht?',
    liveLabel: 'Seit dem 22. März 2002 um 6:23 Uhr lebe ich bereits',
    aboutTitle: 'Über mich',
    aboutDesc: 'Wer ich bin, was ich gemacht habe und wie ich denke. Mein Hintergrund, mein Werdegang und die Tools, die ich verwende — alles an einem Ort.',
    projectsTitle: 'Projekte',
    projectsDesc: 'Eine Sammlung von Dingen, die ich gebaut habe — von Software-Tools und Systemen bis hin zu Marken und Nebenprojekten.',
    blogTitle: 'Blog',
    blogDesc: 'Gedanken über Technologie, Sprachen, Kultur und was mir sonst noch durch den Kopf geht. Gelegentlich aktualisiert.',
    contactTitle: 'Kontakt',
    contactDesc: 'Möchten Sie zusammenarbeiten oder einfach Hallo sagen? Hier finden Sie alle meine Kontaktdaten und Social-Media-Links.',
    exploreMore: 'Mehr erfahren',
    getInTouch: 'Kontakt aufnehmen',
    indexLabel: 'Wie es weitergeht',
    /* Die Startseite ist jetzt ein Angebot, keine Begrüßung: Einstieg → Leistungen →
       Stimmen → Wegweiser → Kontakt. Das sind die Abschnittsbeschriftungen dazu. */
    servicesLede: 'Neun Dinge, für die man mich beauftragen kann. Sagen Sie mir, was auf Sie zutrifft, und ich stelle diese nach vorn.',
    trustTitle: 'Was andere sagen',
    trustLede: 'Geschrieben von Menschen, mit denen ich zusammengearbeitet habe — einer stellvertretenden Schulleitung, einem Kollegen und zwei Programmkoordinatoren.',
    trustAll: 'Alle Empfehlungen',
    closingTitle: 'Sagen Sie mir, was Sie brauchen',
    closingBody: 'Ein Projekt, eine Frage oder eine Situation, bei der Sie nicht wissen, wie Sie sie angehen sollen. Das erste Gespräch kostet nichts.',
  },

  /* ── Über mich ───────────────────────────────────────────────────────── */
  about: {
    overline: 'Über mich',
    title: 'Über mich',
    subtitle: 'Wer bin ich?',
    bio1: 'Hey! Ich bin Jeremy. Mein Ziel? Eine Spur Eleganz in einer Welt zu hinterlassen, die ständig nach dem nächsten großen Ding hastet. Ich glaube, das Leben ist viel zu kostbar, um es damit zu verbringen, Dinge zu tun, die man nicht liebt, für Dinge, die man nicht braucht, um Menschen zu beeindrucken, die man nicht kennt. Nennen Sie mich idealistisch, aber ich wäre lieber pleite und inspiriert als reich und gelangweilt. (Obwohl inspiriert und komfortabel auch nicht schlecht wäre, seien wir ehrlich.)',
    bio2: 'Erfahren Sie unten mehr über mich.',
    timelineTitle: 'Mein Werdegang',
    timelineLived: 'Seit dem 22. März 2002 um 6:23 Uhr lebe ich bereits',
    timelineDesc: 'Ein vollständiger chronologischer Überblick über meine Erfahrungen und prägenden Momente.',
    skillsTitle: 'Meine Fähigkeiten',
    skillsDesc: 'Sprachen, die ich spreche, Tools, die ich verwende, und Technologien, mit denen ich arbeite — ehrlich bewertet.',
    testimonialsTitle: 'Empfehlungen',
    testimonialsDesc: 'Was Kollegen, Lehrkräfte und Organisationen über die Zusammenarbeit mit mir gesagt haben.',
    viewTimeline: 'Zeitstrahl ansehen',
    viewSkills: 'Fähigkeiten ansehen',
    viewTestimonials: 'Empfehlungen ansehen',
  },

  /* ── Zeitstrahl ──────────────────────────────────────────────────────── */
  timeline: {
    overline: 'Werdegang',
    title: 'Mein Werdegang',
    lede: 'Ein vollständiger chronologischer Überblick über meine Erfahrungen und prägenden Momente.',
    countLabel: '{count} Einträge',
    newestFirst: 'Neueste zuerst',
    categoryLabel: 'Kategorie',
    category: {
      career: 'Beruf',
      personal: 'Persönlich',
      education: 'Ausbildung',
      hobby: 'Hobby',
    },
  },

  /* ── Fähigkeiten ─────────────────────────────────────────────────────── */
  skills: {
    overline: 'Fähigkeiten',
    title: 'Meine Fähigkeiten',
    lede: 'Sprachen, die ich spreche, Tools, die ich verwende, und Technologien, mit denen ich arbeite — ehrlich bewertet.',
    filterLabel: 'Fähigkeiten danach filtern, wie sie genutzt werden',
    /* `usage` sagt, WIE eine Fähigkeit genutzt wird, nicht wie gut er darin ist. Es
       ersetzt eine selbst vergebene Prozentzahl, die kein Besucher prüfen oder
       nutzen konnte. */
    usageLabel: 'Wie es genutzt wird',
    evidenceLabel: 'Belege',
    countLabel: '{count} Fähigkeiten',
    usage: {
      professional: 'Kundenarbeit hängt davon ab',
      working: 'Damit wurden echte Dinge gebaut',
      learning: 'Wird gerade gelernt',
    },
    usageShort: {
      professional: 'Beruflich',
      working: 'Im Einsatz',
      learning: 'Lernend',
    },
    filterAll: 'Alle',
    filterProgramming: 'Programmierung',
    filterLanguage: 'Sprachen',
    filterOther: 'Sonstiges',
    category: {
      programming: 'Programmierung',
      language: 'Sprachen',
      other: 'Sonstiges',
    },
  },

  /* ── Empfehlungen ────────────────────────────────────────────────────── */
  testimonials: {
    overline: 'Empfehlungen',
    title: 'Empfehlungen',
    subtitle: 'Was Menschen sagen, mit denen ich zusammengearbeitet habe.',
    lede: 'Was Kollegen, Lehrkräfte und Organisationen über die Zusammenarbeit mit mir gesagt haben.',
    clickToRead: 'Zum Lesen klicken',
    readMore: 'Vollständiges Schreiben lesen',
    readFull: 'Das vollständige Schreiben lesen',
    backBtn: 'Zurück zu den Empfehlungen',
    contextLabel: 'Kontext',
    notFoundTitle: 'Empfehlung nicht gefunden',
    notFoundBody: 'Diese Empfehlung gibt es nicht, oder der Link ist veraltet.',
    notFoundCta: 'Zurück zu allen Empfehlungen',
  },

  /* ── Projekte ────────────────────────────────────────────────────────── */
  projects: {
    overline: 'Arbeit',
    title: 'Meine Projekte',
    subtitle: 'Meine Arbeiten',
    lede: 'Hier finden Sie eine Auswahl meiner Projekte aus verschiedenen Bereichen — von Softwareentwicklung bis kreativem Design, von Technologie bis Unternehmertum. Jedes Projekt spiegelt meine Leidenschaft für Innovation, Kreativität und das Lösen echter Probleme wider.',
    intro: 'Hier finden Sie eine Auswahl meiner Projekte aus verschiedenen Bereichen — von Softwareentwicklung bis kreativem Design, von Technologie bis Unternehmertum. Jedes Projekt spiegelt meine Leidenschaft für Innovation, Kreativität und das Lösen echter Probleme wider.',
    countLabel: '{count} Projekte',
    /* Die Seite hat zwei Hälften: eine ausgeschriebene Auswahl und danach der
       vollständige Index. Der Index ist die Garantie, dass das Sortieren nichts
       verbirgt — jedes Projekt bleibt gelistet, auch die bewusst nicht
       hervorgehobenen. */
    featuredTitle: 'Ausgewählte Arbeiten',
    featuredLede: 'Sechs Projekte, die genug Substanz haben, um ausführlich gelesen zu werden.',
    indexTitle: 'Alle Projekte',
    indexLede: 'Die vollständige Liste, auch die Projekte, die ich nicht ausführlich beschrieben habe. Ein Projekt nicht hervorzuheben heißt nicht, es zu entfernen.',
    indexCount: 'insgesamt {count}',
    archivedNote: 'Nicht hervorgehoben',
    openLink: 'Website öffnen',
    filterLabel: 'Projekte nach Status filtern',
    statusLabel: 'Status',
    progressLabel: 'Fortschritt',
    techStack: 'Technologien',
    cofounder: 'Mitgründer',
    cofounderLabel: 'Mitgründer: {name}',
    stages: 'Projektphasen',
    stageCompleted: 'Abgeschlossen',
    stageInProgress: 'In Bearbeitung',
    stageOf: 'Phase {current} von {total}',
    viewProject: 'Projekt ansehen',
    clickForMore: 'Klicken für Details',
    openProject: 'Projekt öffnen',
    noLink: 'Noch kein öffentlicher Link',
    comingSoon: 'Demnächst',
    waitMore: 'Weitere Inhalte folgen…',
    filterAll: 'Alle',
    filterProgress: 'In Bearbeitung',
    filterPaused: 'Pausiert',
    filterCompleted: 'Abgeschlossen',
    emptyTitle: 'Keine Projekte in diesem Filter',
    emptyBody: 'Versuchen Sie einen anderen Status.',
    status: {
      'in-progress': 'In Bearbeitung',
      paused: 'Pausiert',
      completed: 'Abgeschlossen',
    },
  },

  /* ── Blog ────────────────────────────────────────────────────────────── */
  blog: {
    overline: 'Texte',
    title: 'Mein Blog',
    subtitle: 'Was Sie hier finden',
    lede: 'Willkommen in meiner Ecke des Internets! Hier teile ich meine Gedanken, Einblicke und Geschichten zu Themen, die mich begeistern. Ob Sie wegen Technik-Tipps, Sprachenlernen oder einer Portion Inspiration hier sind — ich hoffe, Sie finden etwas, das bei Ihnen ankommt.',
    intro: 'Willkommen in meiner Ecke des Internets! Hier teile ich meine Gedanken, Einblicke und Geschichten zu Themen, die mich begeistern.',
    countLabel: '{count} Beiträge',
    filterLabel: 'Beiträge nach Kategorie filtern',
    categoryLabel: 'Kategorie',
    draftBadge: 'Entwurf',
    clickToRead: 'Zum Lesen klicken',
    clickForMore: 'Klicken für Details',
    readMore: 'Weiterlesen',
    waitMore: 'Weitere Inhalte folgen…',
    filterAll: 'Alle',
    filterTech: 'Technik',
    filterLanguage: 'Sprachen',
    filterCulture: 'Kultur',
    filterLife: 'Leben',
    emptyTitle: 'Keine Beiträge in dieser Kategorie',
    emptyBody: 'Versuchen Sie eine andere Kategorie — oder schauen Sie später noch einmal vorbei.',
    category: {
      tech: 'Technik',
      language: 'Sprachen',
      culture: 'Kultur',
      life: 'Leben',
    },
  },

  /* ── Galerie ─────────────────────────────────────────────────────────── */
  gallery: {
    overline: 'Galerie',
    title: 'Galerie',
    subtitle: 'Eine visuelle Aufzeichnung von Veranstaltungen, Reisen und Momenten.',
    lede: 'Eine visuelle Aufzeichnung von Veranstaltungen, Reisen und Momenten.',
    countLabel: '{count} Fotos',
    filterLabel: 'Fotos nach Kategorie filtern',
    placeholderNotice: 'Dies sind Platzhalterbilder. Echte Fotos werden sie ersetzen.',
    placeholderBadge: 'Platzhalter',
    yearLabel: 'Jahr',
    locationLabel: 'Ort',
    openPhoto: 'Foto ansehen',
    closePhoto: 'Foto schließen',
    filterAll: 'Alle',
    filterEvents: 'Events',
    filterSports: 'Sport',
    filterVolunteer: 'Ehrenamt',
    filterCampus: 'Campus',
    filterTravel: 'Reisen',
    emptyTitle: 'Keine Fotos in dieser Kategorie',
    emptyBody: 'Versuchen Sie eine andere Kategorie.',
    empty: 'Noch keine Fotos in dieser Kategorie.',
    category: {
      events: 'Events',
      sports: 'Sport',
      volunteer: 'Ehrenamt',
      campus: 'Campus',
      travel: 'Reisen',
    },
  },

  /* ── Auszeichnungen ────────────────────────────────────────────────────────
     Wettbewerbe, Prüfungen und Zertifikate. Erst `result` macht aus einem Eintrag
     einen Nachweis statt einer Behauptung, deshalb wird es immer gezeigt, wenn
     es vorhanden ist.
     ──────────────────────────────────────────────────────────────────────── */
  awards: {
    overline: 'Nachweise',
    title: 'Wettbewerbe & Zertifikate',
    lede: 'Ergebnisse von Dritten — der Teil dieser Seite, den Sie prüfen können, ohne mir etwas glauben zu müssen.',
    countLabel: '{count} Einträge',
    kindLabel: 'Art',
    resultLabel: 'Ergebnis',
    /* Einträge mit `result: null` werden ohne Ergebniszeile gezeigt, statt „offen“ zu behaupten. */
    kind: {
      exam: 'Prüfung',
      competition: 'Wettbewerb',
      certificate: 'Zertifikat',
      sport: 'Sport',
    },
  },

  /* ── Lebenslauf ───────────────────────────────────────────────────────────
     Der Lebenslauf wird aus derselben Inhaltsebene wie die Website zusammengestellt
     und je Branche gefiltert. Die Druckfassung ist mit Absicht textbasiert und
     einspaltig: ein ATS liest Text, und ein zweispaltiges Grafik-PDF bleibt ihm unsichtbar.
     ──────────────────────────────────────────────────────────────────────── */
  resume: {
    overline: 'CV',
    title: 'Lebenslauf',
    lede: 'Fünf Fassungen desselben Werdegangs — die vollständige und vier, die auf eine bestimmte Art von Arbeit zugeschnitten sind. Wählen Sie die, die zu Ihrem Anliegen passt; drucken oder speichern Sie sie als PDF.',
    variantLabel: 'Welche Fassung',
    print: 'Drucken / als PDF speichern',
    downloadJson: 'Als JSON herunterladen',
    /* Sagen, warum die Druckfassung schlicht ist. Sonst liest sich „langweilig“ als „unfertig“. */
    printNote: 'Die Druckfassung ist mit Absicht schlicht und einspaltig, damit Bewerbermanagement-Systeme (ATS) sie lesen können. Die gestaltete Fassung ist die auf der Website.',
    generatedNote: 'Aus denselben Inhalten wie die Website erzeugt — wird eines davon geändert, ändert sich beides.',
    sectionSummary: 'Zusammenfassung',
    sectionServices: 'Was ich mache',
    sectionExperience: 'Berufserfahrung',
    sectionProjects: 'Ausgewählte Projekte',
    sectionEducation: 'Ausbildung',
    sectionSkills: 'Fähigkeiten',
    sectionLanguages: 'Sprachen',
    sectionTechnical: 'Technik',
    sectionAwards: 'Wettbewerbe & Zertifikate',
    present: 'heute',
  },

  /* ── Zielgruppe (die Besucher-Achse) ──────────────────────────────────────
     Das Steuerelement fragt den Besucher, weswegen er da ist; der Text ist deshalb
     als Frage formuliert, die er wiedererkennt — nicht als Kategorie, die Menschen
     in Schubladen sortiert. Die Beschriftungen je Zielgruppe und die „was Sie
     brauchen“-Zeilen liegen in src/content/audiences.js; hier stehen die
     Rahmentexte.
     ──────────────────────────────────────────────────────────────────────── */
  audience: {
    title: 'Ich bin hier wegen…',
    hint: 'Sagen Sie es mir, und ich stelle das voran, was für Sie zählt. Nichts wird verborgen — alles andere bleibt auf der Seite, nur weiter unten.',
    allLabel: 'Alles',
    allNeed: 'Das ganze Bild zeigen — keine Umsortierung.',
    showingFor: 'Was für {label} zählt, steht jetzt vorn.',
    showAll: 'Alles anzeigen',
    /* Die eingeklappte Gruppe mit dem, was dieser Besucher vermutlich nicht braucht. */
    otherTitle: 'Außerdem verfügbar',
    otherCount: '{count} weitere',
    otherBody: 'Nicht das, weswegen Sie hier sind — aufklappen, wenn Sie neugierig sind.',
    otherExpand: '{count} weitere anzeigen',
    otherCollapse: 'Einklappen',
  },

  /* ── Leistungen ──────────────────────────────────────────────────────────
     Das Ziel der Website sind Anfragen, deshalb trägt dieser Namensraum den Text,
     der „wofür kann ich Sie beauftragen“ beantwortet. Die Leistungsbeschreibungen
     selbst liegen in src/content/services.js; hier stehen die Rahmentexte.
     ──────────────────────────────────────────────────────────────────────── */
  services: {
    overline: 'Leistungen',
    title: 'Was ich mache',
    lede: 'Ich arbeite an der Schnittstelle von Sprachen, Handel und Technologie. Bei den meisten Aufträgen kommt mehr als eines davon zusammen — ein Lieferantenbesuch braucht das Dolmetschen und die Papiere und danach eine Website, über die sich das Produkt verkaufen lässt.',
    filterLabel: 'Leistungen nach Bereich filtern',
    includesLabel: 'Das umfasst',
    countLabel: '{count} Leistungen',
    languagesLabel: 'Sprachen',
    ctaTitle: 'Nicht sicher, was Sie davon brauchen?',
    ctaBody: 'Beschreiben Sie die Situation, und ich sage Ihnen, was dazugehört — oder ob Sie mich überhaupt brauchen.',
    cta: 'Ins Gespräch kommen',
    otherNote: 'Andere Arten von Arbeit: fragen Sie einfach.',
    /* Wie ein Auftrag berechnet wird, ohne Zahlen zu veröffentlichen. */
    pricingTitle: 'Wie ich arbeite',
    pricingBody: 'Angebot pro Auftrag — Tagessatz beim Dolmetschen, Festpreis für eine Website oder ein Handelsprojekt, Stundensatz für laufende Beratung. Wie die Kosten aussehen und was enthalten ist, sage ich Ihnen, bevor Sie sich entscheiden.',
    travelNote: 'Sitz in Wenzhou, Zhejiang. Verfügbar für Aufträge in ganz China und international.',
    domainLabel: 'Bereich',
    domain: {
      language: 'Sprache',
      trade: 'Handel',
      tech: 'Technologie',
    },
  },

  /* ── Kontakt ─────────────────────────────────────────────────────────── */
  contact: {
    overline: 'Kontakt',
    title: 'Kontakt aufnehmen',
    lede: 'Möchten Sie zusammenarbeiten oder einfach Hallo sagen? Hier finden Sie alle meine Kontaktdaten und Social-Media-Links.',
    formTitle: 'Kontakt aufnehmen',
    name: 'Name',
    email: 'E-Mail',
    message: 'Nachricht',
    send: 'Nachricht senden',
    infoTitle: 'Oder finden Sie mich hier',
    location: 'Standort',
    phone: 'Telefon',
    wechat: 'WeChat',
    followTitle: 'Folgen Sie mir',
    copyEmail: 'E-Mail-Adresse kopieren',
    copyEmailValue: '{email} kopieren',
    copied: 'In die Zwischenablage kopiert',
    copyFailed: 'Kopieren nicht möglich — bitte die Adresse manuell markieren',
    /* Ehrlicher Ersatz für das alte Formular, das nur alert() aufrief und sich
       selbst leerte, sodass Besucher glaubten, eine Nachricht sei versendet worden. */
    formUnavailableTitle: 'Das Formular ist noch nicht angebunden',
    formUnavailableBody: 'Diese Website hat kein Backend, deshalb kann das Formular keine Nachricht zustellen. E-Mail funktioniert sofort — sie öffnet Ihr Mailprogramm mit den ausgefüllten Angaben.',
    composeEmail: 'Stattdessen eine E-Mail schreiben',
    noPublicProfile: '{name} — noch kein öffentlicher Link',
    officialSite: '{name} — offizielle Website',
  },

  /* ── Fußzeile ────────────────────────────────────────────────────────── */
  footer: {
    rights: '© 2025 Jeremy Thierry Chan. Alle Rechte vorbehalten.',
    /* Die Website ist mit Absicht ungewöhnlich: das sagen, statt es als Fehler wirken zu lassen. */
    themeNote: 'Diese Website ändert ihren Stil mit der Tageszeit.',
    styleNow: 'Aktuell {style} · {window}',
    sourceLabel: 'Quelle',
    socialLabel: 'Social-Media-Links',
  },

  /* ── 404 ─────────────────────────────────────────────────────────────── */
  notFound: {
    overline: 'Fehler 404',
    title: 'Seite nicht gefunden',
    body: 'Diese Seite gibt es nicht, oder der Link ist veraltet. Aber keine Sorge — ich arbeite daran.',
    cta: 'Zur Startseite',
    hint: 'Prüfen Sie die Adresse, oder nutzen Sie die Navigation oben.',
  },

  /* ── Erscheinungsbild / die Tageszeit-Funktion ───────────────────────── */
  theme: {
    label: 'Erscheinungsbild',
    /* Stil und Hell/Dunkel sind zwei unabhängige Achsen. */
    styleAxisLabel: 'Visueller Stil',
    modeAxisLabel: 'Hell oder dunkel',
    styleAuto: 'Der Uhr folgen',
    /* Said on the trigger itself, so a pinned style is visible without opening
       the panel. A pinned style silently overrules the schedule, and when that
       state is invisible the schedule gets reported as broken. */
    triggerAuto: 'Erscheinungsbild — folgt der Uhr',
    triggerPinned: 'Erscheinungsbild — festgelegt, folgt der Uhr nicht',
    styleAutoHint: 'Wechselt im Tagesverlauf automatisch',
    modeFollowsStyle: 'Wie vorgesehen',
    modeFollowsStyleHint: 'Die vorgesehene Helligkeit des jeweiligen Stils',
    light: 'Hell',
    dark: 'Dunkel',
    currentStyle: 'Stil: {name}',
    currentMode: 'Modus: {mode}',
    followsClock: 'Folgt der Uhr',
    pinned: 'Festgelegt',
    pin: 'Dieses Aussehen behalten',
    pinHint: 'Stoppt den automatischen Wechsel',
    reset: 'Zurück zu automatisch',
    nextChange: 'Wechselt um {time} zu {style}',
    nextChangeUnknown: 'Wechselzeit unbekannt',
    scheduleLabel: 'Täglicher Ablauf',
    style: {
      a: {
        name: 'Redaktionell',
        blurb: 'Serifen-Überschriften, feine Linien, ruhig und formell.',
        rationale: 'Morgen — professionelle und formelle Anfragen.',
      },
      b: {
        name: 'Terminal',
        blurb: 'Monospace für Metadaten, scharfe Ecken, gemacht für späte Nächte.',
        rationale: 'Abend und Nacht — kreatives, jüngeres Publikum.',
      },
      c: {
        name: 'Magazin',
        blurb: 'Warmes Papier, Serifentext, bildgeführt und ohne Eile.',
        rationale: 'Nachmittag — ein persönlicheres, lifestyle-orientiertes Publikum.',
      },
    },
    explainer: {
      title: 'Diese Website ändert sich mit der Tageszeit',
      body: 'Es ist gerade {time}, deshalb sehen Sie den Stil {style}. Später wechselt er von selbst. Nichts ist kaputt — das ist so gewollt.',
      schedule: 'Morgens Redaktionell, nachmittags Magazin und abends bis in die Nacht Terminal.',
      keepThis: 'Diesen Stil behalten',
      gotIt: 'Verstanden',
      settings: 'Erscheinungsbild-Einstellungen',
    },
  },
};
