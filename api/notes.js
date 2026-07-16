import { createId, readDb, sanitizeText, updateDb } from "./_shared.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const db = await readDb();
    res.status(200).json({ notes: db.notes.slice(0, 20) });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "请求方法不支持" });
    return;
  }

  const note = {
    id: createId("note"),
    content: sanitizeText(req.body?.content, 80),
    createdAt: new Date().toISOString(),
  };

  if (!note.content) {
    res.status(400).json({ error: "笔记不能为空" });
    return;
  }

  const notes = await updateDb((db) => {
    db.notes.unshift(note);
    db.notes = db.notes.slice(0, 50);
    return db.notes.slice(0, 20);
  });
  res.status(201).json({ note, notes });
}
