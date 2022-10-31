import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/gloable.css'
import request from './utils/request'
import store from './store/index'
import buttonCheck from '@/utils/buttonCheck'

Vue.config.productionTip = false
Vue.use(ElementUI,{ size: 'big'});
Vue.prototype.axios = request  
Vue.prototype.ButtonIsAvailable = buttonCheck.ButtonIsAvailable

new Vue({
  router,
  store,
  beforeCreate(){
		Vue.prototype.$bus = this	
	},
  render: h => h(App)
}).$mount('#app')



