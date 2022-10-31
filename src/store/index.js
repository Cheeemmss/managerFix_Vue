import  Vue  from 'vue'
import  Vuex  from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
  state () {
    return {
      currentPathName: ''
    }
  },
  mutations: {
    setPath(state){
       state.currentPathName  = localStorage.getItem('currentPathName')   //本地存储的路径值是路由守卫中塞进去的
    }
  }
})

export default store