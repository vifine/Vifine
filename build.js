#!/usr/bin/env node
/**
 * Static site build script for project case-study pages.
 *
 * Reads: templates/project.template.html
 *        content/projects/*.json
 * Writes: <slug>.html  (in repo root, e.g. fullflat-operations.html)
 *
 * Usage: node build.js
 *
 * No external dependencies — plain Node.js only.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const TEMPLATE_PATH = path.join(ROOT, 'templates', 'project.template.html');
const CONTENT_DIR = path.join(ROOT, 'content', 'projects');

function getByPath(obj, keyPath) {
  return keyPath.split('.').reduce((acc, key) => {
    if (acc === undefined || acc === null) return undefined;
    return acc[key];
  }, obj);
}

// Render {{#each path}} ... {{/each}} blocks (single level, supports
// {{this}}, {{field}}, and {{#if_TYPE}}...{{/if_TYPE}} sub-blocks keyed
// on item.type === 'TYPE').
function renderEachBlocks(template, data) {
  const eachRe = /{{#each ([\w.]+)}}\n?([\s\S]*?){{\/each}}\n?/g;

  return template.replace(eachRe, (match, arrPath, inner) => {
    const arr = getByPath(data, arrPath);
    if (!Array.isArray(arr)) return '';

    return arr.map((item) => {
      let block = inner;

      // Handle {{#if_TYPE}}...{{/if_TYPE}} conditional sub-blocks
      const ifRe = /{{#if_(\w+)}}\n?([\s\S]*?){{\/if_(\w+)}}\n?/g;
      block = block.replace(ifRe, (ifMatch, type1, ifInner) => {
        if (item && item.type === type1) {
          return ifInner;
        }
        return '';
      });

      // Replace {{this}} — for primitive array items (strings)
      if (typeof item === 'string' || typeof item === 'number') {
        block = block.split('{{this}}').join(String(item));
      } else if (item && typeof item === 'object') {
        block = block.replace(/{{(\w+)}}/g, (fieldMatch, field) => {
          const val = item[field];
          return val !== undefined && val !== null ? String(val) : '';
        });
      }

      return block;
    }).join('');
  });
}

// Render {{#if path}} ... {{/if}} blocks — hides the block entirely when
// the referenced value is falsy, an empty array, or an empty string.
// Handles nesting by always matching the innermost block first (the capture
// group excludes any further "{{#if " so it can't swallow a nested block),
// then re-running until no {{#if}} tags remain.
function renderIfBlocks(template, data) {
  const ifRe = /{{#if ([\w.]+)}}\n?((?:(?!{{#if )[\s\S])*?){{\/if}}\n?/g;

  let out = template;
  let prev;
  do {
    prev = out;
    out = out.replace(ifRe, (match, keyPath, inner) => {
      const val = getByPath(data, keyPath);
      const isEmpty =
        val === undefined ||
        val === null ||
        val === '' ||
        (Array.isArray(val) && val.length === 0);
      return isEmpty ? '' : inner;
    });
  } while (out !== prev && out.includes('{{#if '));

  return out;
}

// Replace remaining {{dot.path}} placeholders from root data.
function renderFields(template, data) {
  return template.replace(/{{([\w.]+)}}/g, (match, keyPath) => {
    const val = getByPath(data, keyPath);
    return val !== undefined && val !== null ? String(val) : '';
  });
}

function render(template, data) {
  let out = renderIfBlocks(template, data);
  out = renderEachBlocks(out, data);
  out = renderFields(out, data);
  return out;
}

function build() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error('Template not found:', TEMPLATE_PATH);
    process.exit(1);
  }
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  if (!fs.existsSync(CONTENT_DIR)) {
    console.error('Content dir not found:', CONTENT_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.json'));
  if (files.length === 0) {
    console.warn('No JSON content files found in', CONTENT_DIR);
    return;
  }

  files.forEach((file) => {
    const fullPath = path.join(CONTENT_DIR, file);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    } catch (e) {
      console.error('Failed to parse', file, e.message);
      return;
    }

    if (!data.slug) {
      console.error('Missing "slug" field in', file, '— skipping.');
      return;
    }

    // Auto-generate a WhatsApp CTA link referencing this project's title
    const plainTitle = (data.title || '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    const waMessage = `Hi Victoria, I saw your ${plainTitle} project and want to discuss a similar challenge`;
    data.whatsappCtaHref = `https://wa.me/972538791843?text=${encodeURIComponent(waMessage)}`;

    const html = render(template, data);
    const outDir = path.join(ROOT, 'projects', data.slug);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, 'index.html');
    fs.writeFileSync(outPath, html, 'utf8');
    console.log('Built:', `projects/${data.slug}/index.html`);
  });

  // ---- Russian case studies (translated content, same template) ----
  const RU_CONTENT_DIR = path.join(ROOT, 'content', 'projects-ru');
  if (fs.existsSync(RU_CONTENT_DIR)) {
    const ruFiles = fs.readdirSync(RU_CONTENT_DIR).filter((f) => f.endsWith('.json'));
    ruFiles.forEach((file) => {
      const fullPath = path.join(RU_CONTENT_DIR, file);
      let data;
      try {
        data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      } catch (e) {
        console.error('Failed to parse', file, e.message);
        return;
      }
      if (!data.slug) {
        console.error('Missing "slug" field in', file, '— skipping.');
        return;
      }
      const plainTitle = (data.title || '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      const waMessage = `Здравствуйте, Виктория, я видел ваш проект ${plainTitle} и хочу обсудить похожую задачу`;
      data.whatsappCtaHref = `https://wa.me/972538791843?text=${encodeURIComponent(waMessage)}`;

      let html = render(template, data);
      // The template has three hardcoded internal nav links (logo -> "/",
      // CV -> "/cv/", Projects -> "/projects/") that are correct for English
      // pages but need the /ru/ prefix here. Everything else (directLink,
      // nav.prevHref/nextHref/ctaHref, image src) is already locale-correct
      // because it comes from the translated JSON itself.
      html = html
        .split('href="/"').join('href="/ru/"')
        .split('href="/cv/"').join('href="/ru/cv/"')
        .split('href="/projects/"').join('href="/ru/projects/"');
      const outDir = path.join(ROOT, 'ru', 'projects', data.slug);
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      const outPath = path.join(outDir, 'index.html');
      fs.writeFileSync(outPath, html, 'utf8');
      console.log('Built:', `ru/projects/${data.slug}/index.html (RU)`);
    });
  }
}

build();
