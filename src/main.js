import Vue from 'vue'
import App from './App.vue'
import router  from '@/router'
import vuetify from './plugins/vuetify'
import store from './store'
import VeeValidate from 'vee-validate'

Vue.config.productionTip = false
Vue.use(VeeValidate)

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
