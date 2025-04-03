<template>
  <view class="cart">
    <!-- 空购物车提示 -->
    <nut-empty v-if="cartItems.length === 0"
      description="购物车是空的"
      image="cart"
    >
      <template #footer>
        <nut-button type="primary" size="small" @click="goShopping">
          去逛逛
        </nut-button>
      </template>
    </nut-empty>

    <!-- 购物车列表 -->
    <view v-else class="cart-content">
      <!-- 商品列表 -->
      <nut-cell-group>
        <nut-swipe v-for="(item, index) in cartItems" :key="index">
          <nut-cell>
            <template #default>
              <view class="cart-item">
                <view class="item-select">
                  <nut-checkbox 
                    v-model="item.checked" 
                    @change="updateSelection"
                  />
                </view>
                <view class="item-info">
                  <image 
                    :src="item.image" 
                    style="width: 80px; height: 80px; border-radius: 4px;"
                  />
                  <view class="item-detail">
                    <view class="item-name">{{ item.name }}</view>
                    <view class="item-sku" v-if="item.sku">{{ item.sku }}</view>
                    <view class="item-price">
                      <nut-price :price="item.price" size="normal" />
                      <view class="quantity-control">
                        <nut-input-number 
                          v-model="item.quantity" 
                          min="1" 
                          max="99"
                          @change="updateTotal"
                        />
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </template>
          </nut-cell>
          <template #right>
            <nut-button 
              type="danger" 
              square 
              @click="deleteItem(index)"
            >
              删除
            </nut-button>
          </template>
        </nut-swipe>
      </nut-cell-group>

      <!-- 结算栏 -->
      <nut-fixed-nav
        position="bottom"
        :overlay="false"
        :content-visible="true"
      >
        <template #content>
          <view class="settlement-bar">
            <view class="select-all">
              <nut-checkbox 
                v-model="isAllSelected" 
                @change="toggleSelectAll"
              >全选</nut-checkbox>
            </view>
            <view class="total-info">
              <view class="total-price">
                <text>合计：</text>
                <nut-price :price="totalPrice" size="large" />
              </view>
              <view class="total-desc">不含运费</view>
            </view>
            <nut-button 
              type="primary" 
              :disabled="!hasSelectedItems"
              @click="settlement"
            >
              结算({{ selectedCount }})
            </nut-button>
          </view>
        </template>
      </nut-fixed-nav>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'

// 购物车数据
const cartItems = ref([
  {
    id: 1,
    name: 'iPhone 14 Pro',
    price: '7999',
    quantity: 1,
    checked: true,
    image: 'https://img14.360buyimg.com/n1/s546x546_jfs/t1/223778/18/6959/103158/61cc7965E6f1e0dda/a4a0450759d5614e.jpg',
    sku: '深空黑色 256GB'
  },
  {
    id: 2,
    name: '华为 Mate 50',
    price: '4999',
    quantity: 1,
    checked: true,
    image: 'https://img14.360buyimg.com/n1/s546x546_jfs/t1/106207/35/33316/168578/632a7361E7bd1f38e/1006e302770e3811.jpg',
    sku: '曜金黑 256GB'
  }
])

// 计算属性
const isAllSelected = computed(() => {
  return cartItems.value.length > 0 && cartItems.value.every(item => item.checked)
})

const totalPrice = computed(() => {
  return cartItems.value
    .filter(item => item.checked)
    .reduce((total, item) => {
      return total + Number(item.price) * item.quantity
    }, 0)
    .toFixed(2)
})

const selectedCount = computed(() => {
  return cartItems.value.filter(item => item.checked).length
})

const hasSelectedItems = computed(() => {
  return cartItems.value.some(item => item.checked)
})

// 方法
const updateSelection = () => {
  // 更新选择状态后的操作
}

const toggleSelectAll = () => {
  const newStatus = !isAllSelected.value
  cartItems.value.forEach(item => {
    item.checked = newStatus
  })
}

const updateTotal = () => {
  // 更新总价的操作
}

const deleteItem = (index: number) => {
  Taro.showModal({
    title: '提示',
    content: '确定要删除这个商品吗？',
    success: function (res) {
      if (res.confirm) {
        cartItems.value.splice(index, 1)
      }
    }
  })
}

const settlement = () => {
  const selectedItems = cartItems.value.filter(item => item.checked)
  if (selectedItems.length === 0) {
    Taro.showToast({
      title: '请选择商品',
      icon: 'none'
    })
    return
  }
  
  Taro.navigateTo({
    url: '/pages/order/confirm'
  })
}

const goShopping = () => {
  Taro.switchTab({
    url: '/pages/index/index'
  })
}
</script>

<style lang="scss">
.cart {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 50px;

  .cart-content {
    .cart-item {
      display: flex;
      align-items: center;
      padding: 10px;

      .item-select {
        padding: 0 10px;
      }

      .item-info {
        flex: 1;
        display: flex;
        align-items: center;

        .nut-image {
          margin-right: 10px;
        }

        .item-detail {
          flex: 1;

          .item-name {
            font-size: 14px;
            color: #333;
            margin-bottom: 5px;
          }

          .item-sku {
            font-size: 12px;
            color: #999;
            margin-bottom: 5px;
          }

          .item-price {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        }
      }
    }

    .settlement-bar {
      display: flex;
      align-items: center;
      padding: 0 16px;
      background: #fff;
      height: 50px;

      .select-all {
        margin-right: 15px;
      }

      .total-info {
        flex: 1;
        
        .total-desc {
          font-size: 12px;
          color: #999;
        }
      }

      .nut-button {
        width: 100px;
        border-radius: 20px;
      }
    }
  }
}
</style>