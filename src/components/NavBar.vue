<template>
  <nut-tabbar @tab-switch="tabSwitch" bottom safe-area-inset-bottom>
    <nut-tabbar-item tab-title="首页" icon="home"></nut-tabbar-item>
    <nut-tabbar-item tab-title="分类" icon="category"></nut-tabbar-item>
    <nut-tabbar-item tab-title="购物车" icon="cart"></nut-tabbar-item>
    <nut-tabbar-item tab-title="我的" icon="my"></nut-tabbar-item>
  </nut-tabbar>
</template>

<script setup>
import { ref } from 'vue';
import Taro from '@tarojs/taro';

const tabSwitch = (item, index) => {
  const routes = ['pages/index/index', 'pages/category/index', 'pages/cart/index', 'pages/mine/index'];
  if (routes[index]) {
    Taro.switchTab({
      url: routes[index]
    });
  }
};
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>