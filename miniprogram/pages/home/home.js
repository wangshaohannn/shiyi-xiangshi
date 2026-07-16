Page({
  data: {
    featured: [],
    notes: [],
    services: [
      { title: "按场景选香", text: "日用、静坐、礼赠和雅集分层推荐。" },
      { title: "手作体验", text: "香材认知、研磨塑形、成品带走。" },
      { title: "礼赠定制", text: "按预算、人数和香气偏好配置礼盒。" },
    ],
  },
  onLoad: function () {
    var homeData = getHomeData();
    var products = homeData.products || [];
    this.setData({
      featured: products.slice(0, 3),
      notes: homeData.notes || [],
    });
  },
  goShop: function () {
    wx.switchTab({ url: "/pages/shop/shop" });
  },
  goMaker: function () {
    wx.switchTab({ url: "/pages/maker/maker" });
  },
  goBooking: function () {
    wx.switchTab({ url: "/pages/booking/booking" });
  },
  previewProduct: function (event) {
    var product = findProductById(this.data.featured, event.currentTarget.dataset.id);
    if (!product) return;
    wx.previewImage({
      current: product.image,
      urls: mapImages(this.data.featured),
    });
  },
});

function getHomeData() {
  try {
    return require("../../data/products");
  } catch (error) {
    return {
      products: [],
      notes: [],
    };
  }
}

function findProductById(items, id) {
  for (var i = 0; i < items.length; i += 1) {
    if (items[i].id === id) return items[i];
  }
  return null;
}

function mapImages(items) {
  var urls = [];
  for (var i = 0; i < items.length; i += 1) {
    urls.push(items[i].image);
  }
  return urls;
}
