import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'logo.svg'],
      manifest: {
        name: '中文研究室',
        short_name: '中文研究室',
        description: '學術講座、研討會、工作坊資訊平台',
        theme_color: '#1c1c1e',
        background_color: '#1c1c1e',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        lang: 'zh-TW',
        icons: [
          {
            src: 'logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: 'favicon.ico',
            sizes: '48x48',
            type: 'image/x-icon',
          },
        ],
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
  base: '/',
})
