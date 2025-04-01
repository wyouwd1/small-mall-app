import request from '../utils/request';
import type { BaseResponse, Product, Category, PageParams, PageResult, Review } from './types';

// 商品列表参数
interface ProductListParams extends PageParams {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  rating?: number;
}

// 商品相关接口
export default {
  // 获取商品列表
  getProducts(params: ProductListParams) {
    return request.get<BaseResponse<PageResult<Product>>>('/products', params);
  },

  // 获取商品详情
  getProductDetail(id: string) {
    return request.get<BaseResponse<Product>>(`/products/${id}`);
  },

  // 获取商品分类列表
  getCategories() {
    return request.get<BaseResponse<Category[]>>('/categories');
  },

  // 获取分类详情
  getCategoryDetail(id: string) {
    return request.get<BaseResponse<Category>>(`/categories/${id}`);
  },

  // 获取商品评价列表
  getProductReviews(productId: string, params: PageParams & {
    rating?: number;
    hasImage?: boolean;
  }) {
    return request.get<BaseResponse<PageResult<Review>>>(`/products/${productId}/reviews`, params);
  },

  // 添加商品评价
  addProductReview(productId: string, data: {
    orderId: string;
    content: string;
    rating: number;
    images?: string[];
  }) {
    return request.post<BaseResponse<Review>>(`/products/${productId}/reviews`, data);
  },

  // 上传评价图片
  uploadReviewImage(productId: string, filePath: string) {
    return request.upload<BaseResponse<{ url: string }>>(`/products/${productId}/review/images`, filePath, 'image');
  },

  // 获取热门商品
  getHotProducts(params: { limit?: number } = {}) {
    return request.get<BaseResponse<Product[]>>('/products/hot', params);
  },

  // 获取推荐商品
  getRecommendProducts(params: { limit?: number } = {}) {
    return request.get<BaseResponse<Product[]>>('/products/recommend', params);
  },

  // 获取新品上市
  getNewProducts(params: { limit?: number } = {}) {
    return request.get<BaseResponse<Product[]>>('/products/new', params);
  },

  // 获取促销商品
  getPromotionProducts(params: { limit?: number } = {}) {
    return request.get<BaseResponse<Product[]>>('/products/promotion', params);
  },

  // 搜索商品
  searchProducts(params: ProductListParams) {
    return request.get<BaseResponse<PageResult<Product>>>('/products/search', params);
  },

  // 获取搜索热词
  getSearchHotwords() {
    return request.get<BaseResponse<string[]>>('/products/search/hotwords');
  },

  // 获取商品标签列表
  getTags() {
    return request.get<BaseResponse<string[]>>('/products/tags');
  },

  // 检查商品库存
  checkStock(productId: string, quantity: number) {
    return request.get<BaseResponse<{ inStock: boolean; availableStock: number }>>(
      `/products/${productId}/stock`,
      { quantity }
    );
  },

  // 获取商品规格
  getProductSpecs(productId: string) {
    return request.get<BaseResponse<{
      specs: Array<{
        name: string;
        values: string[];
      }>;
      skus: Array<{
        id: string;
        specs: Array<{
          name: string;
          value: string;
        }>;
        price: number;
        stock: number;
      }>;
    }>>(`/products/${productId}/specs`);
  },

  // 获取相关商品
  getRelatedProducts(productId: string, params: { limit?: number } = {}) {
    return request.get<BaseResponse<Product[]>>(`/products/${productId}/related`, params);
  },

  // 获取商品统计信息
  getProductStats(productId: string) {
    return request.get<BaseResponse<{
      sales: number;
      favorites: number;
      reviews: number;
      rating: number;
    }>>(`/products/${productId}/stats`);
  }
};