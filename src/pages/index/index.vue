<template>
  <swiper
    class='test-h'
    indicator-color='#999'
    indicator-active-color='#333'
    :vertical="true"
    :circular="true"
    :indicator-dots="true"
    :autoplay="false"
    :full="true"
  >
    <swiper-item>
      <view class='demo-text-1'>首页</view>
    </swiper-item>
    <swiper-item>
      <view class='demo-text-2'>品类</view>
    </swiper-item>
    <swiper-item>
      <view class='demo-text-3'>购物车</view>
    </swiper-item>
    <swiper-item>
      <view class='demo-text-3'>我的</view>
    </swiper-item>
  </swiper>
</template>

<script setup>
import { ref } from 'vue';
import { Dongdong } from '@nutui/icons-vue-taro';

const count = ref(0);

const handleClick = () => {
  count.value++;
};
</script>

<style>
.demo {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>