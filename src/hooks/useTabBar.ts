import Taro from '@tarojs/taro';

export function useTabBar(tabIndex: number) {
  const updateTabBarIndex = () => {
    if (typeof window !== 'undefined') {
      const tabbar = Taro.getCurrentInstance().page?.selectComponent('.custom-tab-bar');
      if (tabbar?.setActive) {
        tabbar.setActive(tabIndex);
      }
    }
  };

  // 页面加载和显示时更新底部导航状态
  Taro.useDidShow(() => {
    updateTabBarIndex();
  });

  Taro.useDidLoad(() => {
    updateTabBarIndex();
  });

  return {
    updateTabBarIndex
  };
}