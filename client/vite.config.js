import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
    const envDir = path.resolve(__dirname, "..");
    const env = loadEnv(mode, envDir, "");
    const apiTarget =
        env.VITE_API_URL || env.API_BACKEND_URL || "http://server:80";

    return {
        envDir,
        build: {
            outDir: "build",
        },
        plugins: [react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
                "@assets": path.resolve(__dirname, "src/assets"),
                "@features": path.resolve(__dirname, "src/features"),
                "@shell": path.resolve(__dirname, "src/shell"),
                "@services": path.resolve(__dirname, "src/services"),
                "@shared": path.resolve(__dirname, "src/shared"),
            },
        },
        server: {
            host: "0.0.0.0", // Écoute sur toutes les interfaces (nécessaire pour Docker)
            port: 3000,
            strictPort: true,
            watch: {
                usePolling: true, // Nécessaire pour le hot reload dans Docker
            },
            proxy: {
                "/api": {
                    target: apiTarget,
                    changeOrigin: true,
                },
                "/public": {
                    target: apiTarget,
                    changeOrigin: true,
                },
            },
        },
    };
});
