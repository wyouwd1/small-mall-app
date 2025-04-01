import storage from './storage';

/**
 * 缓存策略类型
 */
type CacheStrategy = 'memory' | 'storage' | 'both';

/**
 * 缓存配置
 */
interface CacheOptions {
  key: string;
  strategy?: CacheStrategy;
  expire?: number;
  version?: string;
}

/**
 * 缓存数据结构
 */
interface CacheData<T> {
  data: T;
  expire?: number;
  version?: string;
}

/**
 * 缓存管理类
 */
class Cache {
  // 内存缓存
  private memoryCache: Map<string, CacheData<any>> = new Map();
  // 默认过期时间（7天）
  private defaultExpire = 7 * 24 * 60 * 60 * 1000;
  // 当前版本
  private version = '1.0.0';

  /**
   * 设置缓存
   * @param options 缓存配置
   * @param value 缓存数据
   */
  set<T>(options: CacheOptions, value: T): void {
    const { key, strategy = 'both', expire, version = this.version } = options;

    const cacheData: CacheData<T> = {
      data: value,
      expire: expire ? Date.now() + expire : Date.now() + this.defaultExpire,
      version
    };

    // 根据策略存储数据
    if (strategy === 'memory' || strategy === 'both') {
      this.memoryCache.set(key, cacheData);
    }
    if (strategy === 'storage' || strategy === 'both') {
      storage.set(key, cacheData, expire);
    }
  }

  /**
   * 获取缓存
   * @param options 缓存配置
   * @param defaultValue 默认值
   */
  get<T>(options: CacheOptions, defaultValue?: T): T | undefined {
    const { key, strategy = 'both', version = this.version } = options;

    // 优先从内存缓存获取
    if (strategy === 'memory' || strategy === 'both') {
      const memoryData = this.memoryCache.get(key);
      if (this.isValidCache(memoryData, version)) {
        return memoryData.data;
      }
      this.memoryCache.delete(key);
    }

    // 从存储缓存获取
    if (strategy === 'storage' || strategy === 'both') {
      const storageData = storage.get<CacheData<T>>(key);
      if (this.isValidCache(storageData, version)) {
        // 同步到内存缓存
        if (strategy === 'both') {
          this.memoryCache.set(key, storageData);
        }
        return storageData.data;
      }
      storage.remove(key);
    }

    return defaultValue;
  }

  /**
   * 移除缓存
   * @param key 缓存键
   * @param strategy 缓存策略
   */
  remove(key: string, strategy: CacheStrategy = 'both'): void {
    if (strategy === 'memory' || strategy === 'both') {
      this.memoryCache.delete(key);
    }
    if (strategy === 'storage' || strategy === 'both') {
      storage.remove(key);
    }
  }

  /**
   * 清空缓存
   * @param strategy 缓存策略
   */
  clear(strategy: CacheStrategy = 'both'): void {
    if (strategy === 'memory' || strategy === 'both') {
      this.memoryCache.clear();
    }
    if (strategy === 'storage' || strategy === 'both') {
      storage.clear();
    }
  }

  /**
   * 检查缓存是否有效
   * @param cache 缓存数据
   * @param version 版本号
   */
  private isValidCache<T>(cache?: CacheData<T>, version?: string): boolean {
    if (!cache) return false;
    
    // 检查版本
    if (version && cache.version !== version) {
      return false;
    }

    // 检查是否过期
    if (cache.expire && cache.expire < Date.now()) {
      return false;
    }

    return true;
  }
}

// 创建缓存实例
const cache = new Cache();

/**
 * 业务数据缓存
 */
export const dataCache = {
  // 用户信息缓存
  user: {
    set: (value: any) => cache.set({ key: 'user_info', expire: 24 * 60 * 60 * 1000 }, value),
    get: <T>() => cache.get<T>({ key: 'user_info' }),
    remove: () => cache.remove('user_info')
  },

  // 购物车数据缓存
  cart: {
    set: (value: any) => cache.set({ key: 'cart_data', strategy: 'storage' }, value),
    get: <T>() => cache.get<T>({ key: 'cart_data', strategy: 'storage' }),
    remove: () => cache.remove('cart_data', 'storage')
  },

  // 搜索历史缓存
  searchHistory: {
    set: (value: string[]) => cache.set({ key: 'search_history', strategy: 'storage' }, value),
    get: () => cache.get<string[]>({ key: 'search_history', strategy: 'storage' }, []),
    remove: () => cache.remove('search_history', 'storage')
  },

  // 商品浏览记录缓存
  browseHistory: {
    set: (value: any[]) => cache.set({ key: 'browse_history', strategy: 'storage' }, value),
    get: <T>() => cache.get<T[]>({ key: 'browse_history', strategy: 'storage' }, []),
    remove: () => cache.remove('browse_history', 'storage')
  }
};

/**
 * API 数据缓存
 */
export const apiCache = {
  // 设置 API 缓存
  set: <T>(key: string, value: T, expire?: number) => {
    cache.set({ 
      key: `api_${key}`, 
      strategy: 'memory', 
      expire: expire || 5 * 60 * 1000 // 默认5分钟
    }, value);
  },

  // 获取 API 缓存
  get: <T>(key: string) => {
    return cache.get<T>({ key: `api_${key}`, strategy: 'memory' });
  },

  // 移除 API 缓存
  remove: (key: string) => {
    cache.remove(`api_${key}`, 'memory');
  },

  // 清空 API 缓存
  clear: () => {
    // 清空所有以 api_ 开头的缓存
    const keys = Array.from(cache['memoryCache'].keys());
    keys.forEach(key => {
      if (key.startsWith('api_')) {
        cache.remove(key, 'memory');
      }
    });
  }
};

export default cache;

/**
 * 使用示例：
 * 
 * // 业务数据缓存
 * dataCache.user.set({ id: 1, name: 'test' });
 * const userInfo = dataCache.user.get();
 * 
 * dataCache.cart.set([{ id: 1, quantity: 2 }]);
 * const cartData = dataCache.cart.get();
 * 
 * // API 数据缓存
 * apiCache.set('products', [...]);
 * const products = apiCache.get('products');
 * 
 * // 自定义缓存
 * cache.set({ 
 *   key: 'custom_key',
 *   strategy: 'both',
 *   expire: 3600000 // 1小时
 * }, { data: 'custom data' });
 * 
 * const customData = cache.get({ key: 'custom_key' });
 */