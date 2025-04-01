import Taro from '@tarojs/taro';
import { ref } from 'vue';
import eventBus, { Events } from './eventBus';

// 主题类型
export type ThemeType = 'light' | 'dark' | 'system';

// 主题配置接口
interface ThemeConfig {
  // 主色调
  primary: string;
  // 文字颜色
  textColor: string;
  // 背景色
  background: string;
  // 边框色
  borderColor: string;
  // 卡片背景色
  cardBackground: string;
  // 禁用状态色
  disabledColor: string;
  // 成功状态色
  successColor: string;
  // 警告状态色
  warningColor: string;
  // 错误状态色
  errorColor: string;
  // 链接色
  linkColor: string;
}

// 主题配置
const themes: Record<'light' | 'dark', ThemeConfig> = {
  light: {
    primary: '#ff4d4f',
    textColor: '#333333',
    background: '#f8f8f8',
    borderColor: '#e8e8e8',
    cardBackground: '#ffffff',
    disabledColor: '#cccccc',
    successColor: '#52c41a',
    warningColor: '#faad14',
    errorColor: '#ff4d4f',
    linkColor: '#1890ff'
  },
  dark: {
    primary: '#ff4d4f',
    textColor: '#e0e0e0',
    background: '#1a1a1a',
    borderColor: '#333333',
    cardBackground: '#242424',
    disabledColor: '#666666',
    successColor: '#52c41a',
    warningColor: '#faad14',
    errorColor: '#ff4d4f',
    linkColor: '#1890ff'
  }
};

/**
 * 主题管理类
 */
class ThemeManager {
  // 当前主题模式
  private currentTheme = ref<ThemeType>('system');
  // 是否是暗色模式
  private isDark = ref(false);

  constructor() {
    // 初始化主题
    this.initTheme();
    // 监听系统主题变化
    this.watchSystemTheme();
  }

  /**
   * 初始化主题
   */
  private initTheme(): void {
    // 获取存储的主题设置
    const savedTheme = Taro.getStorageSync('theme') as ThemeType;
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('system');
    }
  }

  /**
   * 监听系统主题变化
   */
  private watchSystemTheme(): void {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
        if (this.currentTheme.value === 'system') {
          this.isDark.value = e.matches;
          this.applyTheme();
        }
      };

      mediaQuery.addListener(handleChange);
      handleChange(mediaQuery);
    }
  }

  /**
   * 设置主题
   * @param theme 主题类型
   */
  setTheme(theme: ThemeType): void {
    this.currentTheme.value = theme;
    Taro.setStorageSync('theme', theme);

    if (theme === 'system') {
      // 使用系统主题
      if (typeof window !== 'undefined') {
        this.isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    } else {
      // 使用指定主题
      this.isDark.value = theme === 'dark';
    }

    this.applyTheme();
  }

  /**
   * 应用主题
   */
  private applyTheme(): void {
    const theme = this.isDark.value ? themes.dark : themes.light;

    // 设置 CSS 变量
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      Object.entries(theme).forEach(([key, value]) => {
        root.style.setProperty(`--theme-${key}`, value);
      });
    }

    // 设置状态栏样式
    Taro.setNavigationBarColor({
      frontColor: this.isDark.value ? '#ffffff' : '#000000',
      backgroundColor: theme.background
    });

    // 触发主题变更事件
    eventBus.emit(Events.THEME_CHANGE, {
      theme: this.currentTheme.value,
      isDark: this.isDark.value
    });
  }

  /**
   * 获取当前主题配置
   */
  getThemeConfig(): ThemeConfig {
    return this.isDark.value ? themes.dark : themes.light;
  }

  /**
   * 获取当前主题类型
   */
  getThemeType(): ThemeType {
    return this.currentTheme.value;
  }

  /**
   * 是否是暗色模式
   */
  getIsDark(): boolean {
    return this.isDark.value;
  }

  /**
   * 切换主题
   */
  toggleTheme(): void {
    this.setTheme(this.isDark.value ? 'light' : 'dark');
  }
}

// 创建主题管理实例
const themeManager = new ThemeManager();

// 导出主题相关的工具函数
export const theme = {
  // 设置主题
  setTheme: (theme: ThemeType) => themeManager.setTheme(theme),

  // 切换主题
  toggleTheme: () => themeManager.toggleTheme(),

  // 获取当前主题配置
  getThemeConfig: () => themeManager.getThemeConfig(),

  // 获取当前主题类型
  getThemeType: () => themeManager.getThemeType(),

  // 是否是暗色模式
  isDark: () => themeManager.getIsDark(),

  // 主题配置
  config: themes
};

export default themeManager;

/**
 * 使用示例：
 * 
 * // 设置主题
 * theme.setTheme('dark');
 * 
 * // 切换主题
 * theme.toggleTheme();
 * 
 * // 获取当前主题配置
 * const themeConfig = theme.getThemeConfig();
 * 
 * // 监听主题变化
 * eventBus.on(Events.THEME_CHANGE, ({ theme, isDark }) => {
 *   console.log('Theme changed:', theme, isDark);
 * });
 */