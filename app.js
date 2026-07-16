const ingredients = [
  { id: "agarwood", name: "沉香", note: "深木、安定、留香", value: 6, profile: { fresh: 1, wood: 5, warm: 3, sweet: 1 } },
  { id: "sandalwood", name: "檀木", note: "温润、木质、底韵", value: 7, profile: { fresh: 1, wood: 4, warm: 4, sweet: 2 } },
  { id: "benzoin", name: "安息香", note: "树脂、甜润、圆融", value: 4, profile: { fresh: 1, wood: 1, warm: 4, sweet: 5 } },
  { id: "clove", name: "丁香", note: "辛暖、醒神、扩散", value: 2, profile: { fresh: 1, wood: 1, warm: 5, sweet: 2 } },
  { id: "lotus", name: "莲房", note: "清苦、草本、收束", value: 4, profile: { fresh: 5, wood: 1, warm: 1, sweet: 1 } },
  { id: "tea", name: "白茶", note: "清雅、微甜、轻盈", value: 5, profile: { fresh: 5, wood: 1, warm: 1, sweet: 3 } },
  { id: "rose", name: "玫瑰", note: "花香、柔和、明亮", value: 3, profile: { fresh: 3, wood: 0, warm: 1, sweet: 5 } },
  { id: "binder", name: "楠木粘粉", note: "成型、燃烧、承托", value: 2, profile: { fresh: 0, wood: 2, warm: 1, sweet: 0 } },
];

const moodPresets = {
  静坐: { agarwood: 7, sandalwood: 7, benzoin: 4, clove: 1, lotus: 4, tea: 4, rose: 1, binder: 2 },
  夜读: { agarwood: 4, sandalwood: 6, benzoin: 3, clove: 2, lotus: 2, tea: 7, rose: 2, binder: 2 },
  会客: { agarwood: 3, sandalwood: 5, benzoin: 5, clove: 1, lotus: 2, tea: 4, rose: 6, binder: 2 },
  晨起: { agarwood: 2, sandalwood: 4, benzoin: 2, clove: 3, lotus: 5, tea: 8, rose: 3, binder: 2 },
};

const formulaNames = {
  fresh: ["茶岚", "晓露", "青枝", "素醒"],
  wood: ["松月", "静林", "沉山", "檀影"],
  warm: ["暖篆", "朱火", "南窗", "煦尘"],
  sweet: ["花信", "蜜息", "柔云", "月白"],
};

const fallbackProducts = [
  {
    id: "nha-trang",
    name: "芽庄沉香",
    category: "daily",
    categoryLabel: "日用香",
    spec: "21cm * 10g",
    price: 118,
    stock: 36,
    image: "/assets/docx-product/image11.jpeg",
    note: "甜凉花果",
    desc: "惠安系一线产区，越南芽庄壳子为原料，柔和甜美，回味带蜜甜脂粉香气。",
  },
  {
    id: "water-agarwood",
    name: "养生水沉",
    category: "daily",
    categoryLabel: "日用香",
    spec: "21cm * 10g",
    price: 128,
    stock: 42,
    image: "/assets/docx-product/image1.jpeg",
    note: "清甜入门",
    desc: "入门级海南沉香，香气柔和稳重，加热后凉意透彻，尾韵有清甜花果香。",
  },
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
    desc: "以海南沉香为灵感，清雅花香、果香与蜜香并存，适合静心独处与日常品闻。",
  },
  {
    id: "qinan",
    name: "菩萨棋南",
    category: "ritual",
    categoryLabel: "香道香",
    spec: "21cm * 10g",
    price: 480,
    stock: 12,
    image: "/assets/docx-product/image9.jpeg",
    note: "凉甜穿透",
    desc: "海南虫漏沉香，醇化十年左右，凉味与甜味清晰明朗，穿透力强。",
  },
  {
    id: "lichen",
    name: "离尘",
    category: "gift",
    categoryLabel: "礼品香",
    spec: "10cm * 10g",
    price: 880,
    stock: 8,
    image: "/assets/docx-product/image4.jpeg",
    note: "富森红土",
    desc: "富森红土香气浓郁馨甜，点燃时清甜婉转，适合书房、庭院与雅集。",
  },
  {
    id: "qiongya",
    name: "琼崖",
    category: "gift",
    categoryLabel: "礼品香",
    spec: "21cm * 10g",
    price: 1280,
    stock: 6,
    image: "/assets/docx-product/image8.jpeg",
    note: "龙涎棋楠",
    desc: "富森红土为骨，龙涎做引，棋楠为魂，沉稳蜜甜，烟气细腻，留香持久。",
  },
  {
    id: "handcraft",
    name: "DIY 香牌体验",
    category: "craft",
    categoryLabel: "手作",
    spec: "60min / 人",
    price: 98,
    stock: 50,
    image: "/assets/shiyi-incense-workshop.png",
    note: "预约体验",
    desc: "文化导入、香材认知、手作成型与冥想带走，适合朋友同行与亲子体验。",
  },
];

const state = {
  format: "线香",
  mood: "静坐",
  category: "all",
  cart: JSON.parse(localStorage.getItem("shiyi-cart") || "[]"),
  saved: JSON.parse(localStorage.getItem("shiyi-formulas") || "[]"),
  notes: JSON.parse(localStorage.getItem("shiyi-notes") || "[]"),
};

let products = [...fallbackProducts];
const apiEnabled = location.protocol === "http:" || location.protocol === "https:";

const list = document.querySelector("#ingredientList");
const totalParts = document.querySelector("#totalParts");
const formatBadge = document.querySelector("#formatBadge");
const formulaName = document.querySelector("#formulaName");
const dominantNote = document.querySelector("#dominantNote");
const lastingText = document.querySelector("#lastingText");
const smokeText = document.querySelector("#smokeText");
const toneText = document.querySelector("#toneText");
const formulaStory = document.querySelector("#formulaStory");
const formulaMix = document.querySelector("#formulaMix");
const savedList = document.querySelector("#savedList");
const productGrid = document.querySelector("#productGrid");
const cartList = document.querySelector("#cartList");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const checkoutStatus = document.querySelector("#checkoutStatus");
const bookingStatus = document.querySelector("#bookingStatus");
const shareStatus = document.querySelector("#shareStatus");
const noteList = document.querySelector("#noteList");
const canvas = document.querySelector("#formulaCanvas");
const ctx = canvas.getContext("2d");

function currency(value) {
  return `¥${value.toLocaleString("zh-CN")}`;
}

async function apiGet(path) {
  if (!apiEnabled) return null;
  try {
    const response = await fetch(path, { headers: { Accept: "application/json" } });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function apiPost(path, payload) {
  if (!apiEnabled) return null;
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function renderIngredients() {
  list.innerHTML = ingredients
    .map(
      (item) => `
        <article class="ingredient">
          <div class="ingredient-name">
            <strong>${item.name}</strong>
            <span>${item.note}</span>
          </div>
          <div class="range-wrap">
            <input type="range" min="0" max="10" value="${item.value}" aria-label="${item.name}比例" data-id="${item.id}" />
          </div>
          <output class="part-value" id="${item.id}Value">${item.value} 份</output>
        </article>
      `,
    )
    .join("");

  list.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", (event) => {
      const item = ingredients.find((entry) => entry.id === event.target.dataset.id);
      item.value = Number(event.target.value);
      document.querySelector(`#${item.id}Value`).textContent = `${item.value} 份`;
      updateFormula();
    });
  });
}

function getProfile() {
  const total = Math.max(1, ingredients.reduce((sum, item) => sum + item.value, 0));
  const profile = ingredients.reduce(
    (acc, item) => {
      Object.keys(acc).forEach((key) => {
        acc[key] += item.profile[key] * item.value;
      });
      return acc;
    },
    { fresh: 0, wood: 0, warm: 0, sweet: 0 },
  );

  Object.keys(profile).forEach((key) => {
    profile[key] = Math.round((profile[key] / total) * 20);
  });

  return { profile, total };
}

function dominantFrom(profile) {
  const key = Object.entries(profile).sort((a, b) => b[1] - a[1])[0][0];
  return {
    key,
    label: { fresh: "清雅", wood: "木质", warm: "温辛", sweet: "甜花" }[key],
  };
}

function setBars(profile) {
  const max = Math.max(1, ...Object.values(profile));
  const map = {
    fresh: document.querySelector("#noteFresh"),
    wood: document.querySelector("#noteWood"),
    warm: document.querySelector("#noteWarm"),
    sweet: document.querySelector("#noteSweet"),
  };

  Object.entries(map).forEach(([key, element]) => {
    element.style.transform = `scaleY(${0.18 + (profile[key] / max) * 0.82})`;
  });
}

function formulaTitle(profile) {
  const dominant = dominantFrom(profile);
  const pool = formulaNames[dominant.key];
  const seed = ingredients.reduce((sum, item) => sum + item.value * item.name.charCodeAt(0), 0);
  return `${pool[seed % pool.length]}${state.mood}香`;
}

function updateWheel(profile) {
  const sum = Math.max(1, profile.fresh + profile.wood + profile.warm + profile.sweet);
  const fresh = Math.round((profile.fresh / sum) * 100);
  const wood = fresh + Math.round((profile.wood / sum) * 100);
  const warm = wood + Math.round((profile.warm / sum) * 100);
  document.documentElement.style.setProperty("--fresh", `${fresh}%`);
  document.documentElement.style.setProperty("--wood", `${wood}%`);
  document.documentElement.style.setProperty("--warm", `${warm}%`);
}

function formatCharacter(total, profile) {
  const resin = ingredients.find((item) => item.id === "benzoin").value;
  const spice = ingredients.find((item) => item.id === "clove").value;
  const binder = ingredients.find((item) => item.id === "binder").value;
  const woodBase = profile.wood + profile.warm;

  lastingText.textContent = woodBase > 115 ? "悠长" : woodBase > 86 ? "中长" : "清短";
  smokeText.textContent = binder > 4 || total > 40 ? "厚" : resin > 6 ? "中" : "轻";
  toneText.textContent = spice > 5 ? "明快" : profile.wood >= profile.sweet ? "沉静" : "柔和";
}

function renderMix(total) {
  const active = ingredients.filter((item) => item.value > 0).sort((a, b) => b.value - a.value);
  formulaMix.innerHTML = active
    .map((item) => {
      const width = Math.round((item.value / Math.max(1, total)) * 100);
      return `
        <div class="mix-row">
          <span>${item.name}</span>
          <div class="mix-bar"><span style="width:${width}%"></span></div>
          <strong>${item.value}</strong>
        </div>
      `;
    })
    .join("");
}

function buildStory(dominant) {
  const top = ingredients.filter((item) => item.value > 0).sort((a, b) => b.value - a.value).slice(0, 3);
  const names = top.map((item) => item.name).join("、");
  const moodLine = {
    静坐: "适合在安静的片刻里慢慢点燃。",
    夜读: "适合放在书页翻动与灯影之间。",
    会客: "适合让空间先有一层温和的气息。",
    晨起: "适合在清晨把呼吸轻轻唤醒。",
  }[state.mood];

  return `${names}形成${dominant}主调，${state.format}的形态让香气释放更有节奏，${moodLine}`;
}

function drawFormulaCard(profile) {
  const dominant = dominantFrom(profile);
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#f7f5ef");
  gradient.addColorStop(0.6, "#e8eadf");
  gradient.addColorStop(1, "#d7c9b5");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#1d2423";
  ctx.font = "700 54px serif";
  ctx.fillText(formulaName.textContent, 58, 92);
  ctx.font = "600 20px sans-serif";
  ctx.fillText(`拾壹 · ${state.format} · ${dominant.label}主调`, 60, 130);

  const centerX = 500;
  const baseY = 390;
  ctx.strokeStyle = "rgba(29,36,35,.75)";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";

  if (state.format === "线香") {
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.moveTo(365 + i * 24, 430);
      ctx.lineTo(455 + i * 24, 178);
      ctx.stroke();
    }
  } else if (state.format === "塔香") {
    ctx.fillStyle = "#9f5f4c";
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.ellipse(centerX, baseY - i * 38, 108 - i * 22, 18, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    ctx.fillStyle = "#b9873b";
    for (let i = 0; i < 7; i += 1) {
      ctx.beginPath();
      ctx.arc(385 + i * 36, 345 + Math.sin(i) * 18, 15, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ["fresh", "wood", "warm", "sweet"].forEach((key, index) => {
    const labels = { fresh: "清", wood: "木", warm: "暖", sweet: "甜" };
    const colors = { fresh: "#586f55", wood: "#1d2423", warm: "#9f5f4c", sweet: "#b9873b" };
    const x = 64;
    const y = 205 + index * 55;
    ctx.fillStyle = colors[key];
    ctx.fillRect(x, y, Math.max(18, profile[key] * 10), 14);
    ctx.fillStyle = "#1d2423";
    ctx.font = "700 18px sans-serif";
    ctx.fillText(labels[key], x, y - 10);
  });
}

function updateFormula() {
  const { profile, total } = getProfile();
  const dominant = dominantFrom(profile);

  totalParts.textContent = `合计 ${total} 份`;
  formatBadge.textContent = state.format;
  formulaName.textContent = formulaTitle(profile);
  if (dominantNote) dominantNote.textContent = dominant.label;
  formulaStory.textContent = buildStory(dominant.label);

  setBars(profile);
  updateWheel(profile);
  formatCharacter(total, profile);
  renderMix(total);
  drawFormulaCard(profile);
}

function renderSaved() {
  if (!state.saved.length) {
    savedList.innerHTML = `<div class="empty-state">还没有保存的香方。</div>`;
    return;
  }

  savedList.innerHTML = state.saved
    .map(
      (formula) => `
        <article class="saved-card">
          <strong>${formula.name}</strong>
          <p>${formula.format} · ${formula.mood} · ${formula.total} 份</p>
          <p>${formula.mix}</p>
        </article>
      `,
    )
    .join("");
}

function renderProducts() {
  const filtered = state.category === "all" ? products : products.filter((product) => product.category === state.category);
  productGrid.innerHTML = filtered
    .map(
      (product) => `
        <article class="product-card">
          <img src="${product.image}" alt="${product.name}" />
          <div class="product-meta">
            <span>${product.categoryLabel} · ${product.spec}</span>
            <strong class="product-price">${currency(product.price)}</strong>
          </div>
          <h3>${product.name}</h3>
          <p>${product.desc}</p>
          <span class="product-note">${product.note}</span>
          <div class="product-actions">
            <button class="ghost-action" type="button" data-detail="${product.id}">详情</button>
            <button class="primary-action" type="button" data-add="${product.id}">购买</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderCart() {
  const detailed = state.cart.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const total = detailed.reduce((sum, product) => sum + product.price, 0);
  cartCount.textContent = `${detailed.length} 件`;
  cartTotal.textContent = currency(total);
  cartList.innerHTML = detailed.length
    ? detailed.map((product) => `<div><span>${product.name}</span><strong>${currency(product.price)}</strong></div>`).join("")
    : `<div class="empty-state">还没有选择产品。</div>`;
  localStorage.setItem("shiyi-cart", JSON.stringify(state.cart));
}

function showProduct(productId) {
  const product = products.find((entry) => entry.id === productId);
  if (!product) return;
  document.querySelector("#dialogBody").innerHTML = `
    <img src="${product.image}" alt="${product.name}" />
    <div>
      <p class="section-kicker">${product.categoryLabel}</p>
      <h2>${product.name}</h2>
      <p>${product.desc}</p>
      <dl class="dialog-spec">
        <div><dt>规格</dt><dd>${product.spec}</dd></div>
        <div><dt>库存</dt><dd>${product.stock}</dd></div>
        <div><dt>价格</dt><dd>${currency(product.price)}</dd></div>
      </dl>
      <button class="primary-action" type="button" data-add="${product.id}">加入购物车</button>
    </div>
  `;
  document.querySelector("#productDialog").showModal();
}

function saveFormula() {
  const { total } = getProfile();
  const active = ingredients.filter((item) => item.value > 0).sort((a, b) => b.value - a.value);
  const formula = {
    name: formulaName.textContent,
    format: state.format,
    mood: state.mood,
    total,
    mix: active.map((item) => `${item.name}${item.value}`).join(" / "),
  };

  state.saved = [formula, ...state.saved].slice(0, 6);
  localStorage.setItem("shiyi-formulas", JSON.stringify(state.saved));
  renderSaved();
  apiPost("/api/formulas", formula);
}

function renderNotes() {
  const baseNotes = state.notes.length ? state.notes : ["夜读时点一支菩提心，清甜很安静。", "想带朋友来做香牌体验。"];
  noteList.innerHTML = baseNotes.map((note) => `<article>${note.content || note}</article>`).join("");
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const detailButton = event.target.closest("[data-detail]");
  if (addButton) {
    state.cart.push(addButton.dataset.add);
    checkoutStatus.textContent = "已加入购物车。";
    renderCart();
  }
  if (detailButton) showProduct(detailButton.dataset.detail);
});

document.querySelectorAll("[data-format]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-format]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    state.format = button.dataset.format;
    updateFormula();
  });
});

document.querySelectorAll("[data-mood]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-mood]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    state.mood = button.dataset.mood;
    ingredients.forEach((item) => {
      item.value = moodPresets[state.mood][item.id];
    });
    renderIngredients();
    updateFormula();
  });
});

document.querySelectorAll("[data-category]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-category]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    state.category = button.dataset.category;
    renderProducts();
  });
});

document.querySelector("#saveFormula").addEventListener("click", saveFormula);
document.querySelector("#shareFormula").addEventListener("click", () => {
  shareStatus.textContent = "已生成个人香方图像，可长按或截图分享。";
});
document.querySelector("#resetFormula").addEventListener("click", () => {
  state.mood = "静坐";
  document.querySelectorAll("[data-mood]").forEach((item) => item.classList.toggle("is-active", item.dataset.mood === state.mood));
  ingredients.forEach((item) => {
    item.value = moodPresets[state.mood][item.id];
  });
  renderIngredients();
  updateFormula();
});
document.querySelector("#clearSaved").addEventListener("click", () => {
  state.saved = [];
  localStorage.removeItem("shiyi-formulas");
  renderSaved();
});
document.querySelector("#checkoutButton").addEventListener("click", () => {
  if (!state.cart.length) {
    checkoutStatus.textContent = "请先选择产品。";
    return;
  }
  apiPost("/api/orders", { items: state.cart, paymentMethod: "待选择" }).then((result) => {
    if (result?.order) {
      checkoutStatus.textContent = `订单 ${result.order.id} 已生成，会员积分 ${result.member.points}。`;
      return;
    }
    checkoutStatus.textContent = "订单已生成，请选择微信、支付宝或信用卡完成支付。";
  });
});
document.querySelector("#closeDialog").addEventListener("click", () => {
  document.querySelector("#productDialog").close();
});
document.querySelector("#bookingForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const booking = {
    service: data.get("service"),
    date: data.get("date"),
    people: data.get("people"),
    contact: data.get("contact"),
  };
  apiPost("/api/bookings", booking).then((result) => {
    bookingStatus.textContent = result?.booking
      ? `预约 ${result.booking.id} 已记录，确认信息将发送至 ${result.booking.contact}。`
      : `已记录 ${booking.date} 的 ${booking.service}，确认信息将发送至 ${booking.contact}。`;
  });
  event.target.reset();
});
document.querySelector("#noteForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const note = new FormData(event.target).get("note").trim();
  if (!note) return;
  state.notes = [note, ...state.notes].slice(0, 8);
  localStorage.setItem("shiyi-notes", JSON.stringify(state.notes));
  event.target.reset();
  renderNotes();
  apiPost("/api/notes", { content: note }).then((result) => {
    if (!result?.notes) return;
    state.notes = result.notes;
    renderNotes();
  });
});

async function init() {
  const bootstrap = await apiGet("/api/bootstrap");
  if (bootstrap?.products?.length) products = bootstrap.products;
  if (bootstrap?.notes?.length) state.notes = bootstrap.notes;

  renderIngredients();
  renderProducts();
  renderCart();
  updateFormula();
  renderSaved();
  renderNotes();
}

init();
