<template>
  <div class="search-list" v-show="searches.length">
    <ul>
      <li class="search-item" @click="selectItem(item)" v-for="(item, index) in searches" :key="index">
        <span>{{item}}</span>
        <span class="icon" @click.stop="deleteItem(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      defaule: function(){
        return []
      },
      require: true
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    deleteItem(item) {
      this.$emit('delete', item)
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      justify-content space-between
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>