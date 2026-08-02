# Editing project case studies

**Source of truth: Notion.** The "Vifine Portfolio CMS" workspace holds
4 linked databases — edit content there, not in this repo.

https://app.notion.com/p/3b0fd4f91f5081d2a258cecf44e1be0b

- **Projects** — one row per case study (title, pitch, meta, overview,
  challenge, SEO fields, tech tags)
- **Solution Blocks** — ordered rows linked to a Project, each a
  Heading / Text / Image. This is the vertical blog-style story —
  add, delete, or reorder rows freely by changing the `Order` number.
- **Results Metrics** — the 3 headline numbers per project
- **Results Bullets** — the bullet list under the metrics

## Workflow

1. Edit/add rows in the Notion databases (change text, add a new
   Solution Block, add a whole new Project row, etc.)
2. For new images: attach the file to the `Image` property on the
   Solution Block row.
3. Tell Claude: **"pull from Notion and rebuild the site"**
4. Claude fetches the latest data via the Notion API, regenerates the
   JSON files below, runs the build, and pushes the updated pages.

You never need to touch `content/projects/*.json`, `templates/`, or the
generated `.html` files directly — they're regenerated from Notion.

## Adding a brand new project

1. Add a row to **Projects** with a unique `Slug` (lowercase-with-dashes)
   and the next `Order` number.
2. Add its Solution Blocks, Results Metrics, and Results Bullets rows,
   linked to that Project.
3. Set `Status` to "Ready to publish" once done.
4. Ask Claude to sync + rebuild — it will also add the new page to
   `projects.json` (the portfolio grid) and re-chain the prev/next
   navigation between projects automatically, based on `Order`.

---

## Technical reference (for Claude / future maintenance)

Each project page (e.g. `fullflat-operations.html`) is generated from
`templates/project.template.html` using the JSON files in
`content/projects/`, via `build.js` (plain Node, no dependencies):

```bash
node build.js
# or
npm run build
```

### Structure of a project JSON file

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

`nav` prev/next is derived from each Project row's `Order` field when
syncing from Notion — no need to maintain it by hand in Notion.

