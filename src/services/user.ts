import request from '../utils/request';
import type { UserInfo, BaseResponse } from './types';

// 登录参数
interface LoginParams {
  phone: string;
  code: string;
}

// 注册参数
interface RegisterParams {
  phone: string;
  code: string;
  password: string;
  nickname?: string;
}

// 更新用户信息参数
interface UpdateUserParams {
  nickname?: string;
  avatar?: string;
  gender?: 0 | 1 | 2;
  birthday?: string;
}

// 用户相关接口
export default {
  // 发送验证码
  sendCode(phone: string) {
    return request.post<BaseResponse<{ expired: number }>>('/user/send-code', { phone });
  },

  // 手机号登录
  login(data: LoginParams) {
    return request.post<BaseResponse<{ token: string; userInfo: UserInfo }>>('/user/login', data);
  },

  // 注册
  register(data: RegisterParams) {
    return request.post<BaseResponse<{ token: string; userInfo: UserInfo }>>('/user/register', data);
  },

  // 退出登录
  logout() {
    return request.post('/user/logout');
  },

  // 获取用户信息
  getUserInfo() {
    return request.get<BaseResponse<UserInfo>>('/user/info');
  },

  // 更新用户信息
  updateUserInfo(data: UpdateUserParams) {
    return request.put<BaseResponse<UserInfo>>('/user/info', data);
  },

  // 修改密码
  changePassword(data: { oldPassword: string; newPassword: string }) {
    return request.put('/user/password', data);
  },

  // 重置密码
  resetPassword(data: { phone: string; code: string; password: string }) {
    return request.put('/user/reset-password', data);
  },

  // 绑定手机号
  bindPhone(data: { phone: string; code: string }) {
    return request.post('/user/bind-phone', data);
  },

  // 上传头像
  uploadAvatar(filePath: string) {
    return request.upload<BaseResponse<{ url: string }>>('/user/avatar', filePath, 'avatar');
  },

  // 获取用户积分记录
  getPointsHistory(params: { page?: number; pageSize?: number }) {
    return request.get('/user/points/history', params);
  },

  // 获取用户优惠券
  getCoupons(params: { page?: number; pageSize?: number; status?: 0 | 1 | 2 }) {
    return request.get('/user/coupons', params);
  },

  // 领取优惠券
  receiveCoupon(couponId: string) {
    return request.post(`/user/coupons/${couponId}`);
  },

  // 获取收藏列表
  getFavorites(params: { page?: number; pageSize?: number }) {
    return request.get('/user/favorites', params);
  },

  // 添加收藏
  addFavorite(productId: string) {
    return request.post(`/user/favorites/${productId}`);
  },

  // 取消收藏
  removeFavorite(productId: string) {
    return request.delete(`/user/favorites/${productId}`);
  },

  // 获取消息列表
  getMessages(params: { page?: number; pageSize?: number; type?: string }) {
    return request.get('/user/messages', params);
  },

  // 标记消息已读
  readMessage(messageId: string) {
    return request.put(`/user/messages/${messageId}/read`);
  },

  // 标记所有消息已读
  readAllMessages() {
    return request.put('/user/messages/read-all');
  },

  // 删除消息
  deleteMessage(messageId: string) {
    return request.delete(`/user/messages/${messageId}`);
  },

  // 清空消息
  clearMessages() {
    return request.delete('/user/messages');
  },

  // 获取用户地址列表
  getAddresses() {
    return request.get('/user/addresses');
  },

  // 添加地址
  addAddress(data: {
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    detail: string;
    isDefault?: boolean;
  }) {
    return request.post('/user/addresses', data);
  },

  // 更新地址
  updateAddress(id: string, data: {
    name?: string;
    phone?: string;
    province?: string;
    city?: string;
    district?: string;
    detail?: string;
    isDefault?: boolean;
  }) {
    return request.put(`/user/addresses/${id}`, data);
  },

  // 删除地址
  deleteAddress(id: string) {
    return request.delete(`/user/addresses/${id}`);
  },

  // 设置默认地址
  setDefaultAddress(id: string) {
    return request.put(`/user/addresses/${id}/default`);
  }
};