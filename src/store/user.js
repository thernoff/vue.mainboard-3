import axios from "axios";

export default {
  state: {
    user: {
      firstname: "Guest",
      lastname: "Guest",
      uname: "guest",
      email: "",
      phone: "",
      gid: 7,
      idActiveInterface: 2,
      actions: []
    }
  },
  mutations: {
    setUser(state, data) {
      //state.user = data;
      state.user = Object.assign({}, data);
    },

    saveUser(state, user) {
      if (user.email) {
        state.user.email = user.email;
      }
    }
  },
  actions: {
    actionSaveUser({ commit }, user) {
      axios({
        method: "post",
        headers: { "Content-Type": "application/form-data" },
        url: "/extusers/fpage/saveuser/",
        data: user
      })
        .then(response => {
          //console.log("response", response.data.user);
          //commit("setUser", response.data.user);
          if (process.env.NODE_ENV !== "development") {
            commit("saveUser", user);
            location.reload();
          }
          return response;
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  },
  getters: {
    user(state) {
      return state.user;
    }
  }
};
