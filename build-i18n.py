#!/usr/bin/env python3
"""
i18n scaffolding script.

Creates a /ru/ mirror of every top-level HTML page, fixes relative asset
paths for the extra folder depth, adds hreflang alternate tags between the
English and Russian versions, and inserts an EN/RU language switcher link
into the navbar, desktop dropdown, and mobile menu of every page.

Run once to scaffold the architecture. Re-run any time a new top-level page
is added. Text content itself is NOT translated by this script — Russian
pages start as a copy of the English content, to be translated separately.
"""

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).parent
RU_DIR = ROOT / "ru"
SITE_URL = "https://vifine.tech"

PAGES = [
    "404.html",
    "contact.html",
    "cv.html",
    "fullflat-finance.html",
    "fullflat-operations.html",
    "fullflat-pim.html",
    "index.html",
    "project-detail.html",
    "project.html",
    "projects.html",
    "resume.html",
]


def add_hreflang(html: str, page: str, is_ru: bool) -> str:
    """Insert hreflang alternate tags + x-default right after <link rel="canonical">."""
    en_url = f"{SITE_URL}/{page}" if page != "index.html" else f"{SITE_URL}/"
    ru_url = f"{SITE_URL}/ru/{page}"
    tags = (
        f'\n  <link rel="alternate" hreflang="en" href="{en_url}">'
        f'\n  <link rel="alternate" hreflang="ru" href="{ru_url}">'
        f'\n  <link rel="alternate" hreflang="x-default" href="{en_url}">'
    )
    # Insert after the canonical link line
    return re.sub(
        r'(<link rel="canonical"[^>]*>)',
        r"\1" + tags.replace("\\", "\\\\"),
        html,
        count=1,
    )


def fix_ru_paths(html: str) -> str:
    """Prefix relative asset/script/data paths with ../ for the /ru/ subfolder."""
    html = re.sub(r'(src|href)="assets/', r'\1="../assets/', html)
    html = re.sub(r'src="script\.js"', 'src="../script.js"', html)
    html = re.sub(r"fetch\('projects\.json'\)", "fetch('../projects.json')", html)
    return html


def insert_lang_toggle(html: str, current_label: str, other_label: str, other_href: str) -> str:
    """Insert a persistent 'En | Ru' toggle in the header, right before the burger button —
    always visible, outside the dropdown/mobile menu, matching the Figma design."""
    toggle = (
        '\n      <span class="lang-toggle">'
        f'<span class="lang-current">{current_label}</span>'
        '<span class="lang-sep"> | </span>'
        f'<a href="{other_href}" class="lang-other">{other_label}</a>'
        '</span>\n      '
    )
    return re.sub(
        r'(\s*)(<!-- Burger button[^>]*-->\s*)?(<button class="navbar-burger")',
        lambda m: toggle + (m.group(2) or "") + m.group(3),
        html,
        count=1,
    )


def build():
    RU_DIR.mkdir(exist_ok=True)

    for page in PAGES:
        src_path = ROOT / page
        if not src_path.exists():
            print(f"  skip (not found): {page}")
            continue

        original = src_path.read_text(encoding="utf-8")

        # ---- Update the EN (root) file in place ----
        en_html = original
        en_html = add_hreflang(en_html, page, is_ru=False)
        en_html = insert_lang_toggle(en_html, "En", "Ru", f"ru/{page}")
        src_path.write_text(en_html, encoding="utf-8")

        # ---- Build the RU mirror ----
        ru_html = original
        ru_html = fix_ru_paths(ru_html)
        ru_html = ru_html.replace('<html lang="en">', '<html lang="ru">', 1)
        ru_html = add_hreflang(ru_html, page, is_ru=True)
        # canonical must point to the ru URL
        ru_canonical = f"{SITE_URL}/ru/{page}"
        ru_html = re.sub(
            r'<link rel="canonical" href="[^"]*">',
            f'<link rel="canonical" href="{ru_canonical}">',
            ru_html,
            count=1,
        )
        ru_html = insert_lang_toggle(ru_html, "Ru", "En", f"../{page}")

        (RU_DIR / page).write_text(ru_html, encoding="utf-8")
        print(f"  built: {page}  ->  ru/{page}")

    # Duplicate projects.json into /ru/ so script.js's relative fetch works there too
    pj = ROOT / "projects.json"
    if pj.exists():
        shutil.copy(pj, RU_DIR / "projects.json")
        print("  copied: projects.json -> ru/projects.json")


if __name__ == "__main__":
    build()
