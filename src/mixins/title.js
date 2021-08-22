export default {
  methods: {
    setTitle(title) {
      const titleHtml = document.querySelector("title")
      if (titleHtml) {
        titleHtml.innerText = `${title} | Чат на WebRTC`
      }
    },
  },
}