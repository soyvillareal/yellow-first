import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { esbuildCommonjs, viteCommonjs } from '@originjs/vite-plugin-commonjs';
import eslintPlugin from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    viteCommonjs(),
    react(),
    tsconfigPaths(),
    eslintPlugin({
      emitWarning: true,
      emitError: true,
      failOnError: false,
      failOnWarning: false,
    }),
    checker({ typescript: true, overlay: false, terminal: true }),
  ],
  build: {
    outDir: 'build',
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildCommonjs(['react-s3'])],
    },
  },
  server: {
    host: '192.168.1.5', // Specify the host to use (default: 'localhost')
    port: 3000, // Specify the port to use (default: 3000)
    open: true, // Open the browser on server start (default: false)
  },
});
