import request from '../utils/request';
import type { BaseResponse, CartItem } from './types';

// 添加购物车参数
interface AddToCartParams {
  productId: string;
  quantity: number;
  specs?: Array<{
    name: string;
    value: string;
  }>;
}

// 更新购物车参数
interface UpdateCartParams {
  quantity?: number;
  selected?: boolean;
}

// 购物车相关接口
export default {
  // 获取购物车列表
  getCartList() {
    return request.get<BaseResponse<{
      items: CartItem[];
      totalCount: number;
      totalPrice: number;
      selectedCount: number;
      selectedPrice: number;
    }>>('/cart');
  },

  // 添加到购物车
  addToCart(data: AddToCartParams) {
    return request.post<BaseResponse<CartItem>>('/cart', data);
  },

  // 更新购物车商品
  updateCartItem(id: string, data: UpdateCartParams) {
    return request.put<BaseResponse<CartItem>>(`/cart/${id}`, data);
  },

  // 删除购物车商品
  removeFromCart(id: string) {
    return request.delete<BaseResponse<void>>(`/cart/${id}`);
  },

  // 清空购物车
  clearCart() {
    return request.delete<BaseResponse<void>>('/cart');
  },

  // 选择/取消选择全部商品
  selectAllItems(selected: boolean) {
    return request.put<BaseResponse<void>>('/cart/select-all', { selected });
  },

  // 获取购物车商品数量
  getCartCount() {
    return request.get<BaseResponse<number>>('/cart/count');
  },

  // 检查商品是否在购物车中
  checkInCart(productId: string) {
    return request.get<BaseResponse<{
      inCart: boolean;
      quantity?: number;
      cartItemId?: string;
    }>>(`/cart/check/${productId}`);
  },

  // 批量更新购物车商品选中状态
  batchUpdateSelection(data: {
    itemIds: string[];
    selected: boolean;
  }) {
    return request.put<BaseResponse<void>>('/cart/batch-select', data);
  },

  // 批量删除购物车商品
  batchRemoveItems(itemIds: string[]) {
    return request.delete<BaseResponse<void>>('/cart/batch', { data: { itemIds } });
  },

  // 移入收藏夹
  moveToFavorites(itemIds: string[]) {
    return request.post<BaseResponse<void>>('/cart/move-to-favorites', { itemIds });
  },

  // 获取失效商品列表
  getInvalidItems() {
    return request.get<BaseResponse<CartItem[]>>('/cart/invalid');
  },

  // 清除失效商品
  clearInvalidItems() {
    return request.delete<BaseResponse<void>>('/cart/invalid');
  },

  // 获取购物车商品价格变动提醒
  getPriceChanges() {
    return request.get<BaseResponse<Array<{
      itemId: string;
      oldPrice: number;
      newPrice: number;
    }>>>('/cart/price-changes');
  },

  // 获取购物车商品库存变动提醒
  getStockChanges() {
    return request.get<BaseResponse<Array<{
      itemId: string;
      oldStock: number;
      newStock: number;
    }>>>('/cart/stock-changes');
  },

  // 更新购物车商品规格
  updateItemSpecs(id: string, specs: Array<{
    name: string;
    value: string;
  }>) {
    return request.put<BaseResponse<CartItem>>(`/cart/${id}/specs`, { specs });
  },

  // 合并购物车（登录后合并未登录时的购物车）
  mergeCarts(data: {
    items: Array<{
      productId: string;
      quantity: number;
      specs?: Array<{
        name: string;
        value: string;
      }>;
    }>;
  }) {
    return request.post<BaseResponse<void>>('/cart/merge', data);
  }
};