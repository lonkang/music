<template>
  <div class="singer-list">
    <ul>
      <li v-for="item in singerList" :key="item.singer_id" @click="selectSinger(item)">
        <img v-lazy="item.singer_pic" alt />
        <div class="info">
          <p class="name">{{item.singer_name}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    singerList: {
      type: Array,
      required: true,
    }
  },
  methods: {
    selectSinger(item) {
      this.$emit('selectSinger', item)
    }
  }
};
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
    .singer-list
        color $color-text-d
        padding 0 20px
        li 
            width:100%;
            display flex
            padding-bottom 15px
            img 
                width:60px
                height:60px
                border-radius 50% 
                margin-right 20px
            .info
                display flex
                width calc(100% - 80px)
                flex-direction column
                justify-content center
                .name
                    display flex
                    justify-content space-between
                    width calc(100% - 20px)
                    margin-bottom 10px
</style>
