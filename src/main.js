import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './common/stylus/index.styl'
// 使用axios
import axios from 'axios'
Vue.prototype.$http = axios

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
