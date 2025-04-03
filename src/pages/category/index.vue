<template>
  <view class="category">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <nut-searchbar v-model="searchValue" placeholder="搜索商品" @search="onSearch" />
    </view>

    <view class="category-content">
      <!-- 左侧分类导航 -->
      <view class="sidebar-wrapper">
        <nut-side-navbar v-model="currentCategory">
          <nut-side-navbar-item
            v-for="(item, index) in categories"
            :key="index"
            :title="item.name"
          />
        </nut-side-navbar>
      </view>

      <!-- 右侧商品列表 -->
      <scroll-view scroll-y class="category-list">
        <block v-if="categories[currentCategory]">
          <!-- 分类广告图 -->
          <image
            :src="categories[currentCategory].banner"
            style="width: 100%; height: 100px; border-radius: 8px;"
          />
          
          <!-- 子分类列表 -->
          <nut-grid :column-num="4">
            <nut-grid-item
              v-for="(subCate, subIndex) in categories[currentCategory].children"
              :key="subIndex"
              :text="subCate.name"
              @click="onSubCategoryClick(subCate)"
            >
              <template #icon>
                <image
                  :src="subCate.icon"
                  style="width: 40px; height: 40px;"
                />
              </template>
            </nut-grid-item>
          </nut-grid>

          <!-- 推荐商品 -->
          <view class="recommend-goods" v-if="categories[currentCategory].goods">
            <nut-divider>热门推荐</nut-divider>
            <nut-grid :column-num="2" :border="false">
              <nut-grid-item
                v-for="(goods, goodsIndex) in categories[currentCategory].goods"
                :key="goodsIndex"
                @click="onGoodsClick(goods)"
              >
                <view class="goods-card">
                  <image :src="goods.image" style="width: 100%; height: 150px; border-radius: 4px;" />
                  <view class="goods-info">
                    <view class="goods-name">{{ goods.name }}</view>
                    <nut-price :price="goods.price" size="normal" />
                  </view>
                </view>
              </nut-grid-item>
            </nut-grid>
          </view>
        </block>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Taro from '@tarojs/taro'

// 搜索相关
const searchValue = ref('')
const onSearch = (val) => {
  Taro.navigateTo({ url: `/pages/search/index?keyword=${val}` })
}

// 当前选中的分类
const currentCategory = ref(0)

// 分类数据
const categories = ref([
  {
    name: '手机数码',
    banner: 'https://img10.360buyimg.com/babel/s1180x940_jfs/t1/164255/32/35180/102991/63aa19e4E0f8c3bef/8f3c0f3c4f3f4a24.jpg.webp',
    children: [
      {
        name: '手机',
        icon: 'https://img12.360buyimg.com/babel/s100x100_jfs/t1/187640/12/30800/5256/635f807bE37141191/81d0df32fc478293.jpg',
      },
      {
        name: '平板',
        icon: 'https://img11.360buyimg.com/babel/s100x100_jfs/t1/177562/11/30671/5929/635f807bE4489792d/74b83b6f35dd5893.jpg',
      },
      {
        name: '电脑',
        icon: 'https://img14.360buyimg.com/babel/s100x100_jfs/t1/220688/25/21137/4964/635f807bE91f46b00/7bd6eb8d17830991.jpg',
      },
      {
        name: '相机',
        icon: 'https://img11.360buyimg.com/babel/s100x100_jfs/t1/143365/39/30795/4800/635f807bE37c41f0d/dd28082b12459534.jpg',
      }
    ],
    goods: [
      {
        id: 1,
        name: 'iPhone 14 Pro',
        price: '7999',
        image: 'https://img14.360buyimg.com/n1/s546x546_jfs/t1/223778/18/6959/103158/61cc7965E6f1e0dda/a4a0450759d5614e.jpg'
      },
      {
        id: 2,
        name: '华为 MatePad Pro',
        price: '4999',
        image: 'https://img14.360buyimg.com/n1/s546x546_jfs/t1/106207/35/33316/168578/632a7361E7bd1f38e/1006e302770e3811.jpg'
      }
    ]
  },
  {
    name: '家用电器',
    banner: 'https://img11.360buyimg.com/babel/s1180x940_jfs/t1/136073/35/30095/126223/63aa19e3E4aa4bef8/7b45761968146ce9.jpg.webp',
    children: [
      {
        name: '电视',
        icon: 'https://img13.360buyimg.com/babel/s100x100_jfs/t1/180598/36/30849/4974/635f8075E9e7d1479/5f58e82cc2cc5e1e.jpg'
      },
      {
        name: '空调',
        icon: 'https://img14.360buyimg.com/babel/s100x100_jfs/t1/213972/8/21692/4979/635f8075Eaa7cd76b/01956e2dc5d2a5b3.jpg'
      },
      {
        name: '洗衣机',
        icon: 'https://img11.360buyimg.com/babel/s100x100_jfs/t1/195015/25/29890/4895/635f8075E7e2f3613/eec779757a34ed9b.jpg'
      },
      {
        name: '冰箱',
        icon: 'https://img14.360buyimg.com/babel/s100x100_jfs/t1/139544/13/30811/4757/635f8075Eaa2d6460/0b02c35e46b6cb88.jpg'
      }
    ],
    goods: [
      {
        id: 3,
        name: '小米电视6至尊版 65英寸',
        price: '5999',
        image: 'https://img14.360buyimg.com/n1/s546x546_jfs/t1/195164/25/30800/47837/635f8075E27fad736/6c86f44d0f9aa3c3.jpg'
      },
      {
        id: 4,
        name: '海尔空调挂机',
        price: '2999',
        image: 'https://img14.360buyimg.com/n1/s546x546_jfs/t1/178015/17/30654/74077/6368cb89Ef2f24f3d/a6c2443c9e2ce491.jpg'
      }
    ]
  }
])

// 切换分类
const switchCategory = (index: number) => {
  currentCategory.value = index
}

// 点击子分类
const onSubCategoryClick = (subCategory) => {
  Taro.navigateTo({
    url: `/pages/goods-list/index?category=${subCategory.name}`
  })
}

// 点击商品
const onGoodsClick = (goods) => {
  Taro.navigateTo({
    url: `/pages/goods-details/index?id=${goods.id}`
  })
}
</script>

<style lang="scss">
.category {
  height: 100vh;
  background: #f7f8fa;
  display: flex;
  flex-direction: column;

  .search-bar {
    background: #fff;
    padding: 8px 16px;
  }

  .category-content {
    flex: 1;
    display: flex;
    overflow: hidden;

    .sidebar-wrapper {
      width: 85px;
      height: 100%;
    }

    .category-list {
      flex: 1;
      height: 100%;
      background: #fff;
      padding: 10px;

      :deep(.nut-grid) {
        margin: 10px 0;
      }

      .goods-card {
        margin: 5px;
        background: #fff;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

        .goods-info {
          padding: 8px;

          .goods-name {
            font-size: 14px;
            color: #333;
            margin-bottom: 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }
}
</style>