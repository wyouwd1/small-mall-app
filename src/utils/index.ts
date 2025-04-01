import Taro from '@tarojs/taro';
import config from '../config/env';

/**
 * 格式化金额
 * @param price 金额
 * @param decimals 小数位数
 * @param prefix 前缀
 */
export const formatPrice = (price: number | string, decimals = 2, prefix = '¥') => {
  if (!price) return `${prefix}0.00`;
  return `${prefix}${Number(price).toFixed(decimals)}`;
};

/**
 * 格式化日期
 * @param date 日期
 * @param format 格式
 */
export const formatDate = (date: Date | string | number, format = 'YYYY-MM-DD HH:mm:ss') => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();

  return format
    .replace('YYYY', String(year))
    .replace('MM', String(month).padStart(2, '0'))
    .replace('DD', String(day).padStart(2, '0'))
    .replace('HH', String(hour).padStart(2, '0'))
    .replace('mm', String(minute).padStart(2, '0'))
    .replace('ss', String(second).padStart(2, '0'));
};

/**
 * 存储数据
 * @param key 键
 * @param value 值
 */
export const setStorage = (key: string, value: any) => {
  try {
    Taro.setStorageSync(key, JSON.stringify(value));
  } catch (error) {
    console.error('setStorage error:', error);
  }
};

/**
 * 获取存储数据
 * @param key 键
 * @param defaultValue 默认值
 */
export const getStorage = <T>(key: string, defaultValue?: T): T | undefined => {
  try {
    const value = Taro.getStorageSync(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error('getStorage error:', error);
    return defaultValue;
  }
};

/**
 * 删除存储数据
 * @param key 键
 */
export const removeStorage = (key: string) => {
  try {
    Taro.removeStorageSync(key);
  } catch (error) {
    console.error('removeStorage error:', error);
  }
};

/**
 * 清空存储数据
 */
export const clearStorage = () => {
  try {
    Taro.clearStorageSync();
  } catch (error) {
    console.error('clearStorage error:', error);
  }
};

/**
 * 防抖函数
 * @param fn 函数
 * @param delay 延迟时间
 */
export const debounce = <T extends (...args: any[]) => any>(fn: T, delay = 300) => {
  let timer: NodeJS.Timeout;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

/**
 * 节流函数
 * @param fn 函数
 * @param delay 延迟时间
 */
export const throttle = <T extends (...args: any[]) => any>(fn: T, delay = 300) => {
  let timer: NodeJS.Timeout | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
};

/**
 * 获取图片信息
 * @param src 图片地址
 */
export const getImageInfo = (src: string) => {
  return new Promise<Taro.getImageInfo.SuccessCallbackResult>((resolve, reject) => {
    Taro.getImageInfo({
      src,
      success: resolve,
      fail: reject,
    });
  });
};

/**
 * 图片错误处理
 * @param e 事件对象
 * @param type 图片类型
 */
export const handleImageError = (e: Event, type: 'product' | 'avatar' = 'product') => {
  if (e.target) {
    (e.target as HTMLImageElement).src = config.business.image[
      type === 'product' ? 'defaultProduct' : 'defaultAvatar'
    ];
  }
};

/**
 * 检查更新
 */
export const checkUpdate = () => {
  if (Taro.canIUse('getUpdateManager')) {
    const updateManager = Taro.getUpdateManager();
    updateManager.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(() => {
          Taro.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: (result) => {
              if (result.confirm) {
                updateManager.applyUpdate();
              }
            },
          });
        });
        updateManager.onUpdateFailed(() => {
          Taro.showModal({
            title: '更新提示',
            content: '新版本下载失败，请检查网络后重试',
            showCancel: false,
          });
        });
      }
    });
  }
};

/**
 * 获取页面标题
 * @param key 页面key
 */
export const getPageTitle = (key: keyof typeof config.business.pageTitle) => {
  return config.business.pageTitle[key] || '';
};

/**
 * 复制文本
 * @param text 文本
 */
export const copyText = (text: string) => {
  Taro.setClipboardData({
    data: text,
    success: () => {
      Taro.showToast({
        title: '复制成功',
        icon: 'success',
      });
    },
  });
};

/**
 * 打开外部链接
 * @param url 链接
 */
export const openUrl = (url: string) => {
  // 如果是http链接，使用webview打开
  if (url.startsWith('http')) {
    Taro.navigateTo({
      url: `/pages/webview/index?url=${encodeURIComponent(url)}`,
    });
  } else {
    // 否则当作内部页面跳转
    Taro.navigateTo({ url });
  }
};