// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/color-mode", "@vesp/nuxt-fontawesome"],
  css: ["v-network-graph/lib/style.css"],

  colorMode: {
    classSuffix: "",
  },

  tailwindcss: {
    configPath: 'tailwind.config.js',
  },

  fontawesome: {
    icons: {
      solid: ["user", "envelope", "key", "tag", "dice", "arrow-up-from-bracket", "spinner", "trash-can", "fa-times"],
      regular: ["user", "sun", "moon"],
      brands: ["discord", "github", "steam", "youtube", "reddit", "twitch"],
    },
    content: {},
  } as { [key: string]: unknown },

  compatibilityDate: "2025-04-20",
});