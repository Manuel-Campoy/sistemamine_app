import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', 
      injectRegister: 'auto',
      
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'safari-pinned-tab.svg'],
      
      devOptions: {
        enabled: true 
      },

      manifest: {
        name: 'Sistema Minero - Gestión Operativa',
        short_name: 'Sistema Mine',
        description: 'Control de operación minera, trazabilidad y logística offline',
        theme_color: '#1e3a8a', 
        background_color: '#ffffff',
        display: 'standalone', 
        orientation: 'portrait',
        lang: 'es',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' 
          }
        ]
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2}'],
        navigateFallback: '/index.html',
        
        navigateFallbackDenylist: [/^\/api/] 
      }
    })
  ],
  server: {
    port: 5173,
    host: true, 
  }
})