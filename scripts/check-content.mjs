// Fails the build if an em dash (U+2014) or en dash (U+2013) appears in site source:
// articles, pages, components and layouts (visible copy and structured data alike).
// Runs as `prebuild`, so the content cron cannot push an article that contains either.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOTS = ['src/content', 'src/pages', 'src/components', 'src/layouts'];
const DASH = /[\u2013\u2014]|&[mn]dash;|&#821[12];|&#x201[34];/i;

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (/\.(mdx?|astro|[jt]sx?)$/.test(entry.name)) yield path;
  }
}

const hits = [];
for (const file of ROOTS.flatMap((root) => [...walk(root)])) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (DASH.test(line)) hits.push(`${file}:${i + 1}: ${line.trim()}`);
  });
}

if (hits.length) {
  console.error(`\n✖ Em/en dash found in ${hits.length} line(s). Use a hyphen or "to" for ranges (6-24 months), a comma, colon, parentheses or period otherwise:\n`);
  console.error(hits.join('\n') + '\n');
  process.exit(1);
}
console.log('✔ content check: no em/en dash');
