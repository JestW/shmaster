// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import store from './store'
import router from './router'
import AjaxPlugin from './axiosPlugin/Axiosplugin'

Vue.use(Vuex)
Vue.config.productionTip = false

const FastClick = require('fastclick')
FastClick.attach(document.body)

import {
  DevicePlugin,
  ToastPlugin,
  AlertPlugin,
  ConfirmPlugin,
  LoadingPlugin,
  DatetimePlugin
} from 'vux'
Vue.use(DevicePlugin)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
Vue.use(DatetimePlugin)
Vue.use(AjaxPlugin)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})

// 同步屏幕的旋转状态到 store
store.commit('UPDATE_ORIENTATION', (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait')
window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', function () {
  store.commit('UPDATE_ORIENTATION', (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait')
}, false)
