<template>
  <view class="category-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <nut-searchbar
        v-model="searchValue"
        placeholder="搜索分类商品"
        input-type="search"
        background="#f7f7f7"
      />
    </view>

    <!-- 分类内容 -->
    <view class="category-content">
      <!-- 左侧分类菜单 -->
      <scroll-view 
        scroll-y 
        class="category-menu"
      >
        <view 
          v-for="(item, index) in categories" 
          :key="index"
          class="menu-item"
          :class="{ active: currentCategory === index }"
          @tap="handleCategoryClick(index)"
        >
          {{ item.name }}
        </view>
      </scroll-view>

      <!-- 右侧商品列表 -->
      <scroll-view 
        scroll-y 
        class="category-list"
        @scrolltolower="loadMore"
      >
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
          description="该分类下暂无商品"
        >
          <template #action>
            <nut-button type="primary" size="small" @click="handleRetry">
              刷新
            </nut-button>
          </template>
        </EmptyState>

        <!-- 商品列表 -->
        <view v-else class="product-grid">
          <ProductCard
            v-for="item in products"
            :key="item.id"
            :product="item"
            @click="handleProductClick"
            @error="handleImageError"
          />
        </view>

        <!-- 加载更多状态 -->
        <view v-if="products.length > 0" class="load-more">
          <nut-indicator v-if="loading" size="16" color="#999">加载中...</nut-indicator>
          <text v-else-if="!hasMore" class="no-more">没有更多了</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Taro from '@tarojs/taro';
import { Searchbar, Button, Indicator } from '@nutui/nutui-taro';
import { useProductStore } from '../../store/modules/product';
import { storeToRefs } from 'pinia';
import { useTabBar } from '../../hooks/useTabBar';
import LoadingState from '../../components/LoadingState.vue';
import ErrorState from '../../components/ErrorState.vue';
import EmptyState from '../../components/EmptyState.vue';
import ProductCard from '../../components/ProductCard.vue';

// 使用 Tab Bar Hook
useTabBar(1);

// 获取商品 store
const productStore = useProductStore();
const { products, loading, hasMore } = storeToRefs(productStore);

// 状态
const searchValue = ref('');
const currentCategory = ref(0);
const error = ref<{ title: string; message: string } | null>(null);

// 分类数据
const categories = ref([
  { name: '手机', id: 'phone' },
  { name: '电脑', id: 'computer' },
  { name: '智能', id: 'smart' },
  { name: '配件', id: 'accessories' },
  { name: '家电', id: 'appliance' },
  { name: '食品', id: 'food' },
  { name: '服饰', id: 'clothing' },
  { name: '美妆', id: 'beauty' }
]);

// 切换分类
const handleCategoryClick = async (index: number) => {
  if (currentCategory.value === index) return;
  currentCategory.value = index;
  try {
    error.value = null;
    await productStore.fetchProducts(true);
  } catch (err) {
    error.value = {
      title: '加载失败',
      message: '请检查网络后重试'
    };
    console.error('加载分类商品失败:', err);
  }
};

// 加载更多
const loadMore = async () => {
  if (loading.value || !hasMore.value) return;
  try {
    await productStore.fetchProducts();
  } catch (err) {
    console.error('加载更多失败:', err);
  }
};

// 商品点击处理
const handleProductClick = (product: any) => {
  Taro.navigateTo({
    url: `/pages/product/detail/index?id=${product.id}`
  });
};

// 图片加载错误处理
const handleImageError = (e: Event) => {
  if (e.target) {
    (e.target as HTMLImageElement).src = 'https://img11.360buyimg.com/imagetools/jfs/t1/137646/13/7132/1648/5f4c748bE43da8ddd/a3f06d51dcae7b60.png';
  }
};

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
</script>

<style lang="scss">
.category-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;

  .search-bar {
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 8px 12px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    :deep(.nut-searchbar) {
      --nutui-searchbar-background: #f5f5f5;
      padding: 6px 12px;
      border-radius: 8px;
    }

    :deep(.nut-searchbar__input) {
      font-size: 14px;
    }
  }

  .category-content {
    flex: 1;
    display: flex;
    height: calc(100vh - 60px);

    .category-menu {
      width: 90px;
      background-color: #fff;
      border-right: 1px solid #f0f0f0;

      .menu-item {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #333;
        position: relative;
        transition: all 0.3s ease;

        &.active {
          color: #ff4d4f;
          font-weight: 500;
          background-color: #fff;

          &::after {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 3px;
            height: 20px;
            background-color: #ff4d4f;
            border-radius: 0 2px 2px 0;
          }
        }

        &:active {
          background-color: #f5f5f5;
        }
      }
    }

    .category-list {
      flex: 1;
      background-color: #fff;
      padding: 12px;

      .product-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .load-more {
        padding: 16px 0;
        text-align: center;
        color: #999;
        font-size: 14px;

        .no-more {
          color: #999;
          font-size: 14px;
        }
      }
    }
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .category-page {
    background-color: #1a1a1a;

    .search-bar {
      background-color: #242424;

      :deep(.nut-searchbar) {
        --nutui-searchbar-background: #333;
      }
    }

    .category-content {
      .category-menu {
        background-color: #242424;
        border-right-color: #333;

        .menu-item {
          color: #e0e0e0;

          &.active {
            background-color: #242424;
          }

          &:active {
            background-color: #333;
          }
        }
      }

      .category-list {
        background-color: #242424;
      }
    }
  }
}
</style>