Page({
  data: {
    contact: {},
    orders: [],
    bookings: [],
    formulas: [],
  },
  onShow: function () {
    this.setData({
      contact: getContact(),
      orders: wx.getStorageSync("orders") || [],
      bookings: wx.getStorageSync("bookings") || [],
      formulas: wx.getStorageSync("formulas") || [],
    });
  },
  copyWechat: function () {
    wx.setClipboardData({ data: this.data.contact.wechat || "" });
  },
  callStore: function () {
    wx.showToast({ title: "请先填写门店电话", icon: "none" });
  },
  clearRecords: function () {
    var page = this;
    wx.showModal({
      title: "清空本机记录",
      content: "将删除本机保存的订单、预约与香方。",
      success: function (res) {
        if (!res.confirm) return;
        wx.setStorageSync("orders", []);
        wx.setStorageSync("bookings", []);
        wx.setStorageSync("formulas", []);
        page.onShow();
      },
    });
  },
});

function getContact() {
  try {
    var contactData = require("../../data/contact");
    return contactData.contact || {};
  } catch (error) {
    return {};
  }
}
