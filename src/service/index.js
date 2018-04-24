import ajax from './ajax'

export default {
  install (Vue) {
    Vue.prototype.$http = ajax
    Vue.http = ajax
  },
  $http: ajax
}













