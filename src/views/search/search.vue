<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box :hotSearch="hotSearch" @clear="clear" ref="searchBox" @query="changeQuery"></search-box>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <scroll :data="shortcut" ref="scroll" class="shortcut">
        <div>
          <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="item in hotSearch" :key="item.n" @click="addQuery(item.k)">
              {{item.k}}
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list @select="addQuery" @delete="deleteSearchHistory" :searches="searchHistory"></search-list>
        </div>
        </div>
      </scroll>
    </div>
    <div :data="result" @beforeScroll="listScroll" v-show="query" class="search-result">
      <suggest @getResult="getResult" @select="select" :query="query"></suggest>
    </div>
    <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
  </div>
</template>

<script>
import searchBox from 'components/base/search-box/search-box'
import suggest from 'components/suggest/suggest'
import scroll from 'components/base/scroll/scroll'
import searchList from 'components/base/search-list/search-list'
import confirm from 'components/base/confirm/confirm'
import {playListMixin} from 'common/js/mixin'
import {mapActions, mapGetters} from 'vuex'
export default {
  mixins: [playListMixin],
  components: {
    searchBox,
    suggest,
    scroll,
    searchList,
    confirm
  },
  data() {
    return {
      hotSearch: [],
      query: '',
      result: []
    }
  },
  mounted() {
    this.getHotSearch()
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    async getHotSearch() {
      const {data: {data: res}} = await this.$http.get('/api/search/hot')
      this.hotSearch = res.slice(0, 10)
    },
    changeQuery(query) {
      this.query = query
    },
    listScroll() {
      this.$refs.searchBox.blur()
    },
    getResult(list) {
      console.log(list)
      this.result = [list]
    },
    select() {
      this.saveSearchHistory(this.query)
    },
    clear(){
      this.handlePlayList(this.playList)
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ]),
  },
  watch: {
    query(newQuery) {
      if(!newQuery) {
        setTimeout(() => {
          this.$refs.scroll.refresh()
        })
      }
    }
  },
  computed: {
    shortcut() {
      return this.hotSearch.concat(this.searchHistory)
    },
    ...mapGetters(['searchHistory'], 'playList')
  }
};
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            justify-content space-between
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      height calc(100vh - 178px)
      bottom: 0
</style>