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
      state.user = Object.assign({}, state.user, data);
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
          if (response.data.status) {
            //commit("setUser", response.data.user);
            commit("setMessage", response.data.message);
            setTimeout(() => {
              location.reload();
            }, 1000);
          } else {
            commit("setError", response.data.message);
          }

          if (process.env.NODE_ENV !== "development") {
            commit("setUser", user);
            //location.reload();
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
