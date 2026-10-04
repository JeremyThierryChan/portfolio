/**
 * awards.js — competitions, exams and certificates.
 *
 * WHY THIS COLLECTION EXISTS: it was missing entirely. The content layer had projects,
 * a timeline, skills and testimonials, but nowhere to put a verifiable result — so a
 * page that is supposed to prove competence had no way to show the one class of evidence
 * that is checkable by a third party. These came out of Jeremy's CVs.
 *
 * `result` is what makes an entry evidence rather than a claim: "entered the Shandong
 * translation competition" says nothing, "provincial second prize" says something. Where
 * the CV lists an award without stating an outcome, `result` is `null` and carries a
 * TODO — those are listed at the bottom of this file so they are easy to chase.
 *
 * `kind` groups the list for display:
 *   'exam'        a standardised test or qualification, with a score or grade
 *   'competition' a contest, with a placing
 *   'certificate' a completed training course
 *   'sport'       an athletic achievement
 */

export const awards = [
  {
    id: 'etic-advanced-2023',
    year: '2023',
    kind: 'exam',
    audiences: ['events', 'trade', 'institutions'],
    i18n: {
      en: {
        title: 'ETIC International English Test — Advanced',
        issuer: 'International Talent English Test',
        result: 'Pass',
      },
      zh: {
        title: 'ETIC 国际人才英语考试 — 高级',
        issuer: '国际人才英语考试',
        result: '合格',
      },
    },
  },
  {
    id: 'cidi-words-2023',
    year: '2023',
    kind: 'competition',
    audiences: ['events', 'trade', 'institutions'],
    i18n: {
      en: {
        title: 'Cidi Words Cup — preliminary round',
        issuer: 'National College English Competition',
        // TODO(verify): the CV records "advanced from the preliminary round" but not what
        // happened next. Ask whether he progressed, and to which stage.
        result: 'Advanced from the preliminary round',
      },
      zh: {
        title: '「外教社·词达人杯」全国大学生英语词汇能力大赛 — 初赛',
        issuer: '全国性大学生英语竞赛',
        result: '初赛晋级',
      },
    },
  },
  {
    id: 'cet-6-2022',
    year: '2022',
    kind: 'exam',
    audiences: ['events', 'trade', 'institutions'],
    i18n: {
      en: {
        title: 'CET-6 — College English Test, Band 6',
        issuer: 'National College English Test',
        result: '583',
      },
      zh: {
        title: '大学英语六级（CET-6）',
        issuer: '全国大学英语考试',
        result: '583',
      },
    },
  },
  {
    id: 'lscat-interpreting-2022',
    year: '2022',
    kind: 'competition',
    audiences: ['events', 'trade', 'institutions'],
    i18n: {
      en: {
        title: 'LSCAT National English Interpreting Competition, 10th edition',
        issuer: 'LSCAT',
        // TODO(verify): result not stated on the CV.
        result: null,
      },
      zh: {
        title: 'LSCAT（全国口译大赛）第十届英语口译比赛',
        issuer: 'LSCAT（全国口译大赛）',
        result: null,
      },
    },
  },
  {
    id: 'shandong-translation-2022-en-zh',
    year: '2022',
    kind: 'competition',
    audiences: ['events', 'trade', 'institutions'],
    i18n: {
      en: {
        title: 'Shandong Provincial Translation Competition, 6th edition — Chinese to English',
        issuer: 'Shandong Province',
        // TODO(verify): result not stated on the CV.
        result: null,
      },
      zh: {
        title: '山东省翻译比赛第六届 — 中译英',
        issuer: '山东省',
        result: null,
      },
    },
  },
  {
    id: 'shandong-translation-2022-zh-en',
    year: '2022',
    kind: 'competition',
    audiences: ['events', 'trade', 'institutions'],
    i18n: {
      en: {
        title: 'Shandong Provincial Translation Competition, 6th edition — English to Chinese',
        issuer: 'Shandong Province',
        // TODO(verify): result not stated on the CV.
        result: null,
      },
      zh: {
        title: '山东省翻译比赛第六届 — 英译中',
        issuer: '山东省',
        result: null,
      },
    },
  },
  {
    id: 'cet-4-2021',
    year: '2021',
    kind: 'exam',
    audiences: ['events', 'trade', 'institutions'],
    i18n: {
      en: {
        title: 'CET-4 — College English Test, Band 4',
        issuer: 'National College English Test',
        result: '599',
      },
      zh: {
        title: '大学英语四级（CET-4）',
        issuer: '全国大学英语考试',
        result: '599',
      },
    },
  },
  {
    id: 'cidi-words-shandong-2021',
    year: '2021',
    kind: 'competition',
    audiences: ['events', 'trade', 'institutions'],
    i18n: {
      en: {
        title: 'Cidi Words Cup — National College English Competition, Shandong division',
        issuer: 'Shandong Province',
        result: 'Third prize, undergraduate group',
      },
      zh: {
        title: '「外教社·词达人杯」全国大学生英语词汇能力大赛 — 山东赛区',
        issuer: '山东省',
        result: '本科组三等奖',
      },
    },
  },
  {
    id: 'etic-intermediate-2021',
    year: '2021',
    kind: 'exam',
    audiences: ['events', 'trade', 'institutions'],
    i18n: {
      en: {
        title: 'ETIC International English Test — Intermediate',
        issuer: 'International Talent English Test',
        result: 'Pass with Merit',
      },
      zh: {
        title: 'ETIC 国际人才英语考试 — 中级',
        issuer: '国际人才英语考试',
        result: '良好',
      },
    },
  },
  {
    id: 'etic-basic-2021',
    year: '2021',
    kind: 'exam',
    audiences: ['events', 'trade', 'institutions'],
    i18n: {
      en: {
        title: 'ETIC International English Test — Basic',
        issuer: 'International Talent English Test',
        result: 'Pass with Merit',
      },
      zh: {
        title: 'ETIC 国际人才英语考试 — 初级',
        issuer: '国际人才英语考试',
        result: '良好',
      },
    },
  },
  {
    id: 'sdust-vocabulary-2020',
    year: '2020',
    kind: 'competition',
    audiences: ['institutions'],
    i18n: {
      en: {
        title: 'Shandong University of Science and Technology vocabulary competition',
        issuer: 'Shandong University of Science and Technology',
        result: 'First place',
      },
      zh: {
        title: '山东科技大学词汇竞赛',
        issuer: '山东科技大学',
        result: '第一名',
      },
    },
  },
  {
    id: 'sia-interpreting-2020',
    year: '2020',
    kind: 'exam',
    audiences: ['events', 'trade', 'institutions'],
    i18n: {
      en: {
        title: 'SIA Shanghai Advanced Interpreting Exam',
        issuer: 'Shanghai Interpretation Accreditation',
        // TODO(verify): the CV lists the exam but not the outcome.
        result: null,
      },
      zh: {
        title: 'SIA 上海高级口译考试',
        issuer: '上海口译资格认证',
        result: null,
      },
    },
  },
  {
    id: 'aha-first-aid-2019',
    year: '2019',
    kind: 'certificate',
    audiences: ['institutions'],
    i18n: {
      en: {
        title: 'American Heart Association HeartSaver first aid',
        issuer: 'Shanghai Yuean Health Promotion Centre',
        result: 'Certified',
      },
      zh: {
        title: '美国心脏协会 HeartSaver 急救培训',
        issuer: '上海悦安健康促进中心',
        result: '已获认证',
      },
    },
  },
  {
    id: 'icct-2018',
    year: '2018',
    kind: 'competition',
    audiences: ['events', 'trade', 'institutions'],
    i18n: {
      en: {
        title: 'ICCT Cross-Cultural Communication Competition',
        issuer: 'ICCT',
        result: 'Provincial second prize',
      },
      zh: {
        title: 'ICCT 跨文化交际竞赛',
        issuer: 'ICCT',
        result: '省级二等奖',
      },
    },
  },
  {
    /* Owner-confirmed (2026-10): won THREE times. So "three" was never the error — the
       span beside it was, since 2014–2017 is four calendar years. Both this entry and the
       timeline one are anchored to 2017, so the three years are 2015–2017; the id would
       otherwise assert the same wrong span. */
    id: 'wenzhou-junior-cycling-2015-2017',
    year: '2017',
    kind: 'sport',
    audiences: [],
    i18n: {
      en: {
        title: 'Wenzhou junior road cycling championship',
        issuer: 'Wenzhou',
        result: 'Champion, three consecutive years (2015–2017)',
      },
      zh: {
        title: '温州市青少年公路自行车锦标赛',
        issuer: '温州市',
        result: '冠军，连续三年（2015–2017）',
      },
    },
  },
];

/*
 * ── Outstanding results to collect ───────────────────────────────────────────────
 *
 * Four entries above have `result: null` because the CVs list the award without stating an
 * outcome, and an award with no result reads as participation rather than achievement. They
 * are kept in the data (so nothing is lost) but render without a result line.
 *
 *   sia-interpreting-2020              SIA Shanghai Advanced Interpreting Exam — passed?
 *   shandong-translation-2022-en-zh    Shandong translation competition — which prize?
 *   shandong-translation-2022-zh-en    Shandong translation competition — which prize?
 *   lscat-interpreting-2022            LSCAT interpreting competition — which placing?
 *
 * Also worth confirming: whether the 2022 Shandong competition entries are two categories
 * of one event or two separate events, and how far the 2023 Cidi Words Cup run went.
 */
