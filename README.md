# Portfolio — Jeremy Thierry Chan

六语种、按时间换主题的静态作品集。语言 × 贸易 × 技术，目标是接单：口译、跨境贸易，以及让这两件事运转起来的网站和内部系统。

Vue 3（`<script setup>`）· Vite 5 · vue-router 4 · vue-i18n 9。没有后端、没有运行时取数、没有追踪。构建成静态文件发到 GitHub Pages：<https://jeremythierrychan.github.io/portfolio/>

> **这份 README 是写给你自己看的**，不是给外部开发者看的——你有太多项目，需要一个地方能在几个月后快速想起"这个项目现在什么状态、当初为什么这么定、哪些事等我拍板"。
>
> 代码里的注释仍然是英文（全仓库统一），只有这份文档是中文。
>
> 上一版 README 是项目从 Vue CLI 迁到 Vite 时**从没动过的脚手架模板**，写着 `npm run lint` 和一个早就不存在的 `vue.config.js`。它错了很久没人发现。所以下面凡是涉及命令和数字的，都先确认过 `package.json` 和实际数据。

---

## 状态速览

**Open questions: 16** ← 这个数字由 `verify-content` 校验，不会腐烂；详见下方「等我说的事」。

| 项目 | 状态 |
| --- | --- |
| 路由 | 15 条，全部可用（含 404、5 个简历变体、证言详情页） |
| 内容 | 25 项目 · 50 时间线 · 21 技能 · 15 奖项 · 5 证言 · 3 文章 · 9 服务 · 7 友情链接 |
| 相册 | 14 条**全部是占位**（`image: null`，页面自绘虚线框）——真实照片还没放 |
| 文章 | 3 篇全是 `draft: true`，页面上打了草稿标记 |
| 界面文案 | 6 语种全译（en/zh/de/fr/es/it） |
| 正文内容 | **只有 en + zh**；de/fr/es/it 访问者看到英文正文（按字段回退），这是既定降级不是 bug |
| 校验 | 8 层全绿（68 测试 / 123 内容 / 11 i18n / 138 对比度对 / 19 级联 / 6 布局 / 简历 JSON / 93 SSR） |
| 价目 | 只有 `/tutoring` 公布完整价目表（你明确要求的例外）；其余 9 项服务只写"怎么计价"，不写数字 |
| 待你决定 | **16 处 `TODO(verify)`** —— `npm run questions` |

---

## 当初为什么这么定

这一节是防止未来的你把有意为之的事当成 bug 改掉。

**主题按时间自动切换**：07:00–12:00 → 编辑部风格（A），12:00–18:00 → 杂志风格（C），18:00–07:00 → 终端风格（B）。`data-style` 和 `data-mode`（明/暗）是**两个完全独立的轴**，共 6 种组合。访问者可以覆盖任一轴，永久或到下一个时间窗为止（`theme.styleUntil` 存 `<风格>@<时间戳>`）。风格在首屏绘制**之前**由 `index.html` 里的内联引导确定，所以不会闪一下错的主题。

**只有一个断点：768px**。全站只允许 `max-width: 767.98px` 和 `min-width: 768px` 两种写法，`verify:layout` 会强制这一点。原因：媒体查询读不了 CSS 变量，所以边界只能写字面量；多一个断点就多一处会互相矛盾的地方。栅格完全不带断点，一律用 `repeat(auto-fit, minmax(min(Xrem, 100%), 1fr))`——**`min(X, 100%)` 是强制的**，裸下限会撑破 320px 的手机。

**`--measure` 每个风格不同**（1160 / 1120 / 1080），所以切换风格时内容列会在 40–80px 之间移动、文字会重排。**这是我提过但你没拍板的一件事**，现在仍然是这样。要统一的话，把三个值改成同一个即可，但栅格下限必须保持不变（否则切换风格时列数会变）。

**相册的 14 张图是空的，不是忘了**：原来 14 条全部指向 `picsum.photos`，等于每个访问者打开相册都要从第三方拉 14 张别人的照片。现在 `image: null`，页面自绘占位框；`imageStatus` 标记保留着，放真图时翻转即可。**这也是为什么占位角标只在"有真图但仍是存根"时才显示**——`image: null` 时画的框本身已经写着 Placeholder，再加角标就是同一个词印两遍。

**只有 `/tutoring` 有价目表**。`/contact` 那段说"这里没有价目表"是刻意的，且它的 "这里" 是限定词——教学是按小时的可比单位、没有待摸清的范围，所以列表格是减少摩擦；贸易和活动报价依赖范围，挂数字只会变成谈判天花板。

**正文字段全部在 `i18n` 里**，唯一例外是 `name`：专有名词（技术名、品牌名）留在顶层不翻译，某个语种真的会翻译它时用 `i18n.<locale>.name` 覆盖。除此之外顶层不允许出现任何用户可见文字。

---

## 改这个项目时的地雷

**1. `pick()` 只扁平化顶层。** 它不递归，只认 `stages` 特例。所以 `profile.positioning`、`profile.contact` 这类嵌套容器拿到手仍是 `{...结构, i18n}` 原始对象——读 `profile.positioning.summary` 得到的是 `undefined`，**不报错，只是空白**。嵌套容器一律走 `pick(容器, locale)`。

**2. `<script setup>` 里漏 `.value`。** `useContent()` 返回的是 ref；模板会自动解包，脚本不会。所以同一个表达式在模板里对、在脚本里是 `TypeError`。这一条曾经同时造成三个用户可见故障（复制邮箱永远显示失败、表单提交失效、社交列表整个空掉），而**8 层校验全都看不见**——页面照常渲染、每个字符串都对。现在有守卫了（`verify-content` 会扫），但改脚本时仍然要留意。

**3. 三个计价面必须一起改**：服务卡片的 `services[].billing`、`/services` 的 `services.pricingBody`、`/contact` 的 `quote.noNumbers`。已经矛盾过两次（月度顾问费 vs 按小时；"按成单佣金" vs 贸易的一口价）。现在 `verify-content` 断言卡片用的单位集合 == `noNumbers` 点名的集合，但跨语言的自然语言一致性仍然只能靠人读。

**4. 加/删证言要同步改 `home.trustLede`（6 个语种）**——那句话数了有几个人，而且它曾经把一位教过你的老师叫成"同事"，和它正下方那张卡片自己写的 `English Teacher` 直接打架。数字和事实都没法自动校验，只能靠记。

**5. 改部署路径要同时改三处**：`vite.config.js` 的 `base`、`src/App.vue` 的 `ORIGIN`、`public/sitemap.xml`。三处不一致会让 canonical 和 sitemap 互相竞争。

**6. 改完内容一定要跑 `npm run verify`**，不要只跑 `npm run build`。`public/resume*.json` 是从内容层生成的，只跑 `vite build` 会发出**旧的简历**。

**7. `scripts/withheld-names.mjs` 守着 20 个绝不能上线的名字**，它的文件头记了 3 条例外决定，加名字之前先读。

---

## 等我说的事

**Open questions: 16**

不要在这里手抄清单——会腐烂。运行：

```bash
npm run questions          # 按文件分组，带条目 id 和行号
npm run questions -- --count   # 只要数字
```

它直接读取内容层里的 `TODO(verify)` 标记，所以永远是最新的。`TODO(verify)` 的含义是：**这句话需要你确认后才能当作事实发布**，不是 bug，不会让校验变红。

回答的方式：改内容文件，把标记换成确认后的事实，或者在旁边留一条 `ANSWERED (日期): …`。改完记得同步 README 里那个数字——**忘了也没关系，`verify-content` 会拦下来**。

目前集中在三块：**4 项奖项的结果**（SIA、山东翻译大赛 ×2、LSCAT 只列了奖没写名次）、**7 项商务条款**（最低预约、定金、教学材料是否另计等）、以及**几个项目的进度数字**（TAROT 78、吉他工程、创作者平台）。

---

## 常用命令

```bash
npm ci          # 用这个，不要 npm install（CI 认的是 lockfile）
npm run dev     # 开发服务器
npm run build   # 先重新生成 public/resume*.json，再打包
npm run verify  # 8 层校验 + 生产构建。这是门禁
npm run questions   # 列出待你确认的问题
```

Node 20 以上（`package.json` 的 `engines` 有记录，CI 钉的是 20）。`npm run serve` 只是 `vite` 的别名，当初为了迁就 Vue CLI 的手感留的。

推送到 `main` 会自动部署。CI 跑的是 `npm run verify` 而不是 `build`——`verify` 最后一步就是构建，所以它既是门禁也是产物来源。

---

## 两份真正的契约

这两份是改代码前该读的，不是装饰：

- [`src/content/SCHEMA.md`](src/content/SCHEMA.md) —— 内容层的编写规则：每个字段的含义、双语政策、枚举词表、各集合的条数（校验器会断言这些）。
- [`src/styles/TOKENS.md`](src/styles/TOKENS.md) —— 设计令牌与断点契约。

改动 legacy 文案时要改 `scripts/verify-content.mjs` 里的 `INTENTIONAL_DEVIATIONS` 并写明理由，而不是把检查放宽。

---

## 一个诚实的边界

这个仓库**没有浏览器，也没有 jsdom**。所以"点了才会发生"的行为（焦点捕获、真实剪贴板、动画、真实计时）只有静态分析和 SSR 覆盖，不是在真实浏览器里看过的。凡是只有点一下才能观察到的结论，都应当说"未验证"，而不是含糊过去。
