import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Define the base directory for resolving imports
  root: resolve(__dirname, 'src/assets/src'),
  
  // Configure build options
  build: {
    // Output directory for the build
    outDir: resolve(__dirname, 'src/assets/dist'),
    
    // Clean the output directory before build
    emptyOutDir: true,
    
    // Generate source maps for debugging
    sourcemap: true,
    
    // Configure library mode to bundle for non-module usage
    lib: {
      entry: resolve(__dirname, 'src/assets/src/js/palette.js'),
      name: 'CommandPalette',
      fileName: (format) => `js/palette.min.js`,
      formats: ['iife']
    },
    
    // Configure the build to generate separate files for each entry point
    rollupOptions: {
      output: {
        // Configure output file names for assets
        assetFileNames: (assetInfo) => {
          // Put CSS files in the css directory
          if (assetInfo.name.endsWith('.css')) {
            return 'css/palette.min.css';
          }
          // Put other assets in the assets directory
          return 'assets/[name]-[hash].[ext]';
        }
      }
    },
    
    // Minify the output for production
    minify: true
  },
  
  // Configure CSS processing
  css: {
    // Enable source maps for CSS
    devSourcemap: true,
    
    // Configure preprocessor options
    preprocessorOptions: {
      scss: {
        // Add any SCSS options here if needed
      },
    },
  },
});
