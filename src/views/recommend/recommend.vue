<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-scroll">
      <div>
        <slider :bannerList="bannerList" @imgLoad="imgLoad"></slider>
        <h1 class="list-title">热门歌单推荐</h1>
        <disc :discList="discList"></disc>
      </div>
      <div class="loading-container" v-if="!discList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import scroll from "components/base/scroll/scroll";
import loading from "components/base/loading/loading";

import {playListMixin} from 'common/js/mixin'
import slider from "./components/slider";
import disc from "./components/disc";
export default {
  mixins: [playListMixin],
  components: {
    slider,
    scroll,
    disc,
    loading,
  },
  data() {
    return {
      bannerList: [],
      discList: [],
    };
  },
  created() {
    this.getBanner();
    this.getDiscList();
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    imgLoad() {
      this.$refs.scroll.refresh();
    },
    async getBanner() {
      const {
        data: { data: res },
      } = await this.$http.get("/api/recommend/banner");
      this.bannerList = res;
    },
    async getDiscList() {
      const {
        data: { data: res },
      } = await this.$http.get("/api/recommend/playlist/u");
      this.discList = res.list;
    },
  },
};
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-scroll {
    height: 100%;
    overflow: hidden;

    .list-title {
      height: 65px;
      line-height: 65px;
      text-align: center;
      font-size: $font-size-medium;
      color: $color-theme;
    }
  }
}
</style>