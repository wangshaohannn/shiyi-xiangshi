import { createOrderFromBody, methodNotAllowed, updateDb } from "./_shared.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    methodNotAllowed(res);
    return;
  }

  const result = await updateDb((db) => {
    return createOrderFromBody(db, req.body);
  });

  if (result.error) {
    res.status(400).json({ error: result.error });
    return;
  }

  res.status(201).json(result);
}
