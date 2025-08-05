import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
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
    
    // Configure the build to generate separate files for each entry point
    rollupOptions: {
      input: {
        // JavaScript entry point
        'palette': resolve(__dirname, 'src/assets/src/js/palette.js'),
      },
      output: {
        // Configure output file names
        entryFileNames: 'js/[name].min.js',
        chunkFileNames: 'js/[name]-[hash].min.js',
        assetFileNames: (assetInfo) => {
          // Put CSS files in the css directory
          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name].min.[ext]';
          }
          // Put other assets in the assets directory
          return 'assets/[name]-[hash].[ext]';
        },
      },
    },
    
    // Minify the output for production
    minify: true,
  },
  
  // Configure plugins
  plugins: [
    // Add support for legacy browsers
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  
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
