<template>
  <div id="app">
    <Header></Header>
    <tab></tab>
    <!-- <keep-alive> -->
    <router-view></router-view>
    <!-- </keep-alive> -->
  </div>
</template>

<script>
import Header from "components/header/header";
import tab from "components/tab/tab";

export default {
  components: {
    Header,
    tab,
  },
};
</script>

<style lang="stylus">
@import 'common/stylus/variable';

#app {
  color: $color-theme;
}
</style>
