import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("main navigation switches site pages without hash anchor scrolling", async () => {
  const source = await readFile(new URL("../src/main.jsx", import.meta.url), "utf8");

  assert.match(source, /sitePages/);
  assert.match(source, /activeSitePage/);
  assert.match(source, /navigateSitePage/);
  assert.match(source, /aria-current=\{activeSitePage === page\.id \? "page" : undefined\}/);
  assert.doesNotMatch(source, /href=\{`#\$\{\{ 品牌:/);
});

test("mobile quick navigation includes a home entry", async () => {
  const jsx = await readFile(new URL("../src/main.jsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(jsx, /<Home size=\{17\} \/>/);
  assert.match(jsx, /首页/);
  assert.match(jsx, /activeSitePage === "brand" \? "page" : undefined/);
  assert.match(css, /grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\)/);
});
