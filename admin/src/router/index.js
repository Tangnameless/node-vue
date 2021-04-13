import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Login from '../views/Login.vue'
import CategoryEdit from '../views/CategoryEdit.vue'
import CategoryList from '../views/CategoryList.vue'
import ItemEdit from '../views/ItemEdit.vue'
import ItemList from '../views/ItemList.vue'
import HeroEdit from '../views/HeroEdit.vue'
import HeroList from '../views/HeroList.vue'
import AdEdit from '../views/AdEdit.vue'
import AdList from '../views/AdList.vue'
import AdminUserEdit from '../views/AdminUserEdit.vue'
import AdminUserList from '../views/AdminUserList.vue'

Vue.use(VueRouter)

const routes = [
  {path:'/login', name:"login", component: Login, meta:{isPublic: true}},

  {
    path: '/',
    name: 'main',
    component: Main,
    children:[
      {path: '/categories/create', component: CategoryEdit},
      {path: '/categories/edit/:id', component: CategoryEdit, props:true},
      {path: '/categories/list', component: CategoryList},
      
      {path: '/items/create', component: ItemEdit},
      {path: '/items/edit/:id', component: ItemEdit, props:true},
      {path: '/items/list', component: ItemList},

      {path: '/heros/create', component: HeroEdit},
      {path: '/heros/edit/:id', component: HeroEdit, props:true},
      {path: '/heros/list', component: HeroList},

      {path: '/ads/create', component: AdEdit},
      {path: '/ads/edit/:id', component: AdEdit, props:true},
      {path: '/ads/list', component: AdList},

      {path: '/admin_users/create', component: AdminUserEdit},
      {path: '/admin_users/edit/:id', component: AdminUserEdit, props:true},
      {path: '/admin_users/list', component: AdminUserList},
    ]
  },
  
]

const router = new VueRouter({
  routes
})

// 全局前置守卫
// 每个守卫方法接收三个参数：
// to: Route: 即将要进入的目标 路由对象
// from: Route: 当前导航正要离开的路由
// next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
//  next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed (确认的)。
router.beforeEach((to, from, next) =>{
  if(!to.meta.isPublic && !localStorage.token){
    console.log('试图访问一个非公开的页面，请先登录！')
    return next('/login');
  }
  next()
})


export default router
