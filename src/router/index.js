import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../views/login/Login.vue')
const Home = () => import('../views/home/Home.vue')
const Welcome = () => import('../views/welcome/Welcome.vue')
const User = () => import('../views/home/user/User.vue')
const Roles = () => import('../views/home/roles/Roles.vue')
const Rights = () => import('../views/home/rights/Rights.vue')
const Cate = () => import('../views/home/goods/Cate.vue')
const Params = () => import('../views/home/goods/Params.vue')
const Goods = () => import('../views/home/goods/Goods.vue')
const addGoods = () => import('../views/home/goods/addGoods.vue')
const Order = () => import('../views/home/order/Order.vue')

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome,
    },{
      path: '/users',
      component: User
    },{
      path: '/roles',
      component: Roles
    },{
      path: '/rights',
      component: Rights
    },{
      path: '/categories',
      component: Cate
    },{
      path: '/params',
      component: Params
    },{
      path: '/goods',
      component: Goods
    },{
      path: '/goods/add',
      component: addGoods
    },{
      path: '/orders',
      component: Order
    }]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')

  next()
  // to 将访问哪一个路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数,表示放行
  //   next() 放行 next('/login') 强制跳转


})

export default router