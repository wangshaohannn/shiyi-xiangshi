import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("admin dashboard exposes clickable category sections", async () => {
  const jsx = await readFile(new URL("../src/main.jsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(jsx, /activeAdminSection/);
  assert.match(jsx, /adminSectionCards/);
  assert.match(jsx, /admin-section-nav/);
  assert.match(jsx, /setActiveAdminSection\(section\.id\)/);
  assert.match(jsx, /activeAdminSection === "orders"/);
  assert.match(jsx, /activeAdminSection === "bookings"/);
  assert.match(css, /\.admin-section-nav/);
  assert.match(css, /\.admin-section-card/);
  assert.match(css, /\.admin-panel-view/);
});

test("member management includes a create-member form", async () => {
  const jsx = await readFile(new URL("../src/main.jsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(jsx, /createMember/);
  assert.match(jsx, /新增会员/);
  assert.match(jsx, /name="memberName"/);
  assert.match(jsx, /name="memberLevel"/);
  assert.match(jsx, /name="memberPoints"/);
  assert.match(css, /\.admin-create-card/);
});
