<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <!-- 进度条 -->
      <div class="progress" ref="progress"></div>
      <!-- 拖拽的按钮 -->
      <div class="progress-btn-wrapper" 
        ref="progressBtn" 
        @touchstart.prevent="progressTouchStart" 
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
        >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16
export default {
  props: {
    precent: {
      type: Number,
      default: 0,
    },
  },
  created() {
    this.touch = {}
  },
  methods: {
    // 监听手指开始移动
    progressTouchStart(e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    // 监听手指在移动的过程中
    progressTouchMove(e) {
      if(!this.touch.initiated) return
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    // 监听手指移动完成
    progressTouchEnd() {
      this.touch.initiated = false
      this._triggerPercent()
    },
    // 监听用户的点击
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      this._triggerPercent()
    },
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      // 获取到比例
      const precent = this.$refs.progress.clientWidth / barWidth
      this.$emit('precentChange', precent)
    },
    // 设置进度条和按钮的位置
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style['transform'] = `translate3d(${offsetWidth}px, 0, 0)`
    }
  },
  watch: {
    // 监听比例的变化
    precent(newVal) {
      if(newVal >= 0 && !this.touch.initiated) {
        // 获取到进度条的总长度
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        // 获取到偏移的比例
        const offsetWidth = barWidth * newVal
        this._offset(offsetWidth)
      }
    }
  }
};
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>