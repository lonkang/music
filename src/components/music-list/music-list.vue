<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter">

      </div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll ref="list" :data="songs" class="list" :probeType="probeType" :listenScroll="listenScroll" @scroll="scroll">
      <div class="song-list-wrapper">
        <songList :songs="songs"></songList>
      </div>
    </scroll>  
  </div>
</template>

<script>
import scroll from 'components/base/scroll/scroll'
import songList from 'components/song-list/song-list'

const RESERVED_HEIGHT = 40

export default {
  components: {
    scroll,
    songList
  },
  data(){
    return {
      scrollY: 0
    }
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    bgImg: {
      type: String,
      default: "",
    },
    songs: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted() {
    // 动态设置scroll组件的高度 === 背景图的高度
    this.imageHeight = this.$refs.bgImage.clientHeight
    // 最小可以滑动的地方
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImg})`;
    },
  },
  methods: {
    // 返回按钮
    back() {
        this.$router.back()
    },
    // 监听滚动事件
    scroll(opt) {
      this.scrollY = opt.y
    }
  },
  watch: {
    scrollY(newY) {
      let translateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0
      let scale = 1
      let blur = 0
      this.$refs.layer.style['transform'] = `translate3d(0, ${translateY}px ,0)`

      // 放大比例
      const percent = Math.abs(newY / this.imageHeight)

      if(newY > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(percent * 20, 20)
      }
      // 在ios上才有
      this.$refs.filter.style['backdorp-filter'] = `blur(${blur})px`
      // 当newY小于minTranslateY的时候 设置zIndex = 10 
      if (newY < this.minTranslateY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        // 控制按钮的显示和隐藏
        this.$refs.playBtn.style.display = 'none'
      } else {
        // 反之亦然
        // 当newY的值
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        // 控制按钮的显示和隐藏
        this.$refs.playBtn.style.display = ''
      }
      // 不管有没有滑动到最上面都设置zindex
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style['transform'] = `scale(${scale})`
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>