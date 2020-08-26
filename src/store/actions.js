import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite } from 'common/js/cache'
function findIndex(list, songs) {
  return list.findIndex(item => {
    return item.id === songs.id
  })
}
// 选择播放
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

// 随机播放
export const randomPlay = function ({ commit }, { list }) {
  commit('setMode', playMode.random)
  commit('setSequenceList', list)
  let randomList = shuffle(list)
  commit('setPlayList', randomList)
  commit('setCurrentIndex', 0)
  commit('setPlaying', true)
  commit('setFullScreen', true)
}
// 插入歌曲
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
// 保存历史记录
export const saveSearchHistory = function ({ commit }, query) {
  commit('setSearchHistory', saveSearch(query))
}
// 删除一个历史记录
export const deleteSearchHistory = function ({ commit }, query) {
  commit('setSearchHistory', deleteSearch(query))
}
// 清理全部历史记录
export const clearSearchHistory = function ({ commit }) {
  commit('setSearchHistory', clearSearch())
}

export const deleteSong = function ({ commit, state }, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playList, song)
  playList.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  if (currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--
  }
  commit('setPlayList', playList)
  commit('setSequenceList', sequenceList)
  commit('setCurrentIndex', currentIndex)
  if (!playList.length) {
    commit('setPlaying', false)
  } else {
    commit('setPlaying', true)
  }
}
export const deleteSongList = function ({ commit }) {
  commit('setPlayList', [])
  commit('setSequenceList', [])
  commit('setCurrentIndex', -1)
  commit('setPlaying', false)
}
// 保存历史记录
export const savePlayHistory = function ({ commit }, song) {
  commit('setPlayHistory', savePlay(song))
}

export const saveFavoriteList = function ({commit}, song) {
  commit('setFavoriteList', saveFavorite(song))
}

export const deleteFavoriteList = function ({commit}, song) {
  commit('setFavoriteList', deleteFavorite(song))
}