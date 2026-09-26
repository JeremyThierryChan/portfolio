#!/usr/bin/env python3
"""
Skills: replace self-rated percentages with usage bands plus verifiable evidence.

Run once:  python3 scripts/apply-skills-evidence.py

WHY: `level: 97` is not a signal. A visitor cannot verify it, cannot act on it, and it
invites the reader to argue instead of to read. What Jeremy actually has is a stack of
hard, checkable credentials — IELTS 8.0, ETIC Advanced, CET-6 583, Gaokao English 135/150,
IRONMAN chief interpreter — and none of them were visible in the old model.

So `level` is dropped and replaced by two fields:

  `usage`     'professional' | 'working' | 'learning'
              A statement about HOW the skill is used, not how good he is at it. This is
              a fact (does client work depend on it?) rather than a boast, and it gives
              the page a grouping that reads honestly.

  `evidence`  string[]  — checkable facts. Every entry is either taken from Jeremy's CVs
              or verifiable inside this repository. Nothing here is estimated.

The prose `description` of every skill is preserved VERBATIM, so the frozen-baseline
content check keeps passing without needing new deviations: this is an addition plus the
removal of one field, not a rewrite of the copy.
"""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
SKILLS = ROOT / 'src/content/skills.js'

# usage band per skill id
USAGE = {
    1: 'professional',   # Vue.js
    2: 'professional',   # JavaScript
    3: 'professional',   # CSS / HTML
    4: 'working',        # Node.js
    5: 'professional',   # Python
    6: 'working',        # C
    7: 'working',        # C++
    8: 'working',        # Java
    9: 'working',        # Matlab
    10: 'professional',  # Office / LibreOffice
    11: 'working',       # Docker
    12: 'professional',  # Git / GitHub
    13: 'professional',  # NAS & Home Server
    14: 'working',       # AI integration
    15: 'professional',  # English
    16: 'professional',  # Mandarin
    17: 'working',       # French
    18: 'working',       # German
    19: 'learning',      # Spanish
    20: 'learning',      # Italian
    21: 'learning',      # Arabic
}

# Evidence. Every line is checkable — from the CVs, or inside this repository.
EVIDENCE = {
    1: [
        'Every site in this portfolio is built with it, including the six-language version you are reading',
        'Multilingual routing and a full design-token layer written by hand',
    ],
    2: [
        'Powers the front end of this site with no framework beyond Vue itself',
        'Used for build tooling, export scripts and small Node utilities',
    ],
    3: [
        'This site: three visual styles and two light levels from one token set, no CSS framework',
        'Grid, flexbox, container queries, and a reduced-motion path throughout',
    ],
    4: [
        'Build tooling and verification scripts for this site',
        'Backend services and APIs on earlier projects',
    ],
    5: [
        'Public teaching repository on GitHub (Python-Projects)',
        'Technical articles published on CSDN',
        'Arbitrage strategy research and backtesting',
        'Local AI model deployment and open-source tooling work',
    ],
    6: ['University coursework — surveying engineering programme'],
    7: ['University coursework — surveying engineering programme'],
    8: [
        'Minecraft server: plugin configuration, performance tuning and load balancing',
        'Server-side development coursework',
    ],
    9: ['Numerical computing, data analysis and algorithm coursework'],
    10: [
        'Bilingual trade documentation: quotations, specifications and export papers',
        'Used daily for client-facing documents in three languages',
    ],
    11: ['Container deployment for the Lacquora project (Vue, Node.js, Docker)'],
    12: [
        'Every project in this portfolio is public on GitHub',
        'Structured branching and commit history across team and solo work',
    ],
    13: [
        'OpenMediaVault and TrueNAS deployments, including an internal file server for a university research society',
        'Debian, Ubuntu and Manjaro, with KDE, GNOME, MATE and Cinnamon',
    ],
    14: [
        'Local model deployment with Ollama',
        'Secondary development and application of open-source AI tooling',
    ],
    15: [
        'IELTS 8.0',
        'ETIC International English Test — Advanced: Pass (2023); Intermediate and Basic both Pass with Merit',
        'CET-6 583 / CET-4 599',
        'Gaokao English 135/150 · University English 91/100',
        'Chief interpreter, IRONMAN China Wenzhou 2023',
        'SIA Shanghai Advanced Interpreting Exam',
    ],
    16: [
        'Native speaker',
        'Also speaks Wenzhou, Shanghai, Sichuan and Shandong dialects',
    ],
    17: [
        'French interpreter, IRONMAN China Wenzhou 2023',
        'French interpreter, Great Wall Cigars Cameroon Formula tasting tour 2024',
    ],
    18: [
        'German interpreter, Porsche new Panamera launch 2024',
        'Hosted German exchange students from Martin Luther Gymnasium, Eisenach 2018',
    ],
    19: ['Beginner — actively studying'],
    20: ['Beginner — actively studying'],
    21: ['Beginner — actively studying'],
}


def quote(s: str) -> str:
    """Single quotes normally, double quotes when the string contains an apostrophe."""
    if "'" in s:
        return '"' + s.replace('"', '\\"') + '"'
    return "'" + s + "'"


def render_evidence(lines) -> str:
    body = ''.join(f'\n      {quote(line)},' for line in lines)
    return f'    evidence: [{body}\n    ],'


def main():
    text = SKILLS.read_text(encoding='utf-8')

    # Split into per-entry blocks on the 2-space "  {" boundary.
    blocks = re.split(r'\n(?=  \{\n)', text)
    out = []
    changed = 0

    for block in blocks:
        m = re.search(r'^\s*id: (\d+),', block, re.M)
        if not m:
            out.append(block)
            continue

        sid = int(m.group(1))
        if sid not in USAGE:
            sys.exit(f'FAIL: no usage band defined for skill id {sid}')
        if 'level:' not in block:
            out.append(block)          # already migrated
            continue

        # 1. drop the self-rated percentage
        block = re.sub(r'^\s*level: \d+,\n', '', block, flags=re.M)

        # 2. insert usage + evidence right after `category:`
        insertion = (
            f"    usage: '{USAGE[sid]}',\n"
            f"{render_evidence(EVIDENCE[sid])}\n"
        )
        block = re.sub(r'^(    category: .*\n)', r'\1' + insertion, block, count=1, flags=re.M)
        out.append(block)
        changed += 1

    if changed == 0:
        sys.exit('FAIL: nothing to migrate — has this already been run?')

    # The file header documents the old structure; bring it up to date.
    result = '\n'.join(out)
    result = result.replace(
        """ * Structure (top level): id, name, category, level.""",
        """ * Structure (top level): id, name, category, usage, evidence.""")
    result = result.replace(
        """ * Copy: `i18n.en.description` — the prose blurb only.""",
        """ * Copy: `i18n.en.description` — the prose blurb only.
 *
 * `usage` ('professional' | 'working' | 'learning') says HOW the skill is used, not how
 * good he is at it — a fact about whether client work depends on it, rather than a
 * self-awarded score. It replaced a `level: 90` percentage, which no visitor could verify.
 * `evidence` lists checkable facts, each taken from the CVs or verifiable in this repo.""")
    SKILLS.write_text(result, encoding='utf-8')
    print(f'migrated {changed} skills: level removed, usage + evidence added')


if __name__ == '__main__':
    main()
