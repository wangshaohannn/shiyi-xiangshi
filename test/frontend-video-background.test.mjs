import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("hero uses the supplied mp4 as a muted looping background animation", async () => {
  const jsx = await readFile(new URL("../src/main.jsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(jsx, /className="hero-background-video"/);
  assert.match(jsx, /src=\{assetUrl\("assets\/shiyi-ambient-background\.mp4"\)\}/);
  assert.match(jsx, /autoPlay/);
  assert.match(jsx, /muted/);
  assert.match(jsx, /loop/);
  assert.match(jsx, /playsInline/);
  assert.match(css, /\.hero-background-video/);
  assert.match(css, /object-fit:\s*cover/);
  await access(new URL("../public/assets/shiyi-ambient-background.mp4", import.meta.url));
});
