const storeAddressPlaceholder = "TODO：填写完整门店地址（例：上海市某区某路 11 号 2F）";

export const brandContact = {
  name: "拾壹香室",
  consultationCta: "微信咨询",
  consultationCopy: "把预算、用途、人数或想体验的课程发来，主理人会协助推荐。",
  wechat: {
    id: "TODO_WECHAT_ID",
    label: "官方微信",
    helper: "复制微信号后，在微信内搜索添加咨询。",
    qrImage: "/assets/contact-qr-placeholder.svg",
    qrAlt: "拾壹香室微信二维码占位图，请替换为真实二维码",
  },
  store: {
    name: "拾壹香室体验空间",
    city: "上海",
    address: storeAddressPlaceholder,
    mapUrl: `https://uri.amap.com/search?keyword=${encodeURIComponent(storeAddressPlaceholder)}`,
  },
  socials: [
    {
      name: "小红书",
      handle: "TODO：填写小红书账号",
      url: "https://www.xiaohongshu.com/",
    },
    {
      name: "微信视频号",
      handle: "TODO：填写视频号名称",
      url: "#contact",
    },
    {
      name: "抖音",
      handle: "TODO：填写抖音号",
      url: "https://www.douyin.com/",
    },
  ],
  collaboration: {
    label: "课程 / 团建 / 礼赠 / 品牌联名",
    note: "请先复制微信号沟通人数、时间、预算与合作方向。",
  },
};
