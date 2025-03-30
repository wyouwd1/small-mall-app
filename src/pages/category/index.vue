<template>
  <view class="container">
    <view class="title">商品分类</view>
    <nut-grid :column-num="3" :border="false">
      <nut-grid-item v-for="(item, index) in categories" :key="index">
        <view style="font-size: 20px">{{ item.name }}</view>
      </nut-grid-item>
    </nut-grid>
  </view>

  <NavBar />
</template>

<script setup>
import { ref } from 'vue';
import NavBar from '../../components/NavBar.vue';

const categories = ref([
  { name: '手机' },
  { name: '电脑' },
  { name: '家电' },
  { name: '食品' },
  { name: '服饰' },
  { name: '美妆' }
]);
</script>

<style scoped>
.container {
  padding-bottom: 50px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin: 10px;
  padding-left: 5px;
}
</style>