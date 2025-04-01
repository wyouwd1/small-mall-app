import { defineStore } from 'pinia';
import Taro from '@tarojs/taro';

interface Product {
  id: string;
  imgUrl: string;
  name: string;
  price: string;
  vipPrice: string;
  desc: string;
  delivery: string;
  shop: string;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  hasMore: boolean;
  page: number;
  searchValue: string;
  banners: Array<{
    id: string;
    imgUrl: string;
    name: string;
    link: string;
  }>;
}

export const useProductStore = defineStore('product', {
  state: (): ProductState => ({
    products: [],
    loading: false,
    hasMore: true,
    page: 1,
    searchValue: '',
    banners: [
      {
        id: '1',
        imgUrl: 'https://img12.360buyimg.com/babel/s1580x800_jfs/t1/197251/4/22580/234274/6262ec67Eb77f2f8b/de6cf6a54edd3d09.jpg',
        name: '新品发布',
        link: '/pages/product/detail?id=1'
      },
      {
        id: '2',
        imgUrl: 'https://img11.360buyimg.com/babel/s1580x800_jfs/t1/121636/39/23157/185702/6262ebf4E66917927/1e8f8f6f2ef53551.jpg',
        name: '限时特惠',
        link: '/pages/activity/discount'
      },
      {
        id: '3',
        imgUrl: 'https://img14.360buyimg.com/babel/s1580x800_jfs/t1/213959/14/14996/159481/6262ec67E44f3a1c4/d730a05f64a6c3b4.jpg',
        name: '品牌活动',
        link: '/pages/activity/brand'
      }
    ]
  }),

  actions: {
    // 获取商品列表
    async fetchProducts(isRefresh = false) {
      if (this.loading) return;
      
      try {
        this.loading = true;
        
        if (isRefresh) {
          this.page = 1;
          this.hasMore = true;
        }

        // TODO: 替换为实际的API调用
        const response = await new Promise<Product[]>((resolve) => {
          setTimeout(() => {
            resolve([
              {
                id: String(Math.random()),
                imgUrl: 'https://img13.360buyimg.com/n1/s450x450_jfs/t1/35753/6/19644/60437/63e4a4cfF82b63c38/86ad16b6b6a0c8d1.jpg',
                name: 'iPhone 14 Pro',
                price: '7999',
                vipPrice: '7899',
                desc: 'Apple iPhone 14 Pro (A2892) 256GB 暗紫色',
                delivery: '京东发货',
                shop: 'Apple产品京东自营旗舰店'
              },
              {
                id: String(Math.random()),
                imgUrl: 'https://img14.360buyimg.com/n1/s450x450_jfs/t1/140860/32/33707/38760/63fef906Fddbc7ada/c1b9b4b9c7726b54.jpg',
                name: '小米13',
                price: '3999',
                vipPrice: '3899',
                desc: '小米13 骁龙8 Gen2 徕卡光学镜头',
                delivery: '京东发货',
                shop: '小米京东自营旗舰店'
              }
            ]);
          }, 1000);
        });

        if (isRefresh) {
          this.products = response;
        } else {
          this.products = [...this.products, ...response];
        }

        this.page += 1;
        this.hasMore = this.page < 4; // 模拟只有3页数据
      } catch (error) {
        Taro.showToast({
          title: '获取商品列表失败',
          icon: 'error'
        });
        console.error('获取商品列表失败:', error);
      } finally {
        this.loading = false;
      }
    },

    // 搜索商品
    async searchProducts(keyword: string) {
      this.searchValue = keyword;
      this.page = 1;
      this.hasMore = true;
      this.products = [];
      await this.fetchProducts();
    },

    // 重置搜索
    resetSearch() {
      this.searchValue = '';
      this.page = 1;
      this.hasMore = true;
      this.products = [];
      this.fetchProducts();
    }
  }
});