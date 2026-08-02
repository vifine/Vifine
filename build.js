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

// Replace remaining {{dot.path}} placeholders from root data.
function renderFields(template, data) {
  return template.replace(/{{([\w.]+)}}/g, (match, keyPath) => {
    const val = getByPath(data, keyPath);
    return val !== undefined && val !== null ? String(val) : '';
  });
}

function render(template, data) {
  let out = renderEachBlocks(template, data);
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

    const html = render(template, data);
    const outPath = path.join(ROOT, `${data.slug}.html`);
    fs.writeFileSync(outPath, html, 'utf8');
    console.log('Built:', `${data.slug}.html`);
  });
}

build();
