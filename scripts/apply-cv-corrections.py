#!/usr/bin/env python3
"""
One-off content corrections from Jeremy's two CVs.

Written as a file rather than an inline `node -e` because the patterns involved contain
both quote styles and regex metacharacters, which the shell mangles.

What it fixes, and why:

 1. ETIC was filed under the WRENCH language. `ETIC 国际人才英语考试` is an ENGLISH
    qualification; the old data credited "ETIC Advanced: Pass" to French. The English
    entry now carries the real credential set from the CVs (ETIC Advanced 2023 /
    Intermediate / Basic, CET-6 583, CET-4 599, SIA, plus the Gaokao and university marks).

 2. High-school entry year: 2017 → 2016 ("提前招" / early admission). Middle-school
    graduation moves with it, since it precedes starting high school. Precision drops to
    year because only the year is known.

 3. A second email address, taken from the CVs. The Gmail stays primary; the QQ address is
    what Chinese clients will expect.
"""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
changed = []

# ── 1. skills.js ────────────────────────────────────────────────────────────────
skills_path = ROOT / 'src/content/skills.js'
sk = skills_path.read_text(encoding='utf-8')

OLD_EN = ("i18n: { en: { description: 'Native-level proficiency. IELTS 8.0 (expired). "
          "Gaokao 135/150. University English 91/100. Simultaneous and consecutive "
          "interpretation experience across high-profile events.' } },")
NEW_EN = ("i18n: { en: { description: 'Native-level proficiency. IELTS 8.0. Gaokao English "
          "135/150. University English 91/100 — full marks on every section except the "
          "essay. ETIC International English Test: Advanced Pass (2023); Intermediate and "
          "Basic both Pass with Merit. CET-6 583, CET-4 599. SIA Shanghai Advanced "
          "Interpreting Exam. Consecutive and simultaneous interpretation at IRONMAN "
          "China, a police witness statement, and brand launches.' } },")

OLD_FR = ("i18n: { en: { description: 'Self-taught. Conversational proficiency. Served as "
          "French interpreter at IRONMAN China Wenzhou (2023) and Great Wall Cigars "
          "Cameroon Formula tasting event (2024). ETIC Advanced: Pass.' } },")
NEW_FR = ("i18n: { en: { description: 'Self-taught, conversational proficiency. Served as "
          "French interpreter at IRONMAN China Wenzhou (2023) and at the Great Wall "
          "Cigars Cameroon Formula tasting tour (2024).' } },")

for label, old, new in (('English entry', OLD_EN, NEW_EN), ('French entry', OLD_FR, NEW_FR)):
    if old not in sk:
        sys.exit(f'FAIL: could not find the {label} in skills.js — aborting without writing')
    sk = sk.replace(old, new)
    changed.append(label)

skills_path.write_text(sk, encoding='utf-8')

# ── 2. timeline.js ──────────────────────────────────────────────────────────────
tl_path = ROOT / 'src/content/timeline.js'
tl = tl_path.read_text(encoding='utf-8')

for eid in ('entered-high-school-early', 'graduated-from-middle-school'):
    marker = f"id: '{eid}',"
    at = tl.index(marker)
    block_end = tl.index('\n  },', at)
    block = tl[at:block_end]
    if "date: '2017-06'" not in block:
        sys.exit(f'FAIL: {eid} does not carry the expected 2017-06 date — aborting')
    fixed = block.replace("date: '2017-06'", "date: '2016'").replace(
        "datePrecision: 'month'", "datePrecision: 'year'")
    tl = tl[:at] + fixed + tl[block_end:]
    changed.append(f'{eid} → 2016')

tl_path.write_text(tl, encoding='utf-8')

# ── 3. profile.js ───────────────────────────────────────────────────────────────
pr_path = ROOT / 'src/content/profile.js'
pr = pr_path.read_text(encoding='utf-8')

OLD_EMAIL = "    email: 'jeremy.thierry.chan@gmail.com',\n"
NEW_EMAIL = ("    email: 'jeremy.thierry.chan@gmail.com',\n"
             "    /* Chinese clients reach for QQ mail first; the Gmail stays primary for\n"
             "       international enquiries. Both are on the CVs. */\n"
             "    emailAlt: '741352970@qq.com',\n")

if 'emailAlt' not in pr:
    if OLD_EMAIL not in pr:
        sys.exit('FAIL: could not find the contact email line — aborting')
    pr = pr.replace(OLD_EMAIL, NEW_EMAIL, 1)
    changed.append('profile.contact.emailAlt')
    pr_path.write_text(pr, encoding='utf-8')

print('Applied:')
for c in changed:
    print('  ✓', c)
