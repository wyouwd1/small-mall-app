<template>
  <view class="product-card" @tap="handleClick">
    <!-- 商品图片 -->
    <view class="product-image-wrapper">
      <image 
        :src="product.imgUrl" 
        :alt="product.name"
        mode="aspectFill"
        class="product-image"
        @error="handleImageError"
      />
      <view v-if="product.tag" class="product-tag">{{ product.tag }}</view>
    </view>

    <!-- 商品信息 -->
    <view class="product-info">
      <!-- 商品名称 -->
      <view class="product-name">{{ product.name }}</view>

      <!-- 商品描述 -->
      <view v-if="product.desc" class="product-desc">{{ product.desc }}</view>

      <!-- 价格信息 -->
      <view class="price-section">
        <text class="current-price">¥{{ product.price }}</text>
        <text v-if="product.vipPrice" class="vip-price">¥{{ product.vipPrice }}</text>
        <text v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</text>
      </view>

      <!-- 商家信息 -->
      <view class="shop-info">
        <text class="shop-name">{{ product.shop }}</text>
        <text v-if="product.delivery" class="delivery-info">{{ product.delivery }}</text>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view v-if="showAction" class="product-action">
      <slot name="action">
        <nut-button 
          type="primary" 
          size="small"
          class="action-button"
          @click.stop="handleAction"
        >
          {{ actionText }}
        </nut-button>
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { Button } from '@nutui/nutui-taro';

interface Product {
  id: string;
  imgUrl: string;
  name: string;
  desc?: string;
  price: string;
  vipPrice?: string;
  originalPrice?: string;
  shop: string;
  delivery?: string;
  tag?: string;
}

interface Props {
  product: Product;
  showAction?: boolean;
  actionText?: string;
}

// 定义组件属性
const props = withDefaults(defineProps<Props>(), {
  showAction: false,
  actionText: '加入购物车'
});

// 定义事件
const emit = defineEmits<{
  (e: 'click', product: Product): void;
  (e: 'action', product: Product): void;
  (e: 'error', event: Event): void;
}>();

// 图片加载错误处理
const handleImageError = (event: Event) => {
  if (event.target) {
    (event.target as HTMLImageElement).src = 'https://img11.360buyimg.com/imagetools/jfs/t1/137646/13/7132/1648/5f4c748bE43da8ddd/a3f06d51dcae7b60.png';
  }
  emit('error', event);
};

// 点击商品卡片
const handleClick = () => {
  emit('click', props.product);
};

// 点击操作按钮
const handleAction = () => {
  emit('action', props.product);
};
</script>

<style lang="scss">
.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:active {
    transform: translateY(2px);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }

  .product-image-wrapper {
    position: relative;
    width: 100%;
    padding-top: 100%; // 1:1 aspect ratio
    overflow: hidden;

    .product-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-tag {
      position: absolute;
      top: 8px;
      left: 8px;
      padding: 2px 6px;
      background-color: #ff4d4f;
      color: #fff;
      font-size: 12px;
      border-radius: 4px;
    }
  }

  .product-info {
    padding: 12px;

    .product-name {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      line-height: 1.4;
      margin-bottom: 4px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-desc {
      font-size: 12px;
      color: #999;
      margin-bottom: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .price-section {
      margin-bottom: 8px;

      .current-price {
        font-size: 16px;
        font-weight: bold;
        color: #ff4d4f;
      }

      .vip-price {
        font-size: 12px;
        color: #ff9c00;
        margin-left: 8px;
      }

      .original-price {
        font-size: 12px;
        color: #999;
        text-decoration: line-through;
        margin-left: 8px;
      }
    }

    .shop-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;

      .shop-name {
        color: #666;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .delivery-info {
        color: #999;
        margin-left: 8px;
      }
    }
  }

  .product-action {
    padding: 0 12px 12px;
    display: flex;
    justify-content: flex-end;

    .action-button {
      min-width: 90px;
      border-radius: 16px;
    }
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .product-card {
    background-color: #242424;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    &:active {
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    }

    .product-info {
      .product-name {
        color: #e0e0e0;
      }

      .product-desc {
        color: #999;
      }

      .shop-info {
        .shop-name {
          color: #999;
        }

        .delivery-info {
          color: #666;
        }
      }
    }
  }
}
</style>