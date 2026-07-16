var ingredients = [
  { id: "agarwood", name: "沉香", note: "深木、安定、留香", value: 6, profile: { fresh: 1, wood: 5, warm: 3, sweet: 1 } },
  { id: "sandalwood", name: "檀木", note: "温润、木质、底韵", value: 7, profile: { fresh: 1, wood: 4, warm: 4, sweet: 2 } },
  { id: "benzoin", name: "安息香", note: "树脂、甜润、圆融", value: 4, profile: { fresh: 1, wood: 1, warm: 4, sweet: 5 } },
  { id: "clove", name: "丁香", note: "辛暖、醒神、扩散", value: 2, profile: { fresh: 1, wood: 1, warm: 5, sweet: 2 } },
  { id: "lotus", name: "莲房", note: "清苦、草本、收束", value: 4, profile: { fresh: 5, wood: 1, warm: 1, sweet: 1 } },
  { id: "tea", name: "白茶", note: "清雅、微甜、轻盈", value: 5, profile: { fresh: 5, wood: 1, warm: 1, sweet: 3 } },
  { id: "rose", name: "玫瑰", note: "花香、柔和、明亮", value: 3, profile: { fresh: 3, wood: 0, warm: 1, sweet: 5 } },
  { id: "binder", name: "楠木粘粉", note: "成型、燃烧、承托", value: 2, profile: { fresh: 0, wood: 2, warm: 1, sweet: 0 } },
];

var presets = {
  静坐: { agarwood: 7, sandalwood: 7, benzoin: 4, clove: 1, lotus: 4, tea: 4, rose: 1, binder: 2 },
  夜读: { agarwood: 4, sandalwood: 6, benzoin: 3, clove: 2, lotus: 2, tea: 7, rose: 2, binder: 2 },
  会客: { agarwood: 3, sandalwood: 5, benzoin: 5, clove: 1, lotus: 2, tea: 4, rose: 6, binder: 2 },
  晨起: { agarwood: 2, sandalwood: 4, benzoin: 2, clove: 3, lotus: 5, tea: 8, rose: 3, binder: 2 },
};

module.exports = {
  ingredients: ingredients,
  presets: presets,
};
