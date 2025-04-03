# 开发指南

## 开发环境配置

### 必需环境
- Node.js >= 14.0.0
- pnpm >= 6.0.0
- 微信开发者工具（小程序开发必需）

### 推荐工具
- VS Code
- Vue.js Devtools
- Taro DevTools

### VS Code 推荐插件
- Volar (Vue 3 支持)
- ESLint
- Prettier
- TypeScript Vue Plugin
- SCSS IntelliSense

## 开发流程

### 1. 新功能开发流程

1. 创建功能分支
```bash
git checkout -b feature/功能名称
```

2. 页面开发
- 在 `src/pages` 下创建对应页面目录
- 在 `app.config.ts` 中注册页面路由
- 开发页面组件和逻辑

3. 组件开发
- 在 `src/components` 下创建组件
- 使用 TypeScript 定义 props 和事件
- 编写组件文档

4. 提交代码
```bash
git add .
git commit -m "feat: 功能描述"
git push origin feature/功能名称
```

### 2. Bug修复流程

1. 创建修复分支
```bash
git checkout -b fix/bug描述
```

2. 修复并测试
3. 提交代码
```bash
git commit -m "fix: bug描述"
```

## 代码规范

### Vue 组件规范

1. 文件命名
- 组件文件使用 PascalCase
- 页面文件使用 kebab-case
```
components/
  └── UserAvatar.vue
pages/
  └── user-profile/
      └── index.vue
```

2. 组件结构
```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts">
// 导入语句
import { ref } from 'vue'

// 类型定义
interface Props {
  // ...
}

// props 定义
const props = defineProps<Props>()

// emit 定义
const emit = defineEmits<{
  (e: 'update', value: string): void
}>()

// 响应式数据
const count = ref(0)

// 计算属性
const doubleCount = computed(() => count.value * 2)

// 方法定义
const handleClick = () => {
  // ...
}

// 生命周期钩子
onMounted(() => {
  // ...
})
</script>

<style lang="scss" scoped>
// 样式定义
</style>
```

### TypeScript 规范

1. 类型定义
```typescript
// 接口定义
interface UserInfo {
  id: number
  name: string
  avatar?: string
}

// 类型别名
type Status = 'pending' | 'success' | 'failed'

// 枚举
enum OrderStatus {
  Pending = 'pending',
  Paid = 'paid',
  Shipped = 'shipped',
  Completed = 'completed'
}
```

2. Props 类型定义
```typescript
interface Props {
  title: string
  showIcon?: boolean
  type?: 'primary' | 'secondary'
  onClick?: () => void
}

const props = defineProps<Props>()
```

### 样式规范

1. 使用 SCSS
```scss
.component {
  &__header {
    // ...
  }

  &__content {
    // ...
  }

  &--active {
    // ...
  }
}
```

2. 变量使用
```scss
// 使用 NutUI 变量
@import "@nutui/nutui-taro/dist/styles/variables.scss";

.custom-button {
  color: $primary-color;
  font-size: $font-size-2;
}
```

## Taro 多端开发注意事项

### 1. 条件编译
```typescript
// 平台判断
if (process.env.TARO_ENV === 'weapp') {
  // 小程序特有逻辑
} else if (process.env.TARO_ENV === 'h5') {
  // H5特有逻辑
}
```

### 2. API 使用
```typescript
import Taro from '@tarojs/taro'

// 使用 Taro API
Taro.showToast({
  title: '操作成功',
  icon: 'success'
})
```

### 3. 样式适配
```scss
// 小程序单位转换
.container {
  width: 100%;
  padding: 20px;  // Taro 会自动转换单位
}
```

## 性能优化建议

1. 组件优化
- 合理使用 `computed` 和 `watch`
- 避免不必要的组件重渲染
- 使用 `v-show` 替代频繁切换的 `v-if`

2. 图片优化
- 使用适当的图片格式和大小
- 考虑使用图片懒加载
- 使用 CDN 加速图片加载

3. 数据处理
- 避免大量数据的重复计算
- 合理使用本地缓存
- 分页加载大量数据

## 调试技巧

1. H5调试
- 使用 Vue Devtools
- 使用浏览器开发者工具
- 使用 console.log 打印关键数据

2. 小程序调试
- 使用微信开发者工具
- 使用 Real Device 调试
- 查看调试器的 Network 面板

## 常见问题解决

1. 样式问题
- 检查是否添加了 scoped 属性
- 检查样式优先级
- 检查单位使用是否正确

2. 生命周期问题
- 确认使用正确的生命周期钩子
- 检查执行顺序是否符合预期

3. 数据更新问题
- 检查响应式数据的定义
- 确认数据更新时机
- 验证计算属性的依赖关系