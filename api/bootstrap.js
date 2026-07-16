import { methodNotAllowed, publicDb, readDb } from "./_shared.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    methodNotAllowed(res);
    return;
  }

  const db = await readDb();
  res.status(200).json(publicDb(db));
}
