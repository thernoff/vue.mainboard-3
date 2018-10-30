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
    activeWindow: null,
    windows: [] // хранится ссылка на массив activeWorkspace.windows
  },
  mutations: {
    setWindows(state, windows) {
      state.windows = windows;
    },

    createNewWindow(state, { element, widthWorkspace, heightWorkspace }) {
      const title = element.title || element.label;
      const link = element.link;
      const currentLink = element.link;
      const apiLink = element.apiLink;
      const itemId = element.id;
      //const id = Math.random()
      const id = getRandomId();
      const top = state.topPrevWindow > 0 ? state.topPrevWindow : 5;
      const left = state.leftPrevWindow > 0 ? state.leftPrevWindow : 5;
      //console.log('id', id)
      const newWindow = {
        id,
        title,
        link,
        apiLink,
        currentLink,
        itemId,
        top: (100 * top) / heightWorkspace,
        left: (100 * left) / widthWorkspace,
        width: 40,
        height: 45,
        zIndex: state.windows.length + 2,
        minimize: false,
        fullscreen: false,
        closed: false,
        active: true,
        classesCss: []
      };

      if (state.activeWindow) {
        state.activeWindow.active = false;
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
      let window = state.windows[options.index];
      console.log("updateWindow window", window);
      state.windows[options.index] = Object.assign(window, options);
    },

    updateWindowCoords(state, { options, widthWorkspace, heightWorkspace }) {
      console.log("updateWindowCoords options", options);
      let window = state.windows[options.index];
      if (!window.fullscreen) {
        window.top = (+options.top / heightWorkspace) * 100;
        window.left = (+options.left / widthWorkspace) * 100;
        //state.topPrevWindow -= state.stepShift
        //state.leftPrevWindow -= state.stepShift
      }
    },

    updateWindowSize(state, options) {
      console.log("updateWindowSize options", options);
      let window = state.windows[options.index];
      if (!window.fullscreen) {
        console.log("updateWindowSize window.fullscreen", window.fullscreen);
        window.width = +options.width;
        window.height = +options.height;
      }
    },

    updateWindowTitle(state, options) {
      let window = state.windows[options.index];
      window.title = options.title;
    },

    updateWindowApiLink(state, options) {
      let window = state.windows[options.index];
      window.apiLink = options.apiLink;
    },

    toggleClassWindow(state, data) {
      let classesCss = state.windows[data.index].classesCss;
      let i = classesCss.indexOf(data.classCss);
      if (i > -1) {
        classesCss.splice(i, 1);
      } else {
        classesCss.push(data.classCss);
      }
      console.log(i, classesCss);
    },

    closeWindow(state, index) {
      state.activeWindow = null;
      state.indexActiveWindow = null;
      state.windows.splice(index, 1);
      state.topPrevWindow -= state.stepShift;
      state.leftPrevWindow -= state.stepShift;
    },

    minimizeWindow(state, index) {
      state.windows[index].minimize = true;
    },

    toggleMinimizeWindow(state, index) {
      state.windows[index].minimize = !state.windows[index].minimize;
    },

    toggleFullscreenWindow(state, index) {
      state.windows[index].fullscreen = !state.windows[index].fullscreen;
    },

    fullscreenWindowOff(state, index) {
      state.windows[index].fullscreen = false;
    },

    setActiveWindow(state, index = undefined) {
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
        state.windows.forEach(function(window) {
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
          state.indexActiveWindow = index;
          return true;
        }
      });

      if (state.activeWindow) {
        state.maxZIndex += 1;
        const zIndex = state.activeWindow.zIndex;
        state.windows.forEach(function(window) {
          if (window.zIndex > zIndex) {
            window.zIndex -= 1;
          }
        });
        state.activeWindow.zIndex = state.windows.length;
      }
    },

    setNotActiveWindows(state) {
      state.windows.forEach(function(window) {
        window.active = false;
      });
      state.activeWindow = null;
      state.indexActiveWindow = null;
    }
  },
  actions: {
    actionCreateNewWindow({ commit, rootState }, element) {
      const widthWorkspace = rootState.desktop.widthWorkspace;
      const heightWorkspace = rootState.desktop.heightWorkspace;
      commit("createNewWindow", { element, widthWorkspace, heightWorkspace });
    },

    actionCloseWindow({ commit }, index) {
      commit("closeWindow", index);
      commit("setActiveWindow", 0);
    },

    actionSetActiveWindow({ commit }) {
      commit("setActiveWindow");
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
      console.log("actionUpdateWindowCoords.options", {
        options,
        widthWorkspace,
        heightWorkspace
      });
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

        setTimeout(function() {
          commit("updateWindowSize", options);
          commit("updateWindowCoords", {
            options,
            widthWorkspace,
            heightWorkspace
          });
          dispatch("actionSaveSettingsDesktop");
        }, 1);
      } else {
        dispatch("actionSaveSettingsDesktop");
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

        //console.log('actionUpdateWindowSize', options.width)
        setTimeout(function() {
          commit("updateWindowCoords", {
            options,
            widthWorkspace,
            heightWorkspace
          });
          commit("updateWindowSize", options);
          dispatch("actionSaveSettingsDesktop");
        }, 1);
      } else {
        dispatch("actionSaveSettingsDesktop");
      }
    }
  },
  getters: {
    indexActiveWindow(state) {
      return state.indexActiveWindow;
    },

    windows(state) {
      return state.windows;
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
