import { createApp } from 'vue'
import App from './App.vue'
import "./assets/scss/main.scss"
import router from "./router/"
import store from "./store/"
import title from "./mixins/title"

createApp(App)
  .mixin(title)
  .use(router)
  .use(store)
  .mount('#app')
