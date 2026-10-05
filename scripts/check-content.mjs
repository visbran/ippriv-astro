// Fails the build if an em dash (U+2014) appears in any content file.
// Runs as `prebuild`, so the content cron cannot push an article that contains one.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/content';
const EM_DASH = /—|&mdash;|&#8212;|&#x2014;/i;

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (/\.mdx?$/.test(entry.name)) yield path;
  }
}

const hits = [];
for (const file of walk(ROOT)) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (EM_DASH.test(line)) hits.push(`${file}:${i + 1}: ${line.trim()}`);
  });
}

if (hits.length) {
  console.error(`\n✖ Em dash found in ${hits.length} line(s). Replace with a comma, colon, parentheses or period:\n`);
  console.error(hits.join('\n') + '\n');
  process.exit(1);
}
console.log('✔ content check: no em dash');
