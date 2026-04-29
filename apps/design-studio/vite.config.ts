import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'watch-workspace-packages',
      configureServer(server) {
        server.watcher.add(path.resolve(__dirname, '../../packages'));
      },
      handleHotUpdate({ file, modules, server }) {
        const packagesDir = path.resolve(__dirname, '../../packages');
        if (!file.startsWith(packagesDir)) return;

        // Collect every module in the importer chain all the way to the
        // app boundary.  This bypasses the React Fast Refresh boundary that
        // would otherwise swallow the update inside DesignX.tsx (which is
        // never rendered as a live client component — only via
        // renderToStaticMarkup).  Returning the full set forces Fast Refresh
        // to re-render the page components that call renderDesign(), so the
        // iframe content updates without a manual reload.
        const all = new Set(modules);
        const walk = (mods: typeof modules) => {
          for (const mod of mods) {
            for (const importer of mod.importers) {
              if (!all.has(importer)) {
                all.add(importer);
                walk([importer]);
              }
            }
          }
        };
        walk([...modules]);
        return [...all];
      },
    },
  ],
  resolve: {
    alias: {
      // Point directly at source so design changes hot-reload instantly
      '@flow-ledger/document-templates': path.resolve(__dirname, '../../packages/document-templates/src/index.ts'),
    },
  },
  optimizeDeps: {
    // Ensure react-dom/server (used by renderDesign) is pre-bundled for the browser
    include: ['react-dom/server'],
  },
  server: {
    fs: {
      // Allow Vite to serve files from the packages/ directory
      allow: ['../..'],
    },
  },
});
