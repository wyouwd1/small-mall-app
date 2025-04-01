<template>
  <view class="product-detail">
    <!-- 顶部导航栏 -->
    <nut-navbar
      title="商品详情"
      left-text="返回"
      @click-left="handleBack"
    />

    <!-- 商品图片轮播 -->
    <view class="product-images">
      <nut-swiper
        :init-page="0"
        :pagination-visible="true"
        pagination-color="#426543"
        class="product-swiper"
      >
        <nut-swiper-item v-for="(image, index) in productImages" :key="index">
          <img
            :src="image"
            class="product-image"
            @error="handleImageError"
          />
        </nut-swiper-item>
      </nut-swiper>
    </view>

    <!-- 商品信息 -->
    <view class="product-info">
      <view class="price-section">
        <text class="current-price">¥{{ product?.price || '--' }}</text>
        <text class="original-price">¥{{ product?.originalPrice || '--' }}</text>
        <text class="sale-tag" v-if="product?.saleTag">{{ product.saleTag }}</text>
      </view>

      <view class="title-section">
        <text class="product-title">{{ product?.name || '加载中...' }}</text>
        <text class="product-subtitle">{{ product?.desc || '' }}</text>
      </view>

      <view class="shop-info">
        <text class="shop-name">{{ product?.shop || '' }}</text>
        <text class="delivery-info">{{ product?.delivery || '' }}</text>
      </view>
    </view>

    <!-- 商品详情 -->
    <view class="detail-section">
      <nut-tabs v-model="activeTab">
        <nut-tab-pane title="商品介绍" pane-key="intro">
          <view class="detail-content">
            <rich-text :nodes="product?.detail || ''" />
          </view>
        </nut-tab-pane>
        <nut-tab-pane title="规格参数" pane-key="specs">
          <view class="specs-content">
            <view class="spec-item" v-for="(spec, index) in product?.specs" :key="index">
              <text class="spec-label">{{ spec.label }}</text>
              <text class="spec-value">{{ spec.value }}</text>
            </view>
          </view>
        </nut-tab-pane>
      </nut-tabs>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="left-actions">
        <view class="action-item" @tap="handleShopClick">
          <Shop />
          <text>店铺</text>
        </view>
        <view class="action-item" @tap="handleCartClick">
          <Cart />
          <text>购物车</text>
          <nut-badge :value="cartCount" v-if="cartCount > 0" />
        </view>
      </view>
      <view class="right-actions">
        <nut-button 
          type="warning" 
          class="action-button"
          @tap="handleAddToCart"
        >
          加入购物车
        </nut-button>
        <nut-button 
          type="primary" 
          class="action-button"
          @tap="handleBuyNow"
        >
          立即购买
        </nut-button>
      </view>
    </view>

    <!-- 加载状态 -->
    <nut-overlay v-if="loading" :visible="true">
      <view class="loading-wrapper">
        <nut-indicator size="30" color="#ff4d4f" />
        <text class="loading-text">加载中...</text>
      </view>
    </nut-overlay>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Taro, { useRouter } from '@tarojs/taro';
import { 
  Navbar,
  Swiper, 
  SwiperItem, 
  Tabs, 
  TabPane,
  Button,
  Badge,
  Overlay,
  Indicator,
  Toast
} from '@nutui/nutui-taro';
import '@nutui/nutui-taro/dist/style.css';
import { Shop, Cart } from '@nutui/icons-vue-taro';
import { useProductStore } from '../../../store/modules/product';

const router = useRouter();
const productStore = useProductStore();

// 状态
const loading = ref(false);
const product = ref<any>(null);
const activeTab = ref('intro');
const cartCount = ref(0);
const productImages = ref<string[]>([]);

// 获取商品详情
const fetchProductDetail = async () => {
  const productId = router.params.id;
  if (!productId) {
    Toast.text('商品ID不存在');
    return;
  }

  try {
    loading.value = true;
    // TODO: 替换为实际API调用
    // const response = await productStore.getProductDetail(productId);
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 1000));
    product.value = {
      id: productId,
      name: 'iPhone 14 Pro',
      price: '7999',
      originalPrice: '8999',
      vipPrice: '7899',
      desc: 'Apple iPhone 14 Pro (A2892) 256GB 暗紫色',
      delivery: '京东发货',
      shop: 'Apple产品京东自营旗舰店',
      saleTag: '限时优惠',
      detail: '<div>商品详情内容</div>',
      specs: [
        { label: '型号', value: 'iPhone 14 Pro' },
        { label: '颜色', value: '暗紫色' },
        { label: '容量', value: '256GB' }
      ]
    };
    productImages.value = [
      'https://img13.360buyimg.com/n1/s450x450_jfs/t1/35753/6/19644/60437/63e4a4cfF82b63c38/86ad16b6b6a0c8d1.jpg',
      'https://img14.360buyimg.com/n1/s450x450_jfs/t1/140860/32/33707/38760/63fef906Fddbc7ada/c1b9b4b9c7726b54.jpg'
    ];
  } catch (error) {
    console.error('获取商品详情失败:', error);
    Toast.text('获取商品详情失败');
  } finally {
    loading.value = false;
  }
};

// 返回上一页
const handleBack = () => {
  Taro.navigateBack();
};

// 图片加载错误处理
const handleImageError = (e: Event) => {
  if (e.target) {
    (e.target as HTMLImageElement).src = 'https://img11.360buyimg.com/imagetools/jfs/t1/137646/13/7132/1648/5f4c748bE43da8ddd/a3f06d51dcae7b60.png';
  }
};

// 店铺点击处理
const handleShopClick = () => {
  Taro.navigateTo({
    url: `/pages/shop/index?id=${product.value?.shopId}`
  });
};

// 购物车点击处理
const handleCartClick = () => {
  Taro.switchTab({
    url: '/pages/cart/index'
  });
};

// 加入购物车
const handleAddToCart = () => {
  Toast.text('已加入购物车');
  cartCount.value++;
};

// 立即购买
const handleBuyNow = () => {
  Taro.navigateTo({
    url: `/pages/order/confirm/index?productId=${product.value?.id}`
  });
};

// 页面加载
onMounted(() => {
  fetchProductDetail();
});
</script>

<style lang="scss">
.product-detail {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 100px; // 为底部操作栏留出空间

  .product-images {
    background: #fff;
    
    .product-swiper {
      height: 400px;
      
      .product-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .product-info {
    margin-top: 12px;
    padding: 16px;
    background: #fff;

    .price-section {
      margin-bottom: 12px;

      .current-price {
        font-size: 24px;
        font-weight: bold;
        color: #ff4d4f;
      }

      .original-price {
        font-size: 14px;
        color: #999;
        text-decoration: line-through;
        margin-left: 8px;
      }

      .sale-tag {
        font-size: 12px;
        color: #fff;
        background: #ff4d4f;
        padding: 2px 6px;
        border-radius: 4px;
        margin-left: 8px;
      }
    }

    .title-section {
      margin-bottom: 12px;

      .product-title {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        line-height: 1.4;
      }

      .product-subtitle {
        font-size: 14px;
        color: #666;
        margin-top: 4px;
        display: block;
      }
    }

    .shop-info {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #666;

      .shop-name {
        color: #333;
      }
    }
  }

  .detail-section {
    margin-top: 12px;
    background: #fff;
    
    .detail-content {
      padding: 16px;
    }

    .specs-content {
      padding: 16px;

      .spec-item {
        display: flex;
        margin-bottom: 12px;
        font-size: 14px;

        .spec-label {
          width: 80px;
          color: #666;
        }

        .spec-value {
          flex: 1;
          color: #333;
        }
      }
    }
  }

  .bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

    .left-actions {
      display: flex;
      gap: 24px;

      .action-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 12px;
        color: #666;
      }
    }

    .right-actions {
      display: flex;
      gap: 12px;

      .action-button {
        min-width: 100px;
      }
    }
  }

  .loading-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;

    .loading-text {
      margin-top: 12px;
      color: #fff;
      font-size: 14px;
    }
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .product-detail {
    background-color: #1a1a1a;

    .product-info,
    .detail-section,
    .bottom-bar {
      background-color: #242424;
    }

    .product-info {
      .title-section {
        .product-title {
          color: #e0e0e0;
        }

        .product-subtitle {
          color: #999;
        }
      }

      .shop-info {
        .shop-name {
          color: #e0e0e0;
        }
      }
    }

    .detail-section {
      .specs-content {
        .spec-item {
          .spec-label {
            color: #999;
          }

          .spec-value {
            color: #e0e0e0;
          }
        }
      }
    }
  }
}
</style>