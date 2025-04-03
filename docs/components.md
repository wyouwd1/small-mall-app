# 组件文档

## 目录
- [通用组件](#通用组件)
- [业务组件](#业务组件)
- [组件开发指南](#组件开发指南)

## 通用组件

### 商品卡片组件
用于展示商品基本信息的卡片组件。

```vue
<!-- 使用示例 -->
<view class="goods-card">
  <image :src="goods.image" style="width: 100%; height: 150px; border-radius: 4px;" />
  <view class="goods-info">
    <view class="goods-name">{{ goods.name }}</view>
    <view class="price-info">
      <nut-price :price="goods.price" size="normal" />
      <nut-price :price="goods.vipPrice" size="small" class="vip-price" />
    </view>
  </view>
</view>
```

**Props:**
```typescript
interface GoodsInfo {
  id: number
  name: string
  price: string
  vipPrice?: string
  image: string
}
```

**样式类：**
- `.goods-card`: 卡片容器
- `.goods-info`: 商品信息容器
- `.goods-name`: 商品名称
- `.price-info`: 价格信息容器
- `.vip-price`: VIP价格样式

### 分类导航组件
用于展示分类导航的网格组件。

```vue
<nut-grid :column-num="5">
  <nut-grid-item v-for="item in categories" :key="item.name" @click="onCategoryClick(item)">
    <component :is="item.icon" size="30" />
    <text>{{ item.name }}</text>
  </nut-grid-item>
</nut-grid>
```

**Props:**
```typescript
interface Category {
  icon: Component
  name: string
}
```

## 业务组件

### 购物车商品项
购物车中的商品展示组件。

```vue
<view class="cart-item">
  <view class="item-select">
    <nut-checkbox v-model="checked" @change="updateSelection" />
  </view>
  <view class="item-info">
    <image :src="item.image" style="width: 80px; height: 80px; border-radius: 4px;" />
    <view class="item-detail">
      <view class="item-name">{{ item.name }}</view>
      <view class="item-sku">{{ item.sku }}</view>
      <view class="item-price">
        <nut-price :price="item.price" size="normal" />
        <nut-input-number v-model="item.quantity" min="1" max="99" @change="updateTotal" />
      </view>
    </view>
  </view>
</view>
```

**Props:**
```typescript
interface CartItem {
  id: number
  name: string
  price: string
  quantity: number
  checked: boolean
  image: string
  sku?: string
}
```

**Events:**
- `updateSelection`: 选中状态变更
- `updateTotal`: 数量变更
- `delete`: 删除商品

## 组件开发指南

### 1. 组件创建规范

1. 文件结构
```
components/
  └── ComponentName/
      ├── index.vue        # 组件主文件
      ├── types.ts         # 类型定义
      └── README.md        # 组件文档
```

2. 组件命名
- 使用 PascalCase 命名
- 使用有意义的前缀（如：Base、App、The）

### 2. Props 定义规范

```typescript
// 使用 TypeScript 接口定义 props
interface Props {
  // 必需属性
  required: string
  // 可选属性
  optional?: number
  // 带默认值的属性
  withDefault: boolean
}

// 在组件中使用
const props = withDefaults(defineProps<Props>(), {
  withDefault: false
})
```

### 3. 事件规范

```typescript
// 定义事件
const emit = defineEmits<{
  (e: 'update', value: string): void
  (e: 'change', value: boolean): void
}>()

// 触发事件
const handleClick = () => {
  emit('update', 'newValue')
}
```

### 4. 插槽使用

```vue
<template>
  <div class="component">
    <!-- 默认插槽 -->
    <slot />
    
    <!-- 具名插槽 -->
    <slot name="header" />
    
    <!-- 作用域插槽 -->
    <slot name="item" :data="itemData" />
  </div>
</template>
```

### 5. 样式指南

```scss
.component {
  // 组件根元素样式
  
  &__element {
    // 子元素样式
  }
  
  &--modifier {
    // 修饰符样式
  }
  
  // 状态类
  &.is-active {
    // 激活状态样式
  }
  
  // 响应式样式
  @media screen and (max-width: 768px) {
    // 移动端样式
  }
}
```

### 6. 组件文档模板

```markdown
# 组件名称

## 简介
简要描述组件的用途和功能。

## 使用示例
提供基本的使用代码示例。

## Props
列出所有可用的 props 及其说明。

## 事件
列出组件可触发的所有事件。

## 插槽
描述可用的插槽。

## 注意事项
列出使用时需要注意的点。
```

### 7. 最佳实践

1. 组件设计原则
- 单一职责
- 可复用性
- 可维护性
- 可测试性

2. 性能优化
- 合理使用计算属性
- 避免不必要的渲染
- 使用 v-show 代替频繁切换的 v-if

3. 错误处理
- 属性验证
- 优雅的错误提示
- 合理的默认值

4. 无障碍性
- 语义化标签
- ARIA 属性
- 键盘操作支持