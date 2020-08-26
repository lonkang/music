<template>
  <div class="singer" ref="singer">
    <singerCaterogy :categoryList="categoryList" @categoryClick="getSingerList"></singerCaterogy>
    <scroll :data="singerList" class="singer-scroll" ref="scroll">
      <singer-lists :singerList="singerList" @selectSinger="selectSinger"></singer-lists>
    </scroll>
    <div class="loading-container" v-if="!singerList.length">
      <loading></loading>
    </div>
  </div>
</template>

<script>
import singerCaterogy from "./components/singerCategory";
import singerLists from "./components/singerList";

import {playListMixin} from 'common/js/mixin'
import loading from "components/base/loading/loading";
import scroll from "components/base/scroll/scroll";
export default {
  mixins: [playListMixin],
  components: {
    singerCaterogy,
    singerLists,
    scroll,
    loading,
  },
  data() {
    return {
      singerList: [],
      categoryList: {},
    };
  },
  created() {
    this.getCategoryList();
    this.getSingerList();
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    // 选择歌手
    selectSinger(singer) {
      this.$store.commit('setSinger', singer)
      this.$router.push({
        path: `/singer/${singer.singer_mid}`
      })
    },
    // 获取分类数据
    async getCategoryList() {
      const {
        data: { data: res },
      } = await this.$http.get("/api/singer/category");
      this.categoryList = {
        sex: res.sex,
        area: res.area,
        genre: res.genre,
      };
    },
    // 获取歌手数据
    async getSingerList(params) {
      const {
        data: { data: res },
      } = await this.$http.get("/api/singer/list", { params });
      this.singerList = res.list;
    },
  },
};
</script>

<style scoped lang="stylus"> 
.singer
  position: fixed
  width: 100%
  top: 88px
  bottom: 0
  .singer-scroll
    height calc(100% - 144px) // 减去上面category高度
    overflow: hidden
  .loading-container
    position absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>