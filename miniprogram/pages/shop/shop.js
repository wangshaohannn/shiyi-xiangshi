Page({
  data: {
    categories: [],
    products: [],
    filteredProducts: [],
    activeCategory: "all",
    selectedProduct: null,
    cart: [],
    total: 0,
    buyerName: "",
    buyerPhone: "",
    remark: "",
    pickupOptions: ["到店自提", "同城配送", "快递寄送"],
    pickupIndex: 0,
  },
  onLoad: function () {
    var productData = getProductData();
    var categories = productData.categories || [];
    var products = productData.products || [];
    this.setData({
      categories: categories,
      products: products,
      filteredProducts: products,
      selectedProduct: products[0] || null,
    });
  },
  chooseCategory: function (event) {
    var id = event.currentTarget.dataset.id;
    var filteredProducts = filterProducts(this.data.products, id);
    this.setData({
      activeCategory: id,
      filteredProducts: filteredProducts,
      selectedProduct: filteredProducts[0] || null,
    });
  },
  selectProduct: function (event) {
    var product = findProductById(this.data.products, event.currentTarget.dataset.id);
    this.setData({ selectedProduct: product || null });
  },
  addSelected: function () {
    if (!this.data.selectedProduct) return;
    this.addProduct(this.data.selectedProduct.id);
  },
  addFromList: function (event) {
    this.addProduct(event.currentTarget.dataset.id);
  },
  addProduct: function (id) {
    var product = findProductById(this.data.products, id);
    if (!product) return;

    var cart = copyCart(this.data.cart);
    var existing = null;
    for (var i = 0; i < cart.length; i += 1) {
      if (cart[i].id === id) {
        existing = cart[i];
        break;
      }
    }

    if (existing) {
      existing.count += 1;
    } else {
      cart.push(createCartItem(product));
    }

    this.setData({ cart: cart, total: calcTotal(cart) });
    wx.showToast({ title: "已加入清单", icon: "success" });
  },
  changeCount: function (event) {
    var id = event.currentTarget.dataset.id;
    var step = Number(event.currentTarget.dataset.step);
    var cart = [];
    for (var i = 0; i < this.data.cart.length; i += 1) {
      var item = this.data.cart[i];
      var nextItem = item;
      if (item.id === id) {
        nextItem = createCartItem(item);
        nextItem.count = Math.max(0, item.count + step);
      }
      if (nextItem.count > 0) cart.push(nextItem);
    }
    this.setData({ cart: cart, total: calcTotal(cart) });
  },
  clearCart: function () {
    this.setData({ cart: [], total: 0 });
  },
  bindInput: function (event) {
    setDynamicField(this, event.currentTarget.dataset.field, event.detail.value);
  },
  bindPickup: function (event) {
    this.setData({ pickupIndex: Number(event.detail.value) });
  },
  submitOrder: function () {
    if (!this.data.cart.length) {
      wx.showToast({ title: "先选择香品", icon: "none" });
      return;
    }
    if (!this.data.buyerName.trim() || !this.data.buyerPhone.trim()) {
      wx.showToast({ title: "填写姓名和电话", icon: "none" });
      return;
    }

    var orderItems = [];
    for (var i = 0; i < this.data.cart.length; i += 1) {
      var cartItem = this.data.cart[i];
      orderItems.push({
        id: cartItem.id,
        name: cartItem.name,
        price: cartItem.price,
        count: cartItem.count,
      });
    }

    var order = {
      id: "order-" + Date.now(),
      items: orderItems,
      total: this.data.total,
      pickup: this.data.pickupOptions[this.data.pickupIndex],
      buyerName: this.data.buyerName.trim(),
      buyerPhone: this.data.buyerPhone.trim(),
      remark: this.data.remark.trim(),
      status: "待确认",
      createdAt: new Date().toISOString(),
    };
    var orders = wx.getStorageSync("orders") || [];
    orders.unshift(order);
    wx.setStorageSync("orders", orders);
    this.setData({ cart: [], total: 0, buyerName: "", buyerPhone: "", remark: "" });
    wx.showModal({
      title: "已生成咨询单",
      content: "订单已保存到“我的”，请等待店主微信或电话确认。",
      showCancel: false,
    });
  },
});

function getProductData() {
  try {
    return require("../../data/products");
  } catch (error) {
    return {
      categories: [],
      products: [],
    };
  }
}

function calcTotal(cart) {
  var sum = 0;
  for (var i = 0; i < cart.length; i += 1) {
    sum += cart[i].price * cart[i].count;
  }
  return sum;
}

function findProductById(items, id) {
  for (var i = 0; i < items.length; i += 1) {
    if (items[i].id === id) return items[i];
  }
  return null;
}

function filterProducts(items, categoryId) {
  if (categoryId === "all") return items;
  var result = [];
  for (var i = 0; i < items.length; i += 1) {
    if (items[i].category === categoryId) result.push(items[i]);
  }
  return result;
}

function copyCart(cart) {
  var next = [];
  for (var i = 0; i < cart.length; i += 1) {
    next.push(cart[i]);
  }
  return next;
}

function createCartItem(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    categoryLabel: product.categoryLabel,
    spec: product.spec,
    price: product.price,
    stock: product.stock,
    image: product.image,
    note: product.note,
    desc: product.desc,
    count: product.count || 1,
  };
}

function setDynamicField(page, field, value) {
  var patch = {};
  patch[field] = value;
  page.setData(patch);
}
