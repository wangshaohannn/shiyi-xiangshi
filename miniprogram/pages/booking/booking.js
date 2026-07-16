var serviceOptions = ["DIY 香牌体验", "线香选购咨询", "团建课程", "礼赠定制"];
var peopleOptions = ["1 人", "2 人", "3-4 人", "5-8 人", "8 人以上"];
var timeOptions = ["10:30", "13:30", "15:30", "19:00"];

function setDynamicField(page, field, value) {
  var patch = {};
  patch[field] = value;
  page.setData(patch);
}

Page({
  data: {
    serviceOptions: serviceOptions,
    peopleOptions: peopleOptions,
    timeOptions: timeOptions,
    serviceIndex: 0,
    peopleIndex: 1,
    timeIndex: 1,
    date: "",
    name: "",
    phone: "",
    remark: "",
  },
  onLoad: function () {
    var now = new Date();
    now.setDate(now.getDate() + 1);
    var date = now.toISOString().slice(0, 10);
    this.setData({ date: date });
  },
  bindPicker: function (event) {
    setDynamicField(this, event.currentTarget.dataset.field, Number(event.detail.value));
  },
  bindInput: function (event) {
    setDynamicField(this, event.currentTarget.dataset.field, event.detail.value);
  },
  bindDate: function (event) {
    this.setData({ date: event.detail.value });
  },
  submitBooking: function () {
    if (!this.data.name.trim() || !this.data.phone.trim()) {
      wx.showToast({ title: "填写姓名和联系方式", icon: "none" });
      return;
    }

    var booking = {
      id: "booking-" + Date.now(),
      service: serviceOptions[this.data.serviceIndex],
      people: peopleOptions[this.data.peopleIndex],
      date: this.data.date,
      time: timeOptions[this.data.timeIndex],
      name: this.data.name.trim(),
      phone: this.data.phone.trim(),
      remark: this.data.remark.trim(),
      status: "待确认",
      createdAt: new Date().toISOString(),
    };
    var bookings = wx.getStorageSync("bookings") || [];
    bookings.unshift(booking);
    wx.setStorageSync("bookings", bookings);
    this.setData({ name: "", phone: "", remark: "" });
    wx.showModal({
      title: "预约已提交",
      content: "预约信息已保存到“我的”，店主确认后即可到店体验。",
      showCancel: false,
    });
  },
});
