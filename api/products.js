import { methodNotAllowed, readDb } from "./_shared.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    methodNotAllowed(res);
    return;
  }

  const db = await readDb();
  const { category } = req.query;
  const products = category && category !== "all" ? db.products.filter((product) => product.category === category) : db.products;
  res.status(200).json({ products });
}
