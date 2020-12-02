import Vue from 'vue'
import Router from 'vue-router'
import DailyPage from '@/page/daily.page.vue'
import SummaryPage from '@/page/summary.page.vue'
import DetailPage from '@/page/detail.page.vue'
import AboutPage from '@/page/about.page.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Summary',
      component: SummaryPage
    },
    {
      path: '/daily',
      name: 'Daily',
      component: DailyPage
    },
    {
      path: '/detail',
      name: 'Detail',
      component: DetailPage
    },
    {
      path: '/about',
      name: 'About',
      component: AboutPage
    },
    {
      path: '*',
      name: 'Summary',
      component: SummaryPage
    }


  ]
})
