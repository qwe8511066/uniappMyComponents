import Vue from 'vue'
import App from './App'
import uView from 'uview-ui'
import fly from "@/http/config";
Vue.config.productionTip = false

App.mpType = 'app'

Vue.use(uView);

const app = new Vue({
    ...App
})


Vue.prototype.$http = fly;

app.$mount()
