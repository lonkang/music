<template>
  <div class="rank" ref="rank">
    <scroll :data="rankList" ref="scroll" class="toplist">
      <ul>
        <li class="item" @click="selectItem(item)" v-for="item in rankList" :key="item.picUrl">
          <div class="icon">
            <img :src="item.picUrl" width="100" height="100" alt="">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.song" :key="index">
              <span>{{index + 1}}.</span>
              <span>{{song.title}} - {{song.singerName}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-if="rankList.length<0">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import scroll from 'components/base/scroll/scroll'
import loading from 'components/base/loading/loading'
import {playListMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
export default {
  mixins: [playListMixin],
  components: {
    loading,
    scroll
  },
  data() {
    return {
      rankList: []
    }
  },
  mounted() {
    this.getRank()
  },
  methods: {
    handlePlayList(PlayList) {
      const bottom = PlayList.length > 0 ? '60px': 0
      this.$refs.rank.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    // 获取数据
    async getRank() {
      const res = await this.$http.get("/api/top/category", {
        params: { showDetail: 1 },
      });
      // 处理数据
      this.rankList = res.data.data.reduce(
        (total, item) => total.concat(item.list),
        []
      );
    },
    selectItem(item) {
      this.setTopList(item)
      this.$router.push({
        path: `/topList/id=${item.topId}`
      })
    },
    ...mapMutations([
      'setTopList'
    ])
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>