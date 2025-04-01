<template>
  <view class="mine-page">
    <!-- 用户信息区域 -->
    <view class="user-section">
      <view class="user-info" @tap="handleLogin">
        <image 
          :src="userInfo.avatar || defaultAvatar" 
          class="avatar"
          @error="handleImageError"
        />
        <view class="info">
          <text class="nickname">{{ userInfo.nickname || '未登录' }}</text>
          <text v-if="!userInfo.nickname" class="login-tip">点击登录</text>
        </view>
      </view>
      <view class="user-stats">
        <view class="stat-item" @tap="navigateTo('/pages/mine/points/index')">
          <text class="number">{{ userInfo.points || 0 }}</text>
          <text class="label">积分</text>
        </view>
        <view class="stat-item" @tap="navigateTo('/pages/mine/coupon/index')">
          <text class="number">{{ userInfo.coupons || 0 }}</text>
          <text class="label">优惠券</text>
        </view>
        <view class="stat-item" @tap="navigateTo('/pages/mine/favorite/index')">
          <text class="number">{{ userInfo.favorites || 0 }}</text>
          <text class="label">收藏</text>
        </view>
      </view>
    </view>

    <!-- 订单区域 -->
    <view class="order-section">
      <view class="section-header" @tap="navigateTo('/pages/order/list/index')">
        <text class="title">我的订单</text>
        <view class="more">
          <text>查看全部</text>
          <Right size="12" />
        </view>
      </view>
      <view class="order-types">
        <view 
          class="type-item"
          v-for="(item, index) in orderTypes"
          :key="index"
          @tap="navigateTo(item.path)"
        >
          <view class="icon-wrapper">
            <component :is="item.icon" />
            <nut-badge 
              v-if="item.count" 
              :value="item.count"
              class="badge"
            />
          </view>
          <text class="label">{{ item.label }}</text>
        </view>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="feature-list">
      <view
        v-for="(group, groupIndex) in featureGroups"
        :key="groupIndex"
        class="feature-group"
      >
        <view
          v-for="(item, index) in group"
          :key="index"
          class="feature-item"
          @tap="navigateTo(item.path)"
        >
          <view class="feature-content">
            <component :is="item.icon" class="feature-icon" />
            <text class="feature-label">{{ item.label }}</text>
          </view>
          <Right size="12" class="arrow" />
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-section" v-if="userInfo.nickname">
      <nut-button 
        type="danger" 
        block
        @click="handleLogout"
      >
        退出登录
      </nut-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Taro from '@tarojs/taro';
import { Button, Badge } from '@nutui/nutui-taro';
import { 
  Right,
  Wallet2,
  Cart,
  Truck,
  Comment,
  Service,
  Location,
  Setting,
  Share,
  Star,
  Scan,
  Message
} from '@nutui/icons-vue-taro';
import { useTabBar } from '../../hooks/useTabBar';

// 使用 Tab Bar Hook
useTabBar(3);

// 默认头像
const defaultAvatar = 'https://img11.360buyimg.com/imagetools/jfs/t1/137646/13/7132/1648/5f4c748bE43da8ddd/a3f06d51dcae7b60.png';

// 用户信息
const userInfo = ref({
  nickname: '',
  avatar: '',
  points: 0,
  coupons: 0,
  favorites: 0
});

// 订单类型
const orderTypes = [
  { label: '待付款', icon: Wallet2, path: '/pages/order/list/index?type=unpaid', count: 2 },
  { label: '待发货', icon: Cart, path: '/pages/order/list/index?type=unshipped', count: 0 },
  { label: '待收货', icon: Truck, path: '/pages/order/list/index?type=unreceived', count: 1 },
  { label: '待评价', icon: Comment, path: '/pages/order/list/index?type=unrated', count: 0 }
];

// 功能组
const featureGroups = [
  [
    { label: '客服中心', icon: Service, path: '/pages/service/index' },
    { label: '收货地址', icon: Location, path: '/pages/address/list/index' },
    { label: '系统设置', icon: Setting, path: '/pages/settings/index' }
  ],
  [
    { label: '分享有礼', icon: Share, path: '/pages/share/index' },
    { label: '我的收藏', icon: Star, path: '/pages/mine/favorite/index' },
    { label: '扫一扫', icon: Scan, path: '/pages/scan/index' },
    { label: '我的消息', icon: Message, path: '/pages/message/index' }
  ]
];

// 处理登录
const handleLogin = () => {
  if (!userInfo.value.nickname) {
    Taro.navigateTo({
      url: '/pages/login/index'
    });
  }
};

// 处理退出登录
const handleLogout = () => {
  Taro.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userInfo.value = {
          nickname: '',
          avatar: '',
          points: 0,
          coupons: 0,
          favorites: 0
        };
        Taro.showToast({
          title: '已退出登录',
          icon: 'success'
        });
      }
    }
  });
};

// 页面跳转
const navigateTo = (path: string) => {
  if (!userInfo.value.nickname) {
    handleLogin();
    return;
  }
  Taro.navigateTo({ url: path });
};

// 图片加载错误处理
const handleImageError = (e: Event) => {
  if (e.target) {
    (e.target as HTMLImageElement).src = defaultAvatar;
  }
};
</script>

<style lang="scss">
.mine-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: calc(50px + env(safe-area-inset-bottom));

  .user-section {
    background-color: #fff;
    padding: 20px 16px;
    margin-bottom: 12px;

    .user-info {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .avatar {
        width: 64px;
        height: 64px;
        border-radius: 32px;
        margin-right: 16px;
      }

      .info {
        .nickname {
          font-size: 18px;
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
          display: block;
        }

        .login-tip {
          font-size: 14px;
          color: #999;
        }
      }
    }

    .user-stats {
      display: flex;
      justify-content: space-around;

      .stat-item {
        text-align: center;

        .number {
          font-size: 18px;
          font-weight: 500;
          color: #333;
          display: block;
          margin-bottom: 4px;
        }

        .label {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }

  .order-section {
    background-color: #fff;
    padding: 16px;
    margin-bottom: 12px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .title {
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }

      .more {
        display: flex;
        align-items: center;
        color: #999;
        font-size: 12px;
      }
    }

    .order-types {
      display: flex;
      justify-content: space-between;

      .type-item {
        text-align: center;

        .icon-wrapper {
          position: relative;
          display: inline-block;
          margin-bottom: 4px;

          .badge {
            position: absolute;
            top: -6px;
            right: -6px;
          }
        }

        .label {
          font-size: 12px;
          color: #666;
        }
      }
    }
  }

  .feature-list {
    .feature-group {
      background-color: #fff;
      margin-bottom: 12px;

      .feature-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid #f5f5f5;

        &:last-child {
          border-bottom: none;
        }

        .feature-content {
          display: flex;
          align-items: center;

          .feature-icon {
            margin-right: 12px;
            font-size: 20px;
          }

          .feature-label {
            font-size: 14px;
            color: #333;
          }
        }

        .arrow {
          color: #999;
        }
      }
    }
  }

  .logout-section {
    padding: 16px;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .mine-page {
    background-color: #1a1a1a;

    .user-section,
    .order-section,
    .feature-list .feature-group {
      background-color: #242424;
    }

    .user-section {
      .user-info {
        .info {
          .nickname {
            color: #e0e0e0;
          }
        }
      }

      .user-stats {
        .stat-item {
          .number {
            color: #e0e0e0;
          }
        }
      }
    }

    .order-section {
      .section-header {
        .title {
          color: #e0e0e0;
        }
      }
    }

    .feature-list {
      .feature-group {
        .feature-item {
          border-bottom-color: #333;

          .feature-content {
            .feature-label {
              color: #e0e0e0;
            }
          }
        }
      }
    }
  }
}
</style>