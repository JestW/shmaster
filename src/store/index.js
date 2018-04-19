import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'
import work from './modules/work'
import storage from '@/storage'
const debug = process.env.NODE_ENV !== 'production'
Vue.use(Vuex)

const state = {
  planOrder: {}, // 生产单号
  orientation: 'portrait', // 'landscape' : 'portrait',
  loadingCount: 0,
  direction: 'forward',
  // corpCode:1001,
  footerStatus: {
    show: false,
    selected: '/'
  },
  topToast: {
    show: false,
    type: 'default',
    message: ''
  },
  serviceList: storage.get('SERVICE_LIST') || [],
  uid: storage.get('UID') || '',
  corpCode: storage.get('CORP_CODE') || '',
  corpId: storage.get('CORP_ID') || '',
  corpName: storage.get('CORP_NAME') || '',
  authToken: storage.get('AUTH_TOKEN') || '',
  showDrawer: false,
  authModuleList: []
}
const store = new Vuex.Store({
  actions,
  getters,
  modules: {
    work
  },
  mutations,
  state,
  strict: debug
})

export default store



