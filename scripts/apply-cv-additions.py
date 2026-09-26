#!/usr/bin/env python3
"""
Add the CV material that was missing from the content layer, and re-sort the timeline.

Run once:  python3 scripts/apply-cv-additions.py

WHY A SCRIPT: `timeline.js` is a hand-formatted array in reverse-chronological order.
Inserting ten entries by hand risks both a mis-ordered file and a lost entry, so this
parses the existing blocks, adds the new ones, sorts by `date` descending (the ISO-prefix
format makes plain string comparison chronological — see SCHEMA.md) and rewrites.

Entries with a year RANGE are dated by their most recent year, so an ongoing or recent
engagement sorts where a reader expects to find it; the range itself is stated in the
description. This matches how the pre-existing ranged roles were already handled.

Honesty note: Jeremy asked for the departure reasons to be recorded in full rather than
softened. They are written as plain statements of fact — no evaluation of the employer and
no editorialising about pay — which keeps them honest without being unprofessional.
"""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
TL = ROOT / 'src/content/timeline.js'

NEW_ENTRIES = [
    {
        'id': 'al-bahlaoui-family-china-affairs-advisor',
        'audiences': ['trade'],
        'category': 'career',
        'date': '2025',
        'datePrecision': 'year',
        'title': 'General Advisor to the Al-Bahlaoui Family — Morocco (in-China affairs)',
        'description': 'General advisor and accompanying interpreter for the Al-Bahlaoui family of Morocco in their affairs in China, from 2022 and ongoing, working from Qingdao and remotely.',
    },
    {
        'id': 'chinese-cigar-industry-export-specialist',
        'audiences': ['trade'],
        'category': 'career',
        'date': '2025',
        'datePrecision': 'year',
        'title': 'Foreign Trade Specialist — Chinese Cigar Industry Export, Hangzhou',
        'description': 'Worked as a foreign trade specialist on a project taking the Chinese cigar industry to overseas markets, based in Hangzhou, Zhejiang.',
    },
    {
        'id': 'whitty-family-china-affairs-interpreter',
        'audiences': ['trade'],
        'category': 'career',
        'date': '2024',
        'datePrecision': 'year',
        'title': 'Interpreter to the Whitty Family — London, UK (in-China affairs)',
        'description': 'Accompanying interpreter for the Whitty family of London for their affairs in China, from 2020 to 2024.',
    },
    {
        'id': 'sdust-international-student-interpreter',
        'audiences': ['institutions', 'events'],
        'category': 'career',
        'date': '2024',
        'datePrecision': 'year',
        'title': 'Interpreter for International Students — Shandong University of Science and Technology',
        'description': 'Provided interpreting so international students at SDUST could live, seek medical care and study in China, and organised cross-cultural events and student societies. From 2020 to 2024.',
    },
    {
        'id': 'bike-flying-heroes-club-technician',
        'audiences': [],
        'category': 'career',
        'date': '2020',
        'datePrecision': 'year',
        'title': 'Bicycle Technician — Bike Flying Heroes Club',
        'description': 'Provided bicycle repair, servicing and personalised fitting for club members and customers, from 2018 to 2020.',
    },
    {
        'id': 'wenzhou-puluotuo-machinery-engineer',
        'audiences': [],
        'category': 'career',
        'date': '2020',
        'datePrecision': 'year',
        'title': 'Engineer — Wenzhou Puluotuo Electromechanical Co., Ltd.',
        'description': 'Inspected and signed off construction sites, verified landscaping stock, and reviewed construction drawings. Left to study in Qingdao.',
    },
    {
        'id': 'private-in-home-full-subject-tutor',
        'audiences': ['institutions'],
        'category': 'career',
        'date': '2022',
        'datePrecision': 'year',
        'title': 'Private In-Home Tutor — all school subjects, Qingdao',
        'description': 'Provided in-home tutoring across all school subjects.',
    },
    {
        'id': 'luna-education-full-subject-tutor',
        'audiences': ['institutions'],
        'category': 'career',
        'date': '2021',
        'datePrecision': 'year',
        'title': 'Full-Subject Tutor — Luna Education, Wenzhou',
        'description': 'Tutored middle-school students during school holidays, covering homework support and previewing upcoming material. Left to study in Qingdao.',
    },
    {
        'id': 'first-aid-certification-american-heart-association',
        'audiences': [],
        'category': 'personal',
        'date': '2019',
        'datePrecision': 'year',
        'title': 'First Aid Certification — American Heart Association HeartSaver',
        'description': 'Completed American Heart Association HeartSaver first aid training at the Shanghai Yuean Health Promotion Centre, earning an internationally recognised first aid certificate.',
    },
    {
        'id': 'wenzhou-junior-road-cycling-champion',
        'audiences': [],
        'category': 'hobby',
        'date': '2017',
        'datePrecision': 'year',
        'title': 'Wenzhou Junior Road Cycling Champion — three consecutive years',
        'description': 'Won the Wenzhou junior road cycling championship three years running, from 2014 to 2017.',
    },
]

# Existing entries that the CVs enrich, and the honest reasons Jeremy asked to record.
UPDATES = {
    'english-teacher-nas-system-builder': (
        'Worked as an English teacher and built an internal NAS system for the SE Research Society in Qingdao.',
        'Taught English and wrote question banks, and built an internal NAS system for the SE Research Society in Qingdao. Left voluntarily — the pay was low relative to the workload.',
    ),
    'founded-jtc-atelier': (
        'Founded JTC Atelier, a personal brand specialising in custom leather goods and jewellery, based in Wenzhou. The brand has since ceased operations.',
        'Founded JTC Atelier in March 2020, a personal brand specialising in custom leather goods and jewellery, based in Wenzhou. The brand was profitable; development was paused for study.',
    ),
    'full-subject-tutor-international-student-coordinator': (
        'Worked as a full-subject tutoring teacher at Hangzhi Education, and served as the general coordinator for international student activities at Shandong University of Science and Technology.',
        'Taught all subjects at Hangzhi Education, and served as general coordinator for international student activities at Shandong University of Science and Technology — organising on-campus events during the pandemic lockdown, which were later cancelled as restrictions eased.',
    ),
}

# The trailing newline is a LOOKAHEAD, not a consumed character. Consuming it made the
# next block's leading newline unavailable, so the pattern matched every OTHER entry —
# which silently halved a 40-entry array on the first run of this script.
# Two traps learned the hard way, both of which silently deleted half the array:
#   1. The trailing newline must be a LOOKAHEAD. Consuming it made the next block's
#      leading newline unavailable, so only every other entry matched.
#   2. The leading newline must be OPTIONAL, because the first entry follows the array
#      declaration directly with no blank line.
BLOCK_RE = re.compile(r'(?:^|\n)  \{\n(?:.*?\n)*?  \},(?=\n)', re.M)


def parse_blocks(text):
    """Split the array body into entry blocks, keeping the array header separate.

    Guarded: a mis-parse here deletes content, so the block count is cross-checked against
    the number of `  {` opening lines before anything is written.
    """
    start = text.index('export const timeline = [')
    body_start = text.index('\n', start) + 1
    end = text.rindex('];')
    header, body, footer = text[:body_start], text[body_start:end], text[end:]

    blocks = [b.lstrip('\n') for b in BLOCK_RE.findall(body)]
    openings = len(re.findall(r'^  \{$', body, re.M))
    if len(blocks) != openings:
        sys.exit(
            f'FAIL: parsed {len(blocks)} blocks but the body has {openings} opening lines. '
            'Refusing to write — a partial parse would delete entries.'
        )
    for b in blocks:
        if not re.search(r"^\s*id: '", b, re.M) or not re.search(r'^\s*date:', b, re.M):
            sys.exit('FAIL: a parsed block is missing its id or date. Refusing to write.')
    return header, blocks, footer


def render(entry):
    aud = entry['audiences']
    aud_line = f"    audiences: {str(aud).replace(chr(34), chr(39))},\n" if aud else ''
    return (
        "  {\n"
        f"    id: '{entry['id']}',\n"
        f"{aud_line}"
        f"    category: '{entry['category']}',\n"
        f"    date: '{entry['date']}',\n"
        f"    datePrecision: '{entry['datePrecision']}',\n"
        "    i18n: {\n"
        "      en: {\n"
        f"        title: {quoted(entry['title'])},\n"
        f"        description: {quoted(entry['description'])},\n"
        "      },\n"
        "    },\n"
        "  },\n"
    )


def quoted(s):
    """Use double quotes whenever the text contains an apostrophe."""
    if "'" in s:
        return '"' + s.replace('"', '\\"') + '"'
    return "'" + s + "'"


def field(block, name):
    m = re.search(rf"^\s*{name}: '([^']*)'", block, re.M)
    return m.group(1) if m else None


def main():
    text = TL.read_text(encoding='utf-8')
    header, blocks, footer = parse_blocks(text)
    parsed_count = list(blocks)
    print(f'parsed {len(blocks)} existing entries')

    # Apply the enrichments in place.
    for i, block in enumerate(blocks):
        eid = field(block, 'id')
        if eid in UPDATES:
            old, new = UPDATES[eid]
            if old not in block:
                sys.exit(f'FAIL: enrichment text for {eid} not found — aborting')
            blocks[i] = block.replace(quoted(old), quoted(new))
            print(f'  enriched {eid}')

    existing_ids = {field(b, 'id') for b in blocks}
    added = 0
    for entry in NEW_ENTRIES:
        if entry['id'] in existing_ids:
            print(f"  skipped {entry['id']} (already present)")
            continue
        blocks.append(render(entry))
        added += 1

    # Reverse-chronological. ISO-prefixed dates compare correctly as plain strings, and
    # entries with equal dates keep insertion order, which is stable in Python's sort.
    blocks.sort(key=lambda b: field(b, 'date') or '', reverse=True)

    expected = len(parsed_count) + added
    if len(blocks) != expected:
        sys.exit(f'FAIL: expected {expected} entries, built {len(blocks)}. Refusing to write.')

    # Assemble explicitly rather than relying on the match preserving the original
    # blank-line layout: one block per line, header, then the closing bracket.
    TL.write_text(header + '\n'.join(blocks) + '\n' + footer, encoding='utf-8')
    print(f'added {added}; total now {len(blocks)} entries, re-sorted newest-first')


if __name__ == '__main__':
    main()
