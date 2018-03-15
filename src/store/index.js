import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import permission from './modules/permission'
import app from './modules/app'
import tagsview from './modules/tagsview'
import getters from './getters'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    app,
    // errorLog,
    permission,
    tagsview,
    user
  },
  getters
})

export default store
