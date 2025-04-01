type EventHandler = (...args: any[]) => void;

interface EventHandlers {
  [key: string]: EventHandler[];
}

/**
 * 事件总线类
 */
class EventBus {
  private handlers: EventHandlers = {};

  /**
   * 订阅事件
   * @param event 事件名称
   * @param handler 事件处理函数
   */
  on(event: string, handler: EventHandler): void {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }

  /**
   * 取消订阅事件
   * @param event 事件名称
   * @param handler 事件处理函数
   */
  off(event: string, handler?: EventHandler): void {
    if (!this.handlers[event]) return;

    if (!handler) {
      // 如果没有指定处理函数，则删除该事件的所有处理函数
      delete this.handlers[event];
    } else {
      // 删除指定的处理函数
      this.handlers[event] = this.handlers[event].filter(h => h !== handler);
    }
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 事件参数
   */
  emit(event: string, ...args: any[]): void {
    if (!this.handlers[event]) return;

    // 复制一份处理函数列表，避免在处理过程中的修改影响遍历
    const handlers = [...this.handlers[event]];
    handlers.forEach(handler => {
      try {
        handler(...args);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }

  /**
   * 只订阅一次事件
   * @param event 事件名称
   * @param handler 事件处理函数
   */
  once(event: string, handler: EventHandler): void {
    const onceHandler = (...args: any[]) => {
      handler(...args);
      this.off(event, onceHandler);
    };
    this.on(event, onceHandler);
  }

  /**
   * 清空所有事件处理函数
   */
  clear(): void {
    this.handlers = {};
  }

  /**
   * 获取事件处理函数数量
   * @param event 事件名称
   */
  count(event: string): number {
    return this.handlers[event]?.length || 0;
  }
}

// 创建事件总线实例
const eventBus = new EventBus();

// 预定义的事件名称
export const Events = {
  // 用户相关
  USER_LOGIN: 'USER_LOGIN', // 用户登录
  USER_LOGOUT: 'USER_LOGOUT', // 用户退出
  USER_INFO_UPDATE: 'USER_INFO_UPDATE', // 用户信息更新

  // 购物车相关
  CART_UPDATE: 'CART_UPDATE', // 购物车更新
  CART_ITEM_ADD: 'CART_ITEM_ADD', // 添加购物车商品
  CART_ITEM_REMOVE: 'CART_ITEM_REMOVE', // 删除购物车商品
  CART_ITEM_UPDATE: 'CART_ITEM_UPDATE', // 更新购物车商品

  // 订单相关
  ORDER_CREATE: 'ORDER_CREATE', // 创建订单
  ORDER_PAY: 'ORDER_PAY', // 订单支付
  ORDER_CANCEL: 'ORDER_CANCEL', // 取消订单
  ORDER_REFUND: 'ORDER_REFUND', // 订单退款

  // 商品相关
  PRODUCT_FAVORITE: 'PRODUCT_FAVORITE', // 商品收藏
  PRODUCT_UNFAVORITE: 'PRODUCT_UNFAVORITE', // 取消收藏
  PRODUCT_VIEW: 'PRODUCT_VIEW', // 商品浏览

  // 系统相关
  NETWORK_ERROR: 'NETWORK_ERROR', // 网络错误
  APP_UPDATE: 'APP_UPDATE', // 应用更新
  THEME_CHANGE: 'THEME_CHANGE', // 主题切换
};

// 事件处理示例
export const EventHandlers = {
  // 用户登录处理
  handleUserLogin: (userInfo: any) => {
    console.log('User logged in:', userInfo);
  },

  // 购物车更新处理
  handleCartUpdate: (cartInfo: any) => {
    console.log('Cart updated:', cartInfo);
  },

  // 订单创建处理
  handleOrderCreate: (orderInfo: any) => {
    console.log('Order created:', orderInfo);
  },

  // 网络错误处理
  handleNetworkError: (error: any) => {
    console.error('Network error:', error);
  }
};

/**
 * 使用示例：
 * 
 * // 订阅事件
 * eventBus.on(Events.USER_LOGIN, EventHandlers.handleUserLogin);
 * 
 * // 触发事件
 * eventBus.emit(Events.USER_LOGIN, { userId: '123', username: 'test' });
 * 
 * // 取消订阅
 * eventBus.off(Events.USER_LOGIN, EventHandlers.handleUserLogin);
 * 
 * // 只订阅一次
 * eventBus.once(Events.NETWORK_ERROR, EventHandlers.handleNetworkError);
 */

export default eventBus;