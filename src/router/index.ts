import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})


router.afterEach(() => {
  document.body.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  })
})

router.beforeEach((to, from, next) => {
  // const commonStore = useCommonStore();

  // const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  // const isRefresh = navigationEntry?.type === 'reload'

  // if (to.fullPath !== '/' || !to.path.includes('-check')) {
  //   if (!commonStore.validPage && !isRefresh) {
  //     alert('잘못된 접근입니다.')
  //     return router.replace('/')
  //   } else {
  //     commonStore.validPage = true
  //     next(true)
  //   }
  // } else {
    next(true)
  // }
})

export default router
