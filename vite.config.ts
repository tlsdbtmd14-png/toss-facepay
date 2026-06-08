import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,            // 0.0.0.0 바인딩 → 외부/터널 접속 허용
    allowedHosts: true,    // 터널 도메인(Host 헤더) 허용
  },
})
