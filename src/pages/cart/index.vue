<template>
  <view class="container">
    <view class="title">购物车</view>
    <nut-cell-group>
      <nut-cell v-for="(item, index) in cartItems" :key="index">
        <template #icon>
          <nut-checkbox v-model="item.checked" />
        </template>
        <template #title>
          <view>{{ item.name }}</view>
        </template>
        <template #description>
          <view>¥{{ item.price }} x{{ item.quantity }}</view>
        </template>
        <template #extra>
          <nut-steps v-model="item.quantity" min="1" />
        </template>
      </nut-cell>
    </nut-cell-group>
    
    <view class="footer">
      <nut-button type="primary" block>结算</nut-button>
    </view>
  </view>

  <NavBar />
</template>

<script setup>
import { ref } from 'vue';
import NavBar from '../../components/NavBar.vue';
import { Steps } from '@nutui/nutui-taro';

const cartItems = ref([
  { 
    name: 'iPhone 13',
    price: '5999',
    quantity: 1,
    checked: true
  },
  { 
    name: '小米12 Pro',
    price: '4699',
    quantity: 1,
    checked: false
  }
]);
</script>

<style scoped>
.container {
  padding-bottom: 50px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px;
  padding-left: 5px;
}

.footer {
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
  padding: 10px;
  background: #fff;
}
</style>