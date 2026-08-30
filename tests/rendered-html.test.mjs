import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status:404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Product Design English System", async () => {
  const response = await render();
  assert.equal(response.status,200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Product Design English System<\/title>/i);
  assert.match(html, /Explain why a reliable baseline matters/);
  assert.match(html, />Library<\/button>/);
  assert.match(html, />Speaking/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps P0 Library content separate and documented", async () => {
  const [page, app, data, policy, spec, changelog] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url),"utf8"),
    readFile(new URL("../app/LearningApp.tsx", import.meta.url),"utf8"),
    readFile(new URL("../app/data/p0-library.ts", import.meta.url),"utf8"),
    readFile(new URL("../docs/english-system/library-maintenance-policy.md", import.meta.url),"utf8"),
    readFile(new URL("../docs/english-system/p0-library-spec.md", import.meta.url),"utf8"),
    readFile(new URL("../docs/english-system/library-changelog.md", import.meta.url),"utf8"),
  ]);
  assert.match(page, /<LearningApp \/>/);
  assert.match(app, /appendedVocabulary/);
  assert.match(app, /appendedPatterns/);
  assert.match(app, /speakingTasks/);
  assert.match(data, /export const relationships/);
  assert.match(policy, /append-first/i);
  assert.match(policy, /Deletion always requires owner approval/i);
  assert.match(spec, /150–200/);
  assert.match(changelog, /Deleted[\s\S]*None\./);
  await access(new URL("../scripts/validate-p0-library.mjs", import.meta.url));
});
