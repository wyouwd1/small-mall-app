<template>
  <view class="container">
    <view class="user-info">
      <nut-avatar size="large" icon="my"></nut-avatar>
      <view class="name">用户名</view>
      <view class="level">普通会员</view>
    </view>

    <nut-cell-group>
      <nut-cell title="我的订单" is-link></nut-cell>
      <nut-cell title="收货地址" is-link></nut-cell>
      <nut-cell title="设置" is-link></nut-cell>
      <nut-cell title="关于我们" is-link></nut-cell>
    </nut-cell-group>
  </view>

  <NavBar />
</template>

<script setup>
import NavBar from '../../components/NavBar.vue';
</script>

<style scoped>
.container {
  padding-bottom: 50px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  background: #f5f5f5;
}

.name {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0 5px;
}

.level {
  font-size: 12px;
  color: #999;
}
</style>