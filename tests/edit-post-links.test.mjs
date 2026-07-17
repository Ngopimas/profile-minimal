import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Suggest Changes links to the Markdown source file", async () => {
  const html = await readFile(
    "dist/posts/huggingface-ai-agents-course-fundamentals/index.html",
    "utf8"
  );
  const sourceUrl =
    "https://github.com/Ngopimas/profile-minimal/edit/master/src/content/blog/250224-huggingface-ai-agents-course-review.md";

  assert.match(html, new RegExp(`href="${sourceUrl}"`));
});
