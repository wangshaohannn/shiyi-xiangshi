import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("routed pages use a premium atelier page treatment", async () => {
  const jsx = await readFile(new URL("../src/main.jsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(jsx, /sitePageDetails/);
  assert.match(jsx, /route-hero/);
  assert.match(jsx, /route-page-title/);
  assert.match(jsx, /routed-section/);
  assert.match(css, /\.route-hero/);
  assert.match(css, /\.route-page-title/);
  assert.match(css, /\.routed-section/);
  assert.match(css, /linear-gradient\(90deg,\s*transparent,\s*rgba\(181,\s*138,\s*67,\s*0\.5\),\s*transparent\)/);
});
