import { createApp } from 'vue';
import store from './store';

// 引入NutUI组件
import { Button, Dialog, Notify, Toast } from '@nutui/nutui-taro';

// 引入全局样式
import '@nutui/nutui-taro/dist/style.css';
import './app.scss';

const App = createApp({
  onShow(options) {
    console.log('App onShow:', options);
  },
  onHide() {
    console.log('App onHide');
  },
  onError(err) {
    console.error('App onError:', err);
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
});

// 注册状态管理
App.use(store);

// 注册常用组件
App.use(Button);
App.use(Toast);
App.use(Dialog);
App.use(Notify);

export default App;