import Vue from 'vue'
import Router from 'vue-router'
import DailyPage from '@/page/daily.page.vue'
import SummaryPage from '@/page/summary.page.vue'


Vue.use(Router)

export default new Router({
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


  ]
})
