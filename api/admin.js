import { adminDashboard, methodNotAllowed, readDb, requireAdmin, updateAdminResource, updateDb } from "./_shared.js";

export default async function handler(req, res) {
  const auth = requireAdmin(req);
  if (!auth.ok) {
    res.status(auth.status).json({ error: auth.error });
    return;
  }

  if (req.method === "GET") {
    const db = await readDb();
    res.status(200).json({ dashboard: adminDashboard(db) });
    return;
  }

  if (req.method === "PATCH" || req.method === "POST") {
    const result = await updateDb((db) => updateAdminResource(db, req.body));
    if (result.error) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.status(200).json(result);
    return;
  }

  methodNotAllowed(res);
}
