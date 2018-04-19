import axios from 'axios'
import storage from '@/storage'
import router from '@/router'
import Service from './service'
import qs from 'qs'
import store from '@/store'

// 使用application/json 格式请求的接口列表
//所有在里面的都是以对象的方式上传的，其他的是以form形式上传
const JSON_TYPE_SERVICE_LIST = ['SaveMachinePlan', 'SignInOut', 'SubmitBaoGong', 'SaveEmpoyeeInstead', 'AddMachineShiftProduct', 'SaveMaintenancePlan', 'SaveMaintenance', 'FinishedMaintenance', 'SaveMachineByEmpShiftId', 'SaveRepairPlan', 'SaveRepair', 'FinishedRepair', 'SaveRepairNode']

// ajax 请求全局配置 common/get/post
const ajax = axios.create({
  timeout: 10000,
  header: {
    'Content-Type': 'application/json'
  },
  transformRequest: [],
  transformResponse: [upperToLowerCamelCase],
  validateStatus: function (status) {
    return status >= 200 && status < 300 // default
  }
})

// 拦截请求
ajax.interceptors.request.use(function (config) {
  serializeRequest(config) // 修改请求头和请求参数的方式进行参数序列化
  config.headers['Authorization'] = storage.get('AUTH_TOKEN') || ''
  return config
}, function (error) {
  return Promise.reject(error)
})

// 拦截响应
ajax.interceptors.response.use(function (config) {
  return config
}, function (error) {
  return Promise.reject(error)
})

const proxy = {
  async get (serviceName, ...rest) {
    try {
      const serviceUrl = await Service.getServiceUrlByName(serviceName)
      return await ajax.get(serviceUrl, ...rest)
    } catch (e) {
      throw e
    }
  },
  /**
   * 包装axios的post方法
   * @param serviceName 服务名
   * @param rest
   * @returns {*}
   */
  async post (serviceName, ...rest) {
    const serviceUrl = await Service.getServiceUrlByName(serviceName)

    async function doPost (count = 0) {
      try {
        return await ajax.post(serviceUrl, ...rest)
      } catch (e) {
        if (count >= 2) {
          throw e
        } else {
          return await doPost(count + 1)
        }
      }
    }

    return await doPost()
  }
}

export default proxy

/**
 * 序列化请求参数
 * @param config
 */
function serializeRequest (config) {
  let request = config.data
  let arr = config.url.split('/')
  let api = arr[arr.length - 1]

  let useJson = JSON_TYPE_SERVICE_LIST.indexOf(api) > -1
  Object.assign(config, {
    data: useJson ? JSON.stringify(request) : qs.stringify(Object.assign({}, request, { CorpID: storage.get('CORP_ID') }), {arrayFormat: 'repeat'}),
    headers: {
      'Content-Type': useJson ? 'application/json' : 'application/x-www-form-urlencoded'
    }
  })
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

  let res = JSON.parse(responseString)

  if (res.code === 401) {
    store.commit('UPDATE_TOP_TOAST', {
      show: true,
      message: '登录失效'
    })
    router.replace({
      name: 'login',
      query: { redirect: store.state.route.path } // router.history.current.fullPath
    })
  }
  return res
}
