# 样式指南

## 目录
- [样式架构](#样式架构)
- [主题配置](#主题配置)
- [命名规范](#命名规范)
- [响应式设计](#响应式设计)
- [最佳实践](#最佳实践)

## 样式架构

### 目录结构
```
src/
├── assets/
│   └── styles/
│       ├── variables.scss     # 全局变量
│       ├── mixins.scss       # 混入
│       ├── functions.scss    # 函数
│       ├── reset.scss        # 重置样式
│       └── common.scss       # 公共样式
├── app.scss                  # 全局样式入口
└── pages/
    └── */
        └── index.scss        # 页面样式
```

### 样式导入顺序
```scss
// 1. 变量和配置
@import '@/assets/styles/variables.scss';

// 2. Mixins 和函数
@import '@/assets/styles/mixins.scss';

// 3. NutUI 样式变量（按需）
@import "@nutui/nutui-taro/dist/styles/variables.scss";

// 4. 组件样式
.component { ... }
```

## 主题配置

### 颜色系统

```scss
// 主色调
$primary-color: #E93B3D;
$primary-color-light: #FF5B5D;
$primary-color-dark: #D42N2P;

// 辅助色
$success-color: #67C23A;
$warning-color: #E6A23C;
$danger-color: #F56C6C;
$info-color: #909399;

// 中性色
$text-color-primary: #303133;
$text-color-regular: #606266;
$text-color-secondary: #909399;
$text-color-placeholder: #C0C4CC;

// 边框颜色
$border-color-base: #DCDFE6;
$border-color-light: #E4E7ED;
$border-color-lighter: #EBEEF5;

// 背景色
$background-color-base: #F5F7FA;
$background-color-light: #F5F7FA;
$background-color-lighter: #FAFAFA;
```

### 字体系统

```scss
// 字体家族
$font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
  'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
  'Noto Color Emoji';

// 字号
$font-size-xs: 20px;
$font-size-sm: 24px;
$font-size-base: 28px;
$font-size-lg: 32px;
$font-size-xl: 36px;

// 行高
$line-height-tight: 1.25;
$line-height-base: 1.5;
$line-height-loose: 1.75;
```

### 间距系统

```scss
// 基础间距
$spacing-xs: 8px;
$spacing-sm: 12px;
$spacing-base: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;

// 组件间距
$component-spacing-sm: 16px;
$component-spacing-base: 24px;
$component-spacing-lg: 32px;
```

### 圆角系统

```scss
$border-radius-sm: 4px;
$border-radius-base: 8px;
$border-radius-lg: 16px;
$border-radius-circle: 50%;
```

## 命名规范

### BEM 命名规范

```scss
.block {
  // 块
  &__element {
    // 元素
    &--modifier {
      // 修饰符
    }
  }
}

// 示例
.goods-card {
  &__image {
    &--rounded {
      border-radius: $border-radius-base;
    }
  }
  
  &__title {
    &--bold {
      font-weight: bold;
    }
  }
}
```

### 状态类命名

```scss
.is-active
.is-disabled
.is-hidden
.is-loading
.has-error
.has-success
```

## 响应式设计

### 断点定义

```scss
// 断点变量
$breakpoints: (
  'xs': 320px,
  'sm': 375px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px
);

// 媒体查询混入
@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media screen and (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  }
}

// 使用示例
.component {
  @include respond-to('md') {
    // 平板样式
  }
  
  @include respond-to('lg') {
    // 桌面样式
  }
}
```

### 弹性布局

```scss
// Flex 布局混入
@mixin flex($direction: row, $justify: flex-start, $align: stretch) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}

// 使用示例
.container {
  @include flex(column, center, center);
}
```

## 最佳实践

### 1. 样式作用域

```vue
<style lang="scss" scoped>
// 组件样式
</style>

<style lang="scss">
// 全局样式
</style>
```

### 2. 样式复用

```scss
// Mixins
@mixin ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 使用
.text {
  @include ellipsis;
}
```

### 3. 变量使用

```scss
// 推荐
.button {
  color: $primary-color;
  padding: $spacing-base;
}

// 不推荐
.button {
  color: #E93B3D;
  padding: 16px;
}
```

### 4. 样式嵌套

```scss
// 推荐：最多3层嵌套
.parent {
  &__child {
    &--modifier {
      // 样式
    }
  }
}

// 不推荐：过深的嵌套
.parent {
  .child {
    .grandchild {
      .great-grandchild {
        // 样式
      }
    }
  }
}
```

### 5. 性能优化

1. 选择器性能
```scss
// 推荐
.specific-class { }

// 不推荐
div > div > span { }
```

2. 继承与混入
```scss
// 推荐：使用混入传递参数
@mixin button($color) {
  background: $color;
}

// 不推荐：过度使用继承
%button-base {
  // 共享样式
}
```

3. 避免重复声明
```scss
// 推荐：使用变量和混入
$shadow-base: 0 2px 4px rgba(0, 0, 0, 0.1);

// 不推荐：重复的值
.card1 { box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
.card2 { box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
```

### 6. 注释规范

```scss
// 单行注释
.element { ... }

/**
 * 多行注释
 * 1. 作用
 * 2. 使用场景
 * 3. 注意事项
 */
.component { ... }

// 区块注释
//
// 头部区域样式
// ---------------------------
.header { ... }
```

### 7. 文件组织

```scss
// 1. 变量声明
// 2. 混入声明
// 3. 扩展声明
// 4. 媒体查询
// 5. 动画关键帧
// 6. 样式规则
```