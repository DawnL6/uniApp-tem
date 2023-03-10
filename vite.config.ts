import { defineConfig } from 'vite'
import { resolve } from 'path'  // 新增的
import uni from '@dcloudio/vite-plugin-uni'

// https://vitejs.dev/config/
export default defineConfig({
  envDir: resolve(__dirname, 'env'), // 新增的 设置环境变量的文件目录  默认是跟目录 这里统一在一起了
  plugins: [uni()]
})