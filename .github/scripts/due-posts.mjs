// Lists the posts that were still hidden at the last deploy and are visible now.
// Usage: node .github/scripts/due-posts.mjs <ISO time of the last successful deploy>
// Prints one path per line. Prints nothing when no post became due.
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

// Keep in sync with SITE.scheduledPostMargin in src/config.ts.
const MARGIN_MS = 15 * 60 * 1000;

const last = new Date(process.argv[2] ?? "").getTime();
if (Number.isNaN(last)) {
  console.error("Expected the ISO time of the last deploy as first argument.");
  process.exit(2);
}
const now = Date.now();

const files = (await readdir("src/content", { recursive: true }))
  .filter(name => /\.mdx?$/.test(name))
  .map(name => join("src/content", name));

for (const file of files) {
  const frontmatter = (await readFile(file, "utf8")).split(/^---\s*$/m)[1];
  if (!frontmatter || /^draft:\s*true\s*$/m.test(frontmatter)) continue;
  const raw = frontmatter.match(/^pubDatetime:\s*["']?([^"'\n]+)/m)?.[1];
  const visibleFrom = new Date(raw ?? "").getTime() - MARGIN_MS;
  if (visibleFrom > last && visibleFrom <= now) console.log(file);
}
