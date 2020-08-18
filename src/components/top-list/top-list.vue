<template>
  <transition name="slide">
    <musicList :rank="rank" :title="title" :bgImg="bgImg" :songs="songs"></musicList>
  </transition>
</template>

<script>
import musicList from "components/music-list/music-list";
import { mapGetters } from "vuex";
export default {
  components: {
    musicList,
  },
  data() {
    return {
      songs: [],
      rank: true
    };
  },
  mounted() {
    this.getSongs();
  },
  methods: {
    // 获取歌曲
    async getSongs() {
      if (!this.topList.topId) {
        this.$router.back();
        return;
      }
      this.songs = [];
      const { data: res } = await this.$http.get(
        "/api/top?id=" + this.topList.topId
      );
      // 成功
      if (res.result == 100) {
        this.songs = res.data.list;
      }
    },
  },
  computed: {
    title() {
      return this.topList.label;
    },
    bgImg() {
      return this.topList.picUrl;
    },
    ...mapGetters(["topList"]),
  },
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'
.slide-enter-active, .slide-leave-active
    transition: all 0.3s

.slide-enter, .slide-leave-to
  transform: translate3d(100%, 0, 0)
</style>