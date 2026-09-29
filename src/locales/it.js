/*
 * it.js — locale italiano.
 *
 * Stessa struttura e stesso ordine di en.js, che resta la fonte di verità: ogni
 * chiave assente qui ricade sull'inglese. Le etichette degli enum vivono in
 * <namespace>.<campo>.<valore> (es. projects.status.in-progress) e vanno lette
 * con l'helper enumKey() di @/content, non concatenando stringhe.
 */
export default {
  /* ── site notice ──────────────────────────────────────────────────────
     The slim strip at the top of every page. It is read by SiteNotice.vue,
     which renders this sentence in ALL six locales at once, not just the
     visitor's — so a missing translation would show up as an English line
     inside another language's slot. Keep every pack filled. */
  notice: {
    label: 'Stato del sito',
    building: 'Questo sito è ancora in costruzione: viene aggiornato man mano.',
  },

  quote: {
    heading: 'Come preparo un preventivo',
    lede: 'Cosa succede fra il momento in cui mi scrivi e quello in cui hai un prezzo in mano.',
    step1Title: 'Dimmi di cosa hai bisogno',
    step1Body: 'Scopo, date, lingue, luogo — e un intervallo di budget indicativo se ne hai uno, cosa che fa risparmiare un giro di messaggi.',
    step2Title: 'Ti rispondo con un prezzo e un perimetro',
    step2Body: 'Per iscritto, indicando cosa è incluso, cosa non lo è e quando verrebbe consegnato.',
    step3Title: 'Confermi, e io fisso la data',
    step3Body: 'Una volta concordati prezzo e perimetro, confermo le date e passo ai preparativi.',
    noNumbers: 'Qui non c’è un listino, ed è voluto. Questi nove servizi si fatturano in unità diverse — a giornata, a evento, a parola, a progetto, a ora, a lezione — quindi una cifra unica sarebbe più fuorviante che utile. Descrivi di cosa hai bisogno e otterrai un numero preciso.',
    cta: 'Mandami di cosa hai bisogno',
  },

  /* ── il listino delle lezioni ──────────────────────────────────────────
     La pagina /tutoring con le tariffe orarie. I numeri vivono nel livello di
     contenuto (content/tutoring.js); qui c’è solo l’impalcatura della pagina. */
  tutoring: {
    overline: 'Insegnamento e ripetizioni',
    title: 'Tariffe orarie',
    lede: 'Tariffe orarie per lezioni individuali e in piccoli gruppi, dalla scuola primaria fino all’IELTS, alle lingue, alla programmazione e alla modellazione.',
    unit: 'CNY all’ora',
    courseColumn: 'Corso',
    howTitle: 'Come si calcola il prezzo',
    howBody: 'Ogni corso ha un solo prezzo, quello della lezione individuale. Le altre tre colonne sono quel prezzo moltiplicato per il coefficiente della dimensione del gruppo e arrotondato alla decina — in coppia ciascuno paga il 70 %, in tre il 60 % e in un gruppo più numeroso il 50 %.',
    quotedOnRequest: 'Su richiesta',
    cta: 'Chiedi informazioni su un corso',
  },

  /* ── struttura del sito ──────────────────────────────────────────────── */
  nav: {
    home: 'Home',
    services: 'Servizi',
    resume: 'Curriculum',
    about: 'Chi sono',
    aboutMe: 'Su di me',
    timeline: 'Cronologia',
    skills: 'Competenze',
    testimonials: 'Referenze',
    projects: 'Progetti',
    gallery: 'Galleria',
    blog: 'Blog',
    contact: 'Contatti',
    primaryLabel: 'Principale',
    aboutSubmenuLabel: 'Sezioni di «Chi sono»',
    languageLabel: 'Cambia lingua',
    languageCurrent: 'Lingua: {name}',
    themeLabel: 'Aspetto',
    skipToContent: 'Vai al contenuto',
    menu: 'Menu',
    closeMenu: 'Chiudi il menu',
  },

  /* ── lessico condiviso ───────────────────────────────────────────────── */
  common: {
    filterAll: 'Tutto',
    readMore: 'Leggi di più',
    viewAll: 'Vedi tutto',
    back: 'Indietro',
    backTo: 'Torna a {page}',
    empty: 'Ancora nulla qui.',
    externalLink: 'Si apre in una nuova scheda',
    notTranslated: 'Non ancora tradotto — mostrato in inglese.',
    placeholderImage: 'Immagine segnaposto',
    dismiss: 'Ignora',
    close: 'Chiudi',
    learnMore: 'Scopri di più',
    optional: 'facoltativo',
    /* Usato come aria-valuetext sulle barre di avanzamento. Volutamente generico:
       la barra è condivisa da avanzamento dei progetti e (in passato) livelli delle
       competenze, quindi non deve prendere in prestito il namespace di una sola. */
    percentOf: '{value} su {max}',
    required: 'obbligatorio',
    copy: 'Copia',
    copied: 'Copiato',
    showing: 'Mostrati {count} di {total}',
  },

  /* ── unità del contatore «vivo da…» ──────────────────────────────────── */
  time: {
    days: 'giorni',
    hours: 'ore',
    minutes: 'minuti',
    seconds: 'secondi',
    day: 'giorno',
    hour: 'ora',
    minute: 'minuto',
    second: 'secondo',
    and: 'e',
  },

  /* ── home ────────────────────────────────────────────────────────────── */
  home: {
    overline: 'Portfolio',
    title: 'Benvenuto nel mio sito',
    sub1: 'Sono contento che tu sia qui. Qui troverai tutto su di me — il mio percorso, le mie competenze e i miei lavori.',
    sub2: 'Ancora in costruzione, ma chi non lo è?',
    liveLabel: 'Dal 22 marzo 2002 alle 6:23, ho già vissuto',
    aboutTitle: 'Chi sono',
    aboutDesc: 'Chi sono, cosa ho fatto e come penso. Il mio percorso e gli strumenti che uso — tutto in un unico posto.',
    projectsTitle: 'Progetti',
    projectsDesc: 'Una raccolta di cose che ho creato — da strumenti software a brand e progetti paralleli.',
    blogTitle: 'Blog',
    blogDesc: 'Riflessioni su tecnologia, lingue, cultura e qualsiasi altra cosa mi passi per la testa. Aggiornato occasionalmente.',
    contactTitle: 'Contatti',
    contactDesc: 'Vuoi collaborare o semplicemente dire ciao? Qui trovi tutti i miei contatti e i link ai social.',
    exploreMore: 'Scopri di più',
    getInTouch: 'Contattami',
    indexLabel: 'Dove andare adesso',
    /* La home ora è una proposta, non un saluto: hero → servizi → referenze →
       indice → contatti. Queste sono le etichette di quella struttura. */
    servicesLede: 'Nove cose per cui posso essere ingaggiato. Dimmi quale ti riguarda e le metto davanti a tutto il resto.',
    trustTitle: 'Cosa dicono di me',
    trustLede: 'Scritte da persone con cui ho lavorato — una vicepreside, un collega, due coordinatori di programma e un altro volontario.',
    trustAll: 'Tutte le referenze',
    closingTitle: 'Dimmi di cosa hai bisogno',
    closingBody: 'Un progetto, una domanda, o una situazione che non sai come affrontare. La prima conversazione non costa nulla.',
  },

  /* ── chi sono ────────────────────────────────────────────────────────── */
  about: {
    overline: 'Chi sono',
    title: 'Chi sono',
    subtitle: 'Chi sono?',
    bio1: 'Ciao! Sono Jeremy. Il mio obiettivo? Lasciare una traccia di eleganza in un mondo che corre costantemente verso la prossima grande cosa. Penso che la vita sia troppo preziosa per spenderla a fare cose che non ami, per cose di cui non hai bisogno, per impressionare persone che non conosci. Chiamami idealista, ma preferisco essere al verde e ispirato che ricco e annoiato. (Anche se ispirato e agiato non sarebbe male, ad essere onesti.)',
    bio2: 'Scopri di più su di me qui sotto.',
    timelineTitle: 'Il mio percorso',
    timelineLived: 'Dal 22 marzo 2002 alle 6:23, ho già vissuto',
    timelineDesc: 'Un resoconto cronologico completo delle mie esperienze e dei momenti che mi hanno formato.',
    skillsTitle: 'Le mie competenze',
    skillsDesc: 'Le lingue che parlo, gli strumenti che uso e le tecnologie con cui lavoro — valutate onestamente.',
    testimonialsTitle: 'Referenze',
    testimonialsDesc: 'Cosa hanno detto colleghi, insegnanti e organizzazioni sulla collaborazione con me.',
    viewTimeline: 'Vedi il percorso',
    viewSkills: 'Vedi le competenze',
    viewTestimonials: 'Vedi le referenze',
  },

  /* ── cronologia ──────────────────────────────────────────────────────── */
  timeline: {
    overline: 'Percorso',
    title: 'Il mio percorso',
    lede: 'Un resoconto cronologico completo delle mie esperienze e dei momenti che mi hanno formato.',
    countLabel: '{count} voci',
    newestFirst: 'Prima i più recenti',
    categoryLabel: 'Categoria',
    category: {
      career: 'Carriera',
      personal: 'Personale',
      education: 'Formazione',
      hobby: 'Hobby',
    },
  },

  /* ── competenze ──────────────────────────────────────────────────────── */
  skills: {
    overline: 'Competenze',
    title: 'Le mie competenze',
    lede: 'Le lingue che parlo, gli strumenti che uso e le tecnologie con cui lavoro — valutate onestamente.',
    filterLabel: "Filtra le competenze in base all'uso",
    /* `usage` dice COME si usa una competenza, non quanto si è bravi: ha sostituito
       una percentuale autoattribuita che nessun visitatore poteva verificare. */
    usageLabel: 'Come viene usata',
    evidenceLabel: 'Prove',
    countLabel: '{count} competenze',
    usage: {
      professional: 'Il lavoro con i clienti dipende da questa',
      working: 'Ci ho costruito cose reali',
      learning: 'La sto studiando ora',
    },
    usageShort: {
      professional: 'Per i clienti',
      working: 'Su progetti reali',
      learning: 'In studio',
    },
    filterAll: 'Tutto',
    filterProgramming: 'Programmazione',
    filterLanguage: 'Lingue',
    filterOther: 'Altro',
    category: {
      programming: 'Programmazione',
      language: 'Lingue',
      other: 'Altro',
    },
  },

  /* ── referenze ───────────────────────────────────────────────────────── */
  testimonials: {
    overline: 'Referenze',
    title: 'Referenze',
    subtitle: 'Cosa dicono le persone con cui ho lavorato.',
    lede: 'Cosa hanno detto colleghi, insegnanti e organizzazioni sulla collaborazione con me.',
    clickToRead: 'Clicca per leggere',
    readMore: 'Leggi la lettera completa',
    readFull: 'Leggi la lettera per intero',
    backBtn: 'Torna alle referenze',
    contextLabel: 'Contesto',
    notFoundTitle: 'Referenza non trovata',
    notFoundBody: 'Questa referenza non esiste, oppure il link non è più valido.',
    notFoundCta: 'Torna a tutte le referenze',
  },

  /* ── progetti ────────────────────────────────────────────────────────── */
  projects: {
    overline: 'Lavori',
    title: 'I miei progetti',
    subtitle: 'I miei lavori',
    lede: "Qui troverai una selezione dei miei progetti in vari campi — dallo sviluppo software al design creativo, dalla tecnologia all'imprenditoria.",
    intro: "Qui troverai una selezione dei miei progetti in vari campi — dallo sviluppo software al design creativo, dalla tecnologia all'imprenditoria.",
    countLabel: '{count} progetti',
    /* La pagina ha due metà: una selezione scritta per esteso e poi l'indice
       completo. L'indice è la garanzia che il filtro non nasconde nulla: ogni
       progetto resta elencato, compresi quelli non messi in evidenza. */
    featuredTitle: 'Lavori selezionati',
    featuredLede: 'Sei progetti abbastanza solidi da meritare una lettura approfondita.',
    indexTitle: 'Tutti i progetti',
    indexLede: 'L’elenco completo, compresi quelli di cui non ho scritto la scheda. Scegliere di non mettere in evidenza un progetto non significa toglierlo.',
    indexCount: '{count} in tutto',
    archivedNote: 'Non in evidenza',
    openLink: 'Apri il sito',
    filterLabel: 'Filtra i progetti per stato',
    statusLabel: 'Stato',
    progressLabel: 'Avanzamento',
    techStack: 'Tecnologie',
    cofounder: 'Cofondatore',
    cofounderLabel: 'Cofondatore: {name}',
    stages: 'Fasi del progetto',
    stageCompleted: 'Completato',
    stageInProgress: 'In corso',
    stageOf: 'Fase {current} di {total}',
    viewProject: 'Vedi il progetto',
    clickForMore: 'Clicca per dettagli',
    openProject: 'Apri il progetto',
    noLink: 'Nessun link pubblico per ora',
    comingSoon: 'Prossimamente',
    waitMore: 'Altri contenuti in arrivo…',
    filterAll: 'Tutto',
    filterProgress: 'In corso',
    filterPaused: 'In pausa',
    filterCompleted: 'Completato',
    emptyTitle: 'Nessun progetto con questo filtro',
    emptyBody: 'Prova con un altro stato.',
    status: {
      'in-progress': 'In corso',
      paused: 'In pausa',
      completed: 'Completato',
    },
  },

  /* ── blog ────────────────────────────────────────────────────────────── */
  blog: {
    overline: 'Scritti',
    title: 'Il mio blog',
    subtitle: 'Cosa troverai qui',
    lede: "Benvenuto nel mio angolo di internet! Qui condivido pensieri, intuizioni e storie sugli argomenti che mi appassionano. Che tu sia qui per consigli tecnici, per imparare una lingua o solo per un po' di ispirazione — spero che tu trovi qualcosa che ti risuoni.",
    intro: 'Benvenuto nel mio angolo di internet! Qui condivido i miei pensieri su argomenti che mi appassionano — tecnologia, lingue, cultura e molto altro.',
    countLabel: '{count} articoli',
    filterLabel: 'Filtra gli articoli per categoria',
    categoryLabel: 'Categoria',
    draftBadge: 'Bozza',
    clickToRead: 'Clicca per leggere',
    clickForMore: 'Clicca per dettagli',
    readMore: 'Leggi tutto',
    waitMore: 'Altri contenuti in arrivo…',
    filterAll: 'Tutto',
    filterTech: 'Tecnologia',
    filterLanguage: 'Lingue',
    filterCulture: 'Cultura',
    filterLife: 'Vita',
    emptyTitle: 'Nessun articolo in questa categoria',
    emptyBody: 'Prova con un’altra categoria — o torna a trovarci più avanti.',
    category: {
      tech: 'Tecnologia',
      language: 'Lingue',
      culture: 'Cultura',
      life: 'Vita',
    },
  },

  /* ── galleria ────────────────────────────────────────────────────────── */
  gallery: {
    overline: 'Galleria',
    title: 'Galleria',
    subtitle: 'Un racconto visivo di eventi, viaggi e momenti.',
    lede: 'Un racconto visivo di eventi, viaggi e momenti.',
    countLabel: '{count} foto',
    filterLabel: 'Filtra le foto per categoria',
    placeholderNotice: 'Queste sono immagini segnaposto. Le fotografie reali le sostituiranno.',
    placeholderBadge: 'Segnaposto',
    yearLabel: 'Anno',
    locationLabel: 'Luogo',
    openPhoto: 'Vedi la foto',
    closePhoto: 'Chiudi la foto',
    filterAll: 'Tutto',
    filterEvents: 'Eventi',
    filterSports: 'Sport',
    filterVolunteer: 'Volontariato',
    filterCampus: 'Campus',
    filterTravel: 'Viaggi',
    emptyTitle: 'Nessuna foto in questa categoria',
    emptyBody: 'Prova con un’altra categoria.',
    empty: 'Nessuna foto in questa categoria per ora.',
    category: {
      events: 'Eventi',
      sports: 'Sport',
      volunteer: 'Volontariato',
      campus: 'Campus',
      travel: 'Viaggi',
    },
  },

  /* ── premi e certificati ─────────────────────────────────────────────────
     Gare, esami e certificati. `result` è ciò che rende una voce una prova
     invece di una dichiarazione, quindi si mostra sempre quando c'è.
     ──────────────────────────────────────────────────────────────────────── */
  awards: {
    overline: 'Risultati',
    title: 'Competizioni e certificati',
    lede: 'Risultati di terzi — la parte di questa pagina che puoi verificare senza fidarti della mia parola.',
    countLabel: '{count} voci',
    kindLabel: 'Tipo',
    resultLabel: 'Risultato',
    /* Le voci con `result: null` si mostrano senza riga del risultato, non con «in attesa». */
    kind: {
      exam: 'Esame',
      competition: 'Competizione',
      certificate: 'Certificato',
      sport: 'Sport',
    },
  },

  /* ── curriculum ──────────────────────────────────────────────────────────
     Il CV si compone dagli stessi contenuti del sito, filtrati per settore.
     L'output di stampa è testuale e a colonna singola di proposito: un ATS
     legge il testo, e un PDF grafico a due colonne per lui non esiste.
     ──────────────────────────────────────────────────────────────────────── */
  resume: {
    overline: 'CV',
    title: 'Curriculum',
    lede: 'Cinque versioni dello stesso percorso — quella completa e quattro ritagliate su un tipo preciso di lavoro. Scegli quella che corrisponde al motivo per cui sei qui; stampala o salvala in PDF.',
    variantLabel: 'Quale versione',
    print: 'Stampa / salva in PDF',
    downloadJson: 'Scarica in JSON',
    /* Dire perché la stampa è sobria: altrimenti «noiosa» si legge come «non finita». */
    printNote: 'La versione stampata è sobria e a colonna singola di proposito: così i sistemi di selezione automatica (ATS) riescono a leggerla. Quella con il design è la versione web.',
    generatedNote: 'Generata dagli stessi contenuti del sito — modificare l’una aggiorna anche l’altra.',
    sectionSummary: 'Sintesi',
    sectionServices: 'Cosa faccio',
    sectionExperience: 'Esperienza',
    sectionProjects: 'Progetti selezionati',
    sectionEducation: 'Formazione',
    sectionSkills: 'Competenze',
    sectionLanguages: 'Lingue',
    sectionTechnical: 'Tecnico',
    sectionAwards: 'Competizioni e certificati',
    present: 'Attuale',
  },

  /* ── pubblico (l'asse identitario del visitatore) ────────────────────────
     Il controllo chiede al visitatore per cosa è venuto, quindi il testo è
     scritto come una domanda che riconoscerebbe — non come un'etichetta che
     classifica le persone. Le etichette per pubblico e le righe «di cosa hai
     bisogno» vivono in src/content/audiences.js; queste sono le stringhe
     attorno.
     ──────────────────────────────────────────────────────────────────────── */
  audience: {
    title: 'Sono qui per…',
    hint: 'Dimmi e metto davanti ciò che ti riguarda. Non si nasconde nulla: tutto il resto resta nella pagina, solo più in basso.',
    allLabel: 'Tutto',
    allNeed: 'Mostra il quadro completo — senza riordini.',
    showingFor: 'Metto davanti ciò che conta per {label}.',
    showAll: 'Mostra tutto',
    /* Il gruppo compresso di ciò che probabilmente non ti serve. */
    otherTitle: 'C’è anche altro',
    otherCount: 'altri {count}',
    otherBody: 'Non è quello per cui sei qui — espandi se sei curioso.',
    otherExpand: 'Mostra altri {count}',
    otherCollapse: 'Nascondi',
  },

  /* ── servizi ─────────────────────────────────────────────────────────────
     L'obiettivo del sito è ricevere incarichi, quindi questo namespace porta
     il testo che risponde a «per cosa posso assumerti». Le descrizioni dei
     servizi vivono in src/content/services.js; queste sono le etichette
     attorno.
     ──────────────────────────────────────────────────────────────────────── */
  services: {
    overline: 'Servizi',
    title: 'Cosa faccio',
    lede: 'Lavoro fra lingue, commercio e tecnologia. Nella maggior parte degli incarichi se ne usa più di uno: una visita a un fornitore richiede l’interpretariato e le carte, e poi un sito da cui vendere.',
    filterLabel: 'Filtra i servizi per area',
    includesLabel: 'Cosa comprende',
    billingLabel: 'Come viene fatturato',
    countLabel: '{count} servizi',
    languagesLabel: 'Lingue',
    ctaTitle: 'Non sai quale ti serve?',
    ctaBody: 'Descrivimi la situazione e ti dirò cosa comporta — o se non ti servo affatto.',
    cta: 'Parliamone',
    otherNote: 'Altri tipi di lavoro: basta chiedere.',
    /* Come si calcola il prezzo, senza pubblicare cifre. */
    pricingTitle: 'Come lavoro',
    pricingBody: 'Preventivo per incarico — tariffa a giornata o a evento per l’interpretariato, prezzo fisso per un sito o un progetto commerciale, a ore per una consulenza continuativa. Ti dico che forma avrà il costo prima che tu ti impegni, e cosa comprende.',
    travelNote: 'Base a Wenzhou, Zhejiang. Disponibile per lavori in tutta la Cina e all’estero.',
    domainLabel: 'Area',
    domain: {
      language: 'Lingue',
      trade: 'Commercio',
      tech: 'Tecnologia',
    },
  },

  /* ── contatti ────────────────────────────────────────────────────────── */
  contact: {
    overline: 'Contatti',
    title: 'Contattami',
    lede: 'Vuoi collaborare o semplicemente dire ciao? Qui trovi tutti i miei contatti e i link ai social.',
    formTitle: 'Invia un messaggio',
    name: 'Nome',
    email: 'Email',
    message: 'Messaggio',
    send: 'Invia',
    infoTitle: 'O trovami qui',
    location: 'Posizione',
    phone: 'Telefono',
    wechat: 'WeChat',
    followTitle: 'Seguimi',
    copyEmail: 'Copia l’indirizzo email',
    copyEmailValue: 'Copia {email}',
    copied: 'Copiato negli appunti',
    copyFailed: 'Impossibile copiare — seleziona l’indirizzo a mano',
    /* Sostituisce onestamente il vecchio modulo, che si limitava a chiamare
       alert() e a svuotarsi: chi scriveva credeva di aver inviato un messaggio. */
    formUnavailableTitle: 'Il modulo non è ancora collegato',
    formUnavailableBody: 'Questo sito non ha un backend, quindi il modulo non può consegnare alcun messaggio. L’email invece funziona subito — apre il tuo programma di posta con i dettagli già compilati.',
    composeEmail: 'Scrivimi invece un’email',
    noPublicProfile: '{name} — nessun link pubblico per ora',
    officialSite: '{name} — sito ufficiale',
  },

  /* ── piè di pagina ───────────────────────────────────────────────────── */
  footer: {
    rights: '© 2025 Jeremy Thierry Chan. Tutti i diritti riservati.',
    /* Il sito è insolito di proposito: dirlo, invece di lasciarlo sembrare un bug. */
    themeNote: 'Questo sito cambia stile con il passare delle ore.',
    styleNow: 'Al momento {style} · {window}',
    sourceLabel: 'Codice sorgente',
    socialLabel: 'Link social',
    /* The footer's outgoing-links heading. It doubles as the nav landmark's
       accessible name via aria-labelledby, so it is the words on screen. */
    friendLinks: 'Link',
  },

  /* ── 404 ─────────────────────────────────────────────────────────────── */
  notFound: {
    overline: 'Errore 404',
    title: 'Pagina non trovata',
    body: 'Questa pagina non esiste, oppure il link non è più valido. Ma non preoccuparti — ci sto lavorando.',
    cta: 'Torna alla home',
    hint: 'Controlla l’indirizzo, oppure usa il menu qui sopra.',
  },

  /* ── aspetto / la funzione legata all'ora del giorno ─────────────────── */
  theme: {
    label: 'Aspetto',
    /* Stile e chiaro/scuro sono due assi indipendenti. */
    styleAxisLabel: 'Stile visivo',
    modeAxisLabel: 'Chiaro o scuro',
    styleAuto: 'Segui l’orologio',
    /* Said on the trigger itself, so a pinned style is visible without opening
       the panel. A pinned style silently overrules the schedule, and when that
       state is invisible the schedule gets reported as broken. */
    triggerAuto: 'Aspetto — segue l’orologio',
    triggerPinned: 'Aspetto — bloccato, cambio automatico in pausa',
    /* The switch notice's button: a momentary request, so the pin it writes
       lapses at the next boundary. The panel's button stays permanent. */
    keepForNow: 'Tieni per ora',
    /* The panel chip for that kind of pin: it says when it ends rather than
       implying it lasts. The placeholder is 'HH:MM'. */
    pinnedUntil: 'Mantenuto fino alle {time}',
    styleAutoHint: 'Cambia da solo nell’arco della giornata',
    modeFollowsStyle: 'Come da progetto',
    modeFollowsStyleHint: 'La luminosità prevista da ogni stile',
    light: 'Chiaro',
    dark: 'Scuro',
    currentStyle: 'Stile: {name}',
    currentMode: 'Modalità: {mode}',
    followsClock: 'Segue l’orologio',
    pinned: 'Bloccato',
    pin: 'Tieni questo aspetto',
    pinHint: 'Ferma il cambio automatico',
    reset: 'Torna all’automatico',
    nextChange: 'Passa a {style} alle {time}',
    nextChangeUnknown: 'Ora del cambio sconosciuta',
    scheduleLabel: 'Programma della giornata',
    style: {
      a: {
        name: 'Editoriale',
        blurb: 'Titoli con grazie, filetti sottili, sobrio e formale.',
        rationale: 'Mattina — richieste professionali e formali.',
      },
      b: {
        name: 'Terminale',
        blurb: 'Metadati a spaziatura fissa, angoli netti, fatto per le ore piccole.',
        rationale: 'Sera e notte — pubblico creativo e più giovane.',
      },
      c: {
        name: 'Rivista',
        blurb: 'Carta calda, testo con grazie, guidato dalle immagini e senza fretta.',
        rationale: 'Pomeriggio — un pubblico più personale, più vicino ai temi del vivere quotidiano.',
      },
    },
    explainer: {
      title: 'Questo sito cambia con il passare delle ore',
      body: 'Al momento sono le {time}, quindi stai vedendo lo stile {style}. Più tardi cambierà da solo. Non c’è nulla di rotto — è fatto apposta.',
      schedule: 'La mattina è Editoriale, il pomeriggio è Rivista, e dalla sera fino a notte è Terminale.',
      keepThis: 'Tieni questo stile',
      gotIt: 'Ho capito',
      settings: 'Impostazioni dell’aspetto',
    },
  },
};
