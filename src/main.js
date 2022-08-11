import Vue from 'vue'
import App from './App.vue'
import router  from '@/router'
import vuetify from './plugins/vuetify'
import store from './store'
import VeeValidate from 'vee-validate'
import Vuex from 'vuex'
import setupInterceptors from '@/services/setupInterceptors'

Vue.config.productionTip = false
Vue.use(VeeValidate)
Vue.use(Vuex)

setupInterceptors(store)

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
