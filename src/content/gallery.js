/**
 * Gallery content — 14 entries.
 *
 * Structure (top level): id, category, year, image, imageStatus.
 *   - `category` keeps the old lowercase enum strings unchanged.
 *   - `year` stays the original display string (ranges like '2020–2024' keep
 *     their en dash — it is an i18n-free label, not an ISO date).
 *   - `image` is `null` on all 14 entries: the gallery no longer fetches from a
 *     third-party image host, and the page draws its own placeholder instead.
 *     `imageStatus` stays 'placeholder' per entry so the one flag flips to 'real'
 *     when a real photograph arrives — it tracks the entry's state, not the URL.
 * Copy: `i18n.en.title`, `i18n.en.description`, `i18n.en.location`.
 *   - `location` moved into i18n because place names are localised
 *     (e.g. 'Qingdao, China' → 「中国青岛」) even though the English string is
 *     the same words as before.
 *
 * Migrated verbatim from src/pages/gallery/galleryData.js. Order and ids preserved.
 */

export const gallery = [
  // ── Events & Translation ─────────────────────────────────────
  {
    id: 1,
    category: 'events',
    year: '2024',
    image: null,
    imageStatus: 'placeholder',
    i18n: {
      en: {
        title: 'Mercedes-AMG & G-Class Test Drive',
        description: 'English interpreter and VIP guest at the 2024 Mercedes-AMG full-range test drive event.',
        location: 'Qingdao, China',
      },
      zh: {
        title: '梅赛德斯-AMG 与 G 级越野车试驾',
        description: '在 2024 年梅赛德斯-AMG 全系车型试驾活动中担任英语口译，并作为 VIP 嘉宾出席。',
        location: '中国青岛',
      },
    },
  },
  {
    id: 2,
    category: 'events',
    year: '2024',
    image: null,
    imageStatus: 'placeholder',
    i18n: {
      en: {
        title: 'Lamborghini Urus SE Launch — Dare To Live More',
        description: 'English interpreter and special guest at the Lamborghini Urus SE new car launch.',
        location: 'Qingdao, China',
      },
      zh: {
        title: '兰博基尼 Urus SE 上市发布会 — Dare To Live More',
        description: '在兰博基尼 Urus SE 新车上市发布会上担任英语口译，并作为特邀嘉宾出席。',
        location: '中国青岛',
      },
    },
  },
  {
    id: 3,
    category: 'events',
    year: '2024',
    image: null,
    imageStatus: 'placeholder',
    i18n: {
      en: {
        title: 'A Ferrari Day — Certified Pre-Owned Experience',
        description: 'English interpreter and VIP guest at the Ferrari certified pre-owned experience day.',
        location: 'Qingdao, China',
      },
      zh: {
        title: '法拉利活动日 — 官方认证二手车体验',
        description: '在法拉利官方认证二手车体验日活动中担任英语口译，并作为 VIP 嘉宾出席。',
        location: '中国青岛',
      },
    },
  },
  {
    id: 4,
    category: 'events',
    year: '2024',
    image: null,
    imageStatus: 'placeholder',
    i18n: {
      en: {
        title: 'Porsche New Panamera Launch',
        description: 'German interpreter at the all-new Porsche Panamera launch event.',
        location: 'Qingdao, China',
      },
      zh: {
        title: '保时捷全新 Panamera 上市发布会',
        description: '在全新保时捷 Panamera 上市发布会上担任德语口译。',
        location: '中国青岛',
      },
    },
  },
  {
    id: 5,
    category: 'events',
    year: '2024',
    image: null,
    imageStatus: 'placeholder',
    i18n: {
      en: {
        title: 'Taishan Cigars × Qingdao International Whisky Festival',
        description: 'English interpreter and special invited guest at the Taishan Cigars Whisky Festival.',
        location: 'Qingdao, China',
      },
      zh: {
        title: '泰山雪茄 × 青岛国际威士忌节',
        description: '在泰山雪茄威士忌节活动中担任英语口译，并作为特邀嘉宾出席。',
        location: '中国青岛',
      },
    },
  },
  {
    id: 6,
    category: 'events',
    year: '2024',
    image: null,
    imageStatus: 'placeholder',
    i18n: {
      en: {
        title: 'Great Wall Cigars Cameroon Formula Tasting Tour',
        description: 'French interpreter and invited guest at the Great Wall Cigars Cameroon Formula tasting event.',
        location: 'Qingdao, China',
      },
      zh: {
        title: '长城雪茄喀麦隆配方品鉴活动',
        description: '在长城雪茄喀麦隆配方品鉴活动中担任法语口译，并作为受邀嘉宾出席。',
        location: '中国青岛',
      },
    },
  },
  {
    id: 7,
    category: 'events',
    year: '2025',
    image: null,
    imageStatus: 'placeholder',
    i18n: {
      en: {
        title: 'Qingdao Beer Festival — 风起麦岛',
        description: 'English translator and event planner for the 2025 Qingdao Beer Festival Flavour Trilogy.',
        location: 'Qingdao, China',
      },
      zh: {
        title: '青岛啤酒节 — 风起麦岛',
        description: '2025 年青岛啤酒节 Flavour Trilogy 活动的英语翻译与活动策划。',
        location: '中国青岛',
      },
    },
  },

  // ── Sports ────────────────────────────────────────────────────
  {
    id: 8,
    category: 'sports',
    year: '2023',
    image: null,
    imageStatus: 'placeholder',
    i18n: {
      en: {
        title: 'IRONMAN China · Wenzhou — Chief Translator',
        description: 'Chief translator (EN/FR/ZH) at the 2023 IRONMAN China · Wenzhou Long-Distance Triathlon International Open.',
        location: 'Wenzhou, China',
      },
      zh: {
        title: 'IRONMAN 中国 · 温州 — 首席翻译',
        description: '在 2023 年 IRONMAN 中国 · 温州长距离铁人三项国际公开赛中担任首席翻译（英语／法语／中文）。',
        location: '中国温州',
      },
    },
  },

  // ── Volunteer ─────────────────────────────────────────────────
  {
    id: 9,
    category: 'volunteer',
    year: '2019',
    image: null,
    imageStatus: 'placeholder',
    i18n: {
      en: {
        title: 'IVHQ Teaching Volunteer — Bali',
        description: 'Teaching English to local children at a primary school in Ubud as part of the IVHQ & Green Lion programme.',
        location: 'Ubud, Bali, Indonesia',
      },
      zh: {
        title: 'IVHQ 教学志愿者 — 巴厘岛',
        description: '参与 IVHQ 与 Green Lion 项目，在乌布一所小学为当地儿童教授英语。',
        location: '印度尼西亚巴厘岛乌布',
      },
    },
  },
  {
    id: 10,
    category: 'volunteer',
    year: '2018',
    image: null,
    imageStatus: 'placeholder',
    i18n: {
      en: {
        title: 'German Exchange Students — Pingyang High School',
        description: 'General planner and chief translator for the hosting of exchange students from Martin-Luther-Gymnasium, Eisenach.',
        location: 'Pingyang, Wenzhou, China',
      },
      zh: {
        title: '德国交换生接待 — Pingyang High School（平阳）',
        description: '负责接待来自艾森纳赫 Martin-Luther-Gymnasium 交换生的统筹工作，并担任首席翻译。',
        location: '中国温州平阳',
      },
    },
  },

  // ── Campus ────────────────────────────────────────────────────
  {
    id: 11,
    category: 'campus',
    year: '2020–2024',
    image: null,
    imageStatus: 'placeholder',
    i18n: {
      en: {
        title: 'Shandong University of Science and Technology',
        description: 'Four years of study in Surveying Engineering, Qingdao campus.',
        location: 'Qingdao, China',
      },
      zh: {
        title: '山东科技大学',
        description: '在青岛校区学习测绘工程专业四年。',
        location: '中国青岛',
      },
    },
  },
  {
    id: 12,
    category: 'campus',
    year: '2023',
    image: null,
    imageStatus: 'placeholder',
    i18n: {
      en: {
        title: 'Transplendid Society — Multilingual Club',
        description: 'Founded the Transplendid multilingual interest society at SDUST.',
        location: 'Qingdao, China',
      },
      zh: {
        title: 'Transplendid Society — 多语言社团',
        description: '在山东科技大学创办 Transplendid 多语言兴趣社团。',
        location: '中国青岛',
      },
    },
  },

  // ── Travel ────────────────────────────────────────────────────
  {
    id: 13,
    category: 'travel',
    year: '2019',
    image: null,
    imageStatus: 'placeholder',
    i18n: {
      en: {
        title: 'Bali, Indonesia',
        description: 'Volunteer trip to Bali — Tampaksiring and Ubud.',
        location: 'Bali, Indonesia',
      },
      zh: {
        title: '印度尼西亚巴厘岛',
        description: '前往巴厘岛坦帕西林和乌布的志愿服务之行。',
        location: '印度尼西亚巴厘岛',
      },
    },
  },
  {
    id: 14,
    category: 'travel',
    year: '2020',
    image: null,
    imageStatus: 'placeholder',
    i18n: {
      en: {
        title: 'Uganda — JA Poultry Farm',
        description: 'Business visit to JA Poultry Farm, Wakiso, Uganda.',
        location: 'Wakiso, Uganda',
      },
      zh: {
        title: '乌干达 — JA Poultry Farm',
        description: '在乌干达瓦基索的 JA Poultry Farm 进行商务考察。',
        location: '乌干达瓦基索',
      },
    },
  },
];
