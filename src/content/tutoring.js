/**
 * tutoring.js — Jeremy's hourly tutoring rate card.
 *
 * SOURCE: his own rate sheet, supplied directly (the numbers are his, transcribed
 * verbatim). Nothing here is inferred; the one thing dropped is noted under "Judgement
 * calls" below.
 *
 * HOW THE PRICES WORK: this is not thirty independent prices. It is ONE price per course
 * plus a four-entry coefficient row:
 *
 *     one to one ×1 · one to two ×0.7 · one to three ×0.6 · small group ×0.5
 *
 * Every cell in the sheet is the one-to-one price times the coefficient, rounded to the
 * nearest ten, and that was checked across the whole table before transcribing it. So
 * `coefficient` is the pricing model rather than a presentational nicety, and the four
 * labels are kept beside the prices so a reader can do the multiplication themselves.
 *
 * `prices: null` means quoted on request — the sheet says 议价 for those three rows.
 * A group size simply missing from the `prices` object means the course is not offered at
 * that size (after-school support is one-to-one only), which is a different thing from
 * 议价 and renders differently.
 *
 * ────────────────────────────────────────────────────────────────────────────────
 * A NOTE ON THE DECISION TO PUBLISH THIS AT ALL.
 *
 * A rate card in ONE service anchors all of them: a visitor who reads "programming, 300
 * an hour" on the same site where a website is quoted per project and interpreting is
 * quoted per day will do the arithmetic. That risk was raised and Jeremy chose to publish
 * the full table anyway. It is his business and his call; it is recorded here so that
 * nobody later mistakes the decision for an oversight. The rest of the site still
 * publishes no figure at all — see QuoteProcess.vue.
 *
 * JUDGEMENT CALLS, both flagged to him:
 *   1. Two rows in the sheet read 小升初 一对一 and 初升高 一对一 while carrying a price in
 *      all four group columns, so the 一对一 suffix contradicts its own row. The suffix is
 *      dropped here; the row is labelled by the course alone.
 *   2. Sections are a reading aid, not his structure — the sheet separates rows with blank
 *      lines only. The order of the courses is his, exactly.
 * ────────────────────────────────────────────────────────────────────────────────
 */

/** The four group sizes, in his order, with the coefficient that scales the base price. */
export const tutoringGroups = [
  { id: 'one-to-one', order: 1, coefficient: 1, i18n: { en: { label: 'One to one' }, zh: { label: '一对一' } } },
  { id: 'one-to-two', order: 2, coefficient: 0.7, i18n: { en: { label: 'One to two' }, zh: { label: '一对二' } } },
  { id: 'one-to-three', order: 3, coefficient: 0.6, i18n: { en: { label: 'One to three' }, zh: { label: '一对三' } } },
  { id: 'small-group', order: 4, coefficient: 0.5, i18n: { en: { label: 'Small group' }, zh: { label: '一对多' } } },
];

/** Reading groups only. They carry no prices of their own. */
export const tutoringSections = [
  { id: 'junior', order: 1, i18n: { en: { label: 'Junior high school' }, zh: { label: '初中' } } },
  { id: 'senior', order: 2, i18n: { en: { label: 'Senior high school' }, zh: { label: '高中' } } },
  { id: 'after-school', order: 3, i18n: { en: { label: 'After school' }, zh: { label: '课后' } } },
  { id: 'ielts', order: 4, i18n: { en: { label: 'IELTS' }, zh: { label: '雅思' } } },
  { id: 'french', order: 5, i18n: { en: { label: 'French' }, zh: { label: '法语' } } },
  { id: 'german', order: 6, i18n: { en: { label: 'German' }, zh: { label: '德语' } } },
  { id: 'programming', order: 7, i18n: { en: { label: 'Programming' }, zh: { label: '编程' } } },
  { id: 'modelling-ai', order: 8, i18n: { en: { label: 'Modelling & AI' }, zh: { label: '建模与 AI' } } },
  { id: 'pe', order: 9, i18n: { en: { label: 'PE' }, zh: { label: '体育' } } },
];

/* Courses, in the sheet's own order. Prices are per hour, in CNY, for the stated group. */
export const tutoringCourses = [
  {
    id: 'primary-to-junior',
    section: 'junior',
    order: 1,
    i18n: {
      en: { name: 'Primary-to-junior-high transition' },
      zh: { name: '小升初' },
    },
    prices: { 'one-to-one': 200, 'one-to-two': 140, 'one-to-three': 120, 'small-group': 100 },
  },
  {
    id: 'junior-grade-7',
    section: 'junior',
    order: 2,
    i18n: { en: { name: 'In-class support — Grade 7' }, zh: { name: '课内提升 七年级' } },
    prices: { 'one-to-one': 220, 'one-to-two': 150, 'one-to-three': 130, 'small-group': 110 },
  },
  {
    id: 'junior-grade-8',
    section: 'junior',
    order: 3,
    i18n: { en: { name: 'In-class support — Grade 8' }, zh: { name: '课内提升 八年级' } },
    prices: { 'one-to-one': 260, 'one-to-two': 180, 'one-to-three': 160, 'small-group': 130 },
  },
  {
    id: 'junior-grade-9',
    section: 'junior',
    order: 4,
    i18n: { en: { name: 'In-class support — Grade 9' }, zh: { name: '课内提升 九年级' } },
    prices: { 'one-to-one': 300, 'one-to-two': 210, 'one-to-three': 180, 'small-group': 150 },
  },
  {
    id: 'junior-to-senior',
    section: 'junior',
    order: 5,
    i18n: { en: { name: 'Junior-to-senior-high transition' }, zh: { name: '初升高' } },
    prices: { 'one-to-one': 350, 'one-to-two': 250, 'one-to-three': 210, 'small-group': 180 },
  },
  {
    id: 'pingyang-early-admission',
    section: 'junior',
    order: 6,
    i18n: {
      en: { name: 'Pingyang middle school early-admission exam' },
      zh: { name: '平中提前招' },
    },
    prices: { 'one-to-one': 400, 'one-to-two': 280, 'one-to-three': 240, 'small-group': 200 },
  },
  {
    id: 'junior-english-competition',
    section: 'junior',
    order: 7,
    i18n: { en: { name: 'Junior-high English competition' }, zh: { name: '初中英语竞赛' } },
    prices: { 'one-to-one': 500, 'one-to-two': 350, 'one-to-three': 300, 'small-group': 250 },
  },

  {
    id: 'senior-grade-1',
    section: 'senior',
    order: 8,
    i18n: { en: { name: 'In-class support — Senior 1' }, zh: { name: '课内提升 高一' } },
    prices: { 'one-to-one': 300, 'one-to-two': 210, 'one-to-three': 180, 'small-group': 150 },
  },
  {
    id: 'senior-grade-2',
    section: 'senior',
    order: 9,
    i18n: { en: { name: 'In-class support — Senior 2' }, zh: { name: '课内提升 高二' } },
    prices: { 'one-to-one': 350, 'one-to-two': 250, 'one-to-three': 210, 'small-group': 180 },
  },
  {
    id: 'senior-grade-3',
    section: 'senior',
    order: 10,
    i18n: { en: { name: 'In-class support — Senior 3' }, zh: { name: '课内提升 高三' } },
    prices: { 'one-to-one': 400, 'one-to-two': 280, 'one-to-three': 240, 'small-group': 200 },
  },
  {
    id: 'gaokao',
    section: 'senior',
    order: 11,
    i18n: { en: { name: 'Gaokao preparation' }, zh: { name: '课内提升 高考' } },
    prices: { 'one-to-one': 500, 'one-to-two': 350, 'one-to-three': 300, 'small-group': 250 },
  },
  {
    id: 'senior-english-competition',
    section: 'senior',
    order: 12,
    i18n: { en: { name: 'Senior-high English competition' }, zh: { name: '高中英语竞赛' } },
    prices: { 'one-to-one': 600, 'one-to-two': 420, 'one-to-three': 360, 'small-group': 300 },
  },

  {
    id: 'after-school-support',
    section: 'after-school',
    order: 13,
    i18n: { en: { name: 'After-school homework support' }, zh: { name: '课后答疑托管' } },
    /* One-to-one only: the sheet gives a single figure for this row. */
    prices: { 'one-to-one': 100 },
  },

  {
    id: 'ielts-listening',
    section: 'ielts',
    order: 14,
    i18n: { en: { name: 'IELTS — Listening' }, zh: { name: '雅思（听力）' } },
    prices: { 'one-to-one': 700, 'one-to-two': 490, 'one-to-three': 420, 'small-group': 350 },
  },
  {
    id: 'ielts-reading',
    section: 'ielts',
    order: 15,
    i18n: { en: { name: 'IELTS — Reading' }, zh: { name: '雅思（阅读）' } },
    prices: { 'one-to-one': 700, 'one-to-two': 490, 'one-to-three': 420, 'small-group': 350 },
  },
  {
    id: 'ielts-writing',
    section: 'ielts',
    order: 16,
    i18n: { en: { name: 'IELTS — Writing' }, zh: { name: '雅思（写作）' } },
    prices: { 'one-to-one': 700, 'one-to-two': 490, 'one-to-three': 420, 'small-group': 350 },
  },
  {
    id: 'ielts-speaking',
    section: 'ielts',
    order: 17,
    i18n: { en: { name: 'IELTS — Speaking' }, zh: { name: '雅思（口语）' } },
    prices: { 'one-to-one': 800, 'one-to-two': 560, 'one-to-three': 480, 'small-group': 400 },
  },

  {
    id: 'french-a1',
    section: 'french',
    order: 18,
    i18n: { en: { name: 'French A1' }, zh: { name: '法语 A1' } },
    prices: { 'one-to-one': 300, 'one-to-two': 210, 'one-to-three': 180, 'small-group': 150 },
  },
  {
    id: 'french-a2',
    section: 'french',
    order: 19,
    i18n: { en: { name: 'French A2' }, zh: { name: '法语 A2' } },
    prices: { 'one-to-one': 400, 'one-to-two': 280, 'one-to-three': 240, 'small-group': 200 },
  },

  {
    id: 'german-a1',
    section: 'german',
    order: 20,
    i18n: { en: { name: 'German A1' }, zh: { name: '德语 A1' } },
    prices: { 'one-to-one': 300, 'one-to-two': 210, 'one-to-three': 180, 'small-group': 150 },
  },
  {
    id: 'german-a2',
    section: 'german',
    order: 21,
    i18n: { en: { name: 'German A2' }, zh: { name: '德语 A2' } },
    prices: { 'one-to-one': 400, 'one-to-two': 280, 'one-to-three': 240, 'small-group': 200 },
  },

  {
    id: 'python',
    section: 'programming',
    order: 22,
    i18n: { en: { name: 'Python programming' }, zh: { name: 'Python 程序设计' } },
    prices: { 'one-to-one': 300, 'one-to-two': 210, 'one-to-three': 180, 'small-group': 150 },
  },
  {
    id: 'cpp',
    section: 'programming',
    order: 23,
    i18n: { en: { name: 'C++ programming' }, zh: { name: 'C++ 程序设计' } },
    prices: { 'one-to-one': 400, 'one-to-two': 280, 'one-to-three': 240, 'small-group': 200 },
  },
  {
    id: 'matlab',
    section: 'programming',
    order: 24,
    i18n: { en: { name: 'MATLAB programming' }, zh: { name: 'Matlab 程序设计' } },
    prices: { 'one-to-one': 500, 'one-to-two': 350, 'one-to-three': 300, 'small-group': 250 },
  },

  {
    id: 'llm-agent',
    section: 'modelling-ai',
    order: 25,
    i18n: { en: { name: 'LLMs and agents' }, zh: { name: 'LLM + Agent 相关' } },
    // 议价 — quoted on request, because the scope varies too much for an hour rate to mean much.
    prices: null,
  },
  {
    id: 'shapr3d',
    section: 'modelling-ai',
    order: 26,
    i18n: { en: { name: 'Shapr3D fundamentals' }, zh: { name: 'Shapr3D 基础建模' } },
    prices: null,
  },

  {
    id: 'pe-entrance',
    section: 'pe',
    order: 27,
    i18n: {
      en: { name: 'PE for the high-school entrance exam' },
      zh: { name: '体育中考' },
    },
    prices: null,
  },
];
