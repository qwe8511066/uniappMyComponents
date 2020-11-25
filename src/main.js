import Vue from 'vue'
import App from './App'
import uView from 'uview-ui'
import fly from "@/http/config";


Vue.config.productionTip = false
Vue.use(uView);
import { router, RouterMount } from './permission.js'  //路径换成自己的
Vue.use(router)

App.mpType = 'app'


const app = new Vue({
    ...App
})


Vue.prototype.$http = fly;

app.$mount()
