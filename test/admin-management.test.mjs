import assert from "node:assert/strict";
import test from "node:test";
import { adminDashboard, createBookingForAdmin, updateAdminResource } from "../api/_shared.js";

function sampleDb() {
  return {
    products: [
      {
        id: "bodhi",
        name: "菩提心",
        category: "ritual",
        categoryLabel: "香道香",
        spec: "21cm * 10g",
        price: 420,
        stock: 18,
        image: "/assets/docx-product/image6.jpeg",
        note: "海南清韵",
        desc: "清雅花果与蜜香。",
      },
    ],
    orders: [],
    bookings: [],
    notes: [{ id: "note-1", content: "夜读很安静。", createdAt: "2026-06-07T00:00:00.000Z" }],
    formulas: [{ id: "formula-1", name: "茶岚", mix: "沉香6份", createdAt: "2026-06-08T00:00:00.000Z" }],
    members: [{ id: "guest", name: "访客会员", points: 84, level: "初香" }],
  };
}

test("admin dashboard exposes content and member records", () => {
  const dashboard = adminDashboard(sampleDb());

  assert.equal(dashboard.notes.length, 1);
  assert.equal(dashboard.formulas.length, 1);
  assert.equal(dashboard.members.length, 1);
});

test("admin can edit full product listing details", () => {
  const db = sampleDb();
  const result = updateAdminResource(db, {
    type: "product",
    id: "bodhi",
    fields: {
      name: "菩提心升级版",
      category: "gift",
      categoryLabel: "礼品香",
      spec: "10cm * 20g",
      price: 520,
      stock: 9,
      image: "/assets/docx-product/image8.jpeg",
      note: "清甜礼赠",
      desc: "适合礼赠与静坐。",
    },
  });

  assert.equal(result.product.name, "菩提心升级版");
  assert.equal(result.product.category, "gift");
  assert.equal(result.product.categoryLabel, "礼品香");
  assert.equal(result.product.spec, "10cm * 20g");
  assert.equal(result.product.image, "/assets/docx-product/image8.jpeg");
  assert.equal(result.product.desc, "适合礼赠与静坐。");
});

test("front desk booking creation appears in admin dashboard", () => {
  const db = sampleDb();
  const futureDate = new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10);

  const result = createBookingForAdmin(db, {
    service: "DIY 制香体验 ¥98/人",
    date: futureDate,
    time: "14:00-16:00",
    people: "3",
    name: "高先生",
    contact: "wx-shiyi",
    note: "想周末到店体验",
  });

  assert.equal(result.booking.contact, "wx-shiyi");
  assert.equal(result.dashboard.metrics.bookings, 1);
  assert.equal(result.dashboard.metrics.pendingBookings, 1);
  assert.equal(result.dashboard.bookings[0].id, result.booking.id);
  assert.equal(result.dashboard.bookings[0].note, "想周末到店体验");
});

test("admin can update and delete notes", () => {
  const db = sampleDb();

  const updated = updateAdminResource(db, {
    type: "note",
    id: "note-1",
    fields: { content: "夜读点菩提心，清甜安静。" },
  });
  assert.equal(updated.note.content, "夜读点菩提心，清甜安静。");

  const deleted = updateAdminResource(db, {
    type: "note",
    id: "note-1",
    fields: { action: "delete" },
  });
  assert.equal(deleted.dashboard.notes.length, 0);
});

test("admin can delete formulas and edit member level", () => {
  const db = sampleDb();

  const member = updateAdminResource(db, {
    type: "member",
    id: "guest",
    fields: { points: 120, level: "闻香" },
  });
  assert.equal(member.member.points, 120);
  assert.equal(member.member.level, "闻香");

  const formula = updateAdminResource(db, {
    type: "formula",
    id: "formula-1",
    fields: { action: "delete" },
  });
  assert.equal(formula.dashboard.formulas.length, 0);
}
);

test("admin can create a new member", () => {
  const db = sampleDb();

  const result = updateAdminResource(db, {
    type: "member",
    id: "new",
    fields: { action: "create", name: "林小姐", level: "闻香", points: "36" },
  });

  assert.equal(result.member.name, "林小姐");
  assert.equal(result.member.level, "闻香");
  assert.equal(result.member.points, 36);
  assert.match(result.member.id, /^member-/);
  assert.equal(result.dashboard.members.length, 2);
});
