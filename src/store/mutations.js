const mutations = {
  // 点击歌手进行切换详情页，传递singer
  setSinger(state, singer) {
    state.singer = singer
  },
  // 设置播放状态
  setPlaying(state, flag) {
    state.playing = flag
  },
    // 设置是否全屏展示
  setFullScreen(state, flag) {
    state.fullScreen = flag
  },
  // 设置播放列表
  setPlayList(state, list) {
    state.playList = list
  },
  // 设置顺序播放列表
  setSequenceList(state, list) {
    state.sequenceList = list
  },
  // 设置播放模式
  setMode(state, mode) {
    state.mode = mode
  },
  // 改变播放模式
  setCurrentIndex(state, index) {
    state.currentIndex = index
  },
  // 设置热门歌曲
  setDisc(state, list) {
    console.log(list)
    state.disc = list
  },
  // 设置热门歌曲
  setTopList(state, list) {
    state.topList = list
  },
  // 添加搜索历史记录
  setSearchHistory(state, list) {
    state.searchHistory = list
  },
  setPlayHistory(state, history) {
    state.playHistory = history
  },
  setFavoriteList(state, list) {
    state.favoriteList = list
  }
}
export default mutations