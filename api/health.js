import { getStorageMode, methodNotAllowed } from "./_shared.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    methodNotAllowed(res);
    return;
  }

  res.status(200).json({ ok: true, service: "shiyi-vercel-api", storage: getStorageMode() });
}
