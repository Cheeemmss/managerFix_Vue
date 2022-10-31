import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
  },
  {
    path: '*',
    name: 'NotFound',
    component: () =>import('../views/404.vue')
  }
]



const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


//根据用户所拥有的菜单(路由)来动态设置该用户所拥有的路由
export const setRoute = ()=> {
  if(localStorage.getItem('user')){ //防止登录页刷新无user
    let Routes =  JSON.parse(localStorage.getItem('user')).menuList.map( m => m.childrenMenu)
    let managerRoute = null
    if(Routes){
      managerRoute =  {path: '/',name: 'Manage',redirect: '/login',component: () => import('../views/Manage.vue'),children:[]}
      Routes.forEach( element => {
             element.forEach( e =>{
                  let childrenRoute = {path: e.path.replace('/',''),name: e.name,component: () => import('../views/'+ e.pagePath +'.vue')}
                  managerRoute.children.push(childrenRoute)
               }             
          )
      });
      // 还要添加不在侧边栏中的用户信息的路由
      managerRoute.children.push({path: '/userInfo',name: '用户信息',component: () => import('../views/UserInfo.vue')})
    }
    router.addRoute(managerRoute)
  }
}

// 刷新页面过后 路由就会重置 需要重新setRoute
// let userRouters = router.getRoutes()
// userRouters = userRouters.map(e => e.name)
// 因为登录的时候会setRoute一次 还没有刷新这里又setRoute一次 就会重复设置路由(但是不影响运行) 因此如果有manage路由了就不用设了
// if(!userRouters.includes('Manage')){
   setRoute()
// }


//路由守卫
router.beforeEach(
  (to,from,next) => {
    localStorage.setItem('currentPathName',to.name)  //向本地存储中放入要去的页面的路由地址
    store.commit('setPath')    //提交更新地址(执行store中的setPath方法)
    next() 
  }
)

export default router
