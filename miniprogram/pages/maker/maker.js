Page({
  data: {
    ingredients: [],
    presets: [],
    formula: null,
  },
  onLoad: function () {
    var atelierData = getAtelierData();
    var ingredients = cloneIngredients(atelierData.ingredients || []);
    this.setData({
      ingredients: ingredients,
      presets: objectKeys(atelierData.presets || {}),
      formula: buildFormula(ingredients),
    });
  },
  changeIngredient: function (event) {
    var id = event.currentTarget.dataset.id;
    var value = Number(event.detail.value);
    var ingredients = [];
    for (var i = 0; i < this.data.ingredients.length; i += 1) {
      var item = cloneIngredient(this.data.ingredients[i]);
      if (item.id === id) item.value = value;
      ingredients.push(item);
    }
    this.setData({ ingredients: ingredients, formula: buildFormula(ingredients) });
  },
  applyPreset: function (event) {
    var atelierData = getAtelierData();
    var preset = atelierData.presets[event.currentTarget.dataset.name];
    if (!preset) return;
    var ingredients = [];
    for (var i = 0; i < this.data.ingredients.length; i += 1) {
      var item = cloneIngredient(this.data.ingredients[i]);
      if (preset[item.id] !== undefined) item.value = preset[item.id];
      ingredients.push(item);
    }
    this.setData({ ingredients: ingredients, formula: buildFormula(ingredients) });
  },
  resetFormula: function () {
    var atelierData = getAtelierData();
    var ingredients = cloneIngredients(atelierData.ingredients || []);
    this.setData({ ingredients: ingredients, formula: buildFormula(ingredients) });
  },
  saveFormula: function () {
    var formulaIngredients = [];
    for (var i = 0; i < this.data.ingredients.length; i += 1) {
      var item = this.data.ingredients[i];
      formulaIngredients.push({
        id: item.id,
        name: item.name,
        value: item.value,
      });
    }
    var formula = {
      id: "formula-" + Date.now(),
      name: this.data.formula.name,
      suggestion: this.data.formula.suggestion,
      ingredients: formulaIngredients,
      createdAt: new Date().toISOString(),
    };
    var formulas = wx.getStorageSync("formulas") || [];
    formulas.unshift(formula);
    wx.setStorageSync("formulas", formulas);
    wx.showToast({ title: "香方已保存", icon: "success" });
  },
});

var profileNames = {
  fresh: ["茶岚", "晓露", "青枝", "素醒"],
  wood: ["松月", "静林", "沉山", "檀影"],
  warm: ["暖篆", "朱火", "南窗", "煦尘"],
  sweet: ["花信", "蜜息", "柔云", "月白"],
};

var ratioNames = {
  fresh: "清",
  wood: "木",
  warm: "暖",
  sweet: "甜",
};

var suggestions = {
  fresh: "适合晨起、茶席和轻阅读，建议减少树脂甜感。",
  wood: "适合静坐、书房和晚间收束，留香更稳。",
  warm: "适合会客与冷天，辛暖扩散感更明显。",
  sweet: "适合礼赠与小型雅集，气味更圆润亲近。",
};

function getAtelierData() {
  try {
    return require("../../data/atelier");
  } catch (error) {
    return {
      ingredients: [],
      presets: {},
    };
  }
}

function cloneIngredient(item) {
  return {
    id: item.id,
    name: item.name,
    note: item.note,
    value: item.value,
    profile: item.profile,
  };
}

function cloneIngredients(items) {
  var result = [];
  for (var i = 0; i < items.length; i += 1) {
    result.push(cloneIngredient(items[i]));
  }
  return result;
}

function objectKeys(object) {
  var keys = [];
  for (var key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) keys.push(key);
  }
  return keys;
}

function buildFormula(ingredients) {
  var scores = { fresh: 0, wood: 0, warm: 0, sweet: 0 };
  var keys = objectKeys(scores);
  for (var i = 0; i < ingredients.length; i += 1) {
    var ingredient = ingredients[i];
    for (var j = 0; j < keys.length; j += 1) {
      var key = keys[j];
      scores[key] += ingredient.value * (ingredient.profile[key] || 0);
    }
  }

  var dominant = keys[0] || "fresh";
  var total = 0;
  for (var k = 0; k < keys.length; k += 1) {
    var scoreKey = keys[k];
    total += scores[scoreKey];
    if (scores[scoreKey] > scores[dominant]) dominant = scoreKey;
  }
  if (!total) total = 1;

  var nameList = profileNames[dominant];
  var name = nameList[Math.min(nameList.length - 1, Math.floor(scores[dominant] / 28))];
  var ratios = [];
  for (var r = 0; r < keys.length; r += 1) {
    var ratioKey = keys[r];
    ratios.push({
      id: ratioKey,
      name: ratioNames[ratioKey],
      value: Math.round((scores[ratioKey] / total) * 100),
    });
  }

  return {
    name: name,
    dominant: dominant,
    ratios: ratios,
    suggestion: suggestions[dominant],
  };
}
