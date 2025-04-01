import Taro from '@tarojs/taro';
import config from '../config/env';

/**
 * 存储管理类
 */
class Storage {
  private prefix: string;
  private expire: number;

  constructor(prefix = 'app_', defaultExpire = 7 * 24 * 60 * 60 * 1000) {
    this.prefix = prefix;
    this.expire = defaultExpire;
  }

  /**
   * 获取完整的键名
   * @param key 键名
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * 设置存储
   * @param key 键名
   * @param value 值
   * @param expire 过期时间（毫秒）
   */
  set<T>(key: string, value: T, expire?: number): void {
    try {
      const data = {
        value,
        expire: expire ? Date.now() + expire : Date.now() + this.expire
      };
      Taro.setStorageSync(this.getKey(key), JSON.stringify(data));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  }

  /**
   * 获取存储
   * @param key 键名
   * @param defaultValue 默认值
   */
  get<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const data = Taro.getStorageSync(this.getKey(key));
      if (!data) return defaultValue;

      const { value, expire } = JSON.parse(data);
      // 判断是否过期
      if (expire && expire < Date.now()) {
        this.remove(key);
        return defaultValue;
      }
      return value;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  }

  /**
   * 删除存储
   * @param key 键名
   */
  remove(key: string): void {
    try {
      Taro.removeStorageSync(this.getKey(key));
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  }

  /**
   * 清空所有存储
   */
  clear(): void {
    try {
      Taro.clearStorageSync();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }

  /**
   * 获取所有存储的键
   */
  keys(): string[] {
    try {
      return Taro.getStorageInfoSync().keys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.slice(this.prefix.length));
    } catch (error) {
      console.error('Storage keys error:', error);
      return [];
    }
  }
}

// 创建存储实例
const storage = new Storage();

/**
 * 用户数据存储管理
 */
export const userStorage = {
  // 设置token
  setToken(token: string): void {
    storage.set(config.storageKey.token, token);
  },

  // 获取token
  getToken(): string | undefined {
    return storage.get<string>(config.storageKey.token);
  },

  // 删除token
  removeToken(): void {
    storage.remove(config.storageKey.token);
  },

  // 设置用户信息
  setUserInfo(userInfo: any): void {
    storage.set(config.storageKey.userInfo, userInfo);
  },

  // 获取用户信息
  getUserInfo<T>(): T | undefined {
    return storage.get<T>(config.storageKey.userInfo);
  },

  // 删除用户信息
  removeUserInfo(): void {
    storage.remove(config.storageKey.userInfo);
  },

  // 清除所有用户数据
  clear(): void {
    this.removeToken();
    this.removeUserInfo();
  }
};

/**
 * 购物车数据存储管理
 */
export const cartStorage = {
  // 设置购物车数量
  setCount(count: number): void {
    storage.set(config.storageKey.cartCount, count);
  },

  // 获取购物车数量
  getCount(): number {
    return storage.get<number>(config.storageKey.cartCount, 0);
  },

  // 增加购物车数量
  increaseCount(num = 1): void {
    const count = this.getCount();
    this.setCount(count + num);
  },

  // 减少购物车数量
  decreaseCount(num = 1): void {
    const count = this.getCount();
    this.setCount(Math.max(0, count - num));
  }
};

/**
 * 搜索历史记录存储管理
 */
export const searchStorage = {
  // 获取搜索历史
  getHistory(): string[] {
    return storage.get<string[]>(config.storageKey.searchHistory, []);
  },

  // 添加搜索历史
  addHistory(keyword: string): void {
    const history = this.getHistory();
    // 去重并限制数量
    const newHistory = [
      keyword,
      ...history.filter(item => item !== keyword)
    ].slice(0, 10);
    storage.set(config.storageKey.searchHistory, newHistory);
  },

  // 删除搜索历史
  removeHistory(keyword: string): void {
    const history = this.getHistory();
    storage.set(
      config.storageKey.searchHistory,
      history.filter(item => item !== keyword)
    );
  },

  // 清空搜索历史
  clearHistory(): void {
    storage.remove(config.storageKey.searchHistory);
  }
};

export default storage;