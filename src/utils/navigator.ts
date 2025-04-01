import Taro from '@tarojs/taro';
import { checkAuth } from './auth';

/**
 * 页面路径配置
 */
export const Routes = {
  // 主页面
  INDEX: '/pages/index/index',
  CATEGORY: '/pages/category/index',
  CART: '/pages/cart/index',
  MINE: '/pages/mine/index',

  // 商品相关
  PRODUCT_DETAIL: '/pages/product/detail/index',
  PRODUCT_LIST: '/pages/product/list/index',
  PRODUCT_SEARCH: '/pages/product/search/index',

  // 订单相关
  ORDER_LIST: '/pages/order/list/index',
  ORDER_DETAIL: '/pages/order/detail/index',
  ORDER_CONFIRM: '/pages/order/confirm/index',

  // 用户相关
  LOGIN: '/pages/login/index',
  REGISTER: '/pages/register/index',
  USER_INFO: '/pages/user/info/index',
  USER_SETTINGS: '/pages/user/settings/index',

  // 地址相关
  ADDRESS_LIST: '/pages/address/list/index',
  ADDRESS_EDIT: '/pages/address/edit/index',

  // 其他页面
  WEBVIEW: '/pages/webview/index'
};

/**
 * 页面导航类
 */
class Navigator {
  /**
   * 处理页面参数
   * @param params 参数对象
   */
  private static handleParams(params?: Record<string, any>): string {
    if (!params) return '';
    const query = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');
    return query ? `?${query}` : '';
  }

  /**
   * 检查并补全页面路径
   * @param url 页面路径
   */
  private static formatUrl(url: string): string {
    if (url.startsWith('http')) {
      return `${Routes.WEBVIEW}?url=${encodeURIComponent(url)}`;
    }
    return url.startsWith('/') ? url : `/${url}`;
  }

  /**
   * 页面跳转
   * @param url 页面路径
   * @param params 页面参数
   */
  static async to(url: string, params?: Record<string, any>): Promise<boolean> {
    const formattedUrl = this.formatUrl(url);
    const query = this.handleParams(params);
    const fullUrl = `${formattedUrl}${query}`;

    // 检查页面访问权限
    if (!await checkAuth(formattedUrl)) {
      return false;
    }

    try {
      await Taro.navigateTo({ url: fullUrl });
      return true;
    } catch (error) {
      console.error('Navigation error:', error);
      return false;
    }
  }

  /**
   * 重定向页面
   * @param url 页面路径
   * @param params 页面参数
   */
  static async redirect(url: string, params?: Record<string, any>): Promise<boolean> {
    const formattedUrl = this.formatUrl(url);
    const query = this.handleParams(params);
    const fullUrl = `${formattedUrl}${query}`;

    // 检查页面访问权限
    if (!await checkAuth(formattedUrl)) {
      return false;
    }

    try {
      await Taro.redirectTo({ url: fullUrl });
      return true;
    } catch (error) {
      console.error('Redirect error:', error);
      return false;
    }
  }

  /**
   * 切换 Tab 页面
   * @param url Tab 页面路径
   */
  static async switchTab(url: string): Promise<boolean> {
    const formattedUrl = this.formatUrl(url);

    // 检查页面访问权限
    if (!await checkAuth(formattedUrl)) {
      return false;
    }

    try {
      await Taro.switchTab({ url: formattedUrl });
      return true;
    } catch (error) {
      console.error('Switch tab error:', error);
      return false;
    }
  }

  /**
   * 返回上一页
   * @param delta 返回的页面数
   */
  static back(delta = 1): void {
    Taro.navigateBack({ delta });
  }

  /**
   * 重启应用
   */
  static reLaunch(url = Routes.INDEX): void {
    Taro.reLaunch({ url });
  }

  /**
   * 打开商品详情页
   * @param id 商品ID
   */
  static toProduct(id: string): Promise<boolean> {
    return this.to(Routes.PRODUCT_DETAIL, { id });
  }

  /**
   * 打开订单详情页
   * @param id 订单ID
   */
  static toOrder(id: string): Promise<boolean> {
    return this.to(Routes.ORDER_DETAIL, { id });
  }

  /**
   * 打开登录页
   * @param redirect 重定向地址
   */
  static toLogin(redirect?: string): Promise<boolean> {
    return this.to(Routes.LOGIN, { redirect });
  }

  /**
   * 打开 WebView 页面
   * @param url 网页地址
   * @param title 页面标题
   */
  static toWebView(url: string, title?: string): Promise<boolean> {
    return this.to(Routes.WEBVIEW, { url, title });
  }

  /**
   * 获取当前页面路径
   */
  static getCurrentPage(): string {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    return currentPage?.route || Routes.INDEX;
  }

  /**
   * 获取页面参数
   */
  static getParams(): Record<string, string> {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    return currentPage?.options || {};
  }
}

export default Navigator;

/**
 * 使用示例：
 * 
 * // 普通页面跳转
 * Navigator.to('/pages/product/detail', { id: '123' });
 * 
 * // Tab 页面切换
 * Navigator.switchTab('/pages/cart/index');
 * 
 * // 返回上一页
 * Navigator.back();
 * 
 * // 打开商品详情
 * Navigator.toProduct('123');
 * 
 * // 打开 WebView
 * Navigator.toWebView('https://example.com', '示例页面');
 */