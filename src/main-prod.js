import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/js/axios.config.js'
import './assets/fonts/iconfont.css'
import './assets/js/format'
import ZkTable from 'vue-table-with-tree-grid'

// 文本编辑器 quill
// 引入quill-editor编辑器
import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

Vue.component('tree-table', ZkTable)
Vue.config.productionTip = false

new Vue({
  router,
  // h => createElement( App )
  render: h => h(App)
}).$mount('#app')
