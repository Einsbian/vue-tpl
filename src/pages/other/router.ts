import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router) // 全局注册

export default new Router({
  routes: [
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "oAbout" */ './views/About.vue'),
    },
    {
      path: '*',
      name: 'home',
      component: () =>
        import(/* webpackChunkName: "oHome" */ './views/Home.vue'),
    },
  ],
})
