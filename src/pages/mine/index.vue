<template>
  <view class="mine">
    <!-- 用户信息区域 -->
    <view class="user-header" :class="{ 'not-login': !isLogin }">
      <view class="user-info" @click="handleLogin">
        <view class="avatar">
          <nut-avatar 
            size="large"
            :url="userInfo.avatar"
          >
            <template v-if="!isLogin">
              <My />
            </template>
          </nut-avatar>
        </view>
        <view class="info">
          <view class="name" v-if="isLogin">{{ userInfo.nickname }}</view>
          <view class="name" v-else>点击登录</view>
          <view class="member" v-if="isLogin">
            <nut-tag type="primary">{{ userInfo.memberLevel }}</nut-tag>
          </view>
        </view>
        <view class="setting" v-if="isLogin" @click.stop="goToSetting">
          <Setting size="20" />
        </view>
      </view>
    </view>

    <!-- 我的订单 -->
    <view class="order-section">
      <nut-cell-group>
        <nut-cell title="我的订单" value="全部订单" is-link @click="goToOrderList()" />
      </nut-cell-group>
      <view class="order-types">
        <view class="type-item" v-for="(item, index) in orderTypes" :key="index" @click="goToOrderList(item.status)">
          <view class="icon">
            <nut-badge :value="item.count">
              <component :is="item.icon" size="24" />
            </nut-badge>
          </view>
          <text>{{ item.name }}</text>
        </view>
      </view>
    </view>

    <!-- 常用功能 -->
    <view class="common-functions">
      <nut-cell-group title="常用功能">
        <nut-cell title="收货地址" is-link @click="goToAddress" />
        <nut-cell title="优惠券" is-link @click="goToCoupons" />
        <nut-cell title="我的收藏" is-link @click="goToFavorites" />
        <nut-cell title="浏览历史" is-link @click="goToHistory" />
      </nut-cell-group>
    </view>

    <!-- 更多服务 -->
    <view class="more-services">
      <nut-cell-group title="更多服务">
        <nut-cell title="帮助中心" is-link @click="goToHelp" />
        <nut-cell title="联系客服" is-link @click="contactService" />
        <nut-cell title="关于我们" is-link @click="goToAbout" />
      </nut-cell-group>
    </view>

    <!-- 退出登录 -->
    <view class="logout" v-if="isLogin">
      <nut-button type="danger" block @click="handleLogout">退出登录</nut-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'
import { My, Setting, Shop, Comment, Location, Order } from '@nutui/icons-vue-taro'

// 登录状态
const isLogin = ref(true)

// 用户信息
const userInfo = ref({
  nickname: '张三',
  avatar: 'https://img12.360buyimg.com/imagetools/jfs/t1/143702/31/16654/116794/5fc6f541Edebf8a57/4138097748889987.png',
  memberLevel: '普通会员'
})

// 订单类型
const orderTypes = ref([
  { name: '待付款', icon: Order, status: 'unpaid', count: 1 },
  { name: '待发货', icon: Shop, status: 'unshipped', count: 2 },
  { name: '待收货', icon: Location, status: 'unreceived', count: 0 },
  { name: '待评价', icon: Comment, status: 'unevaluated', count: 3 }
])

// 登录相关
const handleLogin = () => {
  if (!isLogin.value) {
    Taro.navigateTo({ url: '/pages/login/index' })
  }
}

const handleLogout = () => {
  Taro.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: function (res) {
      if (res.confirm) {
        isLogin.value = false
        Taro.showToast({
          title: '已退出登录',
          icon: 'success'
        })
      }
    }
  })
}

// 页面跳转
const goToOrderList = (status?: string) => {
  if (!isLogin.value) {
    return handleLogin()
  }
  const url = status ? `/pages/order/list?status=${status}` : '/pages/order/list'
  Taro.navigateTo({ url })
}

const goToSetting = () => {
  Taro.navigateTo({ url: '/pages/setting/index' })
}

const goToAddress = () => {
  if (!isLogin.value) return handleLogin()
  Taro.navigateTo({ url: '/pages/address/list' })
}

const goToCoupons = () => {
  if (!isLogin.value) return handleLogin()
  Taro.navigateTo({ url: '/pages/coupon/list' })
}

const goToFavorites = () => {
  if (!isLogin.value) return handleLogin()
  Taro.navigateTo({ url: '/pages/favorites/index' })
}

const goToHistory = () => {
  if (!isLogin.value) return handleLogin()
  Taro.navigateTo({ url: '/pages/history/index' })
}

const goToHelp = () => {
  Taro.navigateTo({ url: '/pages/help/index' })
}

const contactService = () => {
  Taro.showToast({
    title: '正在接入客服...',
    icon: 'loading'
  })
}

const goToAbout = () => {
  Taro.navigateTo({ url: '/pages/about/index' })
}
</script>

<style lang="scss">
.mine {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 20px;

  .user-header {
    background: linear-gradient(180deg, #fa2c19 0%, #fa2c19 70%, #f7f8fa 100%);
    padding: 20px 16px;
    margin-bottom: 10px;

    &.not-login {
      background: #fa2c19;
    }

    .user-info {
      display: flex;
      align-items: center;
      position: relative;

      .avatar {
        margin-right: 15px;

        :deep(.nut-avatar) {
          border: 2px solid #fff;
        }
      }

      .info {
        flex: 1;
        color: #fff;

        .name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .member {
          .nut-tag {
            border-radius: 4px;
          }
        }
      }

      .setting {
        padding: 10px;
        color: #fff;
      }
    }
  }

  .order-section {
    background: #fff;
    margin-bottom: 10px;

    .order-types {
      display: flex;
      padding: 15px 0;

      .type-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;

        .icon {
          margin-bottom: 5px;
          position: relative;

          .nut-badge {
            position: absolute;
            top: -8px;
            right: -8px;
          }
        }

        text {
          font-size: 12px;
          color: #666;
        }
      }
    }
  }

  .common-functions,
  .more-services {
    margin-bottom: 10px;
  }

  .logout {
    margin: 20px 16px;
  }
}
</style>