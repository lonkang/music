import {mapGetters, mapMutations, mapActions} from 'vuex'
import { playMode } from "common/js/config.js";
import { shuffle } from "common/js/util.js";

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlayList(this.playList)
  },
  activated() {
    this.handlePlayList(this.playList)
  },
  watch: {
    playlist(newVal) {
      this.handlePlayList(newVal)
    }
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence
        ? "icon-sequence"
        : this.mode === playMode.loop
        ? "icon-loop"
        : "icon-random";
    },
    ...mapGetters([
      'sequenceList',
      'playList',
      'currentSong',
      'mode',
    ])
  },
  methods: {
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.setPlayList(list);
      this.resetCurrentIndex(list)
    },
    // 修改播放的index
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    ...mapMutations([
      'setSequenceList',
      'setPlayList',
      'setCurrentIndex',
      'setMode'
    ])
  },
}
export const searchMixin =  {
  data() {
    return {
      query: ''
    }
  },
  methods: {
    changeQuery(query) {
      this.query = query
      console.log(query)
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
    ])
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  }
}