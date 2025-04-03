<template>
  <view class="index">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <nut-searchbar v-model="searchValue" placeholder="搜索商品" @search="onSearch" />
    </view>

    <!-- 轮播图 -->
    <view class="banner">
      <nut-swiper :init-page="0" :pagination-visible="true" pagination-color="#fa2c19" auto-play="3000">
        <nut-swiper-item v-for="(item, index) in banners" :key="index">
          <img :src="item.imgUrl" :alt="item.name" />
        </nut-swiper-item>
      </nut-swiper>
    </view>

    <!-- 分类导航 -->
    <view class="nav-category">
      <nut-grid :column-num="5">
        <nut-grid-item v-for="(item, index) in categories" :key="index" @click="onCategoryClick(item)">
          <component :is="item.icon" size="30" />
          <text>{{ item.name }}</text>
        </nut-grid-item>
      </nut-grid>
    </view>

    <!-- 商品列表 -->
    <view class="goods-list">
      <nut-divider>热门商品</nut-divider>
      <nut-space direction="vertical" :gap="10">
        <nut-grid :column-num="2" :border="false">
          <nut-grid-item v-for="(item, index) in products" :key="index" @click="onProductClick(item)">
            <nut-card
              :img-url="item.imgUrl"
              :title="item.name"
            >
              <template #price>
                <nut-price :price="item.price" size="normal" />
                <nut-price :price="item.vipPrice" size="small" class="vip-price" />
              </template>
            </nut-card>
          </nut-grid-item>
        </nut-grid>
      </nut-space>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import { Search, Cart, Shop, Shop3, Star } from '@nutui/icons-vue-taro'
import { showToast } from '@tarojs/taro'

// 搜索相关
const searchValue = ref('')
const onSearch = (val) => {
  // TODO: 搜索页面暂未创建
  // Taro.navigateTo({ url: `/pages/search/index?keyword=${val}` })
  showToast({
    title: '搜索功能开发中',
    icon: 'none'
  })
}

// 轮播图数据
const banners = ref([
  {
    imgUrl: 'https://img14.360buyimg.com/babel/s1180x940_jfs/t1/110562/14/27806/131845/63aa19e3Ea49e3cfc/8ef1c21a2bf0b1d1.jpg.webp',
    name: '新年特惠'
  },
  {
    imgUrl: 'https://img12.360buyimg.com/babel/s1180x940_jfs/t1/170098/1/33255/100430/63aa19e3E0c17d522/4d4ca21c7e49dd01.jpg.webp',
    name: '年货节'
  },
  {
    imgUrl: 'https://img11.360buyimg.com/babel/s1180x940_jfs/t1/136073/35/30095/126223/63aa19e3E4aa4bef8/7b45761968146ce9.jpg.webp',
    name: '限时秒杀'
  }
])

// 分类数据
const categories = ref([
  { icon: Shop, name: '超市' },
  { icon: Shop3, name: '新品' },
  { icon: Cart, name: '促销' },
  { icon: Star, name: '精选' },
  { icon: Search, name: '更多' }
])

// 商品数据
const products = ref([
  {
    id: 1,
    imgUrl: 'https://img14.360buyimg.com/n1/s546x546_jfs/t1/223778/18/6959/103158/61cc7965E6f1e0dda/a4a0450759d5614e.jpg',
    name: 'iPhone 13 Pro',
    price: '5999',
    vipPrice: '5899'
  },
  {
    id: 2,
    imgUrl: 'https://img14.360buyimg.com/n1/s546x546_jfs/t1/106207/35/33316/168578/632a7361E7bd1f38e/1006e302770e3811.jpg',
    name: '华为 Mate 50',
    price: '4999',
    vipPrice: '4899'
  },
  {
    id: 3,
    imgUrl: 'https://img14.360buyimg.com/n1/s546x546_jfs/t1/178015/17/30654/74077/6368cb89Ef2f24f3d/a6c2443c9e2ce491.jpg',
    name: '小米 12S Ultra',
    price: '4699',
    vipPrice: '4599'
  },
  {
    id: 4,
    imgUrl: 'https://img14.360buyimg.com/n1/s546x546_jfs/t1/195164/25/30800/47837/635f8075E27fad736/6c86f44d0f9aa3c3.jpg',
    name: 'OPPO Find X5',
    price: '3999',
    vipPrice: '3899'
  }
])

// 事件处理
const onCategoryClick = (category) => {
  Taro.navigateTo({ url: `/pages/category/index?type=${category.name}` })
}

const onProductClick = (product) => {
  // TODO: 商品详情页面暂未创建
  // Taro.navigateTo({ url: `/pages/goods-details/index?id=${product.id}` })
  showToast({
    title: '商品详情页面开发中',
    icon: 'none'
  })
}
</script>

<style lang="scss">
.index {
  min-height: 100vh;
  background: #f7f8fa;
  
  .search-bar {
    background: #fff;
    padding: 8px 16px;
  }

  .banner {
    margin-bottom: 10px;
    
    img {
      width: 100%;
      height: 150px;
      display: block;
    }
  }

  .nav-category {
    background: #fff;
    margin-bottom: 10px;
    padding: 10px 0;

    .nut-grid-item {
      text-align: center;
      
      .nut-icon {
        margin-bottom: 5px;
      }

      text {
        font-size: 12px;
        color: #333;
      }
    }
  }

  .goods-list {
    background: #fff;
  
    :deep(.nut-card) {
      margin: 5px;
    }

    .vip-price {
      margin-left: 5px;
      color: #999;
      text-decoration: line-through;
    }
  }
}
</style>