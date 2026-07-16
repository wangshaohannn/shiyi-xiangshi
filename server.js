import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  adminDashboard,
  createBookingForAdmin,
  createId,
  createOrderFromBody,
  getStorageMode,
  publicDb,
  readDb,
  requireAdmin,
  sanitizeText,
  updateAdminResource,
  updateDb,
} from "./api/_shared.js";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(rootDir, "dist");
const port = Number(process.env.PORT || 8787);
const host = process.env.HOST || "0.0.0.0";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

function sendError(res, status, message) {
  sendJson(res, status, { error: message });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        req.destroy();
        reject(new Error("请求内容过大"));
      }
    });
    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("JSON 格式不正确"));
      }
    });
  });
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(res, 200, { ok: true, service: "shiyi-backend", storage: getStorageMode() });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/bootstrap") {
    const db = await readDb();
    sendJson(res, 200, publicDb(db));
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/products") {
    const db = await readDb();
    const category = url.searchParams.get("category");
    const products = category && category !== "all" ? db.products.filter((product) => product.category === category) : db.products;
    sendJson(res, 200, { products });
    return;
  }

  if (url.pathname === "/api/admin") {
    const auth = requireAdmin(req);
    if (!auth.ok) {
      sendError(res, auth.status, auth.error);
      return;
    }

    if (req.method === "GET") {
      const db = await readDb();
      sendJson(res, 200, { dashboard: adminDashboard(db) });
      return;
    }

    if (req.method === "PATCH" || req.method === "POST") {
      const body = await parseBody(req);
      const result = await updateDb((db) => updateAdminResource(db, body));
      if (result.error) {
        sendError(res, 400, result.error);
        return;
      }
      sendJson(res, 200, result);
      return;
    }

    sendError(res, 405, "请求方法不支持");
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/orders") {
    const body = await parseBody(req);
    const result = await updateDb((db) => {
      return createOrderFromBody(db, body);
    });

    if (result.error) {
      sendError(res, 400, result.error);
      return;
    }

    sendJson(res, 201, result);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/bookings") {
    const body = await parseBody(req);
    const result = await updateDb((db) => createBookingForAdmin(db, body));
    if (result.error) {
      sendError(res, 400, result.error);
      return;
    }

    sendJson(res, 201, result);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/formulas") {
    const body = await parseBody(req);
    const formula = {
      id: createId("formula"),
      name: sanitizeText(body.name, 80),
      format: sanitizeText(body.format, 20),
      mood: sanitizeText(body.mood, 20),
      total: Number(body.total || 0),
      mix: sanitizeText(body.mix, 300),
      createdAt: new Date().toISOString(),
    };

    if (!formula.name) {
      sendError(res, 400, "香方名称不能为空");
      return;
    }

    await updateDb((db) => {
      db.formulas.unshift(formula);
    });
    sendJson(res, 201, { formula });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/notes") {
    const db = await readDb();
    sendJson(res, 200, { notes: db.notes.slice(0, 20) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/notes") {
    const body = await parseBody(req);
    const note = {
      id: createId("note"),
      content: sanitizeText(body.content, 80),
      createdAt: new Date().toISOString(),
    };

    if (!note.content) {
      sendError(res, 400, "笔记不能为空");
      return;
    }

    const notes = await updateDb((db) => {
      db.notes.unshift(note);
      db.notes = db.notes.slice(0, 50);
      return db.notes.slice(0, 20);
    });
    sendJson(res, 201, { note, notes });
    return;
  }

  sendError(res, 404, "接口不存在");
}

function serveStatic(req, res, url) {
  const publicRoot = fs.existsSync(path.join(distDir, "index.html")) ? distDir : rootDir;
  const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  let filePath = path.normalize(path.join(publicRoot, pathname));

  if (!filePath.startsWith(publicRoot)) {
    sendError(res, 403, "禁止访问");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      const rootAssetPath = path.normalize(path.join(rootDir, pathname));
      if (rootAssetPath.startsWith(rootDir) && fs.existsSync(rootAssetPath) && fs.statSync(rootAssetPath).isFile()) {
        const type = mimeTypes[path.extname(rootAssetPath).toLowerCase()] || "application/octet-stream";
        res.writeHead(200, {
          "Content-Type": type,
          "Cache-Control": "no-cache",
        });
        res.end(fs.readFileSync(rootAssetPath));
        return;
      }
      const fallback = path.join(publicRoot, "index.html");
      fs.readFile(fallback, (fallbackError, fallbackData) => {
        if (fallbackError) {
          sendError(res, 404, "文件不存在");
          return;
        }
        res.writeHead(200, {
          "Content-Type": mimeTypes[".html"],
          "Cache-Control": "no-cache",
        });
        res.end(fallbackData);
      });
      return;
    }
    const type = mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": type,
      "Cache-Control": "no-cache",
    });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }
    serveStatic(req, res, url);
  } catch (error) {
    sendError(res, 500, error.message || "服务器错误");
  }
});

server.listen(port, host, () => {
  console.log(`拾壹香室后端已启动: http://${host}:${port}`);
});
