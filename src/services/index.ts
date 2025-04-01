import userApi from './user';
import productApi from './product';
import cartApi from './cart';
import orderApi from './order';

export * from './types';

export default {
  user: userApi,
  product: productApi,
  cart: cartApi,
  order: orderApi
};

// 导出单独的 API 服务，方便按需引入
export {
  userApi,
  productApi,
  cartApi,
  orderApi
};

// 导出常用类型
export type {
  UserInfo,
  Product,
  Category,
  CartItem,
  Order,
  OrderStatus,
  PayType,
  Address,
  Coupon,
  CouponType,
  Favorite,
  Review,
  Message,
  MessageType,
  PageParams,
  PageResult,
  BaseResponse
} from './types';

// 导出常用枚举
export {
  OrderStatus,
  PayType,
  CouponType,
  MessageType
} from './types';

// 导出常用工具函数
export const formatOrderStatus = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    [OrderStatus.PENDING_PAYMENT]: '待支付',
    [OrderStatus.PENDING_SHIPMENT]: '待发货',
    [OrderStatus.PENDING_RECEIPT]: '待收货',
    [OrderStatus.COMPLETED]: '已完成',
    [OrderStatus.CANCELLED]: '已取消',
    [OrderStatus.REFUNDING]: '退款中',
    [OrderStatus.REFUNDED]: '已退款'
  };
  return statusMap[status] || '未知状态';
};

export const formatPayType = (type: PayType): string => {
  const typeMap: Record<PayType, string> = {
    [PayType.WECHAT]: '微信支付',
    [PayType.ALIPAY]: '支付宝'
  };
  return typeMap[type] || '未知方式';
};

export const formatCouponType = (type: CouponType): string => {
  const typeMap: Record<CouponType, string> = {
    [CouponType.AMOUNT]: '满减券',
    [CouponType.DISCOUNT]: '折扣券'
  };
  return typeMap[type] || '未知类型';
};

export const formatMessageType = (type: MessageType): string => {
  const typeMap: Record<MessageType, string> = {
    [MessageType.SYSTEM]: '系统消息',
    [MessageType.ORDER]: '订单消息',
    [MessageType.PROMOTION]: '促销消息'
  };
  return typeMap[type] || '未知类型';
};

// 导出常用常量
export const ORDER_STATUS_LIST = [
  { value: OrderStatus.PENDING_PAYMENT, label: '待支付' },
  { value: OrderStatus.PENDING_SHIPMENT, label: '待发货' },
  { value: OrderStatus.PENDING_RECEIPT, label: '待收货' },
  { value: OrderStatus.COMPLETED, label: '已完成' },
  { value: OrderStatus.CANCELLED, label: '已取消' },
  { value: OrderStatus.REFUNDING, label: '退款中' },
  { value: OrderStatus.REFUNDED, label: '已退款' }
];

export const PAY_TYPE_LIST = [
  { value: PayType.WECHAT, label: '微信支付' },
  { value: PayType.ALIPAY, label: '支付宝' }
];

export const COUPON_TYPE_LIST = [
  { value: CouponType.AMOUNT, label: '满减券' },
  { value: CouponType.DISCOUNT, label: '折扣券' }
];

export const MESSAGE_TYPE_LIST = [
  { value: MessageType.SYSTEM, label: '系统消息' },
  { value: MessageType.ORDER, label: '订单消息' },
  { value: MessageType.PROMOTION, label: '促销消息' }
];