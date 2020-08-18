<template>
  <transition name="slide">
    <musicList :title="title" :bgImg="bgImg" :songs="songs"></musicList>
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
    };
  },
  mounted() {
    this.getSongListDetail()
  },
  methods: {
    async getSongListDetail() {
      // console.log(this.disc.content_id)
      if (!this.disc.content_id) {
        this.$router.back();
        return;
      }
      this.songs = [];
      const {
        data: { data: res },
      } = await this.$http.get("/api/songlist?id=" + this.disc.content_id);
      this.songs = res.songlist
      if(this.songs == undefined) { // 搜索结果为空
          this.songs = []
          return
      }
      this.songs.forEach( item => {
          item.mid = item.songmid
          item.name = item.songname
          item.album = {
              id: item.albumid,
              mid: item.albummid,
              name: item.albumname
          }
      })
    },
  },
  computed: {
    title() {
      return this.disc.title;
    },
    bgImg() {
      return this.disc.cover;
    },
    ...mapGetters(["disc"]),
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