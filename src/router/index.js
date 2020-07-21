import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Userlist from '../components/users/Userlist.vue'
import RightList from '../components/rights/RightList.vue'
import Roles from '../components/rights/Roles.vue'
import Goods from '../components/goods/goods.vue'
import Addgood from '../components/goods/Addgood.vue'
import Categories from '../components/goods/Categories.vue'
import Params from '../components/goods/Params.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: 'welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Userlist },
      { path: '/rights', component: RightList },
      { path: '/roles', component: Roles },
      { path: '/goods', component: Goods },
      { path: '/addgood', component: Addgood },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 路由导航
router.beforeEach((to, form, next) => {
  if (to.path === '/login') return next()
  if (!localStorage.getItem('token')) {
    Vue.prototype.$message.error('未登录,请先登录')
    return next('/login')
  }
  next()
})
// 解决重复点击hash报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
