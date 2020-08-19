<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="changeQuery"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="item in hotSearch" :key="item.n" @click="addQuery(item.k)">
              {{item.k}}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-show="query" class="search-result">
      <suggest :query="query"></suggest>
    </div>
  </div>
</template>

<script>
import searchBox from 'components/base/search-box/search-box'
import suggest from 'components/suggest/suggest'
export default {
  components: {
    searchBox,
    suggest
  },
  data() {
    return {
      hotSearch: [],
      query: ''
    }
  },
  mounted() {
    this.getHotSearch()
  },
  methods: {
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    async getHotSearch() {
      const {data: {data: res}} = await this.$http.get('/api/search/hot')
      this.hotSearch = res.slice(0, 10)
    },
    changeQuery(query) {
      console.log(query)
      this.query = query
    }
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
      bottom: 0
</style>