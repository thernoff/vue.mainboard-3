export default {
  state: {
    languages: [],
    loading: false,
    error: null,
    message: null,
    openMenu: false
  },
  mutations: {
    setLanguages(state, data) {
      state.languages = data;
    },

    setLoading(state, data) {
      state.loading = data;
    },

    setError(state, data) {
      state.error = data;
    },

    setMessage(state, data) {
      state.message = data;
    },

    clearError(state) {
      state.error = null;
    },

    clearMessage(state) {
      state.message = null;
    },

    toggleOpenMenu(state, open = undefined) {
      if (open !== undefined) {
        state.openMenu = !state.openMenu;
      } else {
        state.openMenu = open;
      }
    }
  },
  actions: {
    actionInit({ commit, state }) {
      commit("setActiveWorkspace");
      commit("setWindows", state.activeWorkspace.windows);
      commit("setActiveWindow");
    },

    setLoading({ commit }, data) {
      commit("setLoading", data);
    },

    actionSetError({ commit }, data) {
      commit("setError", data);
    },

    actionSetMessge({ commit }, data) {
      commit("setMessge", data);
    },

    actionClearError({ commit }) {
      commit("clearError");
    },

    actionClearMessage({ commit }) {
      commit("clearMessage");
    },

    actionToggleOpenMenu({ commit }, open) {
      commit("toggleOpenMenu", open);
    }
  },
  getters: {
    loading(state) {
      return state.loading;
    },

    error(state) {
      return state.error;
    },

    message(state) {
      return state.message;
    },

    openMenu(state) {
      return state.openMenu;
    }
  }
};
