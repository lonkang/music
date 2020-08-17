import {mapGetters} from 'vuex'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playList)
  },
  activated() {
    this.handlePlaylist(this.playList)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}