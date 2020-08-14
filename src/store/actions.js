export const selectPlay = function ({commit}, {list, index}) {
  commit('setSequenceList', list)
  commit('setPlayList', list)
  commit('setCurrentIndex', index)
  commit('setPlaying', true)
  commit('setFullScreen', true)
}