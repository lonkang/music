<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from "components/header/header";
import Tab from "components/tab/tab";
import Player from 'views/player/player'
export default {
  components: {
    MHeader,
    Tab,
    Player
  },
};
</script>

<style lang="stylus">
@import 'common/stylus/variable';

#app 
  color: $color-theme;
</style>
