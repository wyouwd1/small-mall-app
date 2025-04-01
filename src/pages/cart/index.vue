<template>
  <view class="cart-page">
    <!-- 空购物车状态 -->
    <EmptyState
      v-if="!cartItems.length"
      title="购物车空空如也"
      description="快去选购心仪的商品吧"
    >
      <template #action>
        <nut-button type="primary" size="small" @click="goShopping">
          去购物
        </nut-button>
      </template>
    </EmptyState>

    <!-- 购物车列表 -->
    <template v-else>
      <!-- 商品列表 -->
      <view class="cart-list">
        <view 
          v-for="item in cartItems" 
          :key="item.id"
          class="cart-item"
        >
          <view class="item-select">
            <nut-checkbox 
              v-model="item.selected"
              @change="handleItemSelect(item)"
            />
          </view>
          <view class="item-content">
            <image 
              :src="item.imgUrl" 
              class="item-image"
              mode="aspectFill"
              @error="handleImageError"
            />
            <view class="item-info">
              <view class="item-name">{{ item.name }}</view>
              <view class="item-spec">{{ item.spec }}</view>
              <view class="item-price">
                <text class="price">¥{{ item.price }}</text>
                <nut-input-number 
                  v-model="item.quantity"
                  min="1"
                  @change="handleQuantityChange(item)"
                />
              </view>
            </view>
          </view>
          <view class="item-delete">
            <nut-button 
              type="danger" 
              size="small"
              @click="handleDelete(item)"
            >
              删除
            </nut-button>
          </view>
        </view>
      </view>

      <!-- 底部结算栏 -->
      <view class="cart-footer">
        <view class="select-all">
          <nut-checkbox 
            v-model="isAllSelected"
            @change="handleSelectAll"
          >
            全选
          </nut-checkbox>
        </view>
        <view class="total-info">
          <view class="total-price">
            合计：<text class="price">¥{{ totalPrice }}</text>
          </view>
          <nut-button 
            type="primary"
            :disabled="!selectedCount"
            @click="handleCheckout"
          >
            结算({{ selectedCount }})
          </nut-button>
        </view>
      </view>
    </template>

    <!-- 删除确认弹窗 -->
    <nut-dialog
      v-model:visible="showDeleteDialog"
      title="删除商品"
      content="确定要删除该商品吗？"
      @confirm="confirmDelete"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Taro from '@tarojs/taro';
import { Button, Checkbox, InputNumber, Dialog, Toast } from '@nutui/nutui-taro';
import '@nutui/nutui-taro/dist/style.css';
import { useTabBar } from '../../hooks/useTabBar';
import EmptyState from '../../components/EmptyState.vue';

// 使用 Tab Bar Hook
useTabBar(2);

// 购物车数据
const cartItems = ref([
  {
    id: '1',
    name: 'iPhone 14 Pro',
    spec: '暗紫色 256GB',
    price: '7999',
    imgUrl: 'https://img13.360buyimg.com/n1/s450x450_jfs/t1/35753/6/19644/60437/63e4a4cfF82b63c38/86ad16b6b6a0c8d1.jpg',
    quantity: 1,
    selected: false
  },
  {
    id: '2',
    name: '小米13',
    spec: '黑色 8GB+256GB',
    price: '3999',
    imgUrl: 'https://img14.360buyimg.com/n1/s450x450_jfs/t1/140860/32/33707/38760/63fef906Fddbc7ada/c1b9b4b9c7726b54.jpg',
    quantity: 1,
    selected: false
  }
]);

// 删除相关
const showDeleteDialog = ref(false);
const itemToDelete = ref<any>(null);

// 计算属性
const isAllSelected = computed({
  get: () => cartItems.value.length > 0 && cartItems.value.every(item => item.selected),
  set: (value) => {
    cartItems.value.forEach(item => item.selected = value);
  }
});

const selectedCount = computed(() => 
  cartItems.value.filter(item => item.selected).length
);

const totalPrice = computed(() => 
  cartItems.value
    .filter(item => item.selected)
    .reduce((total, item) => total + Number(item.price) * item.quantity, 0)
    .toFixed(2)
);

// 方法
const handleItemSelect = (item: any) => {
  // 更新商品选中状态
  item.selected = !item.selected;
};

const handleSelectAll = (value: boolean) => {
  cartItems.value.forEach(item => item.selected = value);
};

const handleQuantityChange = (item: any) => {
  // 更新商品数量
  console.log('数量更新:', item.id, item.quantity);
};

const handleDelete = (item: any) => {
  itemToDelete.value = item;
  showDeleteDialog.value = true;
};

const confirmDelete = () => {
  if (itemToDelete.value) {
    const index = cartItems.value.findIndex(item => item.id === itemToDelete.value.id);
    if (index !== -1) {
      cartItems.value.splice(index, 1);
      Toast.text('删除成功');
    }
  }
  showDeleteDialog.value = false;
  itemToDelete.value = null;
};

const handleCheckout = () => {
  const selectedItems = cartItems.value.filter(item => item.selected);
  console.log('结算商品:', selectedItems);
  // TODO: 跳转到结算页面
  Taro.showToast({
    title: '暂未实现结算功能',
    icon: 'none'
  });
};

const goShopping = () => {
  Taro.switchTab({
    url: '/pages/index/index'
  });
};

const handleImageError = (e: Event) => {
  if (e.target) {
    (e.target as HTMLImageElement).src = 'https://img11.360buyimg.com/imagetools/jfs/t1/137646/13/7132/1648/5f4c748bE43da8ddd/a3f06d51dcae7b60.png';
  }
};
</script>

<style lang="scss">
.cart-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: calc(50px + env(safe-area-inset-bottom));

  .cart-list {
    padding: 12px;

    .cart-item {
      background-color: #fff;
      border-radius: 12px;
      margin-bottom: 12px;
      padding: 12px;
      display: flex;
      align-items: center;

      .item-select {
        margin-right: 12px;
      }

      .item-content {
        flex: 1;
        display: flex;
        align-items: flex-start;

        .item-image {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          margin-right: 12px;
        }

        .item-info {
          flex: 1;

          .item-name {
            font-size: 14px;
            color: #333;
            margin-bottom: 4px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .item-spec {
            font-size: 12px;
            color: #999;
            margin-bottom: 8px;
          }

          .item-price {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .price {
              font-size: 16px;
              color: #ff4d4f;
              font-weight: bold;
            }
          }
        }
      }

      .item-delete {
        margin-left: 12px;
      }
    }
  }

  .cart-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    padding: 12px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);

    .select-all {
      font-size: 14px;
    }

    .total-info {
      display: flex;
      align-items: center;

      .total-price {
        margin-right: 12px;
        font-size: 14px;

        .price {
          font-size: 18px;
          color: #ff4d4f;
          font-weight: bold;
        }
      }
    }
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .cart-page {
    background-color: #1a1a1a;

    .cart-list {
      .cart-item {
        background-color: #242424;

        .item-content {
          .item-info {
            .item-name {
              color: #e0e0e0;
            }
          }
        }
      }
    }

    .cart-footer {
      background-color: #242424;
      box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
    }
  }
}
</style>