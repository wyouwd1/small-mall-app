// 环境变量
const ENV = process.env.NODE_ENV;

// 配置
const config = {
  // 开发环境
  development: {
    baseUrl: 'http://localhost:3000/api',
    uploadUrl: 'http://localhost:3000/upload',
    cdnUrl: 'http://localhost:3000/static',
    wsUrl: 'ws://localhost:3000',
  },
  // 生产环境
  production: {
    baseUrl: 'https://api.example.com',
    uploadUrl: 'https://api.example.com/upload',
    cdnUrl: 'https://cdn.example.com',
    wsUrl: 'wss://api.example.com',
  },
};

// 当前环境配置
const currentConfig = config[ENV as keyof typeof config] || config.development;

export default {
  // 环境
  isDev: ENV === 'development',
  isProd: ENV === 'production',

  // 接口地址
  baseUrl: currentConfig.baseUrl,
  uploadUrl: currentConfig.uploadUrl,
  cdnUrl: currentConfig.cdnUrl,
  wsUrl: currentConfig.wsUrl,

  // 版本信息
  version: '1.0.0',

  // 缓存 key
  storageKey: {
    token: 'TOKEN',
    userInfo: 'USER_INFO',
    cartCount: 'CART_COUNT',
    searchHistory: 'SEARCH_HISTORY',
  },

  // 业务配置
  business: {
    // 页面标题
    pageTitle: {
      index: '首页',
      category: '分类',
      cart: '购物车',
      mine: '我的',
      login: '登录',
      register: '注册',
      search: '搜索',
      detail: '商品详情',
    },
    // 图片配置
    image: {
      // 默认头像
      defaultAvatar: 'https://img11.360buyimg.com/imagetools/jfs/t1/137646/13/7132/1648/5f4c748bE43da8ddd/a3f06d51dcae7b60.png',
      // 默认商品图片
      defaultProduct: 'https://img11.360buyimg.com/imagetools/jfs/t1/137646/13/7132/1648/5f4c748bE43da8ddd/a3f06d51dcae7b60.png',
      // 占位图
      placeholder: 'https://img11.360buyimg.com/imagetools/jfs/t1/137646/13/7132/1648/5f4c748bE43da8ddd/a3f06d51dcae7b60.png',
    },
    // 正则表达式
    regex: {
      phone: /^1[3-9]\d{9}$/,
      email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/,
    },
  },
};