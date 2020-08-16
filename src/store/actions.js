import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

function findIndex(list, songs) {
  return list.findIndex(item => {
    return item.id === songs.id
  })
}

export const selectPlay = function ({ commit, state }, { list, index }) {
  commit('setSequenceList', list)
  if (playMode.random === state.mode) {
    let randomList = shuffle(list)
    commit('setPlayList', randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit('setPlayList', list)
  }
  commit('setCurrentIndex', index)
  commit('setPlaying', true)
  commit('setFullScreen', true)
}

export const randomPlay = function ({ commit }, { list }) {
  commit('setMode', playMode.random)
  commit('setSequenceList', list)
  let randomList = shuffle(list)
  commit('setPlayList', randomList)
  commit('setCurrentIndex', 0)
  commit('setPlaying', true)
  commit('setFullScreen', true)
}