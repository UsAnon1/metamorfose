import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// base './' faz o build funcionar na raiz e em subpasta (usuario.github.io/Cards/)
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',   // baixa e ativa a versão nova sozinho
      injectRegister: false,        // o registro é feito em src/main.js
      includeAssets: ['favicon-32.png', 'apple-touch-icon.png', 'logo-claro.png', 'logo-escuro.png'],
      manifest: {                   // vira o manifest.webmanifest
        name: 'Cartões de enfrentamento',
        short_name: 'Cartões',
        description: 'Cartões de enfrentamento para reflexão e bem-estar.',
        lang: 'pt-BR',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#f4f1ec',
        theme_color: '#f4f1ec',
        icons: [
          { src: 'icone-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icone-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          // maskable: arte reduzida a 80% para caber na "zona segura" do Android
          { src: 'icone-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'icone-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // guarda HTML, JS, CSS, ícones e as imagens dos cartões para abrir offline
        globPatterns: ['**/*.{js,css,html,png,svg,ico,webmanifest,woff2}'],
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
        runtimeCaching: [
          // O app hoje não usa API. Se um dia usar Supabase/Firebase, essas
          // chamadas NUNCA devem ficar em cache (login e dados sempre da rede).
          {
            urlPattern: ({ url }) => /(supabase\.co|firebaseio\.com|firebaseapp\.com|googleapis\.com|\/api\/)/.test(url.href),
            handler: 'NetworkOnly'
          }
        ]
      },
      devOptions: { enabled: false } // PWA só no build (npm run build + preview)
    })
  ]
})
