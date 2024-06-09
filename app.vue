<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script>
export default {
  head() {
    return {
      htmlAttrs: {
        lang: 'en'
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      meta: [
        { hid: 'language', name: 'language', content: 'en' }
      ]
    }
  }
}
</script>
