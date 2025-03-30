<template>
  <view class="container">
    <!-- 轮播图 -->
    <nut-swiper :init-page="0" :pagination-visible="true" pagination-color="#426543" auto-play="3000">
      <nut-swiper-item v-for="(item, index) in banners" :key="index">
        <img :src="item.imgUrl" :alt="item.name" style="width:100%;height:180px" @error="handleImageError" />
      </nut-swiper-item>
    </nut-swiper>

    <!-- 分类 -->
    <view class="category">
      <nut-grid :column-num="4" :border="false">
        <nut-grid-item v-for="(item, index) in categories" :key="index">
          <component :is="item.icon" size="24" />
          <view>{{ item.name }}</view>
        </nut-grid-item>
      </nut-grid>
    </view>

    <!-- 商品列表 -->
    <view class="hot-products">
      <nut-list :gutter="10">
        <nut-card
          v-for="(item, index) in products"
          :key="index"
          :img-url="item.imgUrl"
          :title="item.name"
          :price="item.price"
          :vip-price="item.vipPrice"
          :shop-desc="item.desc"
          :delivery="item.delivery"
          :shop-name="item.shop"
          @click="handleClick"
          :img-tag="'新品'"
          :price-tag="'自营'"
        />
      </nut-list>
    </view>
  </view>

  <NavBar />
</template>

<script setup>
import { ref } from 'vue';
import NavBar from '../../components/NavBar.vue';
import { Grid, GridItem, Card, List } from '@nutui/nutui-taro';
import { Cart, Category, Home, Shop } from '@nutui/icons-vue-taro';

const handleImageError = (e) => {
  e.target.src = './public/default.jpg';
};

const handleClick = () => {
  // 商品点击事件
};

// 轮播图数据
const banners = ref([
  { imgUrl: './public/default.jpg', name: 'banner1' },
  { imgUrl: './public/default.jpg', name: 'banner2' },
  { imgUrl: './public/default.jpg', name: 'banner3' }
]);

// 分类数据
const categories = ref([
  { icon: 'cart', name: '手机' },
  { icon: 'category', name: '电脑' },
  { icon: 'home', name: '家电' },
  { icon: 'shop', name: '食品' }
]);

// 商品数据
const products = ref([
  { 
    imgUrl: './public/default.jpg',
    name: 'iPhone 13',
    price: '5999',
    vipPrice: '5799',
    desc: 'Apple iPhone 13 (A2634) 128GB 星光色',
    delivery: '京东发货',
    shop: 'Apple产品京东自营旗舰店'
  },
  { 
    imgUrl: './public/default.jpg',
    name: '小米12 Pro',
    price: '4699',
    vipPrice: '4599',
    desc: '小米12 Pro 骁龙8 Gen1 2K AMOLED 120Hz高刷',
    delivery: '京东发货',
    shop: '小米京东自营旗舰店'
  },
  { 
    imgUrl: './public/default.jpg',
    name: '华为Mate 50',
    price: '4999',
    vipPrice: '4899',
    desc: '华为Mate 50 骁龙8+ 4G 超光变XMAGE影像',
    delivery: '京东发货',
    shop: '华为京东自营旗舰店'
  },
  { 
    imgUrl: './public/default.jpg',
    name: '荣耀80 GT',
    price: '3299',
    vipPrice: '3199',
    desc: '荣耀80 GT 骁龙8+芯片 超帧独显芯片 120Hz原画超帧屏',
    delivery: '京东发货',
    shop: '荣耀京东自营旗舰店'
  },
  { 
    imgUrl: './public/default.jpg',
    name: 'OPPO Find X5',
    price: '3999',
    vipPrice: '3899',
    desc: 'OPPO Find X5 骁龙888 自研影像芯片 哈苏影像',
    delivery: '京东发货',
    shop: 'OPPO京东自营旗舰店'
  }
]);
</script>

<style>
.container {
  padding-bottom: 50px;
}

/* 轮播图样式 */
nut-swiper {
  height: 180px !important;
}

/* 分类样式 */
.category {
  margin: 10px 0;
  padding: 0 5px;
}

.nut-grid-item {
  padding: 5px 0;
}

.nut-grid-item view {
  font-size: 20px;
  margin-top: 5px;
}

/* 商品卡片样式 */
.hot-products {
  padding: 0 5px;
}

.hot-products .title {
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0;
}

.nut-card {
  margin-bottom: 10px;
}

@media (max-width: 375px) {
  nut-swiper {
    height: 150px !important;
  }
}
</style>