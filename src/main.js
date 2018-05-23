// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/*内部模块*/
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import '@/styles/index.scss'
import './permission'

/*外部引用模块*/
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueI18n from 'vue-i18n'
import VueClipboard from 'vue-clipboard2'
import echarts from 'echarts'
import wordcloud from 'echarts-wordcloud'
//awesome
import 'vue-awesome/icons/flag'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'


Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueI18n)
Vue.use(VueClipboard)
Vue.use(echarts)
Vue.use(wordcloud)
Vue.prototype.$echarts = echarts 
Vue.component('icon', Icon)


/*i18来源*/
const i18n = new VueI18n({
  locale: 'zh-CN',
  message: {
    // 'zh-CN': require('@/lang/zh'),
    // 'en-US': require('@/lang/en')
  }
})


/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    // i18n,
    components: { App },
    template: '<App/>'
})
