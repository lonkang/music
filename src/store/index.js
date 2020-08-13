import Vue from 'vue'
import Vuex from 'vuex'
import createlooger from 'vuex/dist/logger'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    singer: {},  // 歌手详情
  },
  mutations: {
    // 点击歌手进行调整到详情页传递的singer
    setSinger(state, singer) {
      state.singer = singer
    }
  },
  actions: {
  },
  getters: {
    singer(state) {
      return state.singer
    }
  },
  modules: {
  },
  plugins: [createlooger]
})
