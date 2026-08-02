# Editing project case studies

Each project page (e.g. `fullflat-operations.html`) is generated from a JSON
file in `content/projects/`. To change any text, image, or section on a
project page, edit its JSON file — never edit the generated `.html` file
directly, it will be overwritten on the next build.

## Structure of a project JSON file

```jsonc
{
  "slug": "fullflat-operations",        // used to name the output file: <slug>.html
  "breadcrumb": "...",                  // breadcrumb + browser tab context
  "title": "...",                       // H1 + hero title
  "pitch": "...",                       // one-line subtitle under the H1
  "seo": { "title", "description", "keywords", "ogTitle", "ogDescription" },
  "meta": [ { "label": "Role", "value": "Architect" }, ... ],  // hero meta row
  "techTags": ["Airtable", "n8n", ...], // pill tags under Core Tech
  "overview": "...",                    // left column under hero
  "challenge": "...",                   // right column under hero
  "solutionIntro": "...",               // lead paragraph before Solution blocks
  "solutionBlocks": [                   // ordered, vertical blog-style blocks
    { "type": "heading", "text": "..." },
    { "type": "text", "text": "..." },
    { "type": "image", "src": "assets/img/...", "alt": "...", "style": "" }
  ],
  "results": {
    "metrics": [ { "value": "22", "label": "Connected tables" }, ... ],
    "bullets": [ "...", "..." ]
  },
  "nav": {
    "prevHref", "prevLabel",            // bottom-left "Previous Project" link
    "nextHref", "nextLabel",            // bottom-right "Next Project" link
    "ctaHref", "ctaLabel", "ctaTitle", "ctaDesc",  // center CTA card
    "viewAllHref"                       // "View All Projects" link under the CTA
  }
}
```

`solutionBlocks` is the main content of a case study — add, remove, or
reorder items freely to change the story. Each item is one of:
- `heading` — a section subtitle (H3)
- `text` — a paragraph
- `image` — a full-width screenshot

## Adding a new project

1. Copy an existing file in `content/projects/` as a starting point.
2. Fill in the fields above.
3. Add project images to `assets/img/projects/<slug>/`.
4. Run the build (see below) — this creates `<slug>.html` in the repo root.
5. Add the new project to `projects.json` (used by the projects list page)
   so it shows up in the portfolio grid.
6. Update the `nav` fields of the surrounding projects (previous/next) so
   the bottom navigation chains correctly.

## Building

```bash
node build.js
# or
npm run build
```

This reads every file in `content/projects/*.json`, renders it through
`templates/project.template.html`, and writes the resulting static HTML
pages to the repo root — ready to commit and deploy as-is (no server or
build step needed at runtime).
