/**
 * 根级别的 mutation
 */
import storage from '@/storage'

/**
 * 更新屏幕方向
 * @param state
 * @param orientation
 * @constructor
 */
export const UPDATE_ORIENTATION = (state, orientation) => {
  state.orientation = orientation
}

/**
 * 更新loading，主要用于非组件内
 * @param state
 * @param status
 * @constructor
 */
export const UPDATE_LOADING = (state, status) => {
  state.loadingCount += (status ? 1 : state.loadingCount > 0 ? -1 : 0)
}

/**
 * 页面切换动画的滑动方向
 * @param state
 * @param direction
 * @constructor
 */
export const UPDATE_DIRECTION = (state, direction) => {
  state.direction = direction
}

/**
 * 更新是否显示底部导航
 * @param state
 * @param show
 * @param selected
 * @constructor
 */
export const UPDATE_FOOTER_STATUS = (state, {show, selected}) => {
  state.footerStatus = {
    show: show !== undefined ? show : state.show,
    selected: selected !== undefined ? selected : state.selected
  }
}

/**
 * 更新头部提示
 * @param state
 * @param show {Boolean} 显示隐藏
 * @param type {String} 提示的类型
 * @param message 提示消息内容
 * @constructor
 */
export const UPDATE_TOP_TOAST = (state, {show, type, message}) => {
  state.topToast = {
    show: show !== undefined ? show : state.show,
    type: type !== undefined ? type : 'default',
    message: message || ''
  }
}

/**
 * 更新用户uid
 * @param state
 * @param payload
 * @constructor
 */
export const UPDATE_UID = (state, payload) => {
  storage.set('UID', payload, { 'expireDays': 7 })
  state.uid = payload
}

/**
 * 更新auth_token
 * @param state
 * @param payload
 * @constructor
 */
export const UPDATE_AUTH_TOKEN = (state, payload) => {
  storage.set('AUTH_TOKEN', payload, { 'expireDays': 7 })
  state.authToken = payload
}

/**
 * 清除auth_token
 * @param state
 * @constructor
 */
export const REMOVE_AUTH_TOKEN = (state) => {
  storage.remove('AUTH_TOKEN')
  state.authToken = ''
}

/**
 * 更新公司码
 * @param state
 * @param payload
 * @constructor
 */
export const UPDATE_CORP_CODE = (state, payload) => {
  storage.set('CORP_CODE', payload)
  state.corpCode = payload
}

/**
 * 更新公司ID
 * @param state
 * @param payload
 * @constructor
 */
export const UPDATE_CORP_ID = (state, payload) => {
  storage.set('CORP_ID', payload)
  state.corpId = payload
}

/**
 * 更新服务列表（服务发现）
 * @param state
 * @param serviceList
 * @constructor
 */
export const UPDATE_SERVICE_LIST = (state, serviceList) => {
  storage.set('SERVICE_LIST', serviceList)
  state.serviceList = serviceList
}

/**
 * 更新公司名称
 * @param state
 * @param payload
 * @constructor
 */
export const UPDATE_CORP_NAME = (state, payload) => {
  storage.set('CORP_NAME', payload)
  state.corpName = payload
}

/**
 * 更新抽屉菜单状态
 * @param state
 * @param payload
 * @constructor
 */
export const UPDATE_DRAWER_STATUS = (state, payload) => {
  state.showDrawer = payload
}

/**
 * 更新模块权限列表
 * @param state
 * @param payload
 * @constructor
 */
export const UPDATE_AUTH_MODULE_LIST = (state, payload) => {
  state.authModuleList = payload
}
/**
 * 更新生产计划单号
 * @param state
 * @param payload
 * @constructor
 */
export const UPDATE_PLANORDER = (state, payload) => {
  state.planOrder = payload
}

