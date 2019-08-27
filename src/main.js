import Vue from 'vue'
import App from './App.vue'
import router from '@/router/router.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.less'

Vue.config.productionTip = false
Vue.use(ElementUI)

// 导航守卫
router.beforeEach((to, from, next) => {
  let mytoken = localStorage.getItem('vue_manage_master_token')
  if (mytoken || to.path === '/login') {
    next()
  } else {
    next({ path: '/login' })
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
