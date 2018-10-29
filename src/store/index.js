import Vue from "vue";
import Vuex from "vuex";
import shared from "@/store/shared";
import startmenu from "@/store/startmenu";
import windows from "@/store/windows";
import workspaces from "@/store/workspaces";
import desktop from "@/store/desktop";
import user from "@/store/user";
import interfaces from "./interfaces";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    shared,
    startmenu,
    windows,
    workspaces,
    desktop,
    user,
    interfaces
  }
});
