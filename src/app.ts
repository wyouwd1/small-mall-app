import { createApp } from 'vue'
import { Button, Cell, CellGroup, Grid, GridItem, 
  Swiper, SwiperItem, Price, Card, Checkbox, InputNumber, 
  Avatar, Tag, Badge, Input, Tabbar, TabbarItem, 
  Searchbar, Divider, SideNavbar, SideNavbarItem,
  Form, FormItem, Space } from '@nutui/nutui-taro'
import * as Icons from '@nutui/icons-vue-taro'
import '@nutui/nutui-taro/dist/style.css'
import './app.scss'

const App = createApp({
  onShow (options) {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

// 注册 NutUI 组件
const nutComponents = [
  Button, Cell, CellGroup, Grid, GridItem, 
  Swiper, SwiperItem, Price, Card, Checkbox, InputNumber, 
  Avatar, Tag, Badge, Input, Tabbar, TabbarItem,
  Searchbar, Divider, SideNavbar, SideNavbarItem,
  Form, FormItem, Space
]

// 注册组件
nutComponents.forEach(component => {
  App.use(component)
})

// 注册图标
Object.values(Icons).forEach(icon => {
  if (icon.name) {
    App.use(icon)
  }
})

export default App