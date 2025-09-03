import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0', // biar bisa diakses dari luar (bukan cuma localhost)
        port: 5173,      // default port vite
        cors: true,      // izinkan cross-origin
        origin: 'https://tokaku.navadhanarama.com', // samakan dengan domain laravel
    },
});
