<template>
  <div class="banner">
    <swiper ref="mySwiper" :options="swiperOptions" v-if="showBanner">
      <swiper-slide v-for="item of bannerList" :key="item.id" class="banner-item">
        <img :src="item.picUrl" :load="imgLoad" />
      </swiper-slide>1
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
// import "swiper/swiper-bundle.css";
import "swiper/css/swiper.css";

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    bannerList: {
      type: Array,
    },
  },
  data() {
    return {
      flag: false,
      swiperOptions: {
        pagination: {
          el: ".swiper-pagination",
        },
        loop: true,
        autoplay: {
          disableOnInteraction: false,
          delay: 2000,
        },
      },
    };
  },
  methods: {
    imgLoad() {
      if (!this.flag) {
        this.$emit("imgLoad");
        this.flag = true;
      }
    },
  },
  /* 解决轮播图从第一张开始*/
  computed: {
    showBanner() {
      return this.bannerList.length;
    },
  },
};
</script>

<style lang="stylus" scoped>
.banner >>> .swiper-pagination-bullet-active {
  width: 16px;
  border-radius: 8px;
  background: #fff;
}

.banner {
  width: 100%;
  height: 0;
  padding-bottom: 39%;
}

.banner-item {
  width: 100%;
  height: 0;
  padding-bottom: 39%;

  img {
    width: 100%;
  }
}
</style>