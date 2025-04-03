import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    allowedHosts: true,
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
  }
});