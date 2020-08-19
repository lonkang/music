<template>
  <div class="quickSearch">
    <div class="quick">
      <div class="search_query" v-show="query != ''" @click="querySearch">
        <span>详细搜索</span>
        <span class="span_query">{{query}}</span>
      </div>
      <div class="quick_singer_wrap" v-for="item of result" :key="item.id">
        <div v-if="item.itemlist.length > 0">
          <div class="quick_singer_title">{{item.name}}</div>
          <div
            class="quick_singer_item"
            v-for="list of item.itemlist"
            :key="list.id"
            @click="selectItem(item,list)"
          >
            <img :src="list.pic" v-if="list.pic" />
            <p>{{list.name}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      result: [],
    };
  },
  props: {
    query: {
      type: String,
      default: "",
    },
  },
  methods: {
    querySearch() {},
    selectItem(item, list) {
      if (item.name === "歌手") {
        let singer = [];
        singer.push(list);
        singer.forEach((item) => {
          item.singer_mid = list.mid;
          item.singer_pic = list.pic;
          item.singer_name = list.name;
          item.singer_id = list.id;
        });
        this.$router.push({
          path: "/singer/" + singer[0].singer_mid,
        });
        this.setSinger(singer[0]);
      }
      if (item.name === "单曲") {
        console.log(list)
        this.insertSong(list)
        // this.searchOne(list);
      }
      // if (item.name === "专辑") {
      //   let album = [];
      //   album.push(list);
      //   album.forEach((item) => {
      //     item.id = list.id;
      //     item.albumMID = list.mid;
      //     item.cover = list.pic;
      //     item.title = list.name;
      //   });
      //   this.$store.commit("setAlbum", album[0]);
      //   this.$store.commit("setValue", "专辑");
      //   this.$router.push("/album/id=" + album[0].id);
      // }
      // if (item.name == "歌手") {
      //   let singer = [];
      //   singer.push(list);
      //   singer.forEach((item) => {
      //     item.singer_mid = list.mid;
      //     item.singer_pic = list.pic;
      //     item.singer_name = list.name;
      //     item.singer_id = list.id;
      //   });
      //   this.$router.push({
      //     path: "/singer/mid=" + singer[0].singer_mid,
      //   });
      //   this.$store.commit("setSinger", singer[0]);
      // }
      // if (item.name == "单曲") {
      //   this.searchOne(list.name, list.singer);
      // }
      // this.local();
    },
    async getSearch(query) {
      const {
        data: { data: res },
      } = await this.$http.get("/api/search/quick?key=" + query);
      if (res.album.itemlist.length == 0) return;
      this.result = res;
      console.log(res);
    },
    async searchOne() {
      // const { data: res } = await this.$http.get("/api/song/urls?id=" + mid);
    },
    ...mapMutations(["setSinger"]),
    ...mapActions(["insertSong"]),
  },
  watch: {
    query(newVal) {
      this.getSearch(newVal);
    },
  },
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.quickSearch {
  position: fixed;
  margin: 0 20px;
  width: calc(100% - 40px);
  color: $color-text-d;
  z-index: 2;
  background-color: $color-highlight-background;

  .quick {
    .search_query {
      padding: 10px;

      .span_query {
        font-size: 16px;
        padding-left: 10px;
        color: $color-theme;
      }
    }

    .quick_singer_wrap {
      .quick_singer_title {
        font-size: 16px;
        padding: 10px 10px 0;
        color: $color-theme;
      }

      .quick_singer_item {
        display: flex;
        padding: 10px 20px 0;

        img {
          width: 40px;
          height: 40px;
          margin-right: 10px;
        }

        p {
          color: $color-text-d;
          font-size: 14px;
          align-self: center;
          padding-bottom: 5px;
        }
      }
    }
  }
}
</style>