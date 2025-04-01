import { ref, onMounted, onUnmounted } from 'vue';
import Taro from '@tarojs/taro';
import { debounce, throttle } from 'lodash-es';

// 导出已创建的 hooks
export { useTabBar } from './useTabBar';

// 页面滚动 hook
export function useScroll(callback: (scrollTop: number) => void, wait = 100) {
  const scrollTop = ref(0);

  const handleScroll = throttle(() => {
    if (typeof window !== 'undefined') {
      const top = document.documentElement.scrollTop || document.body.scrollTop;
      scrollTop.value = top;
      callback(top);
    }
  }, wait);

  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
    }
  });

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', handleScroll);
    }
  });

  return {
    scrollTop
  };
}

// 下拉刷新 hook
export function usePullDownRefresh(callback: () => Promise<void>) {
  const refreshing = ref(false);

  const onPullDownRefresh = async () => {
    try {
      refreshing.value = true;
      await callback();
    } finally {
      refreshing.value = false;
      Taro.stopPullDownRefresh();
    }
  };

  Taro.usePullDownRefresh(() => {
    onPullDownRefresh();
  });

  return {
    refreshing
  };
}

// 上拉加载 hook
export function useReachBottom(callback: () => Promise<void>, options = { distance: 50 }) {
  const loading = ref(false);
  const finished = ref(false);

  const onReachBottom = async () => {
    if (loading.value || finished.value) return;
    try {
      loading.value = true;
      await callback();
    } finally {
      loading.value = false;
    }
  };

  Taro.useReachBottom(() => {
    onReachBottom();
  });

  return {
    loading,
    finished,
    setFinished: (value: boolean) => {
      finished.value = value;
    }
  };
}

// 搜索 hook
export function useSearch(callback: (keyword: string) => void, wait = 300) {
  const keyword = ref('');
  const searching = ref(false);

  const handleSearch = debounce(async (value: string) => {
    try {
      searching.value = true;
      await callback(value);
    } finally {
      searching.value = false;
    }
  }, wait);

  const onSearch = (value: string) => {
    keyword.value = value;
    handleSearch(value);
  };

  const clearSearch = () => {
    keyword.value = '';
    handleSearch('');
  };

  return {
    keyword,
    searching,
    onSearch,
    clearSearch
  };
}

// 页面标题 hook
export function usePageTitle(title: string) {
  onMounted(() => {
    Taro.setNavigationBarTitle({ title });
  });
}

// 分享 hook
export function useShare(options: {
  title?: string;
  path?: string;
  imageUrl?: string;
}) {
  Taro.useShareAppMessage(() => ({
    title: options.title,
    path: options.path,
    imageUrl: options.imageUrl
  }));

  Taro.useShareTimeline(() => ({
    title: options.title,
    path: options.path,
    imageUrl: options.imageUrl
  }));
}

// 页面可见性 hook
export function usePageVisibility(callback: (visible: boolean) => void) {
  Taro.useDidShow(() => {
    callback(true);
  });

  Taro.useDidHide(() => {
    callback(false);
  });
}

// 返回确认 hook
export function useBeforeBack(message: string) {
  Taro.useDidShow(() => {
    Taro.enableAlertBeforeUnload({
      message
    });
  });

  Taro.useDidHide(() => {
    Taro.disableAlertBeforeUnload();
  });
}

// 页面加载状态 hook
export function useLoading() {
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const startLoading = () => {
    loading.value = true;
    error.value = null;
  };

  const stopLoading = () => {
    loading.value = false;
  };

  const setError = (err: Error) => {
    error.value = err;
    loading.value = false;
  };

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setError
  };
}

// 页面状态管理 hook
export function usePageState<T extends Record<string, any>>(initialState: T) {
  const state = ref<T>({ ...initialState });

  const setState = (newState: Partial<T>) => {
    state.value = {
      ...state.value,
      ...newState
    };
  };

  const resetState = () => {
    state.value = { ...initialState };
  };

  return {
    state,
    setState,
    resetState
  };
}