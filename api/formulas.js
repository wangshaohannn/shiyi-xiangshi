import { createId, methodNotAllowed, sanitizeText, updateDb } from "./_shared.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    methodNotAllowed(res);
    return;
  }

  const formula = {
    id: createId("formula"),
    name: sanitizeText(req.body?.name, 80),
    format: sanitizeText(req.body?.format, 20),
    mood: sanitizeText(req.body?.mood, 20),
    total: Number(req.body?.total || 0),
    mix: sanitizeText(req.body?.mix, 300),
    createdAt: new Date().toISOString(),
  };

  if (!formula.name) {
    res.status(400).json({ error: "香方名称不能为空" });
    return;
  }

  await updateDb((db) => {
    db.formulas.unshift(formula);
  });
  res.status(201).json({ formula });
}
