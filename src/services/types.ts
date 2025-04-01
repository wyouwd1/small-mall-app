// 通用响应类型
export interface BaseResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 分页请求参数
export interface PageParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 分页响应数据
export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 用户相关类型
export interface UserInfo {
  id: string;
  nickname: string;
  avatar: string;
  phone: string;
  email: string;
  gender: 0 | 1 | 2; // 0-未知 1-男 2-女
  birthday?: string;
  points: number;
  level: number;
  createTime: string;
  updateTime: string;
}

// 商品相关类型
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  images: string[];
  category: Category;
  tags: string[];
  specs: ProductSpec[];
  sales: number;
  stock: number;
  status: 0 | 1 | 2; // 0-下架 1-上架 2-售罄
  createTime: string;
  updateTime: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  parentId: string;
  level: number;
  sort: number;
  children?: Category[];
}

export interface ProductSpec {
  name: string;
  value: string;
}

// 购物车相关类型
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selected: boolean;
  specs: ProductSpec[];
  stock: number;
}

// 订单相关类型
export interface Order {
  id: string;
  orderNo: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  payAmount: number;
  payTime?: string;
  payType?: PayType;
  items: OrderItem[];
  address: Address;
  remark?: string;
  createTime: string;
  updateTime: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  specs: ProductSpec[];
}

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT', // 待支付
  PENDING_SHIPMENT = 'PENDING_SHIPMENT', // 待发货
  PENDING_RECEIPT = 'PENDING_RECEIPT', // 待收货
  COMPLETED = 'COMPLETED', // 已完成
  CANCELLED = 'CANCELLED', // 已取消
  REFUNDING = 'REFUNDING', // 退款中
  REFUNDED = 'REFUNDED', // 已退款
}

export enum PayType {
  WECHAT = 'WECHAT', // 微信支付
  ALIPAY = 'ALIPAY', // 支付宝
}

// 地址相关类型
export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
  createTime: string;
  updateTime: string;
}

// 优惠券相关类型
export interface Coupon {
  id: string;
  name: string;
  type: CouponType;
  value: number;
  minAmount: number;
  startTime: string;
  endTime: string;
  status: 0 | 1 | 2; // 0-未使用 1-已使用 2-已过期
  createTime: string;
  updateTime: string;
}

export enum CouponType {
  AMOUNT = 'AMOUNT', // 满减券
  DISCOUNT = 'DISCOUNT', // 折扣券
}

// 收藏相关类型
export interface Favorite {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  createTime: string;
}

// 评价相关类型
export interface Review {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  content: string;
  rating: number;
  images?: string[];
  reply?: string;
  createTime: string;
  updateTime: string;
}

// 消息相关类型
export interface Message {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: MessageType;
  isRead: boolean;
  createTime: string;
}

export enum MessageType {
  SYSTEM = 'SYSTEM', // 系统消息
  ORDER = 'ORDER', // 订单消息
  PROMOTION = 'PROMOTION', // 促销消息
}