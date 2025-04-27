import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';

// Define PWA configuration
const pwaOptions: Partial<VitePWAOptions> = {
  strategies: 'injectManifest',
  srcDir: 'src/sw',
  filename: 'service-worker.ts',
  injectRegister: 'auto',
  registerType: 'autoUpdate',
  injectManifest: {
    rollupFormat: 'iife',
  },
  devOptions: {
    enabled: true,
    type: 'module',
  },
  manifest: {
    name: 'Cameroon Marketplace',
    short_name: 'CM Market',
    description: 'A marketplace application for Cameroon',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/assets/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/assets/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/assets/icons/icon-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default defineConfig({
  plugins: [
    react(),
    VitePWA(pwaOptions),
  ] as PluginOption[],
  server: {
    host: true,
  },
  build: {
    sourcemap: true,
  },
});