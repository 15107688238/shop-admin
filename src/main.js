import Vue from 'vue'
import App from './App.vue'
import router from './router'

import 'assets/css/base.css'
import './assets/fonts/iconfont.css'
import './plugins/element'
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable);
// 将富文本编辑器注册为全局组件
Vue.use(VueQuillEditor)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
