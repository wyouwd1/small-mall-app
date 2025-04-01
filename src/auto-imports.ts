// 自动导入组件配置
import Components from 'unplugin-vue-components/webpack';
import NutUIResolver from '@nutui/auto-import-resolver';

export const AutoImportConfig = Components({
  resolvers: [NutUIResolver()],
  dts: 'src/components.d.ts',
  dirs: ['src/components'],
  extensions: ['vue', 'tsx'],
});