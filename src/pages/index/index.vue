<template>
  <view class="container">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <nut-searchbar
        v-model="searchValue"
        placeholder="搜索商品"
        input-type="search"
        background="#f7f7f7"
      />
    </view>

    <!-- 轮播图 -->
    <view class="banner-section">
      <nut-swiper 
        :init-page="0" 
        :pagination-visible="true" 
        pagination-color="#426543" 
        :auto-play="3000"
        class="custom-swiper"
      >
        <nut-swiper-item v-for="(item, index) in banners" :key="index">
          <img 
            :src="item.imgUrl" 
            :alt="item.name" 
            class="banner-image" 
            @error="handleImageError" 
          />
        </nut-swiper-item>
      </nut-swiper>
    </view>

    <!-- 分类 -->
    <view class="category-section">
      <nut-grid :column-num="4" :border="false">
        <nut-grid-item 
          v-for="(item, index) in categories" 
          :key="index"
          class="category-item"
        >
          <view class="category-icon">
            <component :is="item.icon" size="28" />
          </view>
          <view class="category-name">{{ item.name }}</view>
        </nut-grid-item>
      </nut-grid>
    </view>

    <!-- 商品列表 -->
    <view class="products-section">
      <view class="section-title">
        <text class="title-text">热门商品</text>
        <text class="subtitle-text">为你精选好物</text>
      </view>

      <!-- 加载状态 -->
      <LoadingState v-if="loading && !products.length" />

      <!-- 错误状态 -->
      <ErrorState
        v-else-if="error"
        :title="error.title"
        :description="error.message"
        @retry="handleRetry"
      />

      <!-- 空状态 -->
      <EmptyState
        v-else-if="!loading && !products.length"
        title="暂无商品"
        description="敬请期待"
      >
        <template #action>
          <nut-button type="primary" size="small" @click="handleRetry">
            刷新
          </nut-button>
        </template>
      </EmptyState>

      <!-- 商品列表 -->
      <nut-list
        v-else
        :loading="loading"
        :has-more="hasMore"
        @load-more="loadMore"
      >
        <view class="products-grid">
          <ProductCard
            v-for="item in products"
            :key="item.id"
            :product="item"
            @click="handleProductClick"
            @error="handleImageError"
          />
        </view>

        <!-- 列表底部加载状态 -->
        <template #loading>
          <view class="loading-more">
            <nut-indicator size="16" color="#999">加载中...</nut-indicator>
          </view>
        </template>

        <!-- 列表底部完成状态 -->
        <template #finished>
          <view class="list-finished">
            <text>没有更多了</text>
          </view>
        </template>
      </nut-list>
    </view>
  </view>

  <NavBar />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Taro, { useLoad, usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import { 
  Grid, 
  GridItem, 
  List, 
  Searchbar,
  Toast,
  Swiper,
  SwiperItem,
  Indicator,
  Button
} from '@nutui/nutui-taro';
import '@nutui/nutui-taro/dist/style.css';
import { Cart, Category, Home, Shop } from '@nutui/icons-vue-taro';
import { useProductStore } from '../../store/modules/product';
import { storeToRefs } from 'pinia';
import { debounce } from 'lodash-es';

// 导入自定义组件
import NavBar from '../../components/NavBar.vue';
import ProductCard from '../../components/ProductCard.vue';
import LoadingState from '../../components/LoadingState.vue';
import ErrorState from '../../components/ErrorState.vue';
import EmptyState from '../../components/EmptyState.vue';

// 获取商品store
const productStore = useProductStore();
const { products, loading, hasMore, searchValue, banners } = storeToRefs(productStore);

// 错误状态
const error = ref<{ title: string; message: string } | null>(null);

// 分类数据
const categories = ref([
  { icon: Cart, name: '手机', id: 'phone' },
  { icon: Category, name: '电脑', id: 'computer' },
  { icon: Home, name: '家电', id: 'appliance' },
  { icon: Shop, name: '食品', id: 'food' }
]);

// 错误处理
const handleImageError = (e: Event) => {
  if (e.target) {
    (e.target as HTMLImageElement).src = 'https://img11.360buyimg.com/imagetools/jfs/t1/137646/13/7132/1648/5f4c748bE43da8ddd/a3f06d51dcae7b60.png';
  }
};

// 商品点击处理
const handleProductClick = (product: any) => {
  Taro.navigateTo({
    url: `/pages/product/detail/index?id=${product.id}`
  });
};

// 分类点击处理
const handleCategoryClick = (category: { id: string; name: string }) => {
  Taro.navigateTo({
    url: `/pages/category/list/index?id=${category.id}&name=${category.name}`
  });
};

// 轮播图点击处理
const handleBannerClick = (banner: { link: string }) => {
  Taro.navigateTo({
    url: banner.link
  });
};

// 搜索处理
const handleSearch = debounce(async (value: string) => {
  try {
    error.value = null;
    await productStore.searchProducts(value);
  } catch (err) {
    error.value = {
      title: '搜索失败',
      message: '请检查网络后重试'
    };
    console.error('搜索失败:', err);
  }
}, 500);

// 重试处理
const handleRetry = async () => {
  try {
    error.value = null;
    await productStore.fetchProducts(true);
  } catch (err) {
    error.value = {
      title: '加载失败',
      message: '请检查网络后重试'
    };
    console.error('重试加载失败:', err);
  }
};

// 加载更多
const loadMore = async () => {
  if (loading.value || !hasMore.value) return;
  
  try {
    await productStore.fetchProducts();
  } catch (err) {
    Toast.text('加载更多失败，请重试');
    console.error('加载更多失败:', err);
  }
};

// 下拉刷新
usePullDownRefresh(async () => {
  try {
    error.value = null;
    await productStore.fetchProducts(true);
    Toast.text('刷新成功');
  } catch (err) {
    error.value = {
      title: '刷新失败',
      message: '请检查网络后重试'
    };
    console.error('刷新失败:', err);
  } finally {
    Taro.stopPullDownRefresh();
  }
});

// 上拉加载更多
useReachBottom(() => {
  if (!error.value && !loading.value && hasMore.value) {
    loadMore();
  }
});

// 页面加载
useLoad(async () => {
  try {
    await productStore.fetchProducts(true);
    // 更新底部导航栏状态
    if (typeof window !== 'undefined') {
      const tabbar = Taro.getCurrentInstance().page?.selectComponent('.custom-tab-bar');
      if (tabbar?.setActive) {
        tabbar.setActive(0);
      }
    }
  } catch (err) {
    error.value = {
      title: '加载失败',
      message: '请检查网络后重试'
    };
    console.error('初始加载失败:', err);
  }
});

// 页面显示时更新底部导航状态
Taro.useDidShow(() => {
  if (typeof window !== 'undefined') {
    const tabbar = Taro.getCurrentInstance().page?.selectComponent('.custom-tab-bar');
    if (tabbar?.setActive) {
      tabbar.setActive(0);
    }
  }
});
</script>

<style lang="scss">
.container {
  padding-bottom: calc(60px + env(safe-area-inset-bottom));
  background-color: #f8f8f8;
  min-height: 100vh;
}

/* 搜索栏样式 */
.search-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 8px 12px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .nut-searchbar {
    --nutui-searchbar-background: #f5f5f5;
    padding: 6px 12px;
    border-radius: 8px;
  }

  .nut-searchbar__input {
    font-size: 14px;
  }
}

/* 轮播图样式 */
.banner-section {
  margin: 12px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .custom-swiper {
    height: 180px !important;
    border-radius: 12px;
    overflow: hidden;
  }

  .banner-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }

  .nut-swiper-pagination-bullet {
    width: 6px;
    height: 6px;
    background: rgba(255, 255, 255, 0.6);
    opacity: 1;
  }

  .nut-swiper-pagination-bullet-active {
    width: 12px;
    border-radius: 3px;
    background: #fff;
  }
}

/* 分类样式 */
.category-section {
  margin: 16px 12px;
  padding: 16px 12px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .category-item {
    transition: transform 0.2s ease;
    padding: 8px 0;

    &:active {
      transform: scale(0.95);
    }
  }

  .category-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f7fa;
    border-radius: 12px;
    transition: background-color 0.2s ease;

    &:active {
      background-color: #e8eaed;
    }
  }

  .category-name {
    font-size: 14px;
    color: #333;
    text-align: center;
  }
}

/* 商品列表样式 */
.products-section {
  margin: 0 12px;
  
  .section-title {
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
    padding: 0 4px;

    .title-text {
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }

    .subtitle-text {
      font-size: 12px;
      color: #999;
      margin-top: 4px;
    }
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 0 4px;
  }

  .loading-more,
  .list-finished {
    padding: 16px 0;
    text-align: center;
    color: #999;
    font-size: 14px;
  }
}

/* 响应式调整 */
@media (max-width: 375px) {
  .banner-section {
    .custom-swiper,
    .banner-image {
      height: 150px !important;
    }
  }

  .category-section {
    .category-icon {
      width: 40px;
      height: 40px;
    }

    .category-name {
      font-size: 12px;
    }
  }

  .products-section {
    .products-grid {
      gap: 8px;
    }
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .container {
    background-color: #1a1a1a;
  }

  .search-bar {
    background-color: #242424;

    .nut-searchbar {
      --nutui-searchbar-background: #333;
    }
  }

  .banner-section {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .category-section {
    background-color: #242424;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    .category-icon {
      background-color: #333;

      &:active {
        background-color: #404040;
      }
    }

    .category-name {
      color: #e0e0e0;
    }
  }

  .section-title {
    .title-text {
      color: #e0e0e0;
    }

    .subtitle-text {
      color: #999;
    }
  }

  .loading-more,
  .list-finished {
    color: #666;
  }
}
</style>