import Taro from '@tarojs/taro';
import eventBus, { Events } from './eventBus';

/**
 * 网络状态类型
 */
type NetworkType = 'wifi' | '4g' | '3g' | '2g' | 'none' | 'unknown';

/**
 * 网络状态管理类
 */
class NetworkManager {
  // 当前网络状态
  private networkType: NetworkType = 'unknown';
  // 是否在线
  private isOnline = true;
  // 重试次数
  private retryTimes = 3;
  // 重试延迟（毫秒）
  private retryDelay = 1000;

  constructor() {
    // 初始化网络状态
    this.initNetworkStatus();
    // 监听网络状态变化
    this.watchNetworkStatus();
  }

  /**
   * 初始化网络状态
   */
  private async initNetworkStatus(): Promise<void> {
    try {
      const { networkType } = await Taro.getNetworkType();
      this.setNetworkStatus(networkType as NetworkType);
    } catch (error) {
      console.error('Get network type failed:', error);
    }
  }

  /**
   * 监听网络状态变化
   */
  private watchNetworkStatus(): void {
    Taro.onNetworkStatusChange(({ networkType, isConnected }) => {
      this.setNetworkStatus(networkType as NetworkType, isConnected);
    });
  }

  /**
   * 设置网络状态
   * @param type 网络类型
   * @param isConnected 是否连接
   */
  private setNetworkStatus(type: NetworkType, isConnected = true): void {
    const prevOnline = this.isOnline;
    this.networkType = type;
    this.isOnline = type !== 'none' && isConnected;

    // 触发网络状态变化事件
    eventBus.emit(Events.NETWORK_STATUS_CHANGE, {
      type,
      isOnline: this.isOnline
    });

    // 网络状态改变时触发相应事件
    if (prevOnline !== this.isOnline) {
      if (this.isOnline) {
        eventBus.emit(Events.NETWORK_ONLINE);
      } else {
        eventBus.emit(Events.NETWORK_OFFLINE);
      }
    }
  }

  /**
   * 获取当前网络状态
   */
  getNetworkStatus(): { type: NetworkType; isOnline: boolean } {
    return {
      type: this.networkType,
      isOnline: this.isOnline
    };
  }

  /**
   * 检查是否在线
   */
  checkOnline(): boolean {
    return this.isOnline;
  }

  /**
   * 检查是否是WiFi
   */
  isWifi(): boolean {
    return this.networkType === 'wifi';
  }

  /**
   * 带重试机制的请求
   * @param request 请求函数
   * @param retryTimes 重试次数
   * @param retryDelay 重试延迟
   */
  async requestWithRetry<T>(
    request: () => Promise<T>,
    retryTimes = this.retryTimes,
    retryDelay = this.retryDelay
  ): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i <= retryTimes; i++) {
      try {
        // 检查网络状态
        if (!this.isOnline) {
          throw new Error('Network is offline');
        }

        return await request();
      } catch (error) {
        lastError = error;
        console.error(`Request failed (attempt ${i + 1}/${retryTimes + 1}):`, error);

        if (i < retryTimes) {
          // 延迟重试
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          // 递增重试延迟
          retryDelay *= 2;
        }
      }
    }

    throw lastError;
  }
}

// 创建网络管理实例
const networkManager = new NetworkManager();

/**
 * 错误处理类
 */
class ErrorHandler {
  /**
   * 处理请求错误
   * @param error 错误对象
   */
  handleRequestError(error: any): void {
    // 网络错误
    if (!networkManager.checkOnline()) {
      this.showErrorMessage('网络连接已断开，请检查网络设置');
      return;
    }

    // 请求超时
    if (error.timeout) {
      this.showErrorMessage('请求超时，请重试');
      return;
    }

    // HTTP 状态错误
    if (error.status) {
      switch (error.status) {
        case 401:
          this.showErrorMessage('请先登录');
          // 触发未授权事件
          eventBus.emit(Events.UNAUTHORIZED);
          break;
        case 403:
          this.showErrorMessage('没有权限访问');
          break;
        case 404:
          this.showErrorMessage('请求的资源不存在');
          break;
        case 500:
          this.showErrorMessage('服务器错误，请稍后重试');
          break;
        default:
          this.showErrorMessage('请求失败，请重试');
      }
      return;
    }

    // 其他错误
    this.showErrorMessage(error.message || '未知错误');
  }

  /**
   * 显示错误信息
   * @param message 错误信息
   */
  private showErrorMessage(message: string): void {
    Taro.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  }
}

// 创建错误处理实例
const errorHandler = new ErrorHandler();

export {
  networkManager,
  errorHandler,
  NetworkType
};

/**
 * 使用示例：
 * 
 * // 检查网络状态
 * const { type, isOnline } = networkManager.getNetworkStatus();
 * 
 * // 带重试的请求
 * try {
 *   const result = await networkManager.requestWithRetry(
 *     () => api.getData(),
 *     3,  // 重试3次
 *     1000 // 初始延迟1秒
 *   );
 * } catch (error) {
 *   errorHandler.handleRequestError(error);
 * }
 * 
 * // 监听网络状态变化
 * eventBus.on(Events.NETWORK_STATUS_CHANGE, ({ type, isOnline }) => {
 *   console.log('Network status changed:', type, isOnline);
 * });
 * 
 * // 监听网络恢复
 * eventBus.on(Events.NETWORK_ONLINE, () => {
 *   console.log('Network is back online');
 * });
 */