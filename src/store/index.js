import Vue from 'vue'
import Vuex from 'vuex'
import createlooger from 'vuex/dist/logger'
import state from './state'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'


export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
  },
  plugins: debug ? [createLogger()] : []
})
