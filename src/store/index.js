import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import Vuex from 'vuex'
import { auth } from './auth.module'
import { loa } from './loa.module'
import { factory_files } from './factory_files.module'
import { status_message } from '@/store/status_message.module'
import { email } from '@/store/email.module'
import ru from 'vee-validate/dist/locale/ru'

Validator.localize('ru', ru)
Vue.use(VeeValidate, {
  locale: 'ru',
})
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth,
    loa,
    factory_files,
    status_message,
    email
  }
})
