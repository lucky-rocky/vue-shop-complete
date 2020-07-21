import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/js/axios.config.js'
import './assets/fonts/iconfont.css'
import './assets/js/format'
import ZkTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', ZkTable)
Vue.config.productionTip = false

new Vue({
  router,
  // h => createElement( App )
  render: h => h(App)
}).$mount('#app')
