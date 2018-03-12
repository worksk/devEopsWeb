const tagsview={
  state: {
    visitedviews: [],
    cachedviews: []
  },
  mutations: {
    ADD_VISITED_VIEWS: (state, view) => { //新增浏览过的页面
      if (state.visitedviews.some(v => v.path === view.path)) return
      state.visitedviews.push({
        name: view.name,
        path: view.path,
        title: view.meta.title
      })
      if (!view.meta.noCache) {
        state.cachedviews.push(view.name)
      }
    },
    DEL_VISITED_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedviews.entries()) {
        if (v.path === view.path) {
          state.visitedviews.splice(i, 1)
          break
        }
      }
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedviews.indexOf(i)
          state.cachedviews.splice(index, 1)
          break
        }
      }
    },
    DEL_OTHERS_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedviews.entries()) {
        if (v.path === view.path) {
          state.visitedviews = state.visitedviews.slice(i, i + 1)
          break
        }
      }
      for (const i of state.cachedviews) {
        if (i === view.name) {
          const index = state.cachedviews.indexOf(i)
          state.cachedviews = state.cachedviews.slice(index, i + 1)
          break
        }
      }
    },
    DEL_ALL_VIEWS: (state, view) => {
      state.visitedviews = []
      state.cachedviews = []
    }
  },
  actions: {
    addVisitedViews({commit},view){
      commit('ADD_VISITED_VIEWS',view)
    },
    delVisitedViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view)
        resolve([...state.visitedviews])
      })
    },
    delOthersViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_OTHERS_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delAllViews({ commit, state }) {
      return new Promise((resolve) => {
        commit('DEL_ALL_VIEWS')
        resolve([...state.visitedviews])
      })
    }
  }
}

export default tagsview
