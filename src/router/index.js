import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
// import Userlist from '../components/users/Userlist.vue'
// import RightList from '../components/rights/RightList.vue'
// import Roles from '../components/rights/Roles.vue'
// import Goods from '../components/goods/goods.vue'
// import Addgood from '../components/goods/Addgood.vue'
// import Categories from '../components/goods/Categories.vue'
// import Params from '../components/goods/Params.vue'
// import Orders from '../components/orders/Orders.vue'
// import Report from '@/components/report/Report.vue'

const Login = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Login.vue')
// import Login from './components/Login.vue'
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Home.vue')
// import Home from './components/Home.vue'
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Welcome.vue')
// import Welcome from './components/Welcome.vue'
const Userlist = () => import(/* webpackChunkName:"user" */ '../components/users/Userlist.vue')
// import Users from './components/user/Users.vue'
const RightList = () => import(/* webpackChunkName:"power" */ '../components/rights/RightList.vue')
// import Rights from './components/power/Rights.vue'
const Roles = () => import(/* webpackChunkName:"power" */ '../components/rights/Roles.vue')
// import Roles from './components/power/Roles.vue'
const Categories = () => import(/* webpackChunkName:"goods" */ '../components/goods/Categories.vue')
// import Cate from './components/goods/Cate.vue'
const Params = () => import(/* webpackChunkName:"goods" */ '../components/goods/Params.vue')
// import Params from './components/goods/Params.vue'
const Goods = () => import(/* webpackChunkName:"goods" */ '../components/goods/goods.vue')
// import GoodList from './components/goods/List.vue'
const Addgood = () => import(/* webpackChunkName:"goods" */ '../components/goods/Addgood.vue')
// import GoodAdd from './components/goods/Add.vue'
const Orders = () => import(/* webpackChunkName:"order" */ '../components/orders/Orders.vue')
// import Order from './components/order/Order.vue'
const Report = () => import(/* webpackChunkName:"report" */ '@/components/report/Report.vue')
// import Report from './components/report/Report.vue'

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
      { path: '/params', component: Params },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Report }
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
