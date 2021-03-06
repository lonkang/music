<template>
  <div class="player" v-show="playList.length > 0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="imgsrc()" />
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-for="item in currentSong.singer" :key="item.id">{{item.name}}</h2>
        </div>
        <div class="middle" 
        @touchstart.prevent="middleTouchStart"
        @touchmove.prevent="middleTouchMove"
        @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="imgsrc()" />
              </div>
            </div>
            <!-- 当前播放的歌词 -->
            <div class="playing-lyric-wrapper">
                <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper" >
              <div v-if="currentLyric">
                <p ref="lyricLine" 
                class="text" 
                v-for="(item, index) in currentLyric.lines" 
                :key="index" 
                :class="{current : index === currentLineNum}"
                >{{item.txt}}</p>
                <p v-show="currentLyric.lines.length === 0" class="nolyric">
                  该歌曲暂无歌词
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <!-- 左右分页的显示 -->
          <div class="dot-wrapper">
            <div class="dot" :class="{ active : currentShow === 'cd'}"></div>
            <div class="dot" :class="{ active : currentShow === 'lyric'}"></div>
          </div>
          <!-- 进度条的使用 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{forMat(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar @precentChange="precentChange" :precent="precent"></progress-bar>
            </div>
            <span class="time time-r">{{forMat(currentSong.interval)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" @click="changeCurrentIndex(-1)" :class="disableCls">
              <i class="icon-prev"></i>
            </div>
            <div @click="togglePlaying" class="icon i-center" :class="disableCls">
              <i :class="playIcon"></i>
            </div>
            <div class="icon i-right" @click="changeCurrentIndex(1)" :class="disableCls">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon" :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" @click="open" v-show="!fullScreen">
        <div class="icon">
          <img width="40" height="40" :src="imgsrc()" />
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc">
            <span v-for="item of currentSong.singer" :key="item.id">{{item.name}}</span>
          </p>
        </div>
        <div class="control">
          <progress-circle :precent="precent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <play-list ref="playList"></play-list>
    <audio
      :src="audioSrc"
      ref="audio"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import animations from "create-keyframe-animation";
import { playMode } from "common/js/config.js";
import {playerMixin} from 'common/js/mixin'
import Lyric from "lyric-parser";

import playList from 'components/play-list/play-list'
import scroll from 'components/base/scroll/scroll'
import progressBar from "components/base/progress-bar/progress-bar";
import progressCircle from "components/base/progress-circle/progress-circle";
export default {
  mixins: [playerMixin],
  components: {
    progressBar,
    progressCircle,
    scroll,
    playList
  },
  data() {
    return {
      audioSrc: "", // 歌曲播放地址
      songReady: false, // 歌曲是在否准备
      currentTime: 0, // 音乐当前播放的时间
      currentLyric: null, // 歌词
      currentLineNum: 0, // 当前播放的歌词
      currentShow: 'cd', // 当前显示的分页
      playingLyric: '', // 显示的歌词
    };
  },
  created() {
    this.touch = {}
  },
  methods: {
    // 图片地址
    imgsrc() {
      if (!this.currentSong.album) {
        return 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=333375570,2372716667&fm=26&gp=0.jpg'
      }
      return JSON.stringify(this.currentSong) == "{}"
        ? ""
        : `https://y.gtimg.cn/music/photo_new/T002R300x300M000${this.currentSong.album.mid}.jpg`;
    },
    // 缩小组件
    back() {
      this.setFullScreen(false);
    },
    // 方法组件
    open() {
      this.setFullScreen(true);
    },
    // 切换播放模式
    togglePlaying() {
      if (!this.songReady) return;
      this.playing ? this.setPlaying(false) : this.setPlaying(true);
      if(this.currentLyric) {
        // 歌词暂停与播放
        this.currentLyric.togglePlay()
        }
    },
    // 动画钩子
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`,
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`,
        },
      };
      // 添加动画
      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear",
        },
      });
      // 运行动画
      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      // 删除动画
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    // 离开的动画钩子 添加动画
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style[
        "transform"
      ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener("transitionend", done);
    },
    // 离开之后的动画钩子 清除样式
    afterLeave() {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style["transform"] = "";
    },
    // 获取位置和缩放
    _getPosAndScale() {
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale,
      };
    },
    // 获取歌曲地址
    async getAudioSrc(mid) {
      this.audioSrc = "";
      const { data: res } = await this.$http.get("/api/song/urls?id=" + mid);
      if (JSON.stringify(res.data) == {}) {
        // 没有播放地址
        this.audioSrc = "";
      } else {
        this.audioSrc = res.data[mid];
      }
    },
    // 获取歌词
    async getLyric(mid) {
      const { data: res } = await this.$http.get("/api/lyric?songmid=" + mid);
      if (res.result) {
        this.currentLyric = new Lyric(res.data.lyric, this.handleLyric);
        this.currentLyric.play()
      } else {
        // 获取不到歌词清空
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      }
    },
    // 处理歌词滚动
    handleLyric({lineNum, txt}) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)// 滚动到顶部
      }
      this.playingLyric = txt
    },
    // 音频加载完之后，可以播放
    ready() {
      this.songReady = true;
      this.setPlaying(true);
      // 加载成功就可以播放
      this.$refs.audio.play();
      this.savePlayHistory(this.currentSong)
    },
    // 音频加载错误
    error() {
      this.songReady = false;
    },
    // 播放完之后
    end() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.changeCurrentIndex(1);
      }
    },
    // 循环播放
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      // 循环播放的时候 歌词修改
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    // 上一曲下一曲
    changeCurrentIndex(i) {
      if (this.playList.length === 1) {
        this.loop();
      } else {
        let index = this.currentIndex + i;
        if (index < 0) index = this.playList.length - 1;
        if (index === this.playList.length) index = 0;
        this.setCurrentIndex(index);
      }
    },
    // 改变播放时间
    updateTime(e) {
      // 获取到当前播放的时间
      this.currentTime = e.target.currentTime;
    },
    // 格式化数据
    forMat(time) {
      time = time | 0;
      const min = (time / 60) | 0;
      const sec = time % 60 | 0;
      if (sec < 10) return `${min}:0${sec}`;
      return `${min}:${sec}`;
    },
    // 当拖动进度条的时候 修改比例
    precentChange(percent) {
      // 判断信息里有没有歌曲时长有就拿 没有就获取audio中的歌曲时长
      let currentTime = this.currentSong.interval ? this.currentSong.interval * percent : this.$refs.audio.duration * percent;
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying();
      }
      // 拖动进度条的时候改变歌词
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    middleTouchStart(e) {
      this.touch.initiated = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) return
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }

      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      
      this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style['transitionDuration'] = 0
      
      this.$refs.middleL.style['opacity'] = 1 - this.touch.percent
      this.$refs.middleL.style['transitionDuration'] = 0
    },
    middleTouchEnd() {
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
      if (this.touch.percent < 0.9) {
          offsetWidth = 0
          opacity = 1
          this.currentShow = 'cd'
        } else {
          opacity = 0
        }
      }
        const time = 300
        this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.lyricList.$el.style['transitionDuration'] = `${time}ms`
        this.$refs.middleL.style['opacity'] = opacity
        this.$refs.middleL.style['transitionDuration'] = `${time}ms`
        
    },
    showPlayList() {
      this.$refs.playList.show()
    },
    ...mapMutations([
      "setFullScreen",
      'setPlaying'
    ]),
    ...mapActions([
      'savePlayHistory'
    ])
  },
  computed: {
    // 图片旋转
    cdCls() {
      return this.playing ? "play" : "play pause";
    },
    // 为小按钮的时候改变样式
    miniIcon() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    // 动态改变播放状态的时候改变操作按钮的样式
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    // 当还没有加载完的时候禁止播放
    disableCls() {
      return this.songReady ? "" : "disable";
    },
    // 获取到当前播放和总时间的比例
    precent() {
      return this.currentTime / this.currentSong.interval ? this.currentTime / this.currentSong.interval: 0;
    },
    ...mapGetters([
      "fullScreen",
      "playing",
      "currentIndex"
    ])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!newSong.id) return
      if (newSong.id === oldSong.id) return;
      
      // 防止歌词跳动
      if (this.currentLyric) {
        console.log(1)
          this.currentLyric.stop()
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
      }
      this.getAudioSrc(this.currentSong.mid);
      // 清理定时器
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getLyric(this.currentSong.mid);
      }, 1000)
    },
    playing() {
      const audio = this.$refs.audio;
      // 判断获取播放地址有没有获取完成
      if (!this.songReady) return;
      this.$nextTick(() => {
        this.playing ? audio.play() : audio.pause();
      });
    },
  },
};
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
              &.nolyric
                    margin-top 50%
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>