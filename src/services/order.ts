import request from '../utils/request';
import type { BaseResponse, Order, OrderStatus, PayType, PageParams, PageResult } from './types';

// 创建订单参数
interface CreateOrderParams {
  items: Array<{
    cartItemId?: string;
    productId: string;
    quantity: number;
    specs?: Array<{
      name: string;
      value: string;
    }>;
  }>;
  addressId: string;
  couponId?: string;
  remark?: string;
}

// 订单列表参数
interface OrderListParams extends PageParams {
  status?: OrderStatus;
  startTime?: string;
  endTime?: string;
}

// 订单相关接口
export default {
  // 创建订单
  createOrder(data: CreateOrderParams) {
    return request.post<BaseResponse<{
      orderId: string;
      orderNo: string;
      payAmount: number;
    }>>('/orders', data);
  },

  // 获取订单列表
  getOrders(params: OrderListParams) {
    return request.get<BaseResponse<PageResult<Order>>>('/orders', params);
  },

  // 获取订单详情
  getOrderDetail(id: string) {
    return request.get<BaseResponse<Order>>(`/orders/${id}`);
  },

  // 取消订单
  cancelOrder(id: string, reason?: string) {
    return request.put<BaseResponse<void>>(`/orders/${id}/cancel`, { reason });
  },

  // 删除订单
  deleteOrder(id: string) {
    return request.delete<BaseResponse<void>>(`/orders/${id}`);
  },

  // 确认收货
  confirmReceipt(id: string) {
    return request.put<BaseResponse<void>>(`/orders/${id}/confirm`);
  },

  // 申请退款
  applyRefund(id: string, data: {
    reason: string;
    description?: string;
    images?: string[];
  }) {
    return request.post<BaseResponse<void>>(`/orders/${id}/refund`, data);
  },

  // 取消退款申请
  cancelRefund(id: string) {
    return request.put<BaseResponse<void>>(`/orders/${id}/refund/cancel`);
  },

  // 获取订单支付信息
  getPaymentInfo(id: string) {
    return request.get<BaseResponse<{
      orderNo: string;
      payAmount: number;
      expireTime: string;
    }>>(`/orders/${id}/payment`);
  },

  // 订单支付
  payOrder(id: string, payType: PayType) {
    return request.post<BaseResponse<{
      payParams: any; // 支付参数，根据支付方式不同而不同
    }>>(`/orders/${id}/pay`, { payType });
  },

  // 获取订单物流信息
  getOrderLogistics(id: string) {
    return request.get<BaseResponse<{
      logisticsNo: string;
      logisticsCompany: string;
      traces: Array<{
        time: string;
        content: string;
      }>;
    }>>(`/orders/${id}/logistics`);
  },

  // 获取订单可用优惠券
  getAvailableCoupons(data: {
    items: Array<{
      productId: string;
      quantity: number;
    }>;
  }) {
    return request.post<BaseResponse<Array<{
      id: string;
      name: string;
      type: string;
      value: number;
      minAmount: number;
      startTime: string;
      endTime: string;
    }>>>('/orders/available-coupons', data);
  },

  // 计算订单金额
  calculateAmount(data: {
    items: Array<{
      productId: string;
      quantity: number;
    }>;
    couponId?: string;
  }) {
    return request.post<BaseResponse<{
      totalAmount: number;
      discountAmount: number;
      payAmount: number;
    }>>('/orders/calculate', data);
  },

  // 获取订单统计信息
  getOrderStats() {
    return request.get<BaseResponse<{
      pendingPayment: number;
      pendingShipment: number;
      pendingReceipt: number;
      pendingReview: number;
    }>>('/orders/stats');
  },

  // 上传退款凭证
  uploadRefundImage(orderId: string, filePath: string) {
    return request.upload<BaseResponse<{
      url: string;
    }>>(`/orders/${orderId}/refund/images`, filePath, 'image');
  },

  // 获取退款详情
  getRefundDetail(orderId: string) {
    return request.get<BaseResponse<{
      status: string;
      reason: string;
      description?: string;
      images?: string[];
      rejectReason?: string;
      refundAmount?: number;
      refundTime?: string;
    }>>(`/orders/${orderId}/refund`);
  },

  // 评价订单
  reviewOrder(id: string, data: {
    items: Array<{
      productId: string;
      content: string;
      rating: number;
      images?: string[];
    }>;
  }) {
    return request.post<BaseResponse<void>>(`/orders/${id}/review`, data);
  }
};