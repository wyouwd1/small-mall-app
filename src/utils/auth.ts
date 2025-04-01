import Taro from '@tarojs/taro';
import { userStorage } from './storage';

/**
 * 权限管理类
 */
class Auth {
  // 需要登录的页面路径
  private readonly loginPages: string[] = [
    '/pages/cart/index',
    '/pages/mine/index',
    '/pages/order/list/index',
    '/pages/address/list/index'
  ];

  // 白名单页面路径（不需要检查登录状态）
  private readonly whiteList: string[] = [
    '/pages/index/index',
    '/pages/category/index',
    '/pages/login/index',
    '/pages/register/index'
  ];

  /**
   * 检查是否已登录
   */
  isLoggedIn(): boolean {
    return !!userStorage.getToken();
  }

  /**
   * 检查页面是否需要登录
   * @param pagePath 页面路径
   */
  needLogin(pagePath: string): boolean {
    // 白名单页面不需要登录
    if (this.whiteList.some(path => pagePath.startsWith(path))) {
      return false;
    }
    // 需要登录的页面
    return this.loginPages.some(path => pagePath.startsWith(path));
  }

  /**
   * 检查页面访问权限
   * @param pagePath 页面路径
   */
  async checkPermission(pagePath: string): Promise<boolean> {
    // 判断是否需要登录
    if (!this.needLogin(pagePath)) {
      return true;
    }

    // 判断是否已登录
    if (!this.isLoggedIn()) {
      await this.toLogin();
      return false;
    }

    return true;
  }

  /**
   * 跳转到登录页
   */
  async toLogin(): Promise<void> {
    // 获取当前页面路径
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const redirectUrl = currentPage ? currentPage.route : '';

    // 跳转到登录页
    await Taro.navigateTo({
      url: `/pages/login/index${redirectUrl ? '?redirect=' + encodeURIComponent('/' + redirectUrl) : ''}`
    });
  }

  /**
   * 登录成功处理
   * @param token 登录token
   * @param userInfo 用户信息
   */
  handleLoginSuccess(token: string, userInfo: any): void {
    // 保存登录信息
    userStorage.setToken(token);
    userStorage.setUserInfo(userInfo);

    // 获取重定向地址
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const query = currentPage?.options;
    const redirect = query?.redirect;

    // 跳转到重定向地址或首页
    if (redirect) {
      Taro.redirectTo({
        url: decodeURIComponent(redirect)
      });
    } else {
      Taro.switchTab({
        url: '/pages/index/index'
      });
    }
  }

  /**
   * 退出登录处理
   */
  handleLogout(): void {
    // 清除登录信息
    userStorage.clear();

    // 跳转到首页
    Taro.switchTab({
      url: '/pages/index/index'
    });
  }

  /**
   * 检查登录状态是否过期
   */
  async checkSession(): Promise<boolean> {
    try {
      await Taro.checkSession();
      return true;
    } catch (error) {
      // 登录状态过期，清除登录信息
      userStorage.clear();
      return false;
    }
  }

  /**
   * 刷新登录状态
   */
  async refreshSession(): Promise<void> {
    try {
      // TODO: 调用刷新token的接口
      // const res = await refreshToken();
      // userStorage.setToken(res.token);
    } catch (error) {
      // 刷新失败，清除登录信息并跳转到登录页
      userStorage.clear();
      await this.toLogin();
    }
  }
}

// 创建权限管理实例
const auth = new Auth();

/**
 * 页面访问权限检查中间件
 * @param pagePath 页面路径
 */
export const checkAuth = async (pagePath: string): Promise<boolean> => {
  return auth.checkPermission(pagePath);
};

/**
 * 登录状态检查中间件
 */
export const checkLogin = async (): Promise<boolean> => {
  if (!auth.isLoggedIn()) {
    await auth.toLogin();
    return false;
  }
  return true;
};

/**
 * 登录状态管理
 */
export const login = {
  // 是否已登录
  isLoggedIn: () => auth.isLoggedIn(),

  // 跳转到登录页
  toLogin: () => auth.toLogin(),

  // 登录成功处理
  handleSuccess: (token: string, userInfo: any) => auth.handleLoginSuccess(token, userInfo),

  // 退出登录处理
  handleLogout: () => auth.handleLogout(),

  // 检查登录状态
  checkSession: () => auth.checkSession(),

  // 刷新登录状态
  refreshSession: () => auth.refreshSession()
};

export default auth;