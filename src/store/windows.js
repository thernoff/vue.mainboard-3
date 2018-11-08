function getRandomId() {
  var id = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++) {
    id += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  id += Math.floor(Date.now() / 1000);
  return id;
}

export default {
  state: {
    maxZIndex: 0,
    topPrevWindow: 5,
    leftPrevWindow: 5,
    stepShift: 10,
    indexActiveWindow: null,
    idActiveWindow: "",
    activeWindow: null,
    windows: [] // хранится ссылка на массив activeWorkspace.windows
  },
  mutations: {
    setWindows(state, windows) {
      state.windows = windows;
    },

    createNewWindow(state, { object, widthWorkspace, heightWorkspace }) {
      console.log("createNewWindow object", object);
      const title = object.title || object.label;
      const top = state.topPrevWindow > 0 ? state.topPrevWindow : 5;
      const left = state.leftPrevWindow > 0 ? state.leftPrevWindow : 5;
      const newWindow = {
        id: getRandomId(),
        title,
        top: (100 * top) / heightWorkspace,
        left: (100 * left) / widthWorkspace,
        width: 40,
        height: 45,
        zIndex: state.windows.length + 2,
        minimize: false,
        fullscreen: false,
        closed: false,
        active: true,
        classesCss: [],
        type: "window",
        object: {
          id: object.id,
          type: object.type
        }
      };

      switch (object.type) {
        case "folder":
          break;
        default:
          newWindow.link = object.link;
          newWindow.apiLink = object.apiLink;
          newWindow.currentLink = object.link;
          newWindow.itemId = object.objectId
          break;
      }

      const length = state.windows.push(newWindow);
      console.log("newWindow", newWindow);
      state.activeWindow = state.windows[length - 1];
      state.indexActiveWindow = length - 1;

      state.topPrevWindow += state.stepShift;
      state.leftPrevWindow += state.stepShift;
    },

    updateWindow(state, options) {
      console.log("updateWindow options", options);
      //let window = state.windows[options.index];
      const id = options.id;
      let window = state.windows.find(window => {
        return window.id === id;
      });
      //state.windows[options.index] = Object.assign(window, options);
      window = Object.assign(window, options);
    },

    updateWindowCoords(state, { options, widthWorkspace, heightWorkspace }) {
      console.log("updateWindowCoords options", options);
      //let window = state.windows[options.index];
      const id = options.id;
      let window = state.windows.find(window => {
        return window.id === id;
      });
      if (!window.fullscreen) {
        window.top = (+options.top / heightWorkspace) * 100;
        window.left = (+options.left / widthWorkspace) * 100;
        //state.topPrevWindow -= state.stepShift
        //state.leftPrevWindow -= state.stepShift
      }
    },

    updateWindowSize(state, options) {
      console.log("updateWindowSize options", options);
      //let window = state.windows[options.index];
      const id = options.id;
      let window = state.windows.find(window => {
        return window.id === id;
      });
      if (!window.fullscreen) {
        console.log("updateWindowSize window.fullscreen", window.fullscreen);
        window.width = +options.width;
        window.height = +options.height;
      }
    },

    updateWindowTitle(state, options) {
      //let window = state.windows[options.index];
      const id = options.id;
      let window = state.windows.find(window => {
        return window.id === id;
      });
      window.title = options.title;
    },

    /* updateWindowApiLink(state, options) {
      let window = state.windows[options.index];
      window.apiLink = options.apiLink;
    }, */

    toggleClassWindow(state, { id, classCss }) {
      const window = state.windows.find(window => {
        return window.id === id;
      });
      let classesCss = window.classesCss;
      let i = classesCss.indexOf(classCss);
      if (i > -1) {
        classesCss.splice(i, 1);
      } else {
        classesCss.push(classCss);
      }
    },

    closeWindow(state, id) {
      state.activeWindow = null;
      state.indexActiveWindow = null;
      state.idActiveWindow = "";

      for (let i = 0; i < state.windows.length; i++) {
        if (id === state.windows[i].id) {
          state.windows.splice(i, 1);
        }
      }

      state.topPrevWindow -= state.stepShift;
      state.leftPrevWindow -= state.stepShift;
    },

    minimizeWindow(state, id) {
      //state.windows[index].minimize = true;
      const window = state.windows.find(window => {
        return window.id === id;
      });

      window.minimize = true;
    },

    toggleMinimizeWindow(state, id) {
      //state.windows[index].minimize = !state.windows[index].minimize;
      const window = state.windows.find(window => {
        return window.id === id;
      });

      window.minimize = !window.minimize;
    },

    toggleFullscreenWindow(state, id) {
      //state.windows[index].fullscreen = !state.windows[index].fullscreen;
      const window = state.windows.find(window => {
        return window.id === id;
      });

      window.fullscreen = !window.fullscreen;
    },

    fullscreenWindowOff(state, id) {
      //state.windows[index].fullscreen = false;
      const window = state.windows.find(window => {
        return window.id === id;
      });

      window.fullscreen == false;
    },

    /* setActiveWindow(state, index = undefined) {
      if (state.windows.length > 0) {
        if (index === state.indexActiveWindow && state.activeWindow.active) {
          return;
        }

        if (index != undefined) {
          if (state.activeWindow !== null) {
            state.activeWindow.active = false;
          }
          state.activeWindow = state.windows[index];
          state.activeWindow.active = true;
          state.indexActiveWindow = index;
        } else {
          for (let i = 0; i < state.windows.length; i++) {
            if (state.windows[i].active) {
              state.activeWindow = state.windows[i];
              state.indexActiveWindow = i;
              break;
            }
          }
        }
      } else {
        state.activeWindow = null;
        state.indexActiveWindow = null;
      }

      if (state.activeWindow) {
        state.maxZIndex += 1;
        const zIndex = state.activeWindow.zIndex;
        state.windows.forEach(function (window) {
          if (window.zIndex > zIndex) {
            window.zIndex -= 1;
          }
        });
        state.activeWindow.zIndex = state.windows.length + 1;
      }
    }, */

    setActiveWindow(state, id = "") {
      if (state.windows.length > 0) {
        if (
          state.activeWindow &&
          id === state.idActiveWindow &&
          state.activeWindow.active
        ) {
          return;
        }

        if (id != "") {
          if (state.activeWindow !== null) {
            state.activeWindow.active = false;
          }
          state.activeWindow = state.windows.find(window => {
            return window.id === id;
          });
          state.activeWindow.active = true;
          state.idActiveWindow = id;
        } else {
          for (let i = 0; i < state.windows.length; i++) {
            state.windows[i].active = false;
            /* if (state.windows[i].active) {
              state.activeWindow = state.windows[i];
              state.idActiveWindow = state.windows[i].id;
              break;
            } */
          }
          state.activeWindow = state.windows[0];
          state.idActiveWindow = state.windows[0].id;
          state.activeWindow.active = true;
        }
      } else {
        state.activeWindow = null;
        state.idActiveWindow = "";
      }

      if (state.activeWindow) {
        state.maxZIndex += 1;
        const zIndex = state.activeWindow.zIndex;
        state.windows.forEach(function (window) {
          if (window.zIndex > zIndex) {
            window.zIndex -= 1;
          }
        });
        state.activeWindow.zIndex = state.windows.length + 1;
      }
    },

    unsetActiveWindow(state) {
      state.activeWindow.active = false;
      state.windows.some((window, index) => {
        if (!window.minimize) {
          console.log("index", index);
          state.activeWindow = window;
          state.activeWindow.active = true;
          state.idActiveWindow = state.activeWindow.id;
          //state.indexActiveWindow = index;
          return true;
        }
      });

      if (state.activeWindow) {
        state.maxZIndex += 1;
        const zIndex = state.activeWindow.zIndex;
        state.windows.forEach(function (window) {
          if (window.zIndex > zIndex) {
            window.zIndex -= 1;
          }
        });
        state.activeWindow.zIndex = state.windows.length;
      }
    },

    setNotActiveWindows(state) {
      state.windows.forEach(function (window) {
        window.active = false;
      });
      state.activeWindow = null;
      state.indexActiveWindow = null;
      state.idActiveWindow = "";
    }
  },
  actions: {
    actionCreateNewWindow({ commit, rootState }, object) {
      const widthWorkspace = rootState.desktop.widthWorkspace;
      const heightWorkspace = rootState.desktop.heightWorkspace;
      commit("setNotActiveWindows");
      commit("createNewWindow", { object, widthWorkspace, heightWorkspace });
      commit("setActiveWindow");
    },

    actionCloseWindow({ commit }, id) {
      commit("closeWindow", id);
      commit("setActiveWindow"); // устанавливаем первое окно активным
    },

    actionSetActiveWindow({ commit }) {
      commit("setActiveWindow"); // устанавливаем первое окно активным
    },

    actionSetNotActiveWindows({ commit }) {
      commit("setNotActiveWindows");
    },

    actionSetWindows({ commit }, windows) {
      commit("setWindows", windows);
    },

    actionToggleWindows({ commit }, windows) {
      commit("toggleWindows", windows);
    },

    actionUpdateWindow({ commit }, options) {
      commit("updateWindow", options);
    },

    actionUpdateWindowCoords({ commit, dispatch, rootState }, options) {
      const widthWorkspace = rootState.desktop.widthWorkspace;
      const heightWorkspace = rootState.desktop.heightWorkspace;

      commit("updateWindowCoords", {
        options,
        widthWorkspace,
        heightWorkspace
      });
      if (rootState.desktop.modeGrid) {
        const countColumns = rootState.desktop.countColumns;
        const widthWorkspace = rootState.desktop.widthWorkspace;
        const widthOneColumn = widthWorkspace / countColumns;

        if (options.diffLeft) {
          options.left =
            Math.floor(options.left / widthOneColumn) * widthOneColumn;
        } else {
          options.left =
            Math.round(options.left / widthOneColumn) * widthOneColumn;
        }

        const countRows = rootState.desktop.countRows;
        const heightWorkspace = rootState.desktop.heightWorkspace;
        const heightOneRow = heightWorkspace / countRows;

        if (options.diffTop) {
          options.top = Math.floor(options.top / heightOneRow) * heightOneRow;
        } else {
          options.top = Math.round(options.top / heightOneRow) * heightOneRow;
        }

        options.top = Math.floor(options.top / heightOneRow) * heightOneRow;
        options.width = (100 * options.width) / widthWorkspace;
        options.height = (100 * options.height) / heightWorkspace;

        const widthColumnPercent = 100 / countColumns;
        options.width =
          Math.ceil(options.width / widthColumnPercent) * widthColumnPercent;

        if (options.width > 100) {
          options.width = 100;
        }

        const heightRowPercent = 100 / countRows;
        options.height =
          Math.ceil(options.height / heightRowPercent) * heightRowPercent;

        if (options.height > 100) {
          options.height = 100;
        }

        commit("updateWindowSize", options);
        commit("updateWindowCoords", {
          options,
          widthWorkspace,
          heightWorkspace
        });

        /* setTimeout(function () {
          commit("updateWindowSize", options);
          commit("updateWindowCoords", {
            options,
            widthWorkspace,
            heightWorkspace
          });
          dispatch("actionSaveSettingsDesktop");
        }, 1); */
      } else {
        //dispatch("actionSaveSettingsDesktop");
      }
    },

    actionUpdateWindowSize({ commit, dispatch, rootState }, options) {
      const widthWorkspace = rootState.desktop.widthWorkspace;
      const heightWorkspace = rootState.desktop.heightWorkspace;
      options.width =
        (100 * options.width) / widthWorkspace <= 100
          ? (100 * options.width) / widthWorkspace
          : 100;
      options.height =
        (100 * options.height) / heightWorkspace <= 100
          ? (100 * options.height) / heightWorkspace
          : 100;
      commit("updateWindowCoords", {
        options,
        widthWorkspace,
        heightWorkspace
      });
      commit("updateWindowSize", options);
      if (rootState.desktop.modeGrid) {
        //console.log('old left', options.left, 'old top', options.top)
        const countColumns = rootState.desktop.countColumns;
        const widthWorkspace = rootState.desktop.widthWorkspace;
        const widthOneColumn = widthWorkspace / countColumns;
        //options.left = Math.floor(options.left / widthOneColumn) * widthOneColumn

        if (options.diffLeft) {
          options.left =
            Math.floor(options.left / widthOneColumn) * widthOneColumn;
        } else {
          options.left =
            Math.round(options.left / widthOneColumn) * widthOneColumn;
        }

        const countRows = rootState.desktop.countRows;
        const heightWorkspace = rootState.desktop.heightWorkspace;
        const heightOneRow = heightWorkspace / countRows;

        if (options.diffTop) {
          options.top = Math.floor(options.top / heightOneRow) * heightOneRow;
        } else {
          options.top = Math.round(options.top / heightOneRow) * heightOneRow;
        }

        const widthColumnPercent = 100 / countColumns;
        options.width =
          Math.ceil(options.width / widthColumnPercent) * widthColumnPercent;

        if (options.width > 100) {
          options.width = 100;
        }

        const heightRowPercent = 100 / countRows;
        options.height =
          Math.ceil(options.height / heightRowPercent) * heightRowPercent;

        if (options.height > 100) {
          options.height = 100;
        }

        commit("updateWindowCoords", {
          options,
          widthWorkspace,
          heightWorkspace
        });
        commit("updateWindowSize", options);

        //console.log('actionUpdateWindowSize', options.width)
        /* setTimeout(function () {
          commit("updateWindowCoords", {
            options,
            widthWorkspace,
            heightWorkspace
          });
          commit("updateWindowSize", options);
          dispatch("actionSaveSettingsDesktop");
        }, 1); */
      } else {
        //dispatch("actionSaveSettingsDesktop");
      }
    }
  },
  getters: {
    indexActiveWindow(state) {
      return state.indexActiveWindow;
    },

    windows(state) {
      console.log("state.windows", state.windows);
      return state.windows;
    },

    frameWindows(state) {
      return state.windows.filter(window => {
        return !("type" in window) || window.object.type === "frame";
      });
    },

    folderWindows(state) {
      return state.windows.filter(window => {
        return window.object.type === "folder";
      });
    },

    getMinimizeWindows(state) {
      return state.windows.filter(window => {
        return window.minimize;
      });
    },

    isActiveWindow(state) {
      return state.indexActiveWindow !== null ? true : false;
    }
  }
};
