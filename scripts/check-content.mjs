// Fails the build if an em dash (U+2014) or en dash (U+2013) appears in any content file.
// Runs as `prebuild`, so the content cron cannot push an article that contains either.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/content';
const DASH = /[\u2013\u2014]|&[mn]dash;|&#821[12];|&#x201[34];/i;

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
    if (DASH.test(line)) hits.push(`${file}:${i + 1}: ${line.trim()}`);
  });
}

if (hits.length) {
  console.error(`\n✖ Em/en dash found in ${hits.length} line(s). Use a hyphen or "to" for ranges (6-24 months), a comma, colon, parentheses or period otherwise:\n`);
  console.error(hits.join('\n') + '\n');
  process.exit(1);
}
console.log('✔ content check: no em/en dash');

// Warns (does not fail) when a blog tag has no topic in src/utils/topics.ts,
// so the blog filter does not silently drop it. Map new tags there.
const topicsSrc = readFileSync('src/utils/topics.ts', 'utf8');
const known = new Set([...topicsSrc.matchAll(/^\s+'([^']+)': '/gm)].map((m) => m[1]));
const ignored = topicsSrc.match(/IGNORED_TAGS = new Set\(\[([^\]]*)\]/)?.[1] ?? '';
for (const m of ignored.matchAll(/'([^']+)'/g)) known.add(m[1]);

const unmapped = new Map();
for (const file of walk('src/content/blog')) {
  const tags = readFileSync(file, 'utf8').match(/^tags:\s*\[([^\]]*)\]/m)?.[1] ?? '';
  for (const raw of tags.split(',')) {
    const tag = raw.trim().replace(/^['"]|['"]$/g, '').toLowerCase();
    if (tag && !known.has(tag)) unmapped.set(tag, file);
  }
}
if (unmapped.size) {
  console.warn(`\n⚠ ${unmapped.size} blog tag(s) without a topic (add them to TAG_TO_TOPIC in src/utils/topics.ts):`);
  for (const [tag, file] of unmapped) console.warn(`  "${tag}" (${file})`);
} else {
  console.log('✔ content check: every blog tag maps to a topic');
}
