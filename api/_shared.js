import { assertRuntimeEnv } from "../config/env.js";

assertRuntimeEnv();

export { getStorageMode, readDb, updateDb } from "./storage.js";

export function createId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function sanitizeText(value, maxLength = 200) {
  return String(value || "").trim().slice(0, maxLength);
}

export function sanitizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function headerValue(req, name) {
  const headers = req?.headers || {};
  const lowerName = name.toLowerCase();
  const value = headers[name] || headers[lowerName];
  return Array.isArray(value) ? value[0] : value;
}

export function adminToken() {
  if (process.env.ADMIN_TOKEN) return process.env.ADMIN_TOKEN;
  return process.env.NODE_ENV === "production" ? "" : "dev-admin";
}

export function requireAdmin(req) {
  const configuredToken = adminToken();
  if (!configuredToken) {
    return { ok: false, status: 503, error: "后台未配置管理员口令" };
  }

  const headerToken = headerValue(req, "x-admin-token");
  const authorization = headerValue(req, "authorization") || "";
  const bearerToken = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const token = headerToken || bearerToken;

  if (token !== configuredToken) {
    return { ok: false, status: 401, error: "管理员口令不正确" };
  }

  return { ok: true };
}

export function publicDb(db) {
  return {
    products: db.products,
    notes: db.notes.slice(0, 12),
    member: db.members[0],
  };
}

export function normalizeOrderItems(items) {
  if (!Array.isArray(items)) return [];

  const quantities = new Map();
  items.forEach((item) => {
    const id = sanitizeText(typeof item === "string" ? item : item?.id, 80);
    const quantity = Math.max(1, Math.min(Math.floor(sanitizeNumber(item?.quantity, 1)), 99));
    if (!id) return;
    quantities.set(id, Math.min((quantities.get(id) || 0) + quantity, 99));
  });

  return Array.from(quantities, ([id, quantity]) => ({ id, quantity }));
}

export function createOrderFromBody(db, body = {}) {
  const requestedItems = normalizeOrderItems(body.items);
  if (!requestedItems.length) {
    return { error: "请先选择产品" };
  }

  const customer = {
    name: sanitizeText(body.customer?.name || body.name, 40),
    contact: sanitizeText(body.customer?.contact || body.contact, 80),
    deliveryMethod: sanitizeText(body.customer?.deliveryMethod || body.deliveryMethod || "到店自提", 30),
    address: sanitizeText(body.customer?.address || body.address, 160),
  };

  if (!customer.contact) {
    return { error: "请留下联系方式" };
  }

  const orderItems = [];
  for (const item of requestedItems) {
    const product = db.products.find((entry) => entry.id === item.id);
    if (!product) {
      return { error: "部分商品已下架，请刷新后重试" };
    }

    const stock = Math.max(0, Math.floor(sanitizeNumber(product.stock, 0)));
    if (item.quantity > stock) {
      return { error: `${product.name} 库存不足，仅剩 ${stock} 件` };
    }

    orderItems.push({
      id: product.id,
      name: product.name,
      spec: product.spec,
      price: product.price,
      quantity: item.quantity,
      subtotal: product.price * item.quantity,
    });
  }

  const total = orderItems.reduce((sum, product) => sum + product.subtotal, 0);
  const order = {
    id: createId("order"),
    items: orderItems,
    total,
    customer,
    paymentMethod: sanitizeText(body.paymentMethod || "线下确认 / 微信 / 支付宝", 40),
    note: sanitizeText(body.note, 180),
    status: "pending_confirmation",
    createdAt: new Date().toISOString(),
  };

  orderItems.forEach((item) => {
    const product = db.products.find((entry) => entry.id === item.id);
    product.stock = Math.max(0, Math.floor(sanitizeNumber(product.stock, 0)) - item.quantity);
  });

  db.orders.unshift(order);
  db.members[0].points += Math.floor(total / 10);
  return { order, member: db.members[0], products: db.products };
}

export function createBookingFromBody(body = {}) {
  const people = Math.floor(sanitizeNumber(body.people, 1));
  const booking = {
    id: createId("booking"),
    service: sanitizeText(body.service, 80),
    date: sanitizeText(body.date, 30),
    time: sanitizeText(body.time || "到店后确认", 30),
    people,
    name: sanitizeText(body.name, 40),
    contact: sanitizeText(body.contact, 80),
    note: sanitizeText(body.note, 180),
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  if (!booking.service || !booking.date || !booking.contact) {
    return { error: "预约信息不完整" };
  }

  if (booking.people < 1 || booking.people > 30) {
    return { error: "预约人数需在 1-30 人之间" };
  }

  const today = new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(booking.date) || booking.date < today) {
    return { error: "预约日期不能早于今天" };
  }

  return { booking };
}

export function createBookingForAdmin(db, body = {}) {
  const result = createBookingFromBody(body);
  if (result.error) return result;

  db.bookings = db.bookings || [];
  db.bookings.unshift(result.booking);
  return { booking: result.booking, dashboard: adminDashboard(db) };
}

function statusCounts(records = []) {
  return records.reduce((acc, record) => {
    const status = record.status || "unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
}

function normalizeAdminOrder(order) {
  const items = Array.isArray(order.items) ? order.items : [];
  return {
    ...order,
    customer: order.customer || { name: "", contact: "", deliveryMethod: "", address: "" },
    items: items.map((item) => ({
      ...item,
      quantity: Math.max(1, Math.floor(sanitizeNumber(item.quantity, 1))),
      subtotal: sanitizeNumber(item.subtotal, sanitizeNumber(item.price, 0) * Math.max(1, Math.floor(sanitizeNumber(item.quantity, 1)))),
    })),
  };
}

export function adminDashboard(db) {
  const orders = (db.orders || []).slice(0, 50).map(normalizeAdminOrder);
  const bookings = (db.bookings || []).slice(0, 50);
  const products = db.products || [];
  const notes = (db.notes || []).slice(0, 50);
  const formulas = (db.formulas || []).slice(0, 50);
  const members = db.members || [];
  const revenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + sanitizeNumber(order.total, 0), 0);

  return {
    metrics: {
      products: products.length,
      lowStock: products.filter((product) => sanitizeNumber(product.stock, 0) <= 8).length,
      orders: orders.length,
      pendingOrders: orders.filter((order) => ["created", "pending_confirmation"].includes(order.status)).length,
      bookings: bookings.length,
      pendingBookings: bookings.filter((booking) => booking.status === "pending").length,
      revenue,
      notes: notes.length,
      formulas: formulas.length,
      members: members.length,
    },
    products,
    orders,
    bookings,
    notes,
    formulas,
    members,
    orderStatusCounts: statusCounts(db.orders || []),
    bookingStatusCounts: statusCounts(db.bookings || []),
  };
}

export function updateAdminResource(db, body = {}) {
  const type = sanitizeText(body.type, 30);
  const id = sanitizeText(body.id, 100);
  const fields = body.fields || {};

  if (!type || !id) {
    return { error: "缺少更新对象" };
  }

  if (type === "product") {
    const product = db.products.find((item) => item.id === id);
    if (!product) return { error: "商品不存在" };

    const price = sanitizeNumber(fields.price, product.price);
    const stock = sanitizeNumber(fields.stock, product.stock);
    product.name = sanitizeText(fields.name ?? product.name, 80);
    product.category = sanitizeText(fields.category ?? product.category, 40);
    product.categoryLabel = sanitizeText(fields.categoryLabel ?? product.categoryLabel, 40);
    product.spec = sanitizeText(fields.spec ?? product.spec, 60);
    product.image = sanitizeText(fields.image ?? product.image, 180);
    product.price = Math.max(0, Math.round(price));
    product.stock = Math.max(0, Math.floor(stock));
    product.note = sanitizeText(fields.note ?? product.note, 40);
    product.desc = sanitizeText(fields.desc ?? product.desc, 300);
    return { product, dashboard: adminDashboard(db) };
  }

  if (type === "order") {
    const order = db.orders.find((item) => item.id === id);
    if (!order) return { error: "订单不存在" };

    const allowed = ["created", "pending_confirmation", "confirmed", "paid", "fulfilled", "cancelled"];
    const status = sanitizeText(fields.status, 40);
    if (!allowed.includes(status)) return { error: "订单状态不支持" };
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return { order: normalizeAdminOrder(order), dashboard: adminDashboard(db) };
  }

  if (type === "booking") {
    const booking = db.bookings.find((item) => item.id === id);
    if (!booking) return { error: "预约不存在" };

    const allowed = ["pending", "confirmed", "completed", "cancelled"];
    const status = sanitizeText(fields.status, 40);
    if (!allowed.includes(status)) return { error: "预约状态不支持" };
    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    return { booking, dashboard: adminDashboard(db) };
  }

  if (type === "note") {
    db.notes = db.notes || [];
    const index = db.notes.findIndex((item) => item.id === id);
    if (index < 0) return { error: "笔记不存在" };

    if (sanitizeText(fields.action, 20) === "delete") {
      const [note] = db.notes.splice(index, 1);
      return { note, dashboard: adminDashboard(db) };
    }

    const note = db.notes[index];
    note.content = sanitizeText(fields.content ?? note.content, 120);
    if (!note.content) return { error: "笔记不能为空" };
    note.updatedAt = new Date().toISOString();
    return { note, dashboard: adminDashboard(db) };
  }

  if (type === "formula") {
    db.formulas = db.formulas || [];
    const index = db.formulas.findIndex((item) => item.id === id);
    if (index < 0) return { error: "香方不存在" };

    if (sanitizeText(fields.action, 20) === "delete") {
      const [formula] = db.formulas.splice(index, 1);
      return { formula, dashboard: adminDashboard(db) };
    }

    const formula = db.formulas[index];
    formula.name = sanitizeText(fields.name ?? formula.name, 80);
    formula.mix = sanitizeText(fields.mix ?? formula.mix, 300);
    formula.updatedAt = new Date().toISOString();
    return { formula, dashboard: adminDashboard(db) };
  }

  if (type === "member") {
    db.members = db.members || [];
    if (sanitizeText(fields.action, 20) === "create") {
      const member = {
        id: createId("member"),
        name: sanitizeText(fields.name, 60),
        level: sanitizeText(fields.level || "初香", 40),
        points: Math.max(0, Math.floor(sanitizeNumber(fields.points, 0))),
        createdAt: new Date().toISOString(),
      };
      if (!member.name) return { error: "会员名称不能为空" };
      db.members.unshift(member);
      return { member, dashboard: adminDashboard(db) };
    }

    const member = db.members.find((item) => item.id === id);
    if (!member) return { error: "会员不存在" };

    member.name = sanitizeText(fields.name ?? member.name, 60);
    member.level = sanitizeText(fields.level ?? member.level, 40);
    member.points = Math.max(0, Math.floor(sanitizeNumber(fields.points, member.points)));
    member.updatedAt = new Date().toISOString();
    return { member, dashboard: adminDashboard(db) };
  }

  return { error: "更新类型不支持" };
}

export function methodNotAllowed(res) {
  res.status(405).json({ error: "请求方法不支持" });
}
