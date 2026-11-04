import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { dedupe: ["react", "react-dom", "three"] },
  optimizeDeps: { include: ["@react-three/fiber", "three", "three/addons/controls/OrbitControls.js", "three/addons/geometries/TextGeometry.js", "three/addons/loaders/FontLoader.js", "react-icons/lu"] },
});
