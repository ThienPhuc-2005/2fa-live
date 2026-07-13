import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Dùng đường dẫn tương đối để web chạy đúng trên GitHub Pages
  // (https://<tên>.github.io/<tên-kho>/) mà không cần biết trước tên kho.
  base: './',
  plugins: [react()],
});
