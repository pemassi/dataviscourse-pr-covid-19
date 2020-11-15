import Vue from 'vue'
import Router from 'vue-router'
import MapPage from '@/page/map.page.vue'
import StaticPage from '@/page/static.page.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Map',
      component: MapPage
    },
    {
      path: '/',
      name: 'Static',
      component: StaticPage
    },


  ]
})
