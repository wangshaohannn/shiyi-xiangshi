import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  HeartHandshake,
  Home,
  Leaf,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  Save,
  Send,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";
import { brandContact } from "./brandContact";
import "./styles.css";

const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");
const assetUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
const siteUrl = (path = "/") => `${BASE_PATH}${path === "/" ? "/" : path}`;

const fallbackProducts = [
  {
    id: "nha-trang",
    name: "芽庄沉香",
    category: "daily",
    categoryLabel: "日用香",
    spec: "21cm * 10g",
    price: 118,
    stock: 36,
    image: assetUrl("assets/docx-product/image11.jpeg"),
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
    image: assetUrl("assets/docx-product/image1.jpeg"),
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
    image: assetUrl("assets/docx-product/image6.jpeg"),
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
    image: assetUrl("assets/docx-product/image9.jpeg"),
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
    image: assetUrl("assets/docx-product/image4.jpeg"),
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
    image: assetUrl("assets/docx-product/image8.jpeg"),
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
    image: assetUrl("assets/shiyi-incense-workshop.png"),
    note: "预约体验",
    desc: "文化导入、香材认知、手作成型与冥想带走，适合朋友同行与亲子体验。",
  },
];

const initialIngredients = [
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

const namePool = {
  fresh: ["茶岚", "晓露", "青枝", "素醒"],
  wood: ["松月", "静林", "沉山", "檀影"],
  warm: ["暖篆", "朱火", "南窗", "煦尘"],
  sweet: ["花信", "蜜息", "柔云", "月白"],
};

const categories = [
  ["all", "全部"],
  ["ritual", "香道香"],
  ["daily", "日用香"],
  ["gift", "礼品香"],
  ["craft", "手作"],
];

const sitePages = [
  { id: "brand", label: "品牌", path: "/brand" },
  { id: "shop", label: "商城", path: "/shop" },
  { id: "maker", label: "互动", path: "/maker" },
  { id: "booking", label: "预约", path: "/booking" },
  { id: "journal", label: "动态", path: "/journal" },
  { id: "contact", label: "联系", path: "/contact" },
];

const sitePageDetails = {
  brand: {
    kicker: "INCENSE HOUSE",
    title: "拾壹香室",
    copy: "以天然香材、手作体验与东方香气美学，建立日常生活里的安静秩序。",
    meta: ["东方香气", "手作体验", "线香零售"],
  },
  shop: {
    kicker: "CURATED SHOP",
    title: "本季香单",
    copy: "从日用清甜到雅集礼赠，每一款香都按场景、气味层次与留香表现重新编排。",
    meta: ["7 款香品", "按场景选香", "线下确认"],
  },
  maker: {
    kicker: "INCENSE ATELIER",
    title: "一炷香成",
    copy: "把制香过程变成一张可互动的案台，从选材、研磨到晾晒，完成自己的香签。",
    meta: ["6 步工序", "即时香气画像", "可保存香方"],
  },
  booking: {
    kicker: "PRIVATE BOOKING",
    title: "预约体验",
    copy: "把一次到店体验做得更像小型雅集：时间、人数、服务内容都可以提前确认。",
    meta: ["60-120min", "手作课程", "团建定制"],
  },
  journal: {
    kicker: "FIELD NOTES",
    title: "香气札记",
    copy: "记录香材知识、活动信息和访客灵感，让香气从一次体验延伸到日常。",
    meta: ["知识文章", "笔记墙", "香方收藏"],
  },
  contact: {
    kicker: "CONTACT",
    title: "到店与咨询",
    copy: "复制微信、打开地图或预约到店，让咨询路径足够直接，也保持香室的克制秩序。",
    meta: ["微信咨询", "地图导航", "合作预约"],
  },
};

const sitePageIds = new Set(sitePages.map((page) => page.id));
const hashPageMap = {
  "#culture": "brand",
  "#shop": "shop",
  "#maker": "maker",
  "#booking": "booking",
  "#journal": "journal",
  "#contact": "contact",
};

function pageFromLocation() {
  const relativePath = window.location.pathname.startsWith(BASE_PATH)
    ? window.location.pathname.slice(BASE_PATH.length)
    : window.location.pathname;
  const pathPage = relativePath.replace(/^\//, "") || "brand";
  if (sitePageIds.has(pathPage)) return pathPage;
  return hashPageMap[window.location.hash] || "brand";
}

function currency(value) {
  return `¥${Number(value || 0).toLocaleString("zh-CN")}`;
}

async function apiGet(path) {
  try {
    const response = await fetch(path, { headers: { Accept: "application/json" } });
    return response.ok ? response.json() : null;
  } catch {
    return null;
  }
}

async function apiPost(path, payload) {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    return response.ok ? response.json() : null;
  } catch {
    return null;
  }
}

async function apiPostResult(path, payload) {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => null);
    return response.ok ? { data, error: null } : { data: null, error: data?.error || "提交失败，请稍后再试" };
  } catch {
    return { data: null, error: "网络暂时不可用，请稍后再试" };
  }
}

async function apiAdmin(method, token, payload) {
  try {
    const response = await fetch("/api/admin", {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Admin-Token": token,
      },
      body: payload ? JSON.stringify(payload) : undefined,
    });
    const data = await response.json().catch(() => null);
    return response.ok ? { data, error: null } : { data: null, error: data?.error || "后台请求失败" };
  } catch {
    return { data: null, error: "后台暂时不可用，请稍后再试" };
  }
}

const orderStatusLabels = {
  created: "已创建",
  pending_confirmation: "待确认",
  confirmed: "已确认",
  paid: "已收款",
  fulfilled: "已完成",
  cancelled: "已取消",
};

const bookingStatusLabels = {
  pending: "待确认",
  confirmed: "已确认",
  completed: "已完成",
  cancelled: "已取消",
};

function statusLabel(map, status) {
  return map[status] || status || "未知";
}

function formatDateTime(value) {
  if (!value) return "未记录";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

async function runConfetti(options) {
  const module = await import("canvas-confetti");
  module.default(options);
}

function dominantFrom(profile) {
  const key = Object.entries(profile).sort((a, b) => b[1] - a[1])[0][0];
  return { key, label: { fresh: "清雅", wood: "木质", warm: "温辛", sweet: "甜花" }[key] };
}

function normalizeStoredCart(items) {
  if (!Array.isArray(items)) return [];
  const quantities = new Map();

  items.forEach((item) => {
    const id = typeof item === "string" ? item : item?.id;
    const rawQuantity = Math.floor(Number(item?.quantity || 1));
    const quantity = Number.isFinite(rawQuantity) ? Math.max(1, Math.min(rawQuantity, 99)) : 1;
    if (!id) return;
    quantities.set(id, Math.min((quantities.get(id) || 0) + quantity, 99));
  });

  return Array.from(quantities, ([id, quantity]) => ({ id, quantity }));
}

function readStoredCart() {
  try {
    return normalizeStoredCart(JSON.parse(localStorage.getItem("shiyi-cart") || "[]"));
  } catch {
    return [];
  }
}

function cartQuantity(cart, productId) {
  return cart.find((item) => item.id === productId)?.quantity || 0;
}

const initialCraft = {
  grind: 28,
  sift: 22,
  heat: 12,
  water: 58,
  knead: 34,
  pressure: 52,
  roll: 38,
  dry: 18,
  shade: 62,
};

const craftSteps = [
  { title: "选材", short: "择香意", hint: "选择心境与香材比例，定下一支线香的气质。", target: "香材 3-5 味，粘粉 1-3 份" },
  { title: "研磨", short: "细研粉", hint: "慢慢画圈，香粉越细，香气越顺。", target: "细度 80% 以上，温度不超过 55%" },
  { title: "筛粉", short: "过细筛", hint: "轻筛去粗，让粉体更匀。", target: "细粉 76% 以上，粗粉尽量少" },
  { title: "和泥", short: "调湿度", hint: "水分合适，香泥才柔韧。", target: "水分 55-62%，揉合 75% 以上" },
  { title: "搓香", short: "成线香", hint: "手势越稳，线香越直。", target: "力度 58-68%，直度 80% 以上" },
  { title: "晾晒", short: "定香形", hint: "风与时间让香身稳定。", target: "阴干 65% 以上，干燥 72% 以上" },
];

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function closeness(value, target, spread) {
  return clamp(100 - Math.abs(value - target) * spread);
}

function stepScores(craft, ingredients) {
  const activeCount = ingredients.filter((item) => item.value > 0 && item.id !== "binder").length;
  const binder = ingredients.find((item) => item.id === "binder")?.value ?? 2;
  const selection = ingredients.length ? clamp(activeCount * 19 + closeness(binder, 2, 18) * 0.24, 0, 100) : 72;
  const grind = clamp(craft.grind * 0.78 + (100 - craft.heat) * 0.22);
  const sift = clamp(craft.sift * 0.86 + craft.grind * 0.14);
  const knead = clamp(closeness(craft.water, 58, 3.2) * 0.48 + craft.knead * 0.52);
  const roll = clamp(craft.roll * 0.58 + closeness(craft.pressure, 63, 2.8) * 0.42);
  const dry = clamp(craft.dry * 0.58 + craft.shade * 0.28 + roll * 0.14);
  return { selection, grind, sift, knead, roll, dry };
}

function qualityFromScore(score) {
  if (score >= 88) return { label: "上品", tone: "香身细直，烟线清稳", className: "is-excellent" };
  if (score >= 72) return { label: "成香", tone: "比例舒服，手作痕迹自然", className: "is-good" };
  if (score >= 56) return { label: "可燃", tone: "还能成型，但细节略粗", className: "is-ok" };
  return { label: "待养", tone: "需要再调整粉、水与手势", className: "is-low" };
}

function stepAdvice(step, craft, ingredients) {
  const activeCount = ingredients.filter((item) => item.value > 0 && item.id !== "binder").length;
  const binder = ingredients.find((item) => item.id === "binder")?.value ?? 2;
  if (step === 0) {
    if (activeCount < 3) return "香材层次偏少，可再添一味花草或木香。";
    if (activeCount > 5) return "香材略多，建议收束到 3-5 味。";
    if (binder < 1 || binder > 3) return "粘粉控制在 1-3 份，成型会更稳。";
    return "香材层次合适，可以进入研磨。";
  }
  if (step === 1) {
    if (craft.heat > 55) return "温度偏高，慢磨一圈让香粉安静下来。";
    if (craft.grind < 80) return "细度还不够，继续慢磨更顺。";
    return "粉体细腻，温度也稳。";
  }
  if (step === 2) return craft.sift < 76 ? "还有粗粉，轻筛几次会更细。" : "筛粉均匀，表面质感会更干净。";
  if (step === 3) {
    if (craft.water < 55) return "偏干，线香容易裂，可补一点水。";
    if (craft.water > 62) return "偏湿，搓线容易弯，先少量揉合。";
    if (craft.knead < 75) return "水分合适，继续揉到香泥有韧性。";
    return "香泥柔韧，可以搓香。";
  }
  if (step === 4) {
    if (craft.pressure < 58) return "力度偏轻，线香会短而松。";
    if (craft.pressure > 68) return "力度偏重，线香可能压扁。";
    if (craft.roll < 80) return "力度不错，再稳稳搓长。";
    return "直度不错，手作线条出来了。";
  }
  if (craft.shade < 65) return "晾晒偏急，阴干一些可减少弯曲。";
  return craft.dry < 72 ? "还需要一点时间定形。" : "成香状态稳定，可以保存香签。";
}

function aromaPortrait(formula) {
  const notes = [];
  if (formula.profile.wood >= 18) notes.push("木质底韵深");
  if (formula.profile.fresh >= 18) notes.push("清气上扬");
  if (formula.profile.sweet >= 18) notes.push("尾韵柔甜");
  if (formula.profile.warm >= 18) notes.push("入口温暖");
  return notes.slice(0, 2).join("，") || "气息平衡";
}

function craftScore(craft, ingredients = []) {
  const scores = stepScores(craft, ingredients);
  return Math.round(
    clamp(
      scores.selection * 0.12 + scores.grind * 0.16 + scores.sift * 0.14 + scores.knead * 0.2 + scores.roll * 0.22 + scores.dry * 0.16,
      0,
      100,
    ),
  );
}

function makeFormula(ingredients, mood, format, craft = initialCraft) {
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
  const dominant = dominantFrom(profile);
  const seed = ingredients.reduce((sum, item) => sum + item.value * item.name.charCodeAt(0), 0);
  const name = `${namePool[dominant.key][seed % namePool[dominant.key].length]}${mood}香`;
  const mix = ingredients.filter((item) => item.value > 0).map((item) => `${item.name}${item.value}份`).join(" / ");
  const score = craftScore(craft, ingredients);
  const quality = qualityFromScore(score);
  return {
    name,
    profile,
    dominant,
    total,
    mix,
    format,
    score,
    quality,
    lasting: total > 36 || score > 82 ? "绵长" : total > 25 ? "中长" : "轻短",
    smoke: profile.wood + profile.warm > 23 ? "饱满" : "轻盈",
    tone: dominant.key === "fresh" ? "清醒" : dominant.key === "sweet" ? "柔和" : dominant.key === "warm" ? "温定" : "沉静",
    craftNote: quality.tone,
    portrait: aromaPortrait({ profile }),
  };
}

function ThreeSmoke({ variant = "hero" }) {
  const canvasRef = useRef(null);
  const auraRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const aura = auraRef.current;
    const wrapper = canvas?.parentElement;
    if (!canvas || !wrapper) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0, active: false };
    const particles = Array.from({ length: 72 }, (_, index) => ({
      x: 0,
      y: 0,
      baseX: 0,
      baseY: 0,
      vx: 0,
      vy: 0,
      length: 80 + (index % 7) * 18,
      width: 0.55 + (index % 5) * 0.16,
      phase: index * 0.39,
      drift: 0.16 + (index % 6) * 0.025,
      opacity: 0.1 + (index % 8) * 0.018,
    }));
    let width = 0;
    let height = 0;
    let frame = 0;

    const resetParticle = (particle, index) => {
      particle.baseX = width * (0.48 + ((index * 37) % 44) / 100);
      particle.baseY = height * (0.94 - ((index * 19) % 68) / 100);
      particle.x = particle.baseX;
      particle.y = particle.baseY;
      particle.vx = 0;
      particle.vy = 0;
    };

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles.forEach(resetParticle);
    };

    const movePointer = (event) => {
      const rect = wrapper.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = pointer.x >= 0 && pointer.x <= width && pointer.y >= 0 && pointer.y <= height;
      if (aura && pointer.active) {
        aura.style.setProperty("--cursor-x", `${pointer.x}px`);
        aura.style.setProperty("--cursor-y", `${pointer.y}px`);
        aura.style.opacity = "1";
      }
    };

    const leavePointer = () => {
      pointer.active = false;
      if (aura) aura.style.opacity = "0";
    };

    const drawIncenseStick = () => {
      const x = width * 0.76;
      const y = height * 0.76;
      context.save();
      context.translate(x, y);
      context.rotate(-0.18);
      const ember = context.createRadialGradient(0, -86, 1, 0, -86, 34);
      ember.addColorStop(0, "rgba(245, 185, 103, 0.88)");
      ember.addColorStop(0.34, "rgba(159, 70, 53, 0.36)");
      ember.addColorStop(1, "rgba(159, 70, 53, 0)");
      context.fillStyle = ember;
      context.beginPath();
      context.arc(0, -86, 34, 0, Math.PI * 2);
      context.fill();
      const stick = context.createLinearGradient(0, -88, 0, 120);
      stick.addColorStop(0, "rgba(245, 201, 136, 0.7)");
      stick.addColorStop(0.22, "rgba(111, 68, 54, 0.88)");
      stick.addColorStop(1, "rgba(47, 32, 28, 0.2)");
      context.strokeStyle = stick;
      context.lineWidth = 5;
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(0, -88);
      context.lineTo(0, 120);
      context.stroke();
      context.restore();
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);

      const backgroundGlow = context.createRadialGradient(width * 0.72, height * 0.52, 0, width * 0.72, height * 0.52, width * 0.52);
      backgroundGlow.addColorStop(0, "rgba(190, 145, 81, 0.22)");
      backgroundGlow.addColorStop(0.42, "rgba(79, 98, 87, 0.14)");
      backgroundGlow.addColorStop(1, "rgba(79, 98, 87, 0)");
      context.fillStyle = backgroundGlow;
      context.fillRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        const t = time * 0.00025 + particle.phase;
        const targetX = particle.baseX + Math.sin(t * 1.25 + index) * 30 + Math.sin(t * 0.48) * 18;
        const targetY = particle.baseY - ((t * 42 * particle.drift + index * 15) % (height * 0.78));
        let forceX = 0;
        let forceY = 0;

        if (pointer.active) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.hypot(dx, dy) || 1;
          const radius = Math.min(width, height) * 0.38;
          if (distance < radius) {
            const force = (1 - distance / radius) ** 2;
            forceX += (dx / distance) * force * 1.9 + (-dy / distance) * force * 0.68;
            forceY += (dy / distance) * force * 0.9 + (dx / distance) * force * 0.3;
          }
        }

        particle.vx += (targetX - particle.x) * 0.0085 + forceX;
        particle.vy += (targetY - particle.y) * 0.0085 + forceY - 0.007;
        particle.vx *= 0.92;
        particle.vy *= 0.92;
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.y < height * 0.08) {
          resetParticle(particle, index);
          particle.y = height * 0.93 + (index % 9) * 8;
        }

        const alpha = particle.opacity * (0.72 + Math.sin(t * 2.1) * 0.2);
        const curve = 26 + Math.sin(t + index) * 18;
        const gradient = context.createLinearGradient(particle.x, particle.y, particle.x - curve, particle.y - particle.length);
        gradient.addColorStop(0, `rgba(248, 238, 215, ${alpha * 0.06})`);
        gradient.addColorStop(0.35, `rgba(236, 221, 194, ${alpha})`);
        gradient.addColorStop(1, "rgba(236, 221, 194, 0)");
        context.strokeStyle = gradient;
        context.lineWidth = particle.width;
        context.lineCap = "round";
        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.bezierCurveTo(
          particle.x + curve,
          particle.y - particle.length * 0.32,
          particle.x - curve * 1.4,
          particle.y - particle.length * 0.72,
          particle.x + Math.sin(t) * 24,
          particle.y - particle.length,
        );
        context.stroke();
      });

      drawIncenseStick();
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", movePointer);
    window.addEventListener("pointerleave", leavePointer);
    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", movePointer);
      window.removeEventListener("pointerleave", leavePointer);
    };
  }, []);

  return (
    <div className={`smoke-scene ${variant === "global" ? "global-scent-field" : "pointer-events-none absolute inset-0 z-0"}`} data-smoke-scene aria-hidden="true">
      <canvas ref={canvasRef} className="scent-canvas" />
      <span ref={auraRef} className="scent-cursor-aura" />
    </div>
  );
}

function CultureGallery() {
  const images = ["image8.jpeg", "image11.jpeg", "image4.jpeg"];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % images.length);
    }, 3200);
    return () => window.clearInterval(interval);
  }, [images.length]);

  return (
    <div className="culture-swiper culture-gallery" aria-label="拾壹香室香品工艺图集">
      {images.map((image, index) => (
        <img
          key={image}
          src={`/assets/docx-product/${image}`}
          alt={`拾壹香室香品工艺 ${index + 1}`}
          className={active === index ? "is-active" : ""}
          loading={index === 0 ? "eager" : "lazy"}
        />
      ))}
      <div className="gallery-dots" aria-label="图集切换">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            aria-label={`查看图 ${index + 1}`}
            className={active === index ? "is-active" : ""}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </div>
  );
}

function FormulaCanvas({ formula, ingredients, craft = initialCraft, stage = 0 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const currentCraft = { ...initialCraft, ...craft };
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const dominantColors = {
      fresh: ["#f7fbef", "#cfdcc8", "#4f6954"],
      wood: ["#f8f2e7", "#d2b894", "#5c372e"],
      warm: ["#fbefe3", "#d7a886", "#8f4c38"],
      sweet: ["#fff2ea", "#e6c7be", "#9a5e65"],
    };
    const palette = dominantColors[formula.dominant.key];
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, palette[0]);
    gradient.addColorStop(0.58, "#f5f1e7");
    gradient.addColorStop(1, palette[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(35, 41, 36, 0.07)";
    for (let i = 0; i < 110; i += 1) {
      ctx.beginPath();
      ctx.arc((i * 79) % width, (i * 43) % height, 1 + (i % 4), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.save();
    ctx.translate(width * 0.5, height * 0.56);
    ctx.rotate(-0.035 + (100 - currentCraft.roll) * 0.0005);
    const length = 410 + Math.min(110, formula.total * 4);
    const thickness = 8 + (100 - currentCraft.roll) * 0.035;
    const wobble = (100 - currentCraft.roll) * 0.035 + Math.abs(currentCraft.water - 58) * 0.06;
    const incense = ctx.createLinearGradient(-length / 2, 0, length / 2, 0);
    incense.addColorStop(0, palette[2]);
    incense.addColorStop(0.48, "#73513f");
    incense.addColorStop(1, palette[2]);
    ctx.strokeStyle = "rgba(49, 38, 31, 0.18)";
    ctx.lineWidth = thickness + 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let x = -length / 2; x <= length / 2; x += 22) {
      const y = Math.sin(x * 0.035) * wobble;
      if (x === -length / 2) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.strokeStyle = incense;
    ctx.lineWidth = thickness;
    ctx.beginPath();
    for (let x = -length / 2; x <= length / 2; x += 18) {
      const y = Math.sin(x * 0.035) * wobble;
      if (x === -length / 2) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 244, 220, 0.32)";
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 9; i += 1) {
      const x = -length / 2 + i * (length / 9) + 22;
      ctx.beginPath();
      ctx.moveTo(x, -thickness * 0.3);
      ctx.lineTo(x + 32, thickness * 0.28);
      ctx.stroke();
    }
    ctx.restore();

    ctx.strokeStyle = stage >= 5 ? "rgba(91, 104, 79, 0.34)" : "rgba(91, 104, 79, 0.16)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      const offset = i * 34;
      ctx.moveTo(width * 0.55 + offset * 0.18, height * 0.43 - offset);
      ctx.bezierCurveTo(width * 0.35, height * 0.3 - offset, width * 0.72, height * 0.2 - offset, width * 0.5, height * 0.08 - offset);
      ctx.stroke();
    }

    ctx.fillStyle = "#1f2924";
    ctx.font = "700 48px Songti SC, STSong, serif";
    ctx.fillText(formula.name, 48, 80);
    ctx.font = "600 19px PingFang SC, sans-serif";
    ctx.fillStyle = "#6a5d4d";
    ctx.fillText(`${formula.format} · ${formula.dominant.label} · ${formula.craftNote}`, 52, 118);

    ctx.font = "700 16px PingFang SC, sans-serif";
    ctx.fillStyle = "rgba(32, 39, 34, 0.58)";
    const active = ingredients.filter((item) => item.value > 0).slice(0, 5);
    ctx.fillText(active.map((item) => item.name).join(" / "), 52, height - 42);
  }, [formula, ingredients, craft, stage]);

  return <canvas ref={canvasRef} className="formula-art" width="760" height="520" aria-label="个人定制香品图像" />;
}

function AdminPanel({ onBack }) {
  const [token, setToken] = useState(() => localStorage.getItem("shiyi-admin-token") || "");
  const [tokenInput, setTokenInput] = useState(() => localStorage.getItem("shiyi-admin-token") || "");
  const [dashboard, setDashboard] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminQuery, setAdminQuery] = useState("");
  const [orderFilter, setOrderFilter] = useState("all");
  const [bookingFilter, setBookingFilter] = useState("all");
  const [activeAdminSection, setActiveAdminSection] = useState("overview");

  async function loadAdmin(nextToken = token) {
    if (!nextToken) {
      setStatus("请输入管理员口令");
      return;
    }

    setLoading(true);
    const { data, error } = await apiAdmin("GET", nextToken);
    setLoading(false);
    if (error) {
      setDashboard(null);
      setStatus(error);
      return;
    }

    setDashboard(data.dashboard);
    setStatus("后台数据已更新");
  }

  useEffect(() => {
    if (token) loadAdmin(token);
  }, []);

  async function submitLogin(event) {
    event.preventDefault();
    const nextToken = tokenInput.trim();
    setToken(nextToken);
    localStorage.setItem("shiyi-admin-token", nextToken);
    await loadAdmin(nextToken);
  }

  async function saveAdmin(event, type, id) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    let fields = {};

    if (type === "product") {
      fields = {
        name: form.get("name"),
        category: form.get("category"),
        categoryLabel: form.get("categoryLabel"),
        spec: form.get("spec"),
        price: form.get("price"),
        stock: form.get("stock"),
        image: form.get("image"),
        note: form.get("note"),
        desc: form.get("desc"),
      };
    } else if (type === "note") {
      fields = { content: form.get("content") };
    } else if (type === "formula") {
      fields = { name: form.get("name"), mix: form.get("mix") };
    } else if (type === "member") {
      fields = { name: form.get("name"), level: form.get("level"), points: form.get("points") };
    } else {
      fields = { status: form.get("status") };
    }

    setLoading(true);
    const { data, error } = await apiAdmin("PATCH", token, { type, id, fields });
    setLoading(false);

    if (error) {
      setStatus(error);
      return;
    }

    setDashboard(data.dashboard);
    setStatus("已保存");
  }

  async function deleteAdmin(type, id, label) {
    if (!window.confirm(`确认删除「${label}」吗？`)) return;

    setLoading(true);
    const { data, error } = await apiAdmin("PATCH", token, { type, id, fields: { action: "delete" } });
    setLoading(false);

    if (error) {
      setStatus(error);
      return;
    }

    setDashboard(data.dashboard);
    setStatus("已删除");
  }

  async function createMember(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fields = {
      action: "create",
      name: form.get("memberName"),
      level: form.get("memberLevel"),
      points: form.get("memberPoints"),
    };

    setLoading(true);
    const { data, error } = await apiAdmin("PATCH", token, { type: "member", id: "new", fields });
    setLoading(false);

    if (error) {
      setStatus(error);
      return;
    }

    event.currentTarget.reset();
    setDashboard(data.dashboard);
    setStatus("已新增会员");
  }

  function logout() {
    localStorage.removeItem("shiyi-admin-token");
    setToken("");
    setTokenInput("");
    setDashboard(null);
    setStatus("已退出后台");
  }

  const metrics = dashboard?.metrics || {};
  const products = dashboard?.products || [];
  const orders = dashboard?.orders || [];
  const bookings = dashboard?.bookings || [];
  const notes = dashboard?.notes || [];
  const formulas = dashboard?.formulas || [];
  const members = dashboard?.members || [];
  const query = adminQuery.trim().toLowerCase();
  const filteredOrders = orders.filter((order) => {
    const statusMatches = orderFilter === "all" || order.status === orderFilter;
    const text = [
      order.id,
      order.customer?.name,
      order.customer?.contact,
      order.customer?.address,
      order.items?.map((item) => item.name).join(" "),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return statusMatches && (!query || text.includes(query));
  });
  const filteredBookings = bookings.filter((booking) => {
    const statusMatches = bookingFilter === "all" || booking.status === bookingFilter;
    const text = [booking.service, booking.name, booking.contact, booking.date, booking.time, booking.note].filter(Boolean).join(" ").toLowerCase();
    return statusMatches && (!query || text.includes(query));
  });
  const adminSectionCards = [
    {
      id: "overview",
      label: "总览",
      value: currency(metrics.revenue || 0),
      summary: `${metrics.pendingOrders || 0} 单待确认 / ${metrics.pendingBookings || 0} 条预约`,
      icon: Sparkles,
    },
    {
      id: "products",
      label: "商品",
      value: `${products.length} 款`,
      summary: `${metrics.lowStock || 0} 款低库存`,
      icon: Leaf,
    },
    {
      id: "orders",
      label: "订单",
      value: `${orders.length} 单`,
      summary: `${filteredOrders.length} 单匹配当前筛选`,
      icon: ShoppingBag,
    },
    {
      id: "bookings",
      label: "预约",
      value: `${bookings.length} 条`,
      summary: `${filteredBookings.length} 条匹配当前筛选`,
      icon: CalendarDays,
    },
    {
      id: "content",
      label: "内容",
      value: `${notes.length + formulas.length} 条`,
      summary: `${notes.length} 条笔记 / ${formulas.length} 个香方`,
      icon: MessageCircle,
    },
    {
      id: "members",
      label: "会员",
      value: `${members.length} 位`,
      summary: "管理积分、等级与称呼",
      icon: Users,
    },
  ];
  const viewingOrders = activeAdminSection === "orders";
  const viewingBookings = activeAdminSection === "bookings";

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="kicker">ADMIN</p>
          <h1 className="font-serif text-4xl font-bold">拾壹香室后台</h1>
          <p>管理订单、预约与商品库存。生产环境请使用平台环境变量配置管理员口令。</p>
        </div>
        <div className="admin-header-actions">
          <button className="button-secondary" type="button" onClick={() => loadAdmin()} disabled={!token || loading}>
            <RotateCcw size={17} /> 刷新
          </button>
          <button className="button-secondary" type="button" onClick={onBack}>
            返回官网
          </button>
          {token && (
            <button className="button-primary" type="button" onClick={logout}>
              退出
            </button>
          )}
        </div>
      </header>

      {!dashboard ? (
        <section className="admin-login">
          <form onSubmit={submitLogin}>
            <p className="kicker">ACCESS</p>
            <h2 className="font-serif text-3xl font-bold">输入管理员口令</h2>
            <label>
              管理员口令
              <input
                type="password"
                value={tokenInput}
                onChange={(event) => setTokenInput(event.target.value)}
                placeholder="ADMIN_TOKEN"
                autoComplete="current-password"
                required
              />
            </label>
            <button className="button-primary justify-center" type="submit" disabled={loading}>
              <Check size={18} /> {loading ? "验证中..." : "进入后台"}
            </button>
            <p className="status-text">{status || "本地开发默认口令：dev-admin"}</p>
          </form>
        </section>
      ) : (
        <>
          <section className="admin-section-nav" aria-label="后台分类版块">
            {adminSectionCards.map((section) => {
              const SectionIcon = section.icon;
              return (
                <button
                  className="admin-section-card"
                  key={section.id}
                  type="button"
                  onClick={() => setActiveAdminSection(section.id)}
                  aria-current={activeAdminSection === section.id ? "page" : undefined}
                >
                  <SectionIcon size={20} />
                  <span>{section.label}</span>
                  <strong>{section.value}</strong>
                  <small>{section.summary}</small>
                </button>
              );
            })}
          </section>

          <div className="admin-panel-view">
          <section className="admin-metrics" hidden={activeAdminSection !== "overview"}>
            {[
              ["商品", metrics.products || 0],
              ["低库存", metrics.lowStock || 0],
              ["订单", metrics.orders || 0],
              ["待确认订单", metrics.pendingOrders || 0],
              ["预约", metrics.bookings || 0],
              ["待确认预约", metrics.pendingBookings || 0],
              ["笔记", metrics.notes || 0],
              ["香方", metrics.formulas || 0],
              ["订单金额", currency(metrics.revenue || 0)],
            ].map(([label, value]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </section>

          <section className="admin-section admin-ops" hidden={activeAdminSection !== "overview" && !viewingOrders && !viewingBookings}>
            <div className="section-heading">
              <div>
                <p className="kicker">OPERATIONS</p>
                <h2 className="font-serif text-3xl font-bold">运营筛选</h2>
              </div>
              <span className="badge">{loading ? "同步中" : "实时数据"}</span>
            </div>
            <div className="admin-toolbar">
              <label>
                搜索订单 / 预约
                <input type="search" value={adminQuery} onChange={(event) => setAdminQuery(event.target.value)} placeholder="姓名、电话、订单号、服务内容" />
              </label>
              <label>
                订单状态
                <select value={orderFilter} onChange={(event) => setOrderFilter(event.target.value)}>
                  <option value="all">全部订单</option>
                  {Object.entries(orderStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                预约状态
                <select value={bookingFilter} onChange={(event) => setBookingFilter(event.target.value)}>
                  <option value="all">全部预约</option>
                  {Object.entries(bookingStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="admin-section" hidden={activeAdminSection !== "products"}>
            <div className="section-heading">
              <div>
                <p className="kicker">PRODUCTS</p>
                <h2 className="font-serif text-3xl font-bold">商品管理</h2>
              </div>
              <span className="badge">{products.length} 个商品</span>
            </div>
            <div className="admin-table">
              {products.map((product) => (
                <form className="admin-row product-admin-row" key={product.id} onSubmit={(event) => saveAdmin(event, "product", product.id)}>
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.spec} · {product.categoryLabel}</span>
                  </div>
                  <label>
                    名称
                    <input type="text" name="name" maxLength="80" defaultValue={product.name} />
                  </label>
                  <label>
                    分类
                    <select name="category" defaultValue={product.category}>
                      {categories
                        .filter(([id]) => id !== "all")
                        .map(([id, label]) => (
                          <option key={id} value={id}>
                            {label}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label>
                    分类名
                    <input type="text" name="categoryLabel" maxLength="40" defaultValue={product.categoryLabel} />
                  </label>
                  <label>
                    规格
                    <input type="text" name="spec" maxLength="60" defaultValue={product.spec} />
                  </label>
                  <label>
                    售价
                    <input type="number" name="price" min="0" defaultValue={product.price} />
                  </label>
                  <label>
                    库存
                    <input type="number" name="stock" min="0" defaultValue={product.stock} />
                  </label>
                  <label>
                    标签
                    <input type="text" name="note" maxLength="24" defaultValue={product.note} />
                  </label>
                  <label className="admin-wide-field">
                    图片路径
                    <input type="text" name="image" maxLength="180" defaultValue={product.image} />
                  </label>
                  <label className="admin-wide-field">
                    商品描述
                    <textarea name="desc" rows="2" maxLength="300" defaultValue={product.desc} />
                  </label>
                  <div className="admin-row-submit">
                    <button className="button-secondary justify-center" type="submit" disabled={loading}>
                      <Save size={16} /> 保存商品
                    </button>
                  </div>
                </form>
              ))}
            </div>
          </section>

          <section className="admin-grid admin-single-grid" hidden={!viewingOrders && !viewingBookings}>
            <div className="admin-section" hidden={!viewingOrders}>
              <div className="section-heading">
                <div>
                  <p className="kicker">ORDERS</p>
                  <h2 className="font-serif text-3xl font-bold">订单处理</h2>
                </div>
                <span className="badge">{filteredOrders.length}/{orders.length} 单</span>
              </div>
              <div className="admin-list">
                {filteredOrders.length === 0 ? (
                  <p className="empty-text">暂无订单</p>
                ) : (
                  filteredOrders.map((order) => (
                    <form className="admin-record" key={order.id} onSubmit={(event) => saveAdmin(event, "order", order.id)}>
                      <div className="admin-record-head">
                        <strong>{order.id}</strong>
                        <span>{statusLabel(orderStatusLabels, order.status)}</span>
                      </div>
                      <p>{order.items.map((item) => `${item.name} × ${item.quantity}`).join(" / ") || "订单商品未记录"}</p>
                      <p>
                        {currency(order.total)} · {order.customer?.name || "未留姓名"} · {order.customer?.contact || "未留联系方式"}
                      </p>
                      <p>{formatDateTime(order.createdAt)} · {order.paymentMethod || "未选择支付"} · {order.customer?.deliveryMethod || "取货方式未定"}</p>
                      <p>{order.customer?.address || "无地址备注"} {order.note ? `· ${order.note}` : ""}</p>
                      <div className="admin-record-actions">
                        <select name="status" defaultValue={order.status || "created"}>
                          {Object.entries(orderStatusLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <button className="button-secondary justify-center" type="submit" disabled={loading}>
                          保存状态
                        </button>
                      </div>
                    </form>
                  ))
                )}
              </div>
            </div>

            <div className="admin-section" hidden={!viewingBookings}>
              <div className="section-heading">
                <div>
                  <p className="kicker">BOOKINGS</p>
                  <h2 className="font-serif text-3xl font-bold">预约处理</h2>
                </div>
                <span className="badge">{filteredBookings.length}/{bookings.length} 条</span>
              </div>
              <div className="admin-list">
                {filteredBookings.length === 0 ? (
                  <p className="empty-text">暂无预约</p>
                ) : (
                  filteredBookings.map((booking) => (
                    <form className="admin-record" key={booking.id} onSubmit={(event) => saveAdmin(event, "booking", booking.id)}>
                      <div className="admin-record-head">
                        <strong>{booking.service}</strong>
                        <span>{statusLabel(bookingStatusLabels, booking.status)}</span>
                      </div>
                      <p>
                        {booking.date} · {booking.time || "时段未定"} · {booking.people} 人
                      </p>
                      <p>
                        {booking.name || "未留姓名"} · {booking.contact}
                      </p>
                      <p>{formatDateTime(booking.createdAt)} · {booking.note || "无备注"}</p>
                      <div className="admin-record-actions">
                        <select name="status" defaultValue={booking.status || "pending"}>
                          {Object.entries(bookingStatusLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <button className="button-secondary justify-center" type="submit" disabled={loading}>
                          保存状态
                        </button>
                      </div>
                    </form>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="admin-grid" hidden={activeAdminSection !== "content"}>
            <div className="admin-section">
              <div className="section-heading">
                <div>
                  <p className="kicker">NOTES</p>
                  <h2 className="font-serif text-3xl font-bold">笔记墙管理</h2>
                </div>
                <span className="badge">{notes.length} 条</span>
              </div>
              <div className="admin-list">
                {notes.length === 0 ? (
                  <p className="empty-text">暂无笔记</p>
                ) : (
                  notes.map((note) => (
                    <form className="admin-record" key={note.id} onSubmit={(event) => saveAdmin(event, "note", note.id)}>
                      <div className="admin-record-head">
                        <strong>{note.id}</strong>
                        <span>{formatDateTime(note.createdAt)}</span>
                      </div>
                      <textarea name="content" rows="2" maxLength="120" defaultValue={note.content} />
                      <div className="admin-record-actions">
                        <button className="button-secondary justify-center" type="submit" disabled={loading}>
                          保存笔记
                        </button>
                        <button className="button-secondary justify-center" type="button" onClick={() => deleteAdmin("note", note.id, note.content)} disabled={loading}>
                          删除
                        </button>
                      </div>
                    </form>
                  ))
                )}
              </div>
            </div>

            <div className="admin-section">
              <div className="section-heading">
                <div>
                  <p className="kicker">FORMULAS</p>
                  <h2 className="font-serif text-3xl font-bold">香方管理</h2>
                </div>
                <span className="badge">{formulas.length} 个</span>
              </div>
              <div className="admin-list">
                {formulas.length === 0 ? (
                  <p className="empty-text">暂无香方</p>
                ) : (
                  formulas.map((formula) => (
                    <form className="admin-record" key={formula.id} onSubmit={(event) => saveAdmin(event, "formula", formula.id)}>
                      <div className="admin-record-head">
                        <strong>{formula.id}</strong>
                        <span>{formatDateTime(formula.createdAt)}</span>
                      </div>
                      <label>
                        香方名
                        <input type="text" name="name" maxLength="80" defaultValue={formula.name} />
                      </label>
                      <label>
                        配伍
                        <textarea name="mix" rows="2" maxLength="300" defaultValue={formula.mix} />
                      </label>
                      <div className="admin-record-actions">
                        <button className="button-secondary justify-center" type="submit" disabled={loading}>
                          保存香方
                        </button>
                        <button className="button-secondary justify-center" type="button" onClick={() => deleteAdmin("formula", formula.id, formula.name)} disabled={loading}>
                          删除
                        </button>
                      </div>
                    </form>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="admin-section" hidden={activeAdminSection !== "members"}>
            <div className="section-heading">
              <div>
                <p className="kicker">MEMBERS</p>
                <h2 className="font-serif text-3xl font-bold">会员管理</h2>
              </div>
              <span className="badge">{members.length} 位</span>
            </div>
            <form className="admin-row member-admin-row admin-create-card" onSubmit={createMember}>
              <div>
                <strong>新增会员</strong>
                <span>录入到店客人、合作客户或活动会员</span>
              </div>
              <label>
                名称
                <input type="text" name="memberName" maxLength="60" placeholder="例如：林小姐" required />
              </label>
              <label>
                等级
                <input type="text" name="memberLevel" maxLength="40" placeholder="初香" defaultValue="初香" />
              </label>
              <label>
                积分
                <input type="number" name="memberPoints" min="0" defaultValue="0" />
              </label>
              <button className="button-secondary justify-center" type="submit" disabled={loading}>
                <Plus size={16} /> 新增会员
              </button>
            </form>
            <div className="admin-table">
              {members.length === 0 ? (
                <p className="empty-text">暂无会员</p>
              ) : (
                members.map((member) => (
                  <form className="admin-row member-admin-row" key={member.id} onSubmit={(event) => saveAdmin(event, "member", member.id)}>
                    <div>
                      <strong>{member.name}</strong>
                      <span>{member.id}</span>
                    </div>
                    <label>
                      名称
                      <input type="text" name="name" maxLength="60" defaultValue={member.name} />
                    </label>
                    <label>
                      等级
                      <input type="text" name="level" maxLength="40" defaultValue={member.level} />
                    </label>
                    <label>
                      积分
                      <input type="number" name="points" min="0" defaultValue={member.points} />
                    </label>
                    <button className="button-secondary justify-center" type="submit" disabled={loading}>
                      <Save size={16} /> 保存会员
                    </button>
                  </form>
                ))
              )}
            </div>
          </section>
          </div>

          <p className="admin-status">{status}</p>
        </>
      )}
    </main>
  );
}

function App() {
  const [adminMode, setAdminMode] = useState(() => window.location.pathname === "/admin" || window.location.hash === "#admin");
  const [activeSitePage, setActiveSitePage] = useState(pageFromLocation);
  const [products, setProducts] = useState(fallbackProducts);
  const [notes, setNotes] = useState([]);
  const [member, setMember] = useState({ points: 0, level: "初香" });
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState(readStoredCart);
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [format, setFormat] = useState("线香");
  const [mood, setMood] = useState("静坐");
  const [gameStep, setGameStep] = useState(0);
  const [craft, setCraft] = useState(initialCraft);
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem("shiyi-formulas") || "[]"));
  const [status, setStatus] = useState({});
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const formulaPanelRef = useRef(null);

  useEffect(() => {
    const syncRouteMode = () => {
      if (window.location.pathname === "/space" || window.location.hash === "#space") {
        window.history.replaceState(null, "", siteUrl("/"));
      }
      setAdminMode(window.location.pathname === "/admin" || window.location.hash === "#admin");
      setActiveSitePage(pageFromLocation());
    };
    syncRouteMode();
    window.addEventListener("hashchange", syncRouteMode);
    window.addEventListener("popstate", syncRouteMode);
    return () => {
      window.removeEventListener("hashchange", syncRouteMode);
      window.removeEventListener("popstate", syncRouteMode);
    };
  }, []);

  useEffect(() => {
    apiGet("/api/bootstrap").then((data) => {
      if (!data) return;
      setProducts(data.products || fallbackProducts);
      setNotes(data.notes || []);
      setMember(data.member || { points: 0, level: "初香" });
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("shiyi-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("shiyi-formulas", JSON.stringify(saved));
  }, [saved]);

  const filteredProducts = useMemo(
    () => (category === "all" ? products : products.filter((product) => product.category === category)),
    [products, category],
  );
  const cartItems = useMemo(
    () =>
      cart
        .map((item) => {
          const product = products.find((entry) => entry.id === item.id);
          if (!product) return null;
          return { ...product, quantity: item.quantity, subtotal: product.price * item.quantity };
        })
        .filter(Boolean),
    [cart, products],
  );
  const cartCount = cartItems.reduce((sum, product) => sum + product.quantity, 0);
  const cartTotal = cartItems.reduce((sum, product) => sum + product.subtotal, 0);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const formula = useMemo(() => makeFormula(ingredients, mood, format, craft), [ingredients, mood, format, craft]);
  const scores = useMemo(() => stepScores(craft, ingredients), [craft, ingredients]);
  const stepScore = Object.values(scores)[gameStep] ?? formula.score;
  const stepQuality = qualityFromScore(stepScore);
  const advice = stepAdvice(gameStep, craft, ingredients);
  const activeIngredients = ingredients.filter((item) => item.value > 0);
  const activePageDetail = sitePageDetails[activeSitePage] || sitePageDetails.brand;

  function leaveAdmin() {
    window.history.pushState(null, "", siteUrl(`/${activeSitePage}`));
    setAdminMode(false);
  }

  if (adminMode) {
    return <AdminPanel onBack={leaveAdmin} />;
  }

  function addToCart(product) {
    const stock = Math.max(0, Number(product.stock || 0));
    const currentQuantity = cartQuantity(cart, product.id);
    if (stock <= 0 || currentQuantity >= stock) {
      setStatus({ cart: `${product.name} 库存不足，请先联系确认` });
      return;
    }
    setCart((current) => {
      const exists = current.some((item) => item.id === product.id);
      return exists
        ? current.map((item) => (item.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, stock) } : item))
        : [...current, { id: product.id, quantity: 1 }];
    });
    setStatus({ cart: `${product.name} 已加入香篮` });
  }

  function navigateSitePage(page) {
    window.history.pushState(null, "", siteUrl(page.path));
    setActiveSitePage(page.id);
  }

  function decreaseCart(productId) {
    setCart((current) =>
      current
        .map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    );
  }

  async function checkout(event) {
    event.preventDefault();
    if (!cartItems.length) {
      setStatus({ checkout: "请先选择产品" });
      return;
    }

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setIsCheckingOut(true);
    const { data, error } = await apiPostResult("/api/orders", {
      items: cart,
      paymentMethod: form.get("paymentMethod"),
      customer: {
        name: form.get("name"),
        contact: form.get("contact"),
        deliveryMethod: form.get("deliveryMethod"),
        address: form.get("address"),
      },
      note: form.get("note"),
    });
    setIsCheckingOut(false);

    if (error || !data) {
      setStatus({ checkout: error || "订单未提交，请稍后再试" });
      return;
    }

    setCart([]);
    formElement.reset();
    setMember(data.member);
    if (data.products) setProducts(data.products);
    setStatus({ checkout: `订单 ${data.order.id} 已提交，稍后会联系确认` });
    runConfetti({ particleCount: 70, spread: 58, origin: { y: 0.75 } });
  }

  function setPreset(nextMood) {
    setMood(nextMood);
    const preset = moodPresets[nextMood];
    setIngredients((current) => current.map((item) => ({ ...item, value: preset[item.id] ?? item.value })));
  }

  function changeIngredient(id, amount) {
    setIngredients((current) => current.map((item) => (item.id === id ? { ...item, value: clamp(item.value + amount, 0, 10) } : item)));
  }

  function updateCraft(key, value) {
    setCraft((current) => ({ ...current, [key]: clamp(value) }));
  }

  function nudgeCraft(key, amount) {
    setCraft((current) => ({ ...current, [key]: clamp(current[key] + amount) }));
  }

  function craftAction(changes) {
    setCraft((current) =>
      Object.entries(changes).reduce((next, [key, amount]) => ({ ...next, [key]: clamp((next[key] ?? 0) + amount) }), { ...current }),
    );
  }

  async function copyWechat() {
    const text = brandContact.wechat.id;
    try {
      await navigator.clipboard.writeText(text);
      setStatus({ contact: `已复制微信号：${text}` });
      return;
    } catch {
      const input = document.createElement("textarea");
      input.value = text;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.left = "-9999px";
      input.style.top = "0";
      document.body.appendChild(input);
      input.focus();
      input.select();
      input.setSelectionRange(0, text.length);
      const copied = document.execCommand("copy");
      document.body.removeChild(input);
      setStatus({ contact: copied ? `已复制微信号：${text}` : `请手动复制微信号：${text}` });
    }
  }

  async function saveFormula() {
    const payload = { name: formula.name, format, mood, total: formula.total, mix: formula.mix, score: formula.score };
    await apiPost("/api/formulas", payload);
    setSaved((current) => [{ ...payload, createdAt: new Date().toISOString() }, ...current].slice(0, 8));
    setStatus({ formula: `${formula.name} 已保存` });
    runConfetti({ particleCount: 50, spread: 48, origin: { y: 0.68 } });
  }

  async function downloadFormula() {
    if (!formulaPanelRef.current) return;
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(formulaPanelRef.current, { backgroundColor: "#f7f3ea", scale: 2 });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${formula.name}.png`;
    link.click();
    setStatus({ formula: "分享图已生成" });
  }

  async function submitBooking(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const { data, error } = await apiPostResult("/api/bookings", {
      service: form.get("service"),
      date: form.get("date"),
      time: form.get("time"),
      people: form.get("people"),
      name: form.get("name"),
      contact: form.get("contact"),
      note: form.get("note"),
    });
    if (error) {
      setStatus({ booking: error });
      return;
    }

    setBookingConfirmation(data.booking);
    setStatus({ booking: `预约 ${data.booking.id} 已提交，已同步到后台` });
    runConfetti({ particleCount: 72, spread: 62, origin: { y: 0.72 }, colors: ["#f0c46b", "#8f4f2a", "#f7f1de"] });
    formElement.reset();
  }

  async function submitNote(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const content = String(form.get("note") || "").trim();
    if (!content) return;
    const result = await apiPost("/api/notes", { content });
    if (result) {
      setNotes(result.notes);
      formElement.reset();
    }
  }

  return (
    <main className="site-shell min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <ThreeSmoke variant="global" />
      <section id="home" className={`hero-section ${activeSitePage === "brand" ? "" : "is-page-mode"}`}>
        <video
          className="hero-background-video"
          src={assetUrl("assets/shiyi-ambient-background.mp4")}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <ThreeSmoke />
        <nav className="site-nav relative z-20 flex items-center justify-between gap-5 px-5 py-5 lg:px-10">
          <button className="brand-home-link" type="button" onClick={() => navigateSitePage(sitePages[0])}>
            <span className="font-serif text-3xl font-bold md:text-4xl">拾壹香室</span>
            <span className="hidden text-xs font-bold text-white/65 sm:inline">香艺 · 体验 · 零售</span>
          </button>
          <div className="nav-pills">
            {sitePages.map((page) => (
              <button
                key={page.id}
                type="button"
                className={activeSitePage === page.id ? "is-active" : ""}
                aria-current={activeSitePage === page.id ? "page" : undefined}
                onClick={() => navigateSitePage(page)}
              >
                {page.label}
              </button>
            ))}
          </div>
        </nav>

        {activeSitePage === "brand" && (
        <div className="hero-layout relative z-10 grid min-h-[calc(92vh-88px)] items-end gap-8 px-5 pb-12 lg:grid-cols-[1fr_420px] lg:px-10">
          <div className="hero-copy max-w-4xl">
            <p className="kicker text-[#d0a34f]">INCENSE HOUSE / SHANGHAI</p>
            <h1 className="font-serif text-[clamp(4rem,13vw,10rem)] font-bold leading-none tracking-normal text-white">拾壹香室</h1>
            <p className="mt-6 max-w-2xl font-serif text-[clamp(1.35rem,3vw,2.25rem)] leading-normal text-[#fbf6ea]/90">
              让一支线香，成为日常里可被安顿、可被带走的东方香气。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="button-primary" type="button" onClick={() => navigateSitePage(sitePages.find((page) => page.id === "shop"))}>
                <ShoppingBag size={18} /> 选购线香
              </button>
              <button className="button-ghost-light" type="button" onClick={() => navigateSitePage(sitePages.find((page) => page.id === "booking"))}>
                <CalendarDays size={18} /> 预约体验
              </button>
              <button className="button-ghost-light" type="button" onClick={() => navigateSitePage(sitePages.find((page) => page.id === "contact"))}>
                <MessageCircle size={18} /> {brandContact.consultationCta}
              </button>
            </div>
            <div className="hero-proof" aria-label="拾壹香室服务摘要">
              <span>线香零售</span>
              <span>手作体验</span>
              <span>香道课程</span>
              <button type="button" onClick={() => navigateSitePage(sitePages.find((page) => page.id === "maker"))}>进入制香台</button>
            </div>
          </div>

          <aside className="hero-panel hero-feature">
            <p className="kicker">SIGNATURE</p>
            <div className="signature-stack">
              <img src={assetUrl("assets/docx-product/image6.jpeg")} alt="菩提心海南沉香线香" className="mt-3 aspect-[4/3] w-full object-cover" fetchPriority="high" />
              <span>本月主香</span>
            </div>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold">菩提心 · 海南沉香</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">清雅花果与蜜香，适合静坐、夜读与日常品闻。</p>
              </div>
              <span className="badge">现货 18</span>
            </div>
            <button className="feature-link" type="button" onClick={() => navigateSitePage(sitePages.find((page) => page.id === "shop"))}>
              查看本月推荐 <ChevronRight size={16} />
            </button>
          </aside>
        </div>
        )}
        {activeSitePage !== "brand" && (
          <div className="route-hero">
            <p className="kicker">{activePageDetail.kicker}</p>
            <h1 className="route-page-title">{activePageDetail.title}</h1>
            <p>{activePageDetail.copy}</p>
            <div className="route-page-meta" aria-label={`${activePageDetail.title}摘要`}>
              {activePageDetail.meta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        )}
      </section>

      {activeSitePage === "brand" && (
      <>
      <section id="culture" className="section-pad editorial-section grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="kicker">BRAND CULTURE</p>
          <h2 className="section-title">以香为媒，连接传统与日常</h2>
          <p className="mt-5 max-w-2xl text-lg leading-9 text-[var(--muted)]">
            拾壹香室面向年轻香文化爱好者，提供可购买、可体验、可学习的东方香气入口。网站需要让访客先感到安静可信，再自然进入商品、预约与{brandContact.consultationCta}。
          </p>
          <div className="brand-metrics">
            {[
              ["7+", "精选香品"],
              ["60min", "手作体验"],
              ["4类", "课程与雅集"],
            ].map(([value, label]) => (
              <div key={label} className="metric">
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <CultureGallery />
      </section>

      <section className="section-pad craft-grid craft-story">
        <img src={assetUrl("assets/shiyi-incense-workshop.png")} alt="拾壹香室手作体验空间" className="craft-photo" loading="lazy" />
        <div>
          <p className="kicker">HANDCRAFT</p>
          <h2 className="section-title">从香材到一支线香</h2>
          <div className="mt-7 grid gap-4">
            {[
              ["01", "选材", "甄选沉香、檀木、白茶、树脂与花草，建立清、木、暖、甜的香气骨架。"],
              ["02", "研磨合香", "控制粉体粗细、粘粉比例与含水状态，让香韵释放更稳定。"],
              ["03", "成型醇化", "手作成型后静置养香，使线香燃烧更细腻，尾韵更完整。"],
            ].map(([num, title, copy]) => (
              <article className="process-row" key={num}>
                <span>{num}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      </>
      )}

      {activeSitePage === "shop" && (
      <section id="shop" className="section-pad shop-section routed-section">
        <div className="section-heading">
          <div>
            <p className="kicker">SHOP</p>
            <h2 className="section-title">线香与手作香品</h2>
            <p className="section-copy">按使用场景选择香气：日用、静坐、礼赠，或预约一次亲手制香。</p>
          </div>
          <div className="filter-row">
            {categories.map(([id, label]) => (
              <button key={id} type="button" className={category === id ? "is-active" : ""} onClick={() => setCategory(id)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="shop-intro">
          <span>本季香单</span>
          <strong>从日用清甜到雅集礼赠，按气味场景选香。</strong>
          <em>点击图片查看香品细节，加入香篮后可线下确认。</em>
        </div>

        <div className="shop-shell mt-8 grid gap-6 xl:grid-cols-[1fr_370px]">
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <button type="button" onClick={() => setSelectedProduct(product)} className="block w-full text-left">
                  <div className="product-image-wrap">
                    <img className={`product-image product-image-${product.id}`} src={product.image} alt={product.name} loading="lazy" />
                    <span className="category-tag">{product.categoryLabel}</span>
                  </div>
                  <h3>{product.name}</h3>
                  <div className="product-meta">
                    <span>{product.note}</span>
                    <span>{product.spec}</span>
                  </div>
                  <p>{product.desc}</p>
                </button>
                <div className="product-buy-row mt-4 flex items-center justify-between gap-3">
                  <div>
                    <strong className="text-xl">{currency(product.price)}</strong>
                    <span className="ml-2 text-xs text-[var(--muted)]">库存 {product.stock}</span>
                  </div>
                  <button
                    className="icon-button"
                    type="button"
                    title="加入香篮"
                    onClick={() => addToCart(product)}
                    disabled={cartQuantity(cart, product.id) >= product.stock}
                  >
                    <Plus size={19} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-panel">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="kicker">MEMBER</p>
                <h2 className="font-serif text-3xl font-bold">香室会员</h2>
              </div>
              <span className="badge">{cartCount} 件</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">当前等级 {member.level}，积分 {member.points}</p>
            <button className="wechat-card" type="button" onClick={() => navigateSitePage(sitePages.find((page) => page.id === "contact"))}>
              <MessageCircle size={18} />
              <span>{brandContact.consultationCopy}</span>
            </button>
            <div className="mt-5 space-y-3">
              {cartItems.length === 0 ? (
                <p className="empty-text">香篮尚空</p>
              ) : (
                cartItems.map((product) => (
                  <div className="cart-item" key={product.id}>
                    <div>
                      <strong>{product.name}</strong>
                      <span>
                        {currency(product.price)} × {product.quantity} · 库存 {product.stock}
                      </span>
                    </div>
                    <div className="quantity-tools">
                      <button className="small-icon" type="button" title="减少" onClick={() => decreaseCart(product.id)}>
                        <Minus size={16} />
                      </button>
                      <output>{product.quantity}</output>
                      <button
                        className="small-icon"
                        type="button"
                        title="增加"
                        onClick={() => addToCart(product)}
                        disabled={product.quantity >= product.stock}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="cart-total">
              <span>合计</span>
              <strong>{currency(cartTotal)}</strong>
            </div>
            <form className="checkout-form" onSubmit={checkout}>
              <div className="form-grid two-cols">
                <label>
                  姓名
                  <input type="text" name="name" placeholder="怎么称呼您" maxLength="24" />
                </label>
                <label>
                  联系方式
                  <input type="tel" name="contact" placeholder="手机号 / 微信" maxLength="40" required />
                </label>
              </div>
              <div className="form-grid two-cols">
                <label>
                  取货方式
                  <select name="deliveryMethod" defaultValue="到店自提">
                    <option>到店自提</option>
                    <option>同城配送</option>
                    <option>快递寄送</option>
                  </select>
                </label>
                <label>
                  支付方式
                  <select name="paymentMethod" defaultValue="线下确认 / 微信">
                    <option>线下确认 / 微信</option>
                    <option>支付宝</option>
                    <option>到店支付</option>
                  </select>
                </label>
              </div>
              <label>
                地址或备注
                <textarea name="address" rows="3" placeholder="配送地址、送礼时间或香气偏好" maxLength="120" />
              </label>
              <input type="hidden" name="note" defaultValue="官网香篮订单" />
              <button className="button-primary w-full justify-center" type="submit" disabled={!cartItems.length || isCheckingOut}>
                <Check size={18} /> {isCheckingOut ? "提交中..." : "提交订单"}
              </button>
            </form>
            <p className="status-text">{status.checkout || status.cart}</p>
          </aside>
        </div>
      </section>
      )}

      {activeSitePage === "maker" && (
      <section id="maker" className="section-pad maker-grid routed-section">
        <div className="maker-controls">
          <div className="section-heading maker-intro">
            <div>
              <p className="kicker">INTERACTIVE</p>
              <h2 className="section-title">一炷香成</h2>
              <p className="section-copy">把制香步骤做成一张案台：选材、研磨、筛粉、和泥、搓香、晾晒，每一步都会改变香签气质。</p>
            </div>
            <span className={`badge quality-badge ${formula.quality.className}`}>{formula.quality.label} · {formula.score}%</span>
          </div>

          <div className="game-stepper" aria-label="制香步骤">
            {craftSteps.map((step, index) => {
              const score = Object.values(scores)[index] ?? 0;
              return (
                <button
                  key={step.title}
                  type="button"
                  className={`${gameStep === index ? "is-active" : ""} ${score >= 72 ? "is-done" : ""}`}
                  onClick={() => setGameStep(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {step.title}
                  <i style={{ width: `${score}%` }} />
                </button>
              );
            })}
          </div>

          <div className="workbench-scene" aria-label="制香案台">
            <div className="ingredient-tray" aria-label="已入盘香材">
              {activeIngredients.slice(0, 6).map((item) => (
                <span key={item.id}>{item.name}</span>
              ))}
            </div>
            <div className={`workbench-bowl step-${gameStep}`}>
              <span />
              <i />
            </div>
            <div className="powder-rain" aria-hidden="true">
              {Array.from({ length: 12 }).map((_, index) => (
                <span key={index} style={{ "--x": `${8 + index * 7}%`, "--d": `${index * 90}ms` }} />
              ))}
            </div>
            <div className="workbench-incense" style={{ width: `${36 + craft.roll * 0.54}%` }} />
            <div className="workbench-progress">
              <strong>{craftSteps[gameStep].short}</strong>
              <span>{craftSteps[gameStep].hint}</span>
            </div>
          </div>

          <div className="maker-status-grid">
            <article>
              <span>本步目标</span>
              <strong>{craftSteps[gameStep].target}</strong>
            </article>
            <article>
              <span>本步品质</span>
              <strong>{stepQuality.label} · {Math.round(stepScore)}%</strong>
            </article>
            <article>
              <span>师傅提醒</span>
              <strong>{advice}</strong>
            </article>
          </div>

          <div className="maker-stage">
            {gameStep === 0 && (
              <>
                <div>
                  <span className="control-label">香品形态</span>
                  <div className="segmented">
                    {["线香", "短线香", "卧香"].map((item) => (
                      <button key={item} className={format === item ? "is-active" : ""} type="button" onClick={() => setFormat(item)}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="control-label">心境</span>
                  <div className="mood-row">
                    {Object.keys(moodPresets).map((item) => (
                      <button key={item} className={mood === item ? "is-active" : ""} type="button" onClick={() => setPreset(item)}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="ingredient-list">
                  {ingredients.map((item) => (
                    <div key={item.id} className={`ingredient-row ${item.value > 0 ? "is-selected" : ""}`}>
                      <span>
                        <strong>{item.name}</strong>
                        <em>{item.note}</em>
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={item.value}
                        aria-label={`${item.name}比例`}
                        onChange={(event) =>
                          setIngredients((current) =>
                            current.map((entry) => (entry.id === item.id ? { ...entry, value: Number(event.target.value) } : entry)),
                          )
                        }
                      />
                      <div className="ingredient-tools">
                        <button className="small-icon" type="button" title={`减少${item.name}`} onClick={() => changeIngredient(item.id, -1)}>
                          <Minus size={14} />
                        </button>
                        <output>{item.value}</output>
                        <button className="small-icon" type="button" title={`增加${item.name}`} onClick={() => changeIngredient(item.id, 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="blend-board">
                  <div>
                    <span>香材层次</span>
                    <strong>{activeIngredients.filter((item) => item.id !== "binder").length} 味</strong>
                  </div>
                  <div>
                    <span>合香总量</span>
                    <strong>{formula.total} 份</strong>
                  </div>
                  <div>
                    <span>气味画像</span>
                    <strong>{formula.portrait}</strong>
                  </div>
                </div>
              </>
            )}

            {gameStep === 1 && (
              <div className="craft-action">
                <div className="craft-mini-panel">
                  <div className="craft-dial" style={{ "--progress": `${craft.grind}%` }}>
                    <strong>{craft.grind}%</strong>
                    <span>细度</span>
                  </div>
                  <div className="mini-meter">
                    <span>温度</span>
                    <i style={{ "--value": `${craft.heat}%` }} />
                    <em>{craft.heat}%</em>
                  </div>
                </div>
                <div>
                  <h3>石臼研磨</h3>
                  <p>反复轻研，粉末越细，燃烧越稳定。快磨能抢进度，但温度过高会损伤清气。</p>
                  <div className="choice-actions">
                    <button className="button-primary" type="button" onClick={() => craftAction({ grind: 10, heat: 3 })}>
                      <Sparkles size={18} /> 慢磨一圈
                    </button>
                    <button className="button-secondary" type="button" onClick={() => craftAction({ grind: 19, heat: 14 })}>
                      快磨三圈
                    </button>
                    <button className="button-secondary" type="button" onClick={() => craftAction({ heat: -12, grind: 2 })}>
                      停手散热
                    </button>
                  </div>
                </div>
              </div>
            )}

            {gameStep === 2 && (
              <div className="craft-action">
                <div className="sieve-plate">
                  {Array.from({ length: 18 }).map((_, index) => (
                    <span key={index} style={{ left: `${8 + (index % 6) * 15}%`, top: `${16 + Math.floor(index / 6) * 25}%` }} />
                  ))}
                </div>
                <div>
                  <h3>筛粉去粗</h3>
                  <p>左右轻筛，让细粉落入香碗。筛得越匀，线香表面越细腻。</p>
                  <div className="mini-meter">
                    <span>细粉</span>
                    <i style={{ "--value": `${craft.sift}%` }} />
                    <em>{craft.sift}%</em>
                  </div>
                  <div className="choice-actions mt-3">
                    <button className="button-primary" type="button" onClick={() => craftAction({ sift: 12 })}>
                      轻筛一次
                    </button>
                    <button className="button-secondary" type="button" onClick={() => craftAction({ sift: 8, grind: 3 })}>
                      回磨粗粉
                    </button>
                  </div>
                </div>
              </div>
            )}

            {gameStep === 3 && (
              <div className="craft-action">
                <div className="moisture-card">
                  <strong>{craft.water}%</strong>
                  <span>{craft.water < 48 ? "偏干" : craft.water > 70 ? "偏湿" : "正好"}</span>
                </div>
                <div>
                  <h3>加水和泥</h3>
                  <p>湿度接近 58% 时，香泥更适合搓制。再揉一揉，让粉和水慢慢合在一起。</p>
                  <label className="compact-slider">
                    水分
                    <input type="range" min="35" max="85" value={craft.water} onChange={(event) => updateCraft("water", Number(event.target.value))} />
                  </label>
                  <div className="mini-meter mt-3">
                    <span>揉合</span>
                    <i style={{ "--value": `${craft.knead}%` }} />
                    <em>{craft.knead}%</em>
                  </div>
                  <div className="choice-actions mt-3">
                    <button className="button-primary" type="button" onClick={() => craftAction({ knead: 13, water: -1 })}>
                      揉香泥
                    </button>
                    <button className="button-secondary" type="button" onClick={() => craftAction({ water: 4, knead: 3 })}>
                      补一滴水
                    </button>
                    <button className="button-secondary" type="button" onClick={() => craftAction({ water: -5, knead: 4 })}>
                      撒少许粉
                    </button>
                  </div>
                </div>
              </div>
            )}

            {gameStep === 4 && (
              <div className="craft-action">
                <div className="rolling-board">
                  <span style={{ width: `${34 + craft.roll * 0.58}%` }} />
                </div>
                <div>
                  <h3>手搓线香</h3>
                  <p>让掌心慢慢来回，力度越稳，线香越直。这里没有失败，只有手作痕迹。</p>
                  <label className="compact-slider">
                    掌心力度
                    <input type="range" min="35" max="90" value={craft.pressure} onChange={(event) => updateCraft("pressure", Number(event.target.value))} />
                  </label>
                  <div className="mini-meter mt-3">
                    <span>直度</span>
                    <i style={{ "--value": `${craft.roll}%` }} />
                    <em>{craft.roll}%</em>
                  </div>
                  <div className="choice-actions mt-3">
                    <button className="button-primary" type="button" onClick={() => craftAction({ roll: 12, pressure: 1 })}>
                      稳稳搓长
                    </button>
                    <button className="button-secondary" type="button" onClick={() => craftAction({ roll: 8, pressure: -4 })}>
                      放轻手势
                    </button>
                    <button className="button-secondary" type="button" onClick={() => craftAction({ roll: 8, pressure: 5 })}>
                      加一点力
                    </button>
                  </div>
                </div>
              </div>
            )}

            {gameStep === 5 && (
              <div className="craft-action">
                <div className="drying-rack">
                  <span />
                  <span />
                  <span />
                </div>
                <div>
                  <h3>晾晒定香</h3>
                  <p>放上晾香架，等水气退去。完成后就能生成这支线香的香签。</p>
                  <label className="compact-slider">
                    阴干程度
                    <input type="range" min="30" max="95" value={craft.shade} onChange={(event) => updateCraft("shade", Number(event.target.value))} />
                  </label>
                  <div className="mini-meter mt-3">
                    <span>定形</span>
                    <i style={{ "--value": `${craft.dry}%` }} />
                    <em>{craft.dry}%</em>
                  </div>
                  <div className="choice-actions mt-3">
                    <button className="button-primary" type="button" onClick={() => craftAction({ dry: 14, shade: 3 })}>
                      阴干片刻
                    </button>
                    <button className="button-secondary" type="button" onClick={() => craftAction({ dry: 22, shade: -9 })}>
                      借风快干
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="stage-actions">
              <button className="button-secondary" type="button" disabled={gameStep === 0} onClick={() => setGameStep((step) => Math.max(0, step - 1))}>
                上一步
              </button>
              <button className="button-primary" type="button" disabled={gameStep === craftSteps.length - 1} onClick={() => setGameStep((step) => Math.min(craftSteps.length - 1, step + 1))}>
                下一步 <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>

        <div className="formula-panel" ref={formulaPanelRef}>
          <div className="ritual-mark" aria-hidden="true">香签</div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="kicker">YOUR INCENSE</p>
              <h2 className="font-serif text-4xl font-bold">{formula.name}</h2>
            </div>
            <span className={`badge quality-badge ${formula.quality.className}`}>{formula.quality.label}</span>
          </div>
          <FormulaCanvas formula={formula} ingredients={ingredients} craft={craft} stage={gameStep} />
          <div className="result-ribbon">
            <div>
              <span>气味画像</span>
              <strong>{formula.portrait}</strong>
            </div>
            <div>
              <span>制作状态</span>
              <strong>{formula.craftNote}</strong>
            </div>
            <div>
              <span>成品形态</span>
              <strong>{format}</strong>
            </div>
          </div>
          <div className="profile-bars">
            {[
              ["清", "fresh"],
              ["木", "wood"],
              ["暖", "warm"],
              ["甜", "sweet"],
            ].map(([label, key]) => (
              <div key={key}>
                <span>{label}</span>
                <i style={{ height: `${Math.max(18, formula.profile[key] * 4)}%` }} />
              </div>
            ))}
          </div>
          <dl className="formula-stats">
            <div>
              <dt>留香</dt>
              <dd>{formula.lasting}</dd>
            </div>
            <div>
              <dt>烟感</dt>
              <dd>{formula.smoke}</dd>
            </div>
            <div>
              <dt>调性</dt>
              <dd>{formula.tone}</dd>
            </div>
          </dl>
          <div className="craft-ledger">
            {craftSteps.map((step, index) => {
              const score = Math.round(Object.values(scores)[index] ?? 0);
              return (
                <div key={step.title}>
                  <span>{step.title}</span>
                  <i>
                    <b style={{ width: `${score}%` }} />
                  </i>
                  <em>{score}%</em>
                </div>
              );
            })}
          </div>
          <p className="formula-copy">当前香方以{formula.dominant.label}为主轴，配伍为 {formula.mix}。制香状态：{formula.craftNote}。</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="button-primary" type="button" onClick={saveFormula}>
              <Save size={18} /> 保存香方
            </button>
            <button className="button-secondary" type="button" onClick={downloadFormula}>
              <Download size={18} /> 生成分享
            </button>
            <button
              className="icon-button"
              type="button"
              title="重置香方"
              onClick={() => {
                setIngredients(initialIngredients);
                setFormat("线香");
                setMood("静坐");
                setCraft(initialCraft);
                setGameStep(0);
              }}
            >
              <RotateCcw size={18} />
            </button>
          </div>
          <p className="status-text">{status.formula}</p>
        </div>
      </section>
      )}

      {activeSitePage === "booking" && (
      <section id="booking" className="section-pad booking-section routed-section">
        <div className="section-heading">
          <div>
            <p className="kicker">BOOKING</p>
            <h2 className="section-title">预约体验与课程</h2>
            <p className="section-copy">把“想了解香”变成一次可以到店完成的体验。</p>
          </div>
          <span className="badge">60-120min</span>
        </div>
        <div className="service-cards">
          {[
            ["DIY 制香体验", "适合初次接触、朋友同行与亲子体验", "¥98/人"],
            ["基础香道课程", "识香、品香、用香，建立日常香气审美", "¥128 起"],
            ["高端雅集定制", "小型会客、礼赠、企业团建与品牌联名", "预约报价"],
          ].map(([title, copy, price]) => (
            <article key={title}>
              <strong>{title}</strong>
              <span>{copy}</span>
              <em>{price}</em>
            </article>
          ))}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="timeline">
            {[
              ["15'", "文化导入", "理解东方香气与日常疗愈的关系，进入专注状态。"],
              ["25'", "香材认知", "辨识木、花、草、树脂等香材，建立个人香气偏好。"],
              ["15'", "手作成型", "揉泥、选模、塑形，可选择祥云、莲花、回纹等纹样。"],
              ["5'", "冥想带走", "完成品香冥想，配套礼盒与使用指南带回家。"],
            ].map(([time, title, copy]) => (
              <article key={title}>
                <strong>{time}</strong>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
          <form className="booking-form" onSubmit={submitBooking}>
            <label>
              服务类型
              <select name="service">
                <option>DIY 制香体验 ¥98/人</option>
                <option>基础香道课程 ¥128-398/人</option>
                <option>高端雅集课 ¥688-1288/人</option>
                <option>企业团建定制 ¥88-108/人</option>
              </select>
            </label>
            <div className="form-grid two-cols">
              <label>
                预约日期
                <input type="date" name="date" min={today} required />
              </label>
              <label>
                到店时段
                <select name="time" defaultValue="14:00-16:00">
                  <option>10:00-12:00</option>
                  <option>14:00-16:00</option>
                  <option>16:00-18:00</option>
                  <option>18:30-20:30</option>
                </select>
              </label>
            </div>
            <div className="form-grid two-cols">
              <label>
                人数
                <input type="number" name="people" min="1" max="30" defaultValue="2" required />
              </label>
              <label>
                姓名
                <input type="text" name="name" placeholder="怎么称呼您" maxLength="24" />
              </label>
            </div>
            <label>
              联系方式
              <input type="tel" name="contact" placeholder="手机号 / 微信" maxLength="40" required />
            </label>
            <label>
              预约备注
              <textarea name="note" rows="3" placeholder="如亲子/团建、香牌纹样、预算或特殊时间" maxLength="120" />
            </label>
            <button className="button-primary justify-center" type="submit">
              <Send size={18} /> 确认预约
            </button>
            <p className="status-text">{status.booking}</p>
          </form>
        </div>
      </section>
      )}

      {activeSitePage === "journal" && (
      <section id="journal" className="section-pad journal-grid routed-section">
        <div>
          <p className="kicker">JOURNAL</p>
          <h2 className="section-title">文化文章与笔记墙</h2>
          <div className="mt-7 grid gap-4">
            {[
              ["线香知识", "沉香的清、甜、凉与木韵", "从产区、醇化与合香比例理解一支线香的层次，也更容易找到适合自己的日常香气。"],
              ["活动资讯", "周末手作香牌体验", "适合亲子、朋友同行与独处体验，从文化认知到手作实践，带走自己的香品。"],
            ].map(([tag, title, copy]) => (
              <article className="journal-card" key={title}>
                <span>{tag}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
        <section className="note-wall">
          <form className="note-form" onSubmit={submitNote}>
            <MessageCircle size={18} />
            <input type="text" name="note" maxLength="42" placeholder="写下今天的香气感受" required />
            <button className="icon-button" type="submit" title="发布">
              <Send size={17} />
            </button>
          </form>
          <div className="mt-5 grid gap-3">
            {notes.map((note) => (
              <p className="note-item" key={note.id}>
                {note.content}
              </p>
            ))}
          </div>
          <div className="mt-7">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-serif text-2xl font-bold">已保存香方</h3>
              <button className="small-icon" type="button" title="清空" onClick={() => setSaved([])}>
                <Minus size={16} />
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              {saved.length === 0 ? (
                <p className="empty-text">暂无收藏</p>
              ) : (
                saved.map((item, index) => (
                  <div className="saved-item" key={`${item.name}-${index}`}>
                    <strong>{item.name}</strong>
                    <span>{item.mix}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </section>
      )}

      {activeSitePage === "contact" && (
      <section id="contact" className="contact-section routed-section">
        <div>
          <p className="kicker">CONTACT</p>
          <h2 className="section-title">联系 {brandContact.name}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-9 text-white/75">
            东方香气艺术空间，提供线香零售、香道课程、手作体验与团体活动定制。复制微信号、预约到店或直接打开地图导航。
          </p>
          <div className="contact-actions">
            <button className="button-secondary" type="button" onClick={copyWechat}>
              <Copy size={18} /> 复制微信号
            </button>
            <button className="button-secondary" type="button" onClick={() => navigateSitePage(sitePages.find((page) => page.id === "booking"))}>
              <CalendarDays size={18} /> 预约到店
            </button>
            <a className="button-ghost-light" href={brandContact.store.mapUrl} target="_blank" rel="noreferrer">
              <MapPin size={18} /> 打开地图
            </a>
          </div>
          <p className="contact-status" aria-live="polite">{status.contact}</p>
        </div>
        <div className="contact-grid">
          <article className="contact-card">
            <MessageCircle size={20} />
            <strong>{brandContact.wechat.label}</strong>
            <span className="contact-value">{brandContact.wechat.id}</span>
            <span>{brandContact.wechat.helper}</span>
            <button className="contact-link" type="button" onClick={copyWechat}>
              复制微信号 <Copy size={15} />
            </button>
          </article>
          <article className="contact-card">
            <MapPin size={20} />
            <strong>门店地址</strong>
            <span className="contact-value">{brandContact.store.name}</span>
            <span>{brandContact.store.address}</span>
            <a className="contact-link" href={brandContact.store.mapUrl} target="_blank" rel="noreferrer">
              跳转地图 <ExternalLink size={15} />
            </a>
          </article>
          <article className="contact-card">
            <Users size={20} />
            <strong>社媒入口</strong>
            <span>上线前将占位账号替换为真实主页链接。</span>
            <div className="social-links">
              {brandContact.socials.map((social) => (
                <a key={social.name} href={social.url} target={social.url.startsWith("http") ? "_blank" : undefined} rel={social.url.startsWith("http") ? "noreferrer" : undefined}>
                  {social.name}
                  <small>{social.handle}</small>
                </a>
              ))}
            </div>
          </article>
          <article className="contact-card qr-card">
            <img src={brandContact.wechat.qrImage} alt={brandContact.wechat.qrAlt} loading="lazy" />
            <div>
              <strong>微信二维码</strong>
              <span>当前为明显占位图，上线前替换配置中的真实二维码路径。</span>
            </div>
          </article>
          <article className="contact-card">
            <HeartHandshake size={20} />
            <strong>合作咨询</strong>
            <span className="contact-value">{brandContact.collaboration.label}</span>
            <span>{brandContact.collaboration.note}</span>
          </article>
          <article className="contact-card">
            <Leaf size={20} />
            <strong>主理理念</strong>
            <span>以天然香材安顿日常精神生活。</span>
          </article>
        </div>
      </section>
      )}

      {selectedProduct && (
        <div className="dialog-backdrop" role="dialog" aria-modal="true" aria-label={`${selectedProduct.name}详情`}>
          <div className="product-dialog">
            <button className="dialog-close" type="button" title="关闭" onClick={() => setSelectedProduct(null)}>
              ×
            </button>
            <img className={`product-image product-image-${selectedProduct.id}`} src={selectedProduct.image} alt={selectedProduct.name} />
            <div className="p-6">
              <span className="category-tag">{selectedProduct.categoryLabel}</span>
              <h2 className="mt-3 font-serif text-4xl font-bold">{selectedProduct.name}</h2>
              <p className="mt-3 text-[var(--muted)]">{selectedProduct.note} · {selectedProduct.spec} · 库存 {selectedProduct.stock}</p>
              <p className="mt-5 leading-8 text-[var(--muted)]">{selectedProduct.desc}</p>
              <div className="mt-6 flex items-center justify-between gap-4">
                <strong className="text-2xl">{currency(selectedProduct.price)}</strong>
                <button
                  className="button-primary"
                  type="button"
                  onClick={() => addToCart(selectedProduct)}
                  disabled={cartQuantity(cart, selectedProduct.id) >= selectedProduct.stock}
                >
                  <ShoppingBag size={18} /> 加入香篮 <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {bookingConfirmation && (
        <div className="dialog-backdrop booking-success-backdrop" role="dialog" aria-modal="true" aria-label="预约提交成功">
          <div className="booking-success-dialog">
            <div className="success-mark" aria-hidden="true">
              <Check size={30} />
            </div>
            <p className="kicker">BOOKING SENT</p>
            <h2>预约提交成功</h2>
            <p>
              我们已经收到您的预约，后台也已同步。稍后会通过您留下的联系方式确认到店安排。
            </p>
            <dl>
              <div>
                <dt>预约内容</dt>
                <dd>{bookingConfirmation.service}</dd>
              </div>
              <div>
                <dt>到店时间</dt>
                <dd>{bookingConfirmation.date} · {bookingConfirmation.time || "时段待定"}</dd>
              </div>
              <div>
                <dt>预约编号</dt>
                <dd>{bookingConfirmation.id}</dd>
              </div>
            </dl>
            <button className="button-primary justify-center" type="button" onClick={() => setBookingConfirmation(null)}>
              知道了
            </button>
          </div>
        </div>
      )}
      <nav className="mobile-quick-nav" aria-label="移动端快捷导航">
        <button type="button" onClick={() => navigateSitePage(sitePages.find((page) => page.id === "brand"))} aria-current={activeSitePage === "brand" ? "page" : undefined}>
          <Home size={17} />
          首页
        </button>
        <button type="button" onClick={() => navigateSitePage(sitePages.find((page) => page.id === "shop"))} aria-current={activeSitePage === "shop" ? "page" : undefined}>
          <ShoppingBag size={17} />
          商城
        </button>
        <button type="button" onClick={() => navigateSitePage(sitePages.find((page) => page.id === "maker"))} aria-current={activeSitePage === "maker" ? "page" : undefined}>
          <Sparkles size={17} />
          制香
        </button>
        <button type="button" onClick={() => navigateSitePage(sitePages.find((page) => page.id === "booking"))} aria-current={activeSitePage === "booking" ? "page" : undefined}>
          <CalendarDays size={17} />
          预约
        </button>
        <button type="button" onClick={() => navigateSitePage(sitePages.find((page) => page.id === "contact"))} aria-current={activeSitePage === "contact" ? "page" : undefined}>
          <MessageCircle size={17} />
          咨询
        </button>
      </nav>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
