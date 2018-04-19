import ajax from '../service/axios'

export default {
  install (Vue) {
    Vue.prototype.$http = ajax
    Vue.http = ajax
  },
  $http: ajax
}













