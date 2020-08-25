import searchList from 'components/base/search-list/search-list'
<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box placeholder="搜索歌曲" ref="searchBox" @query="changeQuery"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @changeIndex="changeIndex"></switches>
        <div class="list-wrapper">
          <scroll :data="playHistory" ref="songList" class="list-scroll" v-if="currentIndex === 0">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll ref="searchList" v-if="currentIndex === 1" :data="searchHistory" class="list-scroll">
          <div class="list-inner">
            <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
          </div>
        </scroll>
        </div> 
      </div>
      <div class="search-result" v-show="query">
        <suggest @select="select" :query="query"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
import searchBox from 'components/base/search-box/search-box'
import suggest from 'components/suggest/suggest'
import { searchMixin } from 'common/js/mixin'
import switches from 'components/base/switches/switches'
import scroll from 'components/base/scroll/scroll'
import SongList from 'components/song-list/song-list'
import searchList from 'components/base/search-list/search-list'
import TopTip from 'components/base/top-tip/top-tip'
import { mapGetters , mapActions} from 'vuex'
export default {
  mixins: [searchMixin],
  components: {
    searchBox,
    suggest,
    switches,
    scroll,
    SongList,
    searchList,
    TopTip
  },
  data() {
    return {
      showFlag: false,
      switches: [
      {
        id: 1,
        name: '最近播放'
      },
      {
        id: 2,
        name: '搜索历史'
      }
    ],
    currentIndex: 0
    }
  },
  methods: {
    show() {
      this.showFlag = true
      setTimeout(() => {
        if(this.currentIndex === 0) {
          this.$refs.songList.refresh()
        } else {
          this.$refs.searchList.refresh()
        }
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    changeIndex(index) {
      this.currentIndex = index
    },
    select() {
      this.$refs.topTip.show()
      this.saveSearch()
    },
    selectSong(item, index) {
      if(index !== 0) {
        this.insertSong(item)
        this.showTopTip()
      }
    },
    showTopTip() {
      this.$refs.topTip.show()
    },
    ...mapActions(['insertSong'])
  },
  computed: {
    ...mapGetters([
      'playHistory'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>