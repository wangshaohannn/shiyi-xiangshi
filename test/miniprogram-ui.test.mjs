import assert from "node:assert/strict";
import { access, readdir, readFile, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../miniprogram/", import.meta.url);

async function read(path) {
  return readFile(new URL(path, root), "utf8");
}

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const child = new URL(entry.name, `${dir.href}${dir.href.endsWith("/") ? "" : "/"}`);
    return entry.isDirectory() ? listFiles(child) : child;
  }));
  return files.flat();
}

async function exists(path) {
  try {
    await access(new URL(path, root));
    return true;
  } catch {
    return false;
  }
}

test("mini program uses the premium Shiyi visual system", async () => {
  const appWxss = await read("app.wxss");
  const homeWxml = await read("pages/home/home.wxml");
  const shopWxml = await read("pages/shop/shop.wxml");
  const makerWxml = await read("pages/maker/maker.wxml");
  const bookingWxml = await read("pages/booking/booking.wxml");
  const profileWxml = await read("pages/profile/profile.wxml");

  assert.match(appWxss, /--paper/);
  assert.match(appWxss, /\.section-head/);
  assert.match(appWxss, /\.gold-rule/);
  assert.match(appWxss, /\.soft-panel/);
  assert.match(homeWxml, /class="hero-proof"/);
  assert.match(homeWxml, /class="quick-grid"/);
  assert.match(shopWxml, /class="shop-summary"/);
  assert.match(shopWxml, /class="selected-proof"/);
  assert.match(makerWxml, /class="scent-orbit"/);
  assert.match(bookingWxml, /class="booking-summary"/);
  assert.match(profileWxml, /class="profile-ledger"/);
});

test("mini program layout is guarded for narrow and safe-area screens", async () => {
  const appWxss = await read("app.wxss");
  const homeWxss = await read("pages/home/home.wxss");
  const shopWxss = await read("pages/shop/shop.wxss");
  const makerWxss = await read("pages/maker/maker.wxss");
  const bookingWxss = await read("pages/booking/booking.wxss");
  const profileWxss = await read("pages/profile/profile.wxss");

  assert.match(appWxss, /box-sizing:\s*border-box/);
  assert.match(appWxss, /padding-bottom:\s*120rpx/);
  assert.doesNotMatch(`${homeWxss}\n${shopWxss}\n${makerWxss}\n${bookingWxss}\n${profileWxss}`, /repeat\((3|4),\s*1fr\)/);
  assert.match(homeWxss, /\.hero-title[\s\S]*font-size:\s*76rpx/);
  assert.match(homeWxss, /\.hero-content[\s\S]*min-height:\s*620rpx/);
  assert.match(shopWxss, /\.product-row[\s\S]*display:\s*flex/);
  assert.match(makerWxss, /\.ratio-grid[\s\S]*display:\s*flex/);
  assert.match(profileWxss, /\.profile-ledger[\s\S]*display:\s*flex/);
});

test("mini program upload package stays below the warning threshold", async () => {
  const files = await listFiles(root);
  const totalBytes = await files.reduce(async (sumPromise, file) => {
    const sum = await sumPromise;
    return sum + (await stat(file)).size;
  }, Promise.resolve(0));

  assert.ok(totalBytes < 1.5 * 1024 * 1024, `mini program package is ${(totalBytes / 1024 / 1024).toFixed(2)} MiB`);
});

test("mini program project settings favor simulator stability", async () => {
  const project = JSON.parse(await read("project.config.json"));
  const app = JSON.parse(await read("app.json"));
  const setting = project.setting;
  const ignored = project.packOptions.ignore.map((entry) => `${entry.type}:${entry.value}`);

  assert.equal(setting.es6, true);
  assert.equal(setting.enhance, false);
  assert.equal(setting.postcss, true);
  assert.equal(setting.minified, false);
  assert.equal(setting.minifyWXSS, false);
  assert.equal(setting.minifyWXML, false);
  assert.equal(setting.uploadWithSourceMap, false);
  assert.equal(setting.ignoreDevUnusedFiles, true);
  assert.equal(project.projectArchitecture, undefined);
  assert.equal(project.simulatorPluginLibVersion, undefined);
  assert.equal(app.lazyCodeLoading, "requiredComponents");
  assert.ok(ignored.includes("suffix:.map"));
});

test("mini program upload root does not keep dev-only files that trigger ignored-file notices", async () => {
  const devOnlyPaths = [
    "README.md",
    "app.miniapp.json",
    "project.miniapp.json",
    "project.private.config.json",
    "i18n/base.json",
  ];

  for (const path of devOnlyPaths) {
    assert.equal(await exists(path), false, `${path} should live outside the miniprogram upload root`);
  }
});

test("mini program does not call deprecated system info APIs", async () => {
  const files = await listFiles(root);
  const sourceFiles = files.filter((file) => /\.(js|wxml|wxss|json)$/i.test(file.pathname));
  const source = await Promise.all(sourceFiles.map((file) => readFile(file, "utf8")));

  assert.doesNotMatch(source.join("\n"), /getSystemInfo(?:Sync)?\s*\(/);
});

test("mini program local media resources stay below the recommended single-file size", async () => {
  const assetFiles = (await listFiles(new URL("assets/", root)))
    .filter((file) => /\.(jpe?g|png|webp|gif|svg|mp3|m4a|aac|wav|ogg|mp4|mov)$/i.test(file.pathname));

  for (const file of assetFiles) {
    const size = (await stat(file)).size;
    assert.ok(size < 200 * 1024, `${file.pathname.split("/").pop()} is ${(size / 1024).toFixed(1)} KiB`);
  }
});

test("mini program local media resources stay below the upload audit total", async () => {
  const assetFiles = (await listFiles(new URL("assets/", root)))
    .filter((file) => /\.(jpe?g|png|webp|gif|svg|mp3|m4a|aac|wav|ogg|mp4|mov)$/i.test(file.pathname));
  const totalBytes = await assetFiles.reduce(async (sumPromise, file) => {
    const sum = await sumPromise;
    return sum + (await stat(file)).size;
  }, Promise.resolve(0));

  assert.ok(totalBytes < 200 * 1024, `local media resources are ${(totalBytes / 1024).toFixed(1)} KiB`);
});

test("mini program defers page data injection until pages need it", async () => {
  const appJs = await read("app.js");
  const homeJs = await read("pages/home/home.js");
  const shopJs = await read("pages/shop/shop.js");
  const makerJs = await read("pages/maker/maker.js");
  const profileJs = await read("pages/profile/profile.js");

  assert.doesNotMatch(appJs, /data\/catalog|getApp\(\)\.globalData/);
  assert.doesNotMatch(appJs, /getStorageSync|setStorageSync/);
  assert.match(homeJs, /require\("\.\.\/\.\.\/data\/products"\)/);
  assert.match(shopJs, /require\("\.\.\/\.\.\/data\/products"\)/);
  assert.match(makerJs, /require\("\.\.\/\.\.\/data\/atelier"\)/);
  assert.match(profileJs, /require\("\.\.\/\.\.\/data\/contact"\)/);
});

test("mini program source avoids syntax that injects missing babel runtime helpers", async () => {
  const files = await listFiles(root);
  const jsFiles = files.filter((file) => /\.js$/i.test(file.pathname));
  const source = await Promise.all(jsFiles.map((file) => readFile(file, "utf8")));
  const combined = source.join("\n");

  assert.doesNotMatch(combined, /\.\.\./);
  assert.doesNotMatch(combined, /=>/);
  assert.doesNotMatch(combined, /const\s+\{/);
  assert.doesNotMatch(combined, /let\s+\{/);
  assert.doesNotMatch(combined, /setData\(\s*\{\s*\[/);
  assert.doesNotMatch(combined, /\?\?/);
});

test("mini program pages register before loading optional page data", async () => {
  const pageFiles = [
    "pages/home/home.js",
    "pages/shop/shop.js",
    "pages/maker/maker.js",
    "pages/profile/profile.js",
  ];

  for (const file of pageFiles) {
    const source = await read(file);
    const pageIndex = source.indexOf("Page({");
    const requireIndex = source.indexOf("require(");
    assert.ok(pageIndex >= 0, `${file} should register a Page`);
    assert.ok(requireIndex === -1 || requireIndex > pageIndex, `${file} should not require data before Page registration`);
  }
});

test("mini program simulator styles avoid timeout-prone CSS features", async () => {
  const files = await listFiles(root);
  const styleFiles = files.filter((file) => /\.(wxss|wxml)$/i.test(file.pathname));
  const source = await Promise.all(styleFiles.map((file) => readFile(file, "utf8")));
  const combined = source.join("\n");

  assert.doesNotMatch(combined, /display:\s*grid/);
  assert.doesNotMatch(combined, /grid-template/);
  assert.doesNotMatch(combined, /minmax\(/);
  assert.doesNotMatch(combined, /(?:linear|radial|repeating-linear)-gradient/);
  assert.doesNotMatch(combined, /calc\(/);
  assert.doesNotMatch(combined, /env\(/);
  assert.doesNotMatch(combined, /constant\(/);
  assert.doesNotMatch(combined, /inset:/);
  assert.doesNotMatch(combined, /\senhanced(?:\s|>)/);
});
