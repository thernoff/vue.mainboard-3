import axios from "axios";
export default {
  state: {
    visible: false,
    categories: []
  },
  mutations: {
    toggleVisibleStartMenu(state) {
      state.visible = !state.visible;
    },

    setStartmenuItems(state, categories) {
      state.categories = categories;
    }
  },
  actions: {
    actionToggleVisibleStartMenu({ commit }) {
      commit("toggleVisibleStartMenu");
    },

    actionSaveCategories({ commit }, categories) {
      console.log("actionSaveCategories", categories);
      //commit("setStartmenuItems", categories);
      axios({
        method: "post",
        headers: { "Content-Type": "application/form-data" },
        url: "/extusers/fpage/savedashboard/",
        data: { categories: categories }
      })
        .then(response => {
          console.log("response", response);
          if (response.data.status) {
            commit("setStartmenuItems", response.data.dashboard);
            commit("setMessage", response.data.message);
          } else {
            commit("setError", response.data.message);
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  },
  getters: {
    visibleStartmenu(state) {
      return state.visible;
    },

    getItems(state) {
      return state.categories;
    },

    categories(state) {
      return state.categories;
    },

    getItemStartMenu(state) {
      return (indexItem, indexElement) =>
        state.categories[indexItem].elements[indexElement];
    },

    itemStartmenuById(state) {
      return id => {
        let itemStartmenu = null;
        for (let i = 0; i < state.categories.length; i++) {
          itemStartmenu = state.categories[i].elements.find(
            element => element.id == id
          );

          if (itemStartmenu) {
            return itemStartmenu;
          }
        }
      };
    }
  }
};
