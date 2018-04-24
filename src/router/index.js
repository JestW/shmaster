import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login/Login'
import Home from '@/components/Home/Home'
import Product from '@/components/Product/Product'
import Admin from '@/components/Login/Admin'
import OperateSheet from '@/components/Operate/OperateSheet'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      // name: 'HelloWorld',
      // component: HelloWorld
      redirect:'/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    },
    {
      path: '/product',
      name: 'Product',
      component: Product
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/operate-sheet',
      name: 'OperateSheet',
      component: OperateSheet
    }
  ]
})

