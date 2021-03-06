import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)



const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: () => import('views/recommend/recommend.vue')
  },
  {
    path: '/songList/:id',
    name: 'songList',
    component: () => import('components/song-detail/song-detail')
  },
  {
    path: '/singer',
    name: 'singer',
    component: () => import('views/singer/singer.vue')
  },
  {
    path: '/rank',
    name: 'rank',
    component: () => import('views/rank/rank.vue')
  },
  {
    path: '/topList/:id',
    name: 'topList',
    component: () => import('components/top-list/top-list')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('views/search/search.vue')
  }
  ,
  {
    path: '/singer/:mid',
    component: () => import('components/singer-detail/singer-detail.vue')
  },
  {
    path: '/user',
    component: () => import('components/user-center/user-center')
  }
]

const router = new VueRouter({
  routes,
  mode: 'history',
  base: process.env.BASE_URL
})

export default router
