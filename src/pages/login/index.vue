
<template>
  <view class="login">
    <!-- 顶部logo -->
    <nut-space align="center" direction="vertical" :gap="10">
      <image
        src="https://img11.360buyimg.com/jdphoto/s140x140_jfs/t21160/90/706848746/6960/d655c289/5b163ef9N4a3d7aa6.png"
        style="width: 80px; height: 80px;"
      />
      <text class="logo-text">小小商城</text>
    </nut-space>

    <!-- 登录表单 -->
    <nut-form>
      <nut-form-item>
        <nut-input
          v-model="phone"
          placeholder="请输入手机号"
          type="tel"
          maxlength="11"
          :border="false"
        >
          <template #prefix>
            <My size="16" />
          </template>
        </nut-input>
      </nut-form-item>

      <nut-form-item>
        <nut-cell>
          <nut-input
            v-model="code"
            placeholder="请输入验证码"
            maxlength="6"
            :border="false"
          >
            <template #prefix>
              <Check size="16" />
            </template>
          </nut-input>
          <template #link>
            <nut-button 
              size="small" 
              type="primary" 
              :disabled="!canSendCode || counting > 0"
              @click="sendCode"
            >
              {{ counting > 0 ? `${counting}s后重新获取` : '获取验证码' }}
            </nut-button>
          </template>
        </nut-cell>
      </nut-form-item>

      <nut-form-item>
        <nut-checkbox v-model="agreed" icon-size="14">
          我已阅读并同意
          <text class="link" @click="showAgreement">《用户协议》</text>
          和
          <text class="link" @click="showPrivacy">《隐私政策》</text>
        </nut-checkbox>
      </nut-form-item>

      <nut-form-item>
        <nut-button 
          type="primary" 
          block 
          :disabled="!canLogin"
          @click="handleLogin"
        >
          登录
        </nut-button>
      </nut-form-item>

      <!-- 其他登录方式 -->
      <nut-space direction="vertical" :gap="20">
        <nut-divider>其他登录方式</nut-divider>
        <nut-grid :column-num="3">
          <nut-grid-item @click="handleWechatLogin">
            <Share size="32" color="#07c160" />
            <text>微信登录</text>
          </nut-grid-item>
        </nut-grid>
      </nut-space>
    </nut-form>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'
import { My, Check, Share } from '@nutui/icons-vue-taro'

// 表单数据
const phone = ref('')
const code = ref('')
const agreed = ref(false)
const counting = ref(0)

// 计算属性
const canSendCode = computed(() => {
  return /^1[3-9]\d{9}$/.test(phone.value)
})

const canLogin = computed(() => {
  return canSendCode.value && code.value.length === 6 && agreed.value
})

// 发送验证码
const sendCode = () => {
  if (!canSendCode.value || counting.value > 0) return
  
  counting.value = 60
  const timer = setInterval(() => {
    counting.value--
    if (counting.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)

  // TODO: 调用发送验证码接口
  Taro.showToast({
    title: '验证码已发送',
    icon: 'success'
  })
}

// 手机号登录
const handleLogin = () => {
  if (!canLogin.value) return

  // TODO: 调用登录接口
  Taro.showLoading({
    title: '登录中...'
  })

  setTimeout(() => {
    Taro.hideLoading()
    Taro.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1500,
      success: () => {
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      }
    })
  }, 1500)
}

// 微信登录
const handleWechatLogin = () => {
  Taro.showToast({
    title: '暂未开放',
    icon: 'none'
  })
}

// 查看协议
const showAgreement = () => {
  Taro.navigateTo({
    url: '/pages/agreement/index'
  })
}

const showPrivacy = () => {
  Taro.navigateTo({
    url: '/pages/agreement/privacy'
  })
}
</script>

<style lang="scss">
.login {
  min-height: 100vh;
  background: #fff;
  padding: 20px;

  .logo-text {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }

  :deep(.nut-input) {
    background: #f7f8fa;
    border-radius: 4px;
    padding: 5px 15px;
  }

  .link {
    color: #fa2c19;
  }

  :deep(.nut-grid-item) {
    text {
      font-size: 12px;
      color: #666;
      margin-top: 8px;
    }
  }
}
</style>