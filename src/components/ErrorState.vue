<template>
  <view class="error-state" :style="{ padding: `${padding}px` }">
    <view class="error-content">
      <view class="error-icon">
        <component :is="icon" v-if="icon" :size="iconSize" :color="iconColor" />
        <image v-else-if="image" :src="image" mode="aspectFit" class="error-image" />
      </view>
      <text class="error-title">{{ title }}</text>
      <text v-if="description" class="error-description">{{ description }}</text>
      <view class="error-action">
        <slot name="action">
          <nut-button 
            type="primary" 
            size="small"
            class="retry-button"
            @click="handleRetry"
          >
            {{ retryText }}
          </nut-button>
        </slot>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { Close } from '@nutui/icons-vue-taro';
import { Button } from '@nutui/nutui-taro';

interface Props {
  title?: string;
  description?: string;
  icon?: any;
  iconSize?: number;
  iconColor?: string;
  image?: string;
  padding?: number;
  retryText?: string;
}

// 定义组件属性
withDefaults(defineProps<Props>(), {
  title: '加载失败',
  description: '请检查网络后重试',
  icon: Close,
  iconSize: 48,
  iconColor: '#ff4d4f',
  image: '',
  padding: 32,
  retryText: '重新加载'
});

// 定义事件
const emit = defineEmits<{
  (e: 'retry'): void;
}>();

// 重试处理
const handleRetry = () => {
  emit('retry');
};
</script>

<style lang="scss">
.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 300px;

  .error-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .error-icon {
    margin-bottom: 16px;
  }

  .error-image {
    width: 120px;
    height: 120px;
  }

  .error-title {
    font-size: 16px;
    color: #333;
    margin-bottom: 8px;
  }

  .error-description {
    font-size: 14px;
    color: #999;
    margin-bottom: 16px;
  }

  .error-action {
    margin-top: 16px;

    .retry-button {
      min-width: 120px;
      border-radius: 20px;
      background-color: #ff4d4f;
      border-color: #ff4d4f;

      &:active {
        background-color: #ff7875;
        border-color: #ff7875;
      }
    }
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .error-state {
    .error-title {
      color: #e0e0e0;
    }

    .error-description {
      color: #999;
    }

    .error-action {
      .retry-button {
        background-color: #ff4d4f;
        border-color: #ff4d4f;

        &:active {
          background-color: #ff7875;
          border-color: #ff7875;
        }
      }
    }
  }
}
</style>