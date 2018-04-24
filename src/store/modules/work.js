/**
 * 工作流程相关
 */
import ajax from '@/service/ajax'
import storage from '@/storage'

const work = {
  namespaced: true,
  state () {
    return {
      workshopList: [],
      currentWorkShop: storage.get('current_workshop') || {},
      processList: [],
      currentProcess: storage.get('current_process') || {},
      categoryList: [],
      currentCategory: storage.get('current_category') || {}
    }
  },
  mutations: {
    UPDATE_WORKSHOP_LIST: (state, payload) => {
      state.workshopList = payload
    },
    UPDATE_PROCESS_LIST: (state, payload) => {
      state.processList = payload
    },
    UPDATE_CATEGORY_LIST: (state, payload) => {
      state.categoryList = payload
    },
    UPDATE_CURRENT_WORKSHOP_ID: (state, payload) => {
      let currentWorkshop = (state.workshopList || []).find(item => item.value === payload[0])
      if (currentWorkshop) {
        storage.set('current_workshop', currentWorkshop)
        state.currentWorkShop = currentWorkshop
      } else {
        storage.set('current_workshop', '')
        state.currentWorkShop = null
      }
    },
    UPDATE_CURRENT_PROCESS_ID: (state, payload) => {
      let currentProcess = (state.processList || []).find(item => item.value === payload[0])
      if (currentProcess) {
        storage.set('current_process', currentProcess)
        state.currentProcess = currentProcess
      }
    },
    UPDATE_CURRENT_CATEGORY_ID: (state, payload) => {
      let currentCategory = (state.categoryList || []).find(item => item.value === payload[0])
      if (currentCategory) {
        storage.set('current_category', currentCategory)
        state.currentCategory = currentCategory
      }
    }
  },
  actions: {
    GET_WORKSHOP_LIST: async ({ commit, state }) => {
      await ajax
        .post('GetWorkShop')
        .then(res => {
          let content = res.data
          if (content.isSucceed) {
            let workshops = (content.data || []).map(item => {
              item.value = item.id + ''
              return item
            })
            commit('UPDATE_WORKSHOP_LIST', workshops)
            if (state.currentWorkShop == null || !state.currentWorkShop.value) {
              commit('UPDATE_CURRENT_WORKSHOP_ID', [workshops[0].value])
            }
          }
        })
    },
    GET_PROCESS_LIST: async ({ commit, state }) => {
      await ajax
        .post('GetProcesses')
        .then(res => {
          let content = res.data
          if (content.isSucceed) {
            let processes = (content.data || []).map(item => {
              item.value = item.id + ''
              return item
            })
            commit('UPDATE_PROCESS_LIST', processes)
            if (state.currentProcess == null || !state.currentProcess.value) {
              commit('UPDATE_CURRENT_PROCESS_ID', [processes[0].value])
            }
          }
        })
    },
    GET_CATEGORY_LIST: async ({ commit, state }) => {
      await ajax
        .post('GetSpinningProcesses')
        .then(res => {
          let content = res.data
          if (content.isSucceed) {
            let category = (content.data || []).map(item => {
              item.value = item.id + ''
              return item
            })

            commit('UPDATE_CATEGORY_LIST', category)
            if (!state.currentCategory.value) {
              commit('UPDATE_CURRENT_CATEGORY_ID', [category[0].value])
            }
          }
        })
    }
  }
}
export default work
