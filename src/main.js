import Vue from 'vue'
import App from './App'
import routes from './routes/routes'
// import store from './store'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

Vue.use(VueRouter)
Vue.use(VueResource)

import 'common/stylus/index.styl'

const router = new VueRouter(routes)
/* eslint-disable no-unused-vars */
const app = new Vue({
  render: h => h(App),
  router
}).$mount('#app')

