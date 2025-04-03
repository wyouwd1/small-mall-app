# Small Mall App

一个基于 Taro 3.x 的多端商城应用，使用 Vue 3 和 NutUI 4.x 构建，支持微信小程序和H5。

## 技术栈

- 前端框架：Vue 3
- 多端框架：Taro 3.x
- UI组件库：NutUI 4.x
- 状态管理：Vue Composition API
- 开发语言：TypeScript
- 构建工具：Vite

## 环境要求

- Node.js >= 16.0.0
- pnpm >= 6.0.0
- 微信开发者工具（用于小程序开发）

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

运行H5版本：
```bash
pnpm dev:h5
```

运行小程序版本：
```bash
pnpm dev:weapp
```

### 构建

构建H5版本：
```bash
pnpm build:h5
```

构建小程序版本：
```bash
pnpm build:weapp
```

## 项目结构

```
small-mall-app/
├── config/               # 项目配置文件
├── src/
│   ├── assets/          # 静态资源
│   │   └── icons/       # 图标文件
│   ├── components/      # 公共组件
│   ├── pages/          # 页面文件
│   │   ├── cart/       # 购物车
│   │   ├── category/   # 分类
│   │   ├── index/      # 首页
│   │   ├── login/      # 登录
│   │   └── mine/       # 我的
│   ├── utils/          # 工具函数
│   ├── app.config.ts   # 应用配置
│   ├── app.scss        # 全局样式
│   └── app.ts          # 应用入口
└── types/              # 类型定义文件
```

## 主要功能

### 已实现功能

- [x] 用户认证
  - 手机号登录
  - 验证码登录
  - 微信登录（预留）

- [x] 商品浏览
  - 首页轮播
  - 分类导航
  - 商品列表
  - 商品分类

- [x] 购物车
  - 商品添加/删除
  - 商品数量调整
  - 商品选择
  - 价格计算

- [x] 个人中心
  - 用户信息展示
  - 订单管理（预留）
  - 收货地址（预留）
  - 设置

### 计划功能

- [ ] 商品详情
- [ ] 订单管理
- [ ] 支付功能
- [ ] 地址管理
- [ ] 收藏功能
- [ ] 搜索功能

## UI组件使用

项目使用 NutUI 4.x 作为基础组件库，主要使用了以下组件：

- `nut-button`: 按钮组件
- `nut-cell`: 单元格组件
- `nut-form`: 表单组件
- `nut-input`: 输入框组件
- `nut-swiper`: 轮播图组件
- `nut-grid`: 宫格组件
- `nut-price`: 价格组件
- 更多组件详见 [NutUI 官方文档](https://nutui.jd.com)

## 开发规范

1. 组件开发
   - 使用 Composition API
   - 使用 TypeScript 类型定义
   - 遵循 Vue 3 组件命名规范

2. 样式开发
   - 使用 SCSS 预处理器
   - 遵循 BEM 命名规范
   - 优先使用 NutUI 提供的样式变量

3. 代码提交
   - 遵循 Angular 提交信息规范
   - 提交前进行代码格式化

## 注意事项

1. 开发时注意多端兼容性
2. 使用 NutUI 组件时注意按需引入
3. 注意小程序的页面大小限制
4. 图片资源建议使用 CDN 加速

## 贡献指南

1. Fork 本仓库
2. 创建特性分支
3. 提交代码
4. 创建 Pull Request

## 许可证

[MIT](LICENSE)