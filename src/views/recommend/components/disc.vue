<template>
  <ul class="wrap">
    <li @click="selectItem(item)" v-for="item in discList" class="item" :key="item.content_id">
      <div class="icon">
        <img width="60" height="60" v-lazy="item.cover" />
      </div>
      <div class="text">
        <h2 class="name" v-html="item.title"></h2>
        <p class="desc" v-html="item.username"></p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    discList: {
      type: Array,
    },
  },
  methods: {
    selectItem(item) {
      console.log(item);
      // this.$router.push({
      //   path: `/recommend/${item.dissid}`,
      // });
    },
  },
};
</script>

<style lang="stylus" scoped>
@import "../../../common/stylus/variable.styl"


.item {
  display: flex;
  box-sizing: border-box;
  align-items: center;
  padding: 0 20px 20px 20px;

  .icon {
    flex: 0 0 60px;
    width: 60px;
    padding-right: 20px;
  }

  .text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    font-size: $font-size-medium;

    .name {
      margin-bottom: 10px;
      color: $color-text;
    }

    .desc {
      color: $color-text-d;
    }
  }
}
</style>