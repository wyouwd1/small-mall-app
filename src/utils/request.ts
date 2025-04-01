import Taro from '@tarojs/taro';
import config from '../config/env';
import { getStorage } from './index';

interface RequestConfig extends Omit<Taro.request.Option, 'url'> {
  url: string;
  baseURL?: string;
  showLoading?: boolean;
  loadingText?: string;
}

interface Response<T = any> {
  code: number;
  data: T;
  message: string;
}

// 请求队列
let requestQueue = 0;
// loading显示延迟timer
let loadingTimer: NodeJS.Timeout | null = null;

// 显示loading
const showLoading = (text?: string) => {
  requestQueue++;
  if (loadingTimer) clearTimeout(loadingTimer);
  loadingTimer = setTimeout(() => {
    Taro.showLoading({
      title: text || '加载中...',
      mask: true,
    });
  }, 300); // 300ms延迟显示loading
};

// 隐藏loading
const hideLoading = () => {
  requestQueue--;
  if (requestQueue <= 0) {
    if (loadingTimer) clearTimeout(loadingTimer);
    Taro.hideLoading();
    requestQueue = 0;
  }
};

// 错误处理
const handleError = (error: any, reject: (reason?: any) => void) => {
  hideLoading();

  // 网络错误
  if (!error.statusCode) {
    Taro.showToast({
      title: '网络异常，请检查网络设置',
      icon: 'none',
    });
    reject(new Error('网络异常，请检查网络设置'));
    return;
  }

  // HTTP 状态码错误
  switch (error.statusCode) {
    case 401:
      // 未登录或 token 失效
      Taro.showToast({
        title: '请先登录',
        icon: 'none',
      });
      // 清除登录信息
      Taro.removeStorageSync(config.storageKey.token);
      Taro.removeStorageSync(config.storageKey.userInfo);
      // 跳转登录页
      setTimeout(() => {
        Taro.navigateTo({ url: '/pages/login/index' });
      }, 1500);
      break;
    case 403:
      Taro.showToast({
        title: '没有权限',
        icon: 'none',
      });
      break;
    case 404:
      Taro.showToast({
        title: '请求的资源不存在',
        icon: 'none',
      });
      break;
    case 500:
      Taro.showToast({
        title: '服务器错误',
        icon: 'none',
      });
      break;
    default:
      Taro.showToast({
        title: error.data?.message || '请求失败',
        icon: 'none',
      });
  }

  reject(error);
};

// 请求拦截器
const requestInterceptor = (config: RequestConfig) => {
  // 添加token
  const token = getStorage<string>(config.storageKey.token);
  if (token) {
    config.header = {
      ...config.header,
      Authorization: `Bearer ${token}`,
    };
  }

  // 显示loading
  if (config.showLoading !== false) {
    showLoading(config.loadingText);
  }

  return config;
};

// 响应拦截器
const responseInterceptor = (response: any) => {
  hideLoading();

  // 请求成功
  if (response.statusCode === 200) {
    const res = response.data as Response;
    // 业务状态码处理
    if (res.code === 0) {
      return res.data;
    }
    // 业务错误
    throw {
      statusCode: response.statusCode,
      data: res,
    };
  }

  // 请求失败
  throw response;
};

// 创建请求实例
const request = <T = any>(config: RequestConfig): Promise<T> => {
  const finalConfig = requestInterceptor(config);

  return new Promise((resolve, reject) => {
    Taro.request({
      ...finalConfig,
      url: `${finalConfig.baseURL || config.baseUrl}${finalConfig.url}`,
      success: (res) => {
        try {
          const result = responseInterceptor(res);
          resolve(result);
        } catch (error) {
          handleError(error, reject);
        }
      },
      fail: (error) => {
        handleError(error, reject);
      },
    });
  });
};

// 导出请求方法
export default {
  get: <T = any>(url: string, params?: object, config: Partial<RequestConfig> = {}) => {
    return request<T>({
      ...config,
      url,
      method: 'GET',
      data: params,
    });
  },

  post: <T = any>(url: string, data?: object, config: Partial<RequestConfig> = {}) => {
    return request<T>({
      ...config,
      url,
      method: 'POST',
      data,
    });
  },

  put: <T = any>(url: string, data?: object, config: Partial<RequestConfig> = {}) => {
    return request<T>({
      ...config,
      url,
      method: 'PUT',
      data,
    });
  },

  delete: <T = any>(url: string, data?: object, config: Partial<RequestConfig> = {}) => {
    return request<T>({
      ...config,
      url,
      method: 'DELETE',
      data,
    });
  },

  // 上传文件
  upload: <T = any>(
    url: string,
    filePath: string,
    name = 'file',
    config: Partial<RequestConfig> = {}
  ) => {
    const token = getStorage<string>(config.storageKey.token);
    return new Promise<T>((resolve, reject) => {
      Taro.uploadFile({
        url: `${config.baseURL || config.baseUrl}${url}`,
        filePath,
        name,
        header: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...config.header,
        },
        success: (res) => {
          try {
            const result = responseInterceptor(res);
            resolve(result);
          } catch (error) {
            handleError(error, reject);
          }
        },
        fail: (error) => {
          handleError(error, reject);
        },
      });
    });
  },
};

// 导出类型
export type { RequestConfig, Response };