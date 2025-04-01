<template>
  <view class="loading-state" :class="{ overlay: isOverlay }">
    <view class="loading-content">
      <nut-indicator :size="size" :color="color" />
      <text v-if="text" class="loading-text" :style="{ color: textColor }">{{ text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { Indicator } from '@nutui/nutui-taro';

interface Props {
  isOverlay?: boolean;
  size?: number;
  color?: string;
  text?: string;
  textColor?: string;
}

// 定义组件属性
withDefaults(defineProps<Props>(), {
  isOverlay: false,
  size: 30,
  color: '#ff4d4f',
  text: '加载中...',
  textColor: '#666'
});
</script>

<style lang="scss">
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;

  &.overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 1000;
  }

  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .loading-text {
    margin-top: 12px;
    font-size: 14px;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .loading-state {
    &.overlay {
      background-color: rgba(0, 0, 0, 0.7);
    }

    .loading-text {
      color: #e0e0e0;
    }
  }
}
</style>