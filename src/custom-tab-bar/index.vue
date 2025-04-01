<template>
  <view class="custom-tab-bar">
    <nut-tabbar
      v-model="active"
      bottom
      safe-area-inset-bottom
    >
      <nut-tabbar-item
        v-for="(item, index) in list"
        :key="index"
        :tab-title="item.text"
      >
        <template #icon>
          <component 
            :is="item.icon" 
            :color="active === index ? '#ff4d4f' : '#999'"
            :size="22"
          />
        </template>
      </nut-tabbar-item>
    </nut-tabbar>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Taro from '@tarojs/taro';
import { Tabbar, TabbarItem } from '@nutui/nutui-taro';
import { Home, Category, Cart, My } from '@nutui/icons-vue-taro';

const list = [
  {
    text: '首页',
    icon: Home,
    pagePath: '/pages/index/index'
  },
  {
    text: '分类',
    icon: Category,
    pagePath: '/pages/category/index'
  },
  {
    text: '购物车',
    icon: Cart,
    pagePath: '/pages/cart/index'
  },
  {
    text: '我的',
    icon: My,
    pagePath: '/pages/mine/index'
  }
];

const active = ref(0);

// 监听标签页变化
watch(active, (newValue) => {
  const path = list[newValue].pagePath;
  if (path !== Taro.getCurrentInstance().router?.path) {
    Taro.switchTab({
      url: path,
      fail: (err) => {
        console.error('Tab switch failed:', err);
      }
    });
  }
});

// 初始化激活的标签
const currentPath = Taro.getCurrentInstance().router?.path || '/pages/index/index';
const initialIndex = list.findIndex(item => item.pagePath === currentPath);
if (initialIndex !== -1) {
  active.value = initialIndex;
}

// 供外部调用的方法
function setActive(index: number) {
  active.value = index;
}

// 将方法暴露给外部
defineExpose({
  setActive
});
</script>

<style lang="scss">
.custom-tab-bar {
  .nut-tabbar {
    height: 50px;
    background-color: #ffffff;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);

    &-item {
      height: 100%;
      padding: 6px 0;
      transition: all 0.3s ease;

      &__text {
        font-size: 12px;
        margin-top: 4px;
        color: #999;
      }

      &--active {
        .nut-tabbar-item__text {
          color: #ff4d4f;
        }
      }
    }
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .custom-tab-bar {
    .nut-tabbar {
      background-color: #242424;
      box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
    }
  }
}
</style>