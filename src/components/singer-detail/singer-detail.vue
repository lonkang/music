<template>
  <transition name="slide">
    <musicList :title="title" :bgImg="bgImg" :songs="hotSongs"></musicList>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import musicList from 'components/music-list/music-list'
export default {
  data() {
    return{
      hotSongs: []
    }
  },
  computed: {
    ...mapGetters(["singer"]),
    title() {
      return this.singer.singer_name
    },
    bgImg() {
      return this.singer.singer_pic
    }
  },
  components: {
    musicList
  },
  mounted() {
    this.getHotSong();
  },
  watch: {
    singer() {
      this.getHotSong()
    }
  },
  methods: {
    async getHotSong() {
      if (!this.singer.singer_id) {
        this.$router.push('/singer')
        return
      }
      this.hotSongs = [];
      const {
        data: { data: res },
      } = await this.$http.get(
        "/api/singer/songs?num=50&singermid=" + this.singer.singer_mid
      );
      this.hotSongs = res.list;
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.singer-detail {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-background;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>>
