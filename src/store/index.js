import Vue from "vue";
import Vuex from "vuex";
import desktop from "@/store/desktop.js";
import interfaces from "@/store/interfaces.js";
import shared from "@/store/shared.js";
import startmenu from "@/store/startmenu.js";
import window from "@/store/window.js";
import workspaces from "@/store/workspaces.js";
import user from "@/store/user.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    shared,
    startmenu,
    window,
    workspaces,
    desktop,
    user,
    interfaces
  },
  strict: process.env.NODE_ENV !== "production"
});
