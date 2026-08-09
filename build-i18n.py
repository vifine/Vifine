#!/usr/bin/env python3
"""
i18n scaffolding script.

Creates a /ru/ mirror of every top-level page, adds hreflang alternate tags
between the English and Russian versions, and inserts an EN/RU language
switcher link into the navbar, desktop dropdown, and mobile menu of every
page.

Pages live at clean, extensionless URLs: /cv/, /projects/, /fullflat-pim/,
etc. (physically stored as {slug}/index.html). The homepage (index.html) and
404.html are the only two files that stay flat at the root, since that's
what GitHub Pages requires.

All internal resource references (assets, script.js, projects.json) and
generated links (hreflang, canonical, lang toggle) use root-absolute paths,
so no relative-depth math is needed regardless of how deep a page lives.

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

# Top-level pages that live at /{slug}/ (i.e. {slug}/index.html).
TOP_LEVEL_SLUGS = [
    "contact",
    "cv",
    "project-detail",
    "project",
    "projects",
]

# Case-study pages that live nested under /projects/{slug}/.
PROJECT_SLUGS = [
    "artline-b2b-portal",
    "artline-craft-storefront",
    "artline-email-automation",
    "fullflat-finance",
    "fullflat-oms-agent",
    "fullflat-operations",
    "fullflat-pim",
    "fullflat-taxonomy-reviews",
]


def rel_path(slug: str) -> str:
    """Path fragment for a slug, e.g. 'cv' -> 'cv', 'fullflat-pim' -> 'projects/fullflat-pim'."""
    if slug in PROJECT_SLUGS:
        return f"projects/{slug}"
    return slug


def en_url(slug: str) -> str:
    if slug == "index":
        return f"{SITE_URL}/"
    if slug == "404":
        return f"{SITE_URL}/404.html"
    return f"{SITE_URL}/{rel_path(slug)}/"


def ru_url(slug: str) -> str:
    if slug == "index":
        return f"{SITE_URL}/ru/"
    if slug == "404":
        return f"{SITE_URL}/ru/404.html"
    return f"{SITE_URL}/ru/{rel_path(slug)}/"


def add_hreflang(html: str, slug: str) -> str:
    """Insert hreflang alternate tags + x-default right after <link rel="canonical">."""
    html = re.sub(r'\n\s*<link rel="alternate" hreflang="[^"]*"[^>]*>', "", html)

    tags = (
        f'\n  <link rel="alternate" hreflang="en" href="{en_url(slug)}">'
        f'\n  <link rel="alternate" hreflang="ru" href="{ru_url(slug)}">'
        f'\n  <link rel="alternate" hreflang="x-default" href="{en_url(slug)}">'
    )
    return re.sub(
        r'(<link rel="canonical"[^>]*>)',
        r"\1" + tags.replace("\\", "\\\\"),
        html,
        count=1,
    )


def insert_lang_toggle(html: str, active: str, other_href: str) -> str:
    """Insert a persistent sliding pill toggle in the header, right before the burger
    button — always visible, outside the dropdown/mobile menu, matching Figma."""
    html = re.sub(r'\s*<div class="lang-toggle[^"]*">.*?</div>\s*', "\n      ", html, flags=re.DOTALL)

    modifier = " lang-toggle--ru" if active == "ru" else ""
    if active == "en":
        en_el = '<span class="lang-label lang-label-en">En</span>'
        ru_el = f'<a href="{other_href}" class="lang-label lang-label-ru">Ru</a>'
    else:
        en_el = f'<a href="{other_href}" class="lang-label lang-label-en">En</a>'
        ru_el = '<span class="lang-label lang-label-ru">Ru</span>'
    toggle = (
        f'\n      <div class="lang-toggle{modifier}">'
        '<span class="lang-toggle-thumb"></span>'
        f'{en_el}{ru_el}'
        '</div>\n      '
    )
    return re.sub(
        r'(\s*)(<!-- Burger button[^>]*-->\s*)?(<button class="navbar-burger")',
        lambda m: toggle + (m.group(2) or "") + m.group(3),
        html,
        count=1,
    )


def source_path(slug: str) -> Path:
    if slug in ("index", "404"):
        return ROOT / f"{slug}.html"
    return ROOT / rel_path(slug) / "index.html"


def ru_dest_path(slug: str) -> Path:
    if slug in ("index", "404"):
        return RU_DIR / f"{slug}.html"
    return RU_DIR / rel_path(slug) / "index.html"


def fix_ru_nav_links(html: str) -> str:
    """Rewrite the site's hardcoded internal nav links (logo/Home, Projects,
    CV, Contact) so they point at the /ru/ mirror instead of the English
    root. These are plain HTML in every page (not template variables), so
    a straight string swap on the exact quoted attribute is safe — it can't
    accidentally touch href="/ru/projects/{slug}/" or href="/assets/..."
    since those don't match the short exact strings below."""
    html = html.replace('href="/"', 'href="/ru/"')
    html = html.replace('href="/cv/"', 'href="/ru/cv/"')
    html = html.replace('href="/projects/"', 'href="/ru/projects/"')
    html = html.replace('href="/contact/"', 'href="/ru/contact/"')
    return html


def build():
    RU_DIR.mkdir(exist_ok=True)

    all_slugs = ["index", "404"] + TOP_LEVEL_SLUGS + PROJECT_SLUGS

    for slug in all_slugs:
        src_path = source_path(slug)
        if not src_path.exists():
            print(f"  skip (not found): {slug}")
            continue

        original = src_path.read_text(encoding="utf-8")

        # ---- Update the EN (root) file in place ----
        en_html = original
        en_html = add_hreflang(en_html, slug)
        en_html = insert_lang_toggle(en_html, "en", ru_url(slug).replace(SITE_URL, ""))
        src_path.write_text(en_html, encoding="utf-8")

        # ---- Build the RU mirror ----
        # If build.js already rendered a real Russian translation for this
        # slug (content/projects-ru/{slug}.json exists), that file is
        # already sitting at the destination — use IT as the base instead
        # of overwriting it with a copy of the English page. Only untranslated
        # slugs fall back to the English-copy placeholder.
        dest = ru_dest_path(slug)
        if dest.exists() and slug in PROJECT_SLUGS:
            ru_base = dest.read_text(encoding="utf-8")
        else:
            ru_base = original

        ru_html = ru_base
        ru_html = ru_html.replace('<html lang="en">', '<html lang="ru">', 1)
        ru_html = add_hreflang(ru_html, slug)
        ru_html = re.sub(
            r'<link rel="canonical" href="[^"]*">',
            f'<link rel="canonical" href="{ru_url(slug)}">',
            ru_html,
            count=1,
        )
        ru_html = fix_ru_nav_links(ru_html)
        ru_html = insert_lang_toggle(ru_html, "ru", en_url(slug).replace(SITE_URL, ""))

        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(ru_html, encoding="utf-8")
        print(f"  built: {slug}  ->  ru/{slug}")

    pj = ROOT / "projects.json"
    if pj.exists():
        shutil.copy(pj, RU_DIR / "projects.json")
        print("  copied: projects.json -> ru/projects.json")


if __name__ == "__main__":
    build()
