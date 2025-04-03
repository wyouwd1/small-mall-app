# 项目配置说明

## 目录
- [基础配置](#基础配置)
- [环境配置](#环境配置)
- [构建配置](#构建配置)
- [插件配置](#插件配置)
- [常见问题](#常见问题)

## 基础配置

### 项目配置文件

1. `app.config.ts`
```typescript
export default defineAppConfig({
  // 页面配置
  pages: [
    'pages/index/index',
    'pages/category/index',
    'pages/cart/index',
    'pages/mine/index',
    'pages/login/index'
  ],
  
  // 窗口配置
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '小小商城',
    navigationBarTextStyle: 'black'
  },
  
  // 底部导航配置
  tabBar: {
    color: '#999999',
    selectedColor: '#E93B3D',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/icons/home.svg',
        selectedIconPath: 'assets/icons/home-active.svg'
      },
      // ... 其他标签页配置
    ]
  }
})
```

2. `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "rootDir": ".",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src", "types"],
  "exclude": ["node_modules"]
}
```

## 环境配置

### 开发环境配置 (config/dev.ts)
```typescript
module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
    // 开发环境常量
  },
  mini: {},
  h5: {}
}
```

### 生产环境配置 (config/prod.ts)
```typescript
module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
    // 生产环境常量
  },
  mini: {},
  h5: {
    /**
     * WebpackChain 插件配置
     * @docs https://github.com/neutrinojs/webpack-chain
     */
    webpackChain(chain) {
      // 生产环境优化配置
    }
  }
}
```

## 构建配置

### Webpack 配置

1. 基础配置
```typescript
// config/index.ts
const config = {
  projectName: 'small-mall-app',
  date: '2025-3-27',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1
  },
  sourceRoot: 'src',
  outputRoot: 'dist'
}
```

2. 插件配置
```typescript
// config/index.ts
{
  plugins: [
    '@tarojs/plugin-html',
    // 其他插件配置
  ]
}
```

### PostCSS 配置

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    autoprefixer: {
      enable: true,
      config: {}
    },
    'postcss-pxtransform': {
      enable: true,
      config: {
        selectorBlackList: []
      }
    }
  }
}
```

## 插件配置

### NutUI 配置

1. 自动导入配置
```typescript
// config/index.ts
import Components from 'unplugin-vue-components/webpack'
import NutUIResolver from '@nutui/auto-import-resolver'

{
  mini: {
    webpackChain(chain) {
      chain.plugin('unplugin-vue-components').use(Components({
        resolvers: [
          NutUIResolver({
            importStyle: 'sass',
            taro: true
          })
        ]
      }))
    }
  }
}
```

2. 样式配置
```scss
// app.scss
@import "@nutui/nutui-taro/dist/styles/variables.scss";
```

### Taro 插件配置

```typescript
// config/index.ts
{
  plugins: [
    // HTML 支持
    '@tarojs/plugin-html',
    
    // 其他插件配置
    {
      name: '插件名称',
      options: {
        // 插件配置项
      }
    }
  ]
}
```

## 常见问题

### 1. 路径别名配置

1. TypeScript 配置
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

2. Webpack 配置
```typescript
{
  webpackChain(chain) {
    chain.resolve.alias
      .set('@', path.resolve(__dirname, '../src'))
  }
}
```

### 2. 环境变量使用

1. 定义环境变量
```typescript
// config/dev.ts 或 config/prod.ts
module.exports = {
  defineConstants: {
    API_URL: '"https://api.example.com"'
  }
}
```

2. 使用环境变量
```typescript
console.log(API_URL)
```

### 3. 跨平台兼容

1. 条件编译
```typescript
if (process.env.TARO_ENV === 'weapp') {
  // 小程序特有逻辑
} else if (process.env.TARO_ENV === 'h5') {
  // H5特有逻辑
}
```

2. 样式兼容
```scss
// 针对不同平台的样式
.component {
  /* 通用样式 */
  
  .weapp & {
    /* 小程序特有样式 */
  }
  
  .h5 & {
    /* H5特有样式 */
  }
}
```

### 4. 构建优化

1. 代码分割
```typescript
{
  mini: {
    webpackChain(chain) {
      chain.optimization.splitChunks({
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0
      })
    }
  }
}
```

2. 图片优化
```typescript
{
  mini: {
    imageMinifier: {
      enable: true,
      config: {
        // 图片压缩配置
      }
    }
  }
}
```

### 5. 调试配置

1. 开发者工具配置
```json
{
  "miniprogramRoot": "dist/",
  "projectname": "small-mall-app",
  "description": "小程序商城",
  "appid": "你的小程序appid",
  "setting": {
    "urlCheck": true,
    "es6": false,
    "postcss": false,
    "minified": false
  }
}
```

2. VSCode 调试配置
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Taro H5 Debug",
      "url": "http://localhost:10086",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```