import Vue from 'vue'
import Vuex from 'vuex'
import createlooger from 'vuex/dist/logger'
import state from './state'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
  },
  plugins: [createlooger]
})
