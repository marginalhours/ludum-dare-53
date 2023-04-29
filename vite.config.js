import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/ludum-dare-53/",
  build: {
    assetsInlineLimit: 0, // don't inline stuff! breaks the build
  },
});
