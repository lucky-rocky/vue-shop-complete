import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})
// 路由导航
router.beforeEach((to, form, next) => {
  if (to.path === '/login') return next()
  if (!localStorage.getItem('token')) {
    alert('请先登录')
    return next('/login')
  }
  next()
})
export default router
