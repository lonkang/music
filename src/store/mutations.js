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
  setCurrentIndex(state, index) {
    state.currentIndex = index
  }
}
export default mutations