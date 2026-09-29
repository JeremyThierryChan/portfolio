#!/usr/bin/env python3
"""
make-og-image.py — regenerate public/og-cover.png, the social share card.

    python3 scripts/make-og-image.py

WHY THIS IS A SCRIPT AND NOT A BUILD STEP. It writes a small PDF by hand and then asks
macOS `sips` to rasterise it, because this machine has no PDF toolkit, no Python imaging
library, and the fonts to hand-render text into a PNG do not exist here either. Both
dependencies are macOS-only, so wiring it into `npm run verify` would break the build on
any Linux CI. The output is committed instead; run this only when the card's wording
changes.

WHAT IT IS FOR. The site had no Open Graph tags at all, so a link shared into WeChat,
Slack or LinkedIn rendered as a bare URL with no title, no description and no image — on
the one distribution channel this portfolio actually has, since the work is sent to people
rather than found. The tags live in index.html; this is the image they point at.

Dimensions are the 1200x630 the platforms expect. The wording is deliberately concrete
(four things he does) rather than the positioning line, because a share card is read at
thumbnail size in a crowded feed.

Text is ASCII only on purpose. A PDF text string is a byte string, and getting an em dash
through it needs the font's encoding declared correctly; a hyphen costs nothing and cannot
render as a box.
"""

import os
import zlib

WIDTH, HEIGHT = 1200, 630
OUT_PDF = '/tmp/og-cover.pdf'
OUT_PNG = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'og-cover.png')

# A light editorial card: it is the style the site shows for most of the waking day.
BG = (0.984, 0.984, 0.980)      # near-white, mirroring --bg in style a
INK = (0.09, 0.09, 0.10)        # near-black, mirroring --fg
MUTED = (0.42, 0.42, 0.45)      # mirroring --fg-muted
ACCENT = (0.72, 0.31, 0.20)     # a single warm accent, as the site uses one accent only


def esc(text):
    """Escape a PDF literal string."""
    return text.replace('\\', r'\\').replace('(', r'\(').replace(')', r'\)')


def text(x, y, size, font, string, colour):
    r, g, b = colour
    return (
        f"BT {r:.3f} {g:.3f} {b:.3f} rg /{font} {size} Tf "
        f"1 0 0 1 {x} {y} Tm ({esc(string)}) Tj ET\n"
    )


def build_content():
    out = []
    # background
    r, g, b = BG
    out.append(f"{r:.3f} {g:.3f} {b:.3f} rg 0 0 {WIDTH} {HEIGHT} re f\n")
    # a single accent rule, the same hairline-plus-accent language the site uses
    r, g, b = ACCENT
    out.append(f"{r:.3f} {g:.3f} {b:.3f} rg 96 452 72 4 re f\n")
    # a muted hairline across the bottom, standing in for the footer rule
    r, g, b = MUTED
    out.append(f"{r:.3f} {g:.3f} {b:.3f} rg 96 132 1008 1 re f\n")

    out.append(text(96, 520, 26, 'F2', 'PORTFOLIO', ACCENT))
    out.append(text(96, 396, 76, 'F1', 'Jeremy Thierry Chan', INK))
    out.append(text(96, 318, 34, 'F2', 'Interpreting / Translation / Trade / Web', MUTED))
    out.append(text(96, 196, 24, 'F2', 'Language, trade and technology - one operator.', INK))
    out.append(text(96, 100, 22, 'F2', 'jeremythierrychan.github.io/portfolio', MUTED))
    return ''.join(out).encode('latin-1')


def build_pdf(content):
    """A minimal single-page PDF with a correct cross-reference table."""
    objects = [
        b'<< /Type /Catalog /Pages 2 0 R >>',
        b'<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
        (
            f'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {WIDTH} {HEIGHT}] '
            '/Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>'
        ).encode('latin-1'),
        b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
        b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
        b'<< /Length ' + str(len(content)).encode() + b' >>\nstream\n' + content + b'endstream',
    ]

    out = bytearray(b'%PDF-1.4\n')
    offsets = []
    for i, body in enumerate(objects, start=1):
        offsets.append(len(out))
        out += f'{i} 0 obj\n'.encode() + body + b'\nendobj\n'

    xref_at = len(out)
    out += f'xref\n0 {len(objects) + 1}\n'.encode()
    out += b'0000000000 65535 f \n'
    for off in offsets:
        out += f'{off:010d} 00000 n \n'.encode()
    out += (
        f'trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\n'
        f'startxref\n{xref_at}\n%%EOF\n'
    ).encode()
    return bytes(out)


def main():
    content = build_content()
    with open(OUT_PDF, 'wb') as fh:
        fh.write(build_pdf(content))
    print('wrote', OUT_PDF, os.path.getsize(OUT_PDF), 'bytes')

    # sips is the only rasteriser available here.
    target = os.path.normpath(OUT_PNG)
    if os.system(f'sips -s format png "{OUT_PDF}" --out "{target}" >/dev/null 2>&1') != 0:
        raise SystemExit('sips failed — nothing written')
    if not os.path.exists(target):
        raise SystemExit(f'sips reported success but {target} does not exist')
    print('wrote', target, os.path.getsize(target), 'bytes')


if __name__ == '__main__':
    main()
