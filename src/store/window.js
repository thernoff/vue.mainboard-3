const getRandomId = () => {
  let id = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 10; i++) {
    id += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  id += Math.floor(Date.now() / 1000);
  return id;
}

const recalcCoordLeftForGridMode = (left, widthCell, diffLeft = 0) => {
  if (diffLeft) {
    return Math.floor(left / widthCell) * widthCell;
  } else {
    return Math.round(left / widthCell) * widthCell;
  }
}

const recalcCoordTopForGridMode = (top, heightCell, diffTop = 0) => {
  if (diffTop) {
    return Math.floor(top / heightCell) * heightCell;
  } else {
    return Math.round(top / heightCell) * heightCell;
  }
}

const findWindowById = (state, windowId) => {
  const window = state.windows.find(window => {
    return window.id === windowId;
  });

  return window ? window : null;
}

import { CONST_STORE_WINDOW } from "@/const.js";

export default {
  state: {
    maxZIndex: 0,
    topPrevWindow: CONST_STORE_WINDOW.TOP_PREV_WINDOW, // значение координаты top окна в процентах
    leftPrevWindow: CONST_STORE_WINDOW.LEFT_PREV_WINDOW, // значение координаты left окна в процентах
    widthWindow: CONST_STORE_WINDOW.WIDTH_WINDOW,
    heightWindow: CONST_STORE_WINDOW.HEIGHT_WINDOW,
    stepShift: 1, // сдвиг в процентах
    activeWindow: null,
    windows: [] // хранится ссылка на массив activeWorkspace.windows
  },
  mutations: {
    setWindows(state, windows) {
      state.windows = windows;
    },

    // Данная мутация создает новое окно
    createNewWindow(state, object) {
      console.log("createNewWindow from object", object);
      const title = object.title || object.label || "";
      const top = state.topPrevWindow > 0 ? state.topPrevWindow : 1;
      const left = state.leftPrevWindow > 0 ? state.leftPrevWindow : 1;
      const newWindow = {
        id: getRandomId(),
        title,
        top,
        left,
        width: state.widthWindow,
        height: state.heightWindow,
        zIndex: state.windows.length + 2,
        minimize: false,
        fullscreen: false,
        active: true,
        classesCss: [],
        type: "window",
        object: {
          id: object.id,
          type: object.type || "frame"
        }
      };

      switch (object.type) {
        case "folder":
          break;
        default:
          newWindow.link = object.link;
          newWindow.apiLink = object.apiLink;
          newWindow.currentLink = object.link;
          newWindow.itemId = object.objectId;
          break;
      }

      state.windows.push(newWindow);

      state.topPrevWindow += state.stepShift;
      state.leftPrevWindow += state.stepShift;
    },

    // Данная мутация обновляет свойства окна
    updateWindow(state, options) {
      console.log("updateWindow options", options);
      let window = findWindowById(state, options.id);
      window = Object.assign(window, options);
    },

    // Данная мутация обновляет координаты left и top окна
    updateWindowCoords(state, { options, widthWorkspace, heightWorkspace }) {
      let window = findWindowById(state, options.id);
      if (window && !window.fullscreen) {
        // options.top и options.left - значения в пикселях
        window.top = (options.top / heightWorkspace) * 100;
        window.left = (options.left / widthWorkspace) * 100;
      }
    },

    // Данная мутация обновляет размеры окна
    updateWindowSize(state, options) {
      console.log("updateWindowSize options", options);
      let window = findWindowById(state, options.id);

      if (window && !window.fullscreen) {
        window.width = +options.width;
        window.height = +options.height;
      }
    },

    // Данная мутация изменяет заголовок окна
    updateWindowTitle(state, options) {
      let window = findWindowById(state, options.id);
      if (window) {
        window.title = options.title;
      }
    },

    // Данная мутация добавляет или удаляет css-класс у окна
    toggleClassWindow(state, { id, classCss }) {
      let window = findWindowById(state, id);
      let classesCss = window.classesCss;
      let i = classesCss.indexOf(classCss);
      if (i > -1) {
        classesCss.splice(i, 1);
      } else {
        classesCss.push(classCss);
      }
    },

    // Данная мутация закрывает окно по переданному идентификатору
    closeWindow(state, id) {
      state.activeWindow = null;

      for (let i = 0; i < state.windows.length; i++) {
        if (id === state.windows[i].id) {
          state.topPrevWindow = state.windows[i].top;
          state.leftPrevWindow = state.windows[i].left;
          state.windows.splice(i, 1);
        }
      }

      state.topPrevWindow -= state.stepShift;
      state.leftPrevWindow -= state.stepShift;
    },

    // Данная мутация закрывает все окна
    closeAllWindows(state) {
      state.activeWindow = null;
      state.windows = [];

      state.topPrevWindow = CONST_STORE_WINDOW.TOP_PREV_WINDOW;
      state.leftPrevWindow = CONST_STORE_WINDOW.LEFT_PREV_WINDOW;
    },

    // Данная мутация сворачивает окно по переданному идентификатору
    minimizeWindow(state, id) {
      let window = findWindowById(state, id);
      window.minimize = true;
    },

    toggleMinimizeWindow(state, id) {
      let window = findWindowById(state, id);
      window.minimize = !window.minimize;
    },

    // Данная мутация переключает полноэкранное отображение окна
    toggleFullscreenWindow(state, id) {
      let window = findWindowById(state, id);
      window.fullscreen = !window.fullscreen;
    },

    // Данная мутация раскрывает окно на весь экран
    expandFullscreenWindow(state, id) {
      let window = findWindowById(state, id);
      window.fullscreen = true;
    },

    // Данная мутация переводит раскрытое окно в обычный вид
    fullscreenWindowOff(state, id) {
      let window = findWindowById(state, id);
      window.fullscreen == false;
    },

    // Данная мутация устанавливает окно активным в зависимости от того передан идентификатор или нет
    setActiveWindow(state, id = "") {
      if (state.windows.length > 0) {
        if (
          id &&
          state.activeWindow &&
          id === state.activeWindow.id &&
          state.activeWindow.active
        ) {
          return;
        }

        if (id != "") {
          if (state.activeWindow !== null) {
            state.activeWindow.active = false;
          }
          state.activeWindow = findWindowById(state, id);
        } else {
          for (let i = 0; i < state.windows.length; i++) {
            if (state.windows[i].active) {
              state.activeWindow = state.windows[i];
              break;
            }
          }

          if (state.windows.length && !state.activeWindow) {
            state.activeWindow = state.windows[0];
          }
        }
        state.activeWindow.active = true;
      } else {
        state.activeWindow = null;
      }

      if (state.activeWindow) {
        state.maxZIndex += 1;
        const zIndex = state.activeWindow.zIndex;
        state.windows.forEach((window) => {
          if (window.zIndex > zIndex) {
            window.zIndex -= 1;
          }
        });
        state.activeWindow.zIndex = state.windows.length + 1;
      }
    },

    /* unsetActiveWindow(state) {
      state.activeWindow.active = false;
      state.windows.some((window) => {
        if (!window.minimize) {
          state.activeWindow = window;
          state.activeWindow.active = true;
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
    }, */

    // Данная мутация делает все окна не активными
    setNotActiveWindows(state) {
      state.windows.forEach((window) => {
        window.active = false;
      });
      state.activeWindow = null;
    }
  },

  actions: {
    // Данный экшен создает новое окно
    actionCreateNewWindow({ state, commit, rootState }, object) {
      let window = null;
      window = state.windows.find(window => window.object.id === object.id);
      // Если существует окно, которое отображает переданный объект (фрейм или папка), то делаем его активным
      // иначе создаем новое окно для отображения переданного объекта (object)
      if (window) {
        commit("setActiveWindow", window.id);
      } else {
        commit("setNotActiveWindows");
        commit("createNewWindow", object);
        window = state.windows[state.windows.length - 1];
        commit("setActiveWindow", window.id);
      }
      return window;
    },

    // Данный экшен закрывает окно по переданному идентификатору и устанавливает активным первое не свернутое окно
    actionCloseWindow({ state, commit }, id) {
      commit("closeWindow", id);

      // Найдем идентификатор первого не свернутого окна
      let idActiveWindow = "";
      for (let i = 0; i < state.windows.length; i++) {
        if (!state.windows[i].minimize) {
          idActiveWindow = state.windows[i].id;
          break;
        }
      }

      if (idActiveWindow) {
        commit("setActiveWindow", idActiveWindow); // устанавливаем первое не свернутое окно активным
      }
    },

    /* actionSetActiveWindow({ commit }) {
      commit("setActiveWindow"); // устанавливаем первое окно активным
    }, */

    /* actionSetNotActiveWindows({ commit }) {
      commit("setNotActiveWindows");
    }, */

    /* actionSetWindows({ commit }, windows) {
      commit("setWindows", windows);
    }, */

    /* actionToggleWindows({ commit }, windows) {
      commit("toggleWindows", windows);
    }, */

    // Данный экшен изменяет свойства окна
    actionUpdateWindow({ commit }, options) {
      commit("updateWindow", options);
    },

    // Данный экшен изменяет координаты (left и top) окна
    actionUpdateWindowCoords({ commit, dispatch, rootState }, options) {
      const widthWorkspace = rootState.desktop.widthWorkspace;
      const heightWorkspace = rootState.desktop.heightWorkspace;

      commit("updateWindowCoords", {
        options,
        widthWorkspace,
        heightWorkspace
      });

      if (rootState.desktop.modeGrid) {
        const widthWorkspace = rootState.desktop.widthWorkspace;
        const widthCell = rootState.desktop.widthCell;
        const countColumns = widthWorkspace / widthCell;

        options.left = recalcCoordLeftForGridMode(
          options.left,
          widthCell,
          options.diffLeft
        );

        const heightWorkspace = rootState.desktop.heightWorkspace;
        const heightCell = rootState.desktop.heightCell;
        const countRows = heightWorkspace / heightCell;

        options.top = recalcCoordTopForGridMode(
          options.top,
          heightCell,
          options.diffTop
        );

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

        /* commit("updateWindowSize", options);
        commit("updateWindowCoords", {
          options,
          widthWorkspace,
          heightWorkspace
        }); */

        setTimeout(() => {
          commit("updateWindowSize", options);
          commit("updateWindowCoords", {
            options,
            widthWorkspace,
            heightWorkspace
          });
        }, 1);
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
        const widthWorkspace = rootState.desktop.widthWorkspace;
        const widthCell = rootState.desktop.widthCell;
        const countColumns = widthWorkspace / widthCell;

        options.left = recalcCoordLeftForGridMode(
          options.left,
          widthCell,
          options.diffLeft
        );

        const heightWorkspace = rootState.desktop.heightWorkspace;
        const heightCell = rootState.desktop.heightCell;
        const countRows = heightWorkspace / heightCell;

        options.top = recalcCoordTopForGridMode(
          options.top,
          heightCell,
          options.diffTop
        );

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

        /* commit("updateWindowCoords", {
          options,
          widthWorkspace,
          heightWorkspace
        });
        commit("updateWindowSize", options); */

        setTimeout(() => {
          commit("updateWindowCoords", {
            options,
            widthWorkspace,
            heightWorkspace
          });
          commit("updateWindowSize", options);
        }, 1);
      }
    }
  },
  getters: {
    windows(state) {
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
      return state.activeWindow !== null ? true : false;
    }
  }
};
