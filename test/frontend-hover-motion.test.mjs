import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

function cssBlock(source, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = source.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`));
  return match?.[1] || "";
}

test("signature card hover uses subtle glow instead of sweeping image motion", async () => {
  const css = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
  const stackAfter = cssBlock(css, ".signature-stack::after");
  const stackAfterHover = cssBlock(css, ".hero-feature:hover .signature-stack::after");
  const imageHover = cssBlock(css, ".hero-feature:hover .signature-stack img");

  assert.doesNotMatch(stackAfter, /translateX/);
  assert.doesNotMatch(stackAfterHover, /translateX/);
  assert.match(stackAfter, /opacity:\s*0/);
  assert.match(stackAfterHover, /opacity:\s*1/);
  assert.match(imageHover, /scale\(1\.012\)/);
});
