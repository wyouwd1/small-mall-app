<template>
  <view class="empty-state" :style="{ padding: `${padding}px` }">
    <view class="empty-content">
      <view class="empty-icon">
        <component :is="icon" v-if="icon" :size="iconSize" :color="iconColor" />
        <image v-else-if="image" :src="image" mode="aspectFit" class="empty-image" />
      </view>
      <text class="empty-title">{{ title }}</text>
      <text v-if="description" class="empty-description">{{ description }}</text>
      <view v-if="$slots.action" class="empty-action">
        <slot name="action"></slot>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { Shop } from '@nutui/icons-vue-taro';

interface Props {
  title: string;
  description?: string;
  icon?: any;
  iconSize?: number;
  iconColor?: string;
  image?: string;
  padding?: number;
}

// 定义组件属性
withDefaults(defineProps<Props>(), {
  title: '暂无数据',
  description: '',
  icon: Shop,
  iconSize: 48,
  iconColor: '#999',
  image: '',
  padding: 32
});
</script>

<style lang="scss">
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 300px;

  .empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .empty-icon {
    margin-bottom: 16px;
  }

  .empty-image {
    width: 120px;
    height: 120px;
  }

  .empty-title {
    font-size: 16px;
    color: #333;
    margin-bottom: 8px;
  }

  .empty-description {
    font-size: 14px;
    color: #999;
    margin-bottom: 16px;
  }

  .empty-action {
    margin-top: 16px;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .empty-state {
    .empty-title {
      color: #e0e0e0;
    }

    .empty-description {
      color: #999;
    }
  }
}
</style>