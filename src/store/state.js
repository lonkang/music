import { playMode } from 'common/js/config'
import { loadSearch, loadPlay } from 'common/js/cache'


const state = {
  singer: {}, // 歌手详情
  playing: false, // 播放状态
  fullScreen: false, // 是否全屏
  playList: [], // 播放列表 
  sequenceList: [], // 顺序播放列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前播放歌曲索引
  disc: {}, // 热门歌曲
  topList: {}, // 热门歌曲
  searchHistory: loadSearch(), // 搜索历史
  playHistory: loadPlay() // 播放历史
}
export default state