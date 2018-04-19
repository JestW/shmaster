import store from '@/store'
import AjaxPlugin from '../axiosPlugin/Axiosplugin'

export const Auth = {
  isLogIn () {
    return !!store.state.authToken
  },
  async login ({userName, password}) {
    let res
    try {
      res = await AjaxPlugin.$http
        .post('Login', {
          userName: userName,
          pwd: password
        })
    } catch (e) {
      throw Object({message: '网络错误'})
    }

    if (res && res.data) {
      let content = res.data
      // console.log(res)
      if (content.isSucceed) {
        store.commit('UPDATE_AUTH_TOKEN', content.data.userToken)
        store.commit('UPDATE_CORP_ID', content.data.corpId)
        return {success: true, userName}
      } else {
        return {success: false, message: content.message}
      }
    } else {
      return {success: false, message: '登录失败'}
    }
  },
  async logout () {
    store.commit('REMOVE_AUTH_TOKEN')
    return true
  },
  /**
   * 模块授权判断
   * @param moduleId 路由配置的模块权限id
   * @returns {boolean}
   */
  async checkModuleAuth (moduleId) {
    if (moduleId === void 0) {
      return true
    }

    let authorizedModuleIds = store.state.authModuleList
    if (!authorizedModuleIds.length) {
      let res
      try {
        res = await AjaxPlugin.$http
          .post('GetUserModuleAuthority')
      } catch (e) {
        throw Object({message: '网络错误'})
      }
      if (res && res.data && res.data.isSucceed) {
        if (res.data.data && res.data.data.authorityCode) {
          authorizedModuleIds = res.data.data.authorityCode.split(/[,，]/)
          store.commit('UPDATE_AUTH_MODULE_LIST', authorizedModuleIds)
        } else {
          authorizedModuleIds = []
        }
      } else {
        throw Object({message: res.data.message})
      }
    }
    return authorizedModuleIds.indexOf('' + moduleId) > -1
  },
  moduleAuthList: []
}

export const ServerDate = {
  diff: 0,
  get () {
    return new Date(ServerDate.diff + new Date().getTime())
  },
  set (date) {
    ServerDate.diff = new Date(date).getTime() - new Date().getTime()
  }
}
