import axios from 'axios'
import store from '@/store'
// import qs from 'qs'
const ajaxInstance = axios.create({
  transformResponse: [upperToLowerCamelCase]
})
const GET_SERVICE_URL = `http://api.shengtex.com/Service/GetService`  // 测试环境
const getService = async function (forceQuery) {
  if (!forceQuery && store.state.serviceList.length) {  //  你查查哪里带参数调用了这个函数，修改下
    return store.state.serviceList
  }
  let res
  try {
    store.commit('UPDATE_LOADING', true)
    let url
    url = GET_SERVICE_URL
    url += '?code=' + store.state.corpCode
    url += '&version=1.0.0'
    url += '&r=' + Math.random()
    res = await ajaxInstance
      .get(url)
  } catch (e) {
    store.commit('UPDATE_LOADING', false)
    throw Object({message: '网络错误'})
  }

  store.commit('UPDATE_LOADING', false)
  if (res) {
    // console.log(res)
    let content = res.data
    if (content.isSucceed && content.data) {
      let serviceList = content.data
      store.commit('UPDATE_SERVICE_LIST', serviceList)
      return serviceList
    } else {
      throw Object({message: content.message})
    }
  } else {
    throw Object({message: '接口错误'})
  }
}

const getServiceUrlByName = async function (serviceName) {
  if (/\//.test(serviceName)) {
    return serviceName
  }

  let serviceList = store.state.serviceList
  // 有服务列表缓存并且有此服务
  if (serviceList.length && findUrl(serviceName, serviceList)) {
    return findUrl(serviceName, serviceList)
  } else {
    try {
      // 缓存里找不到服务地址则请求服务器
      serviceList = await getService(true)
    } catch (e) {
      throw e
    }

    let serviceUrl = findUrl(serviceName, serviceList)

    if (serviceUrl) {
      return serviceUrl
    } else {
      throw Object({message: '找不到服务'})
    }
  }
}

export default {
  getService: getService,
  getServiceUrlByName: getServiceUrlByName
}

/**
 * 将返回信息的首字母转换为小写
 * @param response
 */
function upperToLowerCamelCase (response) {
  let responseString = response.replace(/(?!")[$_a-zA-Z0-9]+(?=":)/ig, function (str) {
    return str.replace(/^[A-Z]/, function (char) {
      return char.toLowerCase()
    })
  })
  return JSON.parse(responseString)
}

/**
 * 从服务列表里根据服务名称找到对应服务地址
 * @param name 服务名
 * @param serviceList 服务列表
 * @returns {string}
 */

function findUrl (name, serviceList) {
  let obj = serviceList.find(function (item) {
    return item.name === name
  })
  return obj ? obj.url : ''
}
