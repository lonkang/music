import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { saveSearch , deleteSearch, clearSearch} from 'common/js/cache'
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
export const insertSong = function ({ commit, state }, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playList[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playList, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入这首歌到当前索引位置
  playList.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      playList.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit('setPlayList', playList)
  commit('setSequenceList', sequenceList)
  commit('setCurrentIndex', currentIndex)
  commit('setPlaying', true)
  commit('setFullScreen', true)
}
export const saveSearchHistory = function ({ commit }, query) {
  commit('setSearchHistory', saveSearch(query))
}
// 删除一个
export const deleteSearchHistory = function ({commit}, query) {
  commit('setSearchHistory', deleteSearch(query))
}
// 清理全部
export const clearSearchHistory = function ({commit}) {
  commit('setSearchHistory', clearSearch())
}