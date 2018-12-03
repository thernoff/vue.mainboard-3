import axios from "axios";
import { data } from "@/store/data/data.js"

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

// Данная функция пересчитывает значение координаты left объекта в режиме сетки
// left - текущее значение координаты left
// widthCell - ширина ячейки сетки
// diffLeft - изменение по горизонтальной оси
const recalcCoordLeftForGridMode = (left, widthCell, diffLeft = 0) => {
  if (diffLeft) {
    return Math.floor(left / widthCell) * widthCell;
  } else {
    return Math.round(left / widthCell) * widthCell;
  }
}

// Данная функция пересчитывает значение координаты top объекта в режиме сетки
// top - текущее значение координаты top
// heightCell - высота ячейки сетки
// diffTop - изменение по вертикальной оси
const recalcCoordTopForGridMode = (top, heightCell, diffTop = 0) => {
  if (diffTop) {
    return Math.floor(top / heightCell) * heightCell;
  } else {
    return Math.round(top / heightCell) * heightCell;
  }
}

// Данная функция ищет рекурсивно координаты свободного места на рабочем столе для перемещаемого ярлыка
const findCoords = (shortcuts, left, top, widthWorkspace, heightWorkspace) => {
  let shortcut = null;
  shortcut = shortcuts.find(shortcut => {
    return (
      Math.abs(Math.round(left - (widthWorkspace * shortcut.left) / 100)) < 100
      && Math.abs(Math.round(top - (heightWorkspace * shortcut.top) / 100)) < 100
    );
    /* return (
      Math.abs(left - Math.floor((widthWorkspace * shortcut.left) / 100)) <
      100 && Math.abs(top - (heightWorkspace * shortcut.top) / 100) < 100
    ); */
  });

  if (shortcut) {
    console.log("shortcut найден", shortcut);
    console.log("ищем дальше");
    console.log("shortcut.left", (widthWorkspace * shortcut.left) / 100);
    if (
      Math.abs(widthWorkspace - (widthWorkspace * shortcut.left) / 100 - 100) >=
      100
    ) {
      console.log("есть место справа");
      return findCoords(
        shortcuts,
        (widthWorkspace * shortcut.left) / 100 + 100,
        top,
        widthWorkspace,
        heightWorkspace
      );
    } else {
      console.log("места справа нет, сдвигаемся вниз");
      return findCoords(
        shortcuts,
        0,
        (heightWorkspace * shortcut.top) / 100 + 100,
        widthWorkspace,
        heightWorkspace
      );
    }
  } else {
    console.log("shortcut не найден: top, left", top, left);
    return { left, top };
  }
}

import { CONST_STORE_WORKSPACE } from "@/const.js";

export default {
  state: {
    indexActiveWorkspace: 0,
    activeWorkspace: null,
    topPrevShortcut: CONST_STORE_WORKSPACE.TOP_PREV_SHORTCUT,
    leftPrevShortcut: CONST_STORE_WORKSPACE.LEFT_PREV_SHORTCUT,
    widthShortcut: CONST_STORE_WORKSPACE.WIDTH_SHORTCUT,
    heightShortcut: CONST_STORE_WORKSPACE.HEIGHT_SHORTCUT,
    placeholder: {
      top: 0,
      left: 0,
      over: false
    },
    stepShift: CONST_STORE_WORKSPACE.STEP_SHIFT,
    workspaces: [
      {
        title: "Рабочий стол пользователя",
        descripton: "",
        active: true,
        windows: [],
        shortcuts: []
      }
    ],
    folders: [],
    dashboard: null
  },

  mutations: {
    /***** WORKSPACE *****/
    // Данная мутация создает новую рабочую область
    createNewWorkspace(state, nameWorkspace) {
      const newWorkspace = {
        title: nameWorkspace,
        descripton: "",
        active: true,
        windows: [],
        shortcuts: []
      };

      if (state.activeWorkspace) {
        state.activeWorkspace.active = false;
      }

      const length = state.workspaces.push(newWorkspace);
      state.activeWorkspace = state.workspaces[length - 1];
      state.indexActiveWorkspace = length - 1;
    },

    // Данная мутация удаляет текущую рабочую область
    deleteCurrentWorkspace(state) {
      state.workspaces.splice(state.indexActiveWorkspace, 1);
    },

    // Данная мутация устанавливает рабочую область активной
    setActiveWorkspace(state, index = undefined) {
      if (index != undefined && state.workspaces[index] != undefined) {
        state.activeWorkspace.active = false;
        state.activeWorkspace = state.workspaces[index];
        state.activeWorkspace.active = true;
        state.indexActiveWorkspace = index;
      } else {
        for (let i = 0; i < state.workspaces.length; i++) {
          if (state.workspaces[i].active) {
            state.activeWorkspace = state.workspaces[i];
            state.indexActiveWorkspace = i;
            break;
          }
        }
      }

      if (!state.activeWorkspace) {
        state.activeWorkspace = state.workspaces[0];
        state.indexActiveWorkspace = 0;
      }
    },

    setWorkspaces(state, workspaces) {
      if (workspaces && workspaces.length > 0) {
        state.workspaces = workspaces;
      }
    },

    setDashboard(state, dashboard) {
      state.dashboard = dashboard;
    },

    /***** WINDOWS *****/
    // Данная мутация делает все окна свернутыми
    minimizeWindows(state) {
      state.activeWorkspace.windows.forEach((window) => {
        window.minimize = true;
      });
    },

    // Данная мутация разворачивает окна по указанным индексам
    restoreMinimizeWindows(state, arrIndexesWindowsRestore) {
      arrIndexesWindowsRestore.forEach(
        index => (state.activeWorkspace.windows[index].minimize = false)
      );
    },

    /***** SHORTCUT *****/

    // Данная мутация создает новый ярлык
    // object - объект на который будет ссылаться ярлык
    // folderId - идентификатор папки, которой принадлежит ярлык
    // widthWorkspace и heightWorkspace - ширина и высота рабочей области соответственно
    createNewShortcut(
      state,
      { object, folderId, widthWorkspace, heightWorkspace }
    ) {
      // значения top и left приходят в пикселях
      const top = object.top || state.topPrevShortcut;
      const left = object.left || state.leftPrevShortcut;

      console.log("createNewShortcut from object", object);
      const newShortcut = {
        id: getRandomId(),
        label: object.title || object.label,
        image: "image" in object ? object.image : "",
        top: (100 * top) / heightWorkspace, // переводим значение top в проценты
        left: (100 * left) / widthWorkspace, // переводим значение left в проценты
        zIndex: 5,
        active: false,
        type: "shortcut",
        object: {
          id: object.id,
          type: object.type || "frame"
        },
        folderId
      };

      // Найдем количество уже существующих ярлыков countShortcuts, которые также ссылаются на данный объект
      const shortcuts = state.activeWorkspace.shortcuts;
      let countShortcuts = 0;
      for (let i = 0; i < shortcuts.length; i++) {
        if (object.id == shortcuts[i].object.id) {
          countShortcuts++;
        }
      }
      // Если countShortcuts > 0, то к названию ярлыка добавляем "(n)"
      if (countShortcuts) {
        newShortcut.label = newShortcut.label + " (" + countShortcuts + ")";
      }

      state.activeWorkspace.shortcuts.push(newShortcut);
    },

    // Данная мутация устанавливает активным ярлык по переданному идентификатору
    setActiveShortcut(state, id) {
      const shortcut = state.activeWorkspace.shortcuts.find(shortcut => {
        return shortcut.id === id;
      });

      shortcut.active = true;
    },

    // Данная мутация делает все ярлыки рабочей области не активными
    setNotActiveShortcuts(state) {
      state.activeWorkspace.shortcuts.forEach(shortcut => {
        shortcut.active = false;
      });
    },

    /* updateOrderShortcuts(state, { startIndex, stopIndex }) {
      let arr = state.activeWorkspace.shortcuts.slice();
      let shortcutStart = arr[startIndex];
      let shortcutStop = arr[stopIndex];
      arr[startIndex] = shortcutStop;
      arr[stopIndex] = shortcutStart;
      state.activeWorkspace.shortcuts = arr;
    },*/

    // Данная мутация упорядочивает ярлыки на рабочем столе по порядку их добавления
    sortShortcuts(
      state,
      { widthShortcut, heightShortcut, widthWorkspace, heightWorkspace }
    ) {
      const shortcuts = state.activeWorkspace.shortcuts;
      let top = 0;
      let left = 0;
      shortcuts.map(shortcut => {
        if (!shortcut.folderId) {
          shortcut.left = (100 * left) / widthWorkspace;
          shortcut.top = (100 * top) / heightWorkspace;
          left += widthShortcut;
          if (widthWorkspace - left < widthShortcut) {
            left = 0;
            top += heightShortcut;
          }
        }
      });
    },

    // Данная мутация изменяет свойства ярлыка
    updateShortcut(state, data) {
      const id = data.id;
      const options = data.options;
      let shortcut = state.activeWorkspace.shortcuts.find(shortcut => {
        return shortcut.id === id;
      });

      shortcut = Object.assign({}, shortcut, options);
    },

    // Данная мутация обновляет координаты расположения ярлыка на рабочем столе
    // Значение координат приходят в пикселях, а сохраняются в процентах
    updateShortcutCoords(state, { options, widthWorkspace, heightWorkspace }) {
      const filterShortcuts = state.activeWorkspace.shortcuts.filter(
        shortcut => {
          return options.id !== shortcut.id && !shortcut.folderId;
        }
      );

      // Находим координаты свободного места на рабочем столе
      const data = findCoords(
        filterShortcuts, // массив ярлыков, лежащих на рабочем столе
        options.left, // значение координаты left, полученной при перетаскивании ярлыка
        options.top, // значение координаты top, полученной при перетаскивании ярлыка
        widthWorkspace, // ширина рабочей области
        heightWorkspace // высота рабочей области
      );

      const id = options.id;
      const shortcut = state.activeWorkspace.shortcuts.find(shortcut => {
        return shortcut.id === id;
      });
      shortcut.top = (data.top / heightWorkspace) * 100; // переводим пиксели в проценты
      shortcut.left = (data.left / widthWorkspace) * 100; // переводим пиксели в проценты
    },

    snapShortcutToGrid(state, { options, widthWorkspace, heightWorkspace }) {
      const id = options.id;
      const shortcut = state.activeWorkspace.shortcuts.find(shortcut => {
        return shortcut.id === id;
      });
      shortcut.top = (options.top / heightWorkspace) * 100; // переводим пиксели в проценты
      shortcut.left = (options.left / widthWorkspace) * 100; // переводим пиксели в проценты
    },

    // Данная мутация обновляет свойства плэйсхолдера ярлыка на рабочем столе
    // Значение координат приходят в пикселях, а сохраняются в процентах
    updatePlaceholderShortcut(state, { options, widthWorkspace, heightWorkspace }) {
      const filterShortcuts = state.activeWorkspace.shortcuts.filter(
        shortcut => {
          return shortcut.id !== options.elementId && !shortcut.folderId;
        }
      );
      const shortcut = filterShortcuts.find(shortcut => {
        return (
          Math.abs(Math.round(options.left - (widthWorkspace * shortcut.left) / 100)) < 100
          && Math.abs(Math.round(options.top - (heightWorkspace * shortcut.top) / 100)) < 100
        );
      });
      if (shortcut) {
        options.over = true;
      } else {
        options.over = false;
      }

      if (shortcut && shortcut.object.type === "folder") {
        state.placeholder.visible = false;
      }

      state.placeholder.top = options.top;
      state.placeholder.left = options.left;
      state.placeholder.over = options.over;
      /* state.topPlaceholderShortcut = (options.top / heightWorkspace) * 100; // переводим пиксели в проценты
      state.leftPlaceholderShortcut = (options.left / widthWorkspace) * 100; // переводим пиксели в проценты */
    },

    // Данная мутация удаляет ярлык по переданному идентификатору
    deleteShortcut(state, id) {
      for (let i = 0; i < state.activeWorkspace.shortcuts.length; i++) {
        if (id === state.activeWorkspace.shortcuts[i].id) {
          state.activeWorkspace.shortcuts.splice(i, 1);
        }
      }
    },

    /***** FOLDERS *****/

    // Данная мутация создает новую папку
    createNewFolder(state, data) {
      const newFolder = {
        id: getRandomId(),
        title: data.title,
        type: "folder",
        folderId: 0
      };

      state.folders.push(newFolder);
    },

    // Данная мутация устанавливает массив папок
    setFolders(state, data) {
      state.folders = data;
    },

    // Данная мутация удаляет папку по переданному идентификатору
    deleteFolder(state, id) {
      for (let i = 0; i < state.folders.length; i++) {
        if (id === state.folders[i].id) {
          state.folders.splice(i, 1);
        }
      }
    },

    // Данная мутация перемещает элемент в папку, путем присваивания свойству folderId объекта значение folderId (object.folderId = folderId)
    moveElementToFolder(state, { elementId, folderId }) {
      let shortcut = null;
      shortcut = state.activeWorkspace.shortcuts.find(shortcut => {
        return shortcut.id === elementId;
      });
      if (shortcut) {
        shortcut.folderId = folderId;
      }
    },

    // Данная мутация перемещает элемент из папки на рабочий стол,
    // путем присваивания свойству folderId объекта значения 0 (object.folderId = 0)
    moveElementFromFolderToDesktop(state, { elementId }) {
      let shortcut = null;
      shortcut = state.activeWorkspace.shortcuts.find(shortcut => {
        return shortcut.id === elementId;
      });
      if (shortcut) {
        shortcut.folderId = 0;
      }
    }
  },

  actions: {
    // Данный экшен инициализирует значения хранилища тестовыми данными в случае ошибки при получении данных с удаленного сервера
    actionInitWorkspaces({ state, commit }, workspaces) {
      if (workspaces && workspaces.length > 0) {
        commit("setWorkspaces", workspaces);
        commit("setActiveWorkspace");
        if (state.activeWorkspace.windows) {
          commit("setWindows", state.activeWorkspace.windows);
          commit("setActiveWindow");
        }
      } else {
        commit("setActiveWorkspace");
        commit("setWindows", state.activeWorkspace.windows);
      }
    },

    actionCreateNewWorkspace({ state, commit }, nameWorkspace) {
      commit("createNewWorkspace", nameWorkspace);
      commit("setWindows", state.activeWorkspace.windows);
      commit("setActiveWindow");
    },

    actionSetActiveWorkspace({ state, commit }, index) {
      commit("setActiveWorkspace", index);
      commit("setWindows", state.activeWorkspace.windows);
      commit("setActiveWindow");
    },

    // Данный экшен получает данные с удаленного сервера и инициализирует с их помощью хранилище
    // Запускается в хуке жизненного цикла created в App.vue
    actionGetDashboard({ commit, state, dispatch }) {
      commit("setActiveWorkspace");
      commit("setWindows", state.activeWorkspace.windows);
      axios
        .get("/extusers/fpage/desktop/")
        .then(response => {
          //console.log("response", response.data);

          // Массив данных для отображения стартового меню
          const startMenuItems = response.data.dashboard;
          if (startMenuItems && startMenuItems.length > 0) {
            commit("setStartmenuItems", startMenuItems);
          }

          // Установка данных текущего пользователя
          const user = response.data.user;
          if (user) {
            commit("setUser", user);
          }

          // Установка данных интерфейса
          const interfaces = response.data.interfaces;
          if (interfaces && interfaces.length > 0) {
            commit("setInterfaces", interfaces);
          }

          const languages = response.data.languages;
          if (languages && languages.length > 0) {
            commit("setLanguages", languages);
          }

          if (response.data.settingsDesktop) {
            const workspaces = response.data.settingsDesktop.workspaces;
            if (workspaces && workspaces.length > 0) {
              commit("setWorkspaces", workspaces);
              commit("setActiveWorkspace");
              if (state.activeWorkspace.windows) {
                commit("setWindows", state.activeWorkspace.windows);
                commit("setActiveWindow");
              }
            }

            const folders = response.data.settingsDesktop.folders;
            if (folders && folders.length > 0) {
              commit("setFolders", folders);
            }
          }
        })
        .catch(error => {
          console.log("error", error);
          // В режиме разработки заполняем хранилище тестовыми данными
          if (process.env.NODE_ENV === "development") {
            const dashboard = data.dashboard;
            commit("setStartmenuItems", dashboard);

            const workspaces = data.workspaces;
            dispatch("actionInitWorkspaces", workspaces);

            const user = data.user;
            commit("setUser", user);

            const interfaces = data.interfaces;
            commit("setInterfaces", interfaces);
          }
        });
    },

    // Данный экшен отправляет запрос на сохранение данных на удаленный сервер
    actionSaveSettingsDesktop({ state }) {
      const workspaces = state.workspaces;
      const folders = state.folders;
      if (process.env.NODE_ENV !== "development") {
        axios({
          method: "post",
          headers: { "Content-Type": "application/form-data" },
          url: CONST_STORE_WORKSPACE.URL_SAVE_SETTINGS_DESKTOP,
          data: {
            settings: { workspaces, folders }
          }
        })
          .then(response => {
            console.log("response", response);
          })
          .catch(error => {
            console.log("error", error);
          });
      }

    },

    // Данный экшен удаляет текущую рабочую область, делает активной первую из оставшихся рабочую область
    actionDeleteCurrentWorkspace({ commit, state }) {
      if (state.workspaces.length > 1) {
        commit("deleteCurrentWorkspace");
        commit("setActiveWorkspace", 0);
        commit("setWindows", state.activeWorkspace.windows);
        commit("setActiveWindow");
      }
    },

    /* actionRecalcWindowsCoords({ commit, rootState }, options) {
      const widthWorkspace = rootState.desktop.widthWorkspace;
      const heightWorkspace = rootState.desktop.heightWorkspace;
      commit("recalcWindowsCoords", {
        options,
        widthWorkspace,
        heightWorkspace
      });
    }, */

    /* actionMinimizeWindows({ commit }) {
      commit("minimizeWindows");
    }, */

    /* actionRestoreMinimizeWindows({ commit }, arrIndexesWindowsRestore) {
      commit("restoreMinimizeWindows", arrIndexesWindowsRestore);
    }, */

    // Данный экшен создает новый ярлык. Если включен режим сетки, то координаты (left и top) будут преобразованы в соответствии с ней.
    actionCreateNewShortcut(
      { commit, state, rootState },
      { object, folderId, error }
    ) {
      const widthWorkspace = rootState.desktop.widthWorkspace;
      const heightWorkspace = rootState.desktop.heightWorkspace;
      const shortcuts = state.activeWorkspace.shortcuts;

      commit("createNewShortcut", {
        object,
        folderId,
        widthWorkspace,
        heightWorkspace
      });

      if (rootState.desktop.modeGrid) {
        const shortcut = shortcuts[shortcuts.length - 1];
        let options = { id: shortcut.id };

        const widthCell = rootState.desktop.widthCell;
        const left = (shortcut.left / 100) * widthWorkspace;
        options.left = recalcCoordLeftForGridMode(left, widthCell, 0);

        const heightCell = rootState.desktop.heightCell;
        const top = (shortcut.top / 100) * heightWorkspace;
        console.log("actionCreateNewShortcut top", top);
        options.top = recalcCoordTopForGridMode(top, heightCell, 0);
        commit("updateShortcutCoords", {
          options,
          widthWorkspace,
          heightWorkspace
        });
      }

      return shortcuts[shortcuts.length - 1];
    },

    /* actionSetActiveShortcut({ commit }, id) {
      commit("setNotActiveShortcuts"); // Делаем все ярлыки не активными
      commit("setActiveShortcut", id); // Устанавливаем активным ярлык по переданному идентификатору
    }, */

    /* actionSetNotActiveShortcuts({ commit }) {
      commit("setNotActiveShortcuts");
    },

    actionUpdateOrderShortcuts({ commit }, data) {
      commit("updateOrderShortcuts", data);
    }, */

    actionSortShortcuts({ state, commit, rootState }) {
      const widthShortcut = state.widthShortcut;
      const heightShortcut = state.heightShortcut;
      const widthWorkspace = rootState.desktop.widthWorkspace;
      const heightWorkspace = rootState.desktop.heightWorkspace;
      commit("sortShortcuts", {
        widthShortcut,
        heightShortcut,
        widthWorkspace,
        heightWorkspace
      });
    },

    // Данный экшен удаляет ярлык по переданному идентификатору. Если ярлык ссылается на папку, то она также будет удалена вместе с содержимым.
    // !!! На данный момент ярлык ссылающийся на папку и объект типа folder тождественно взаимосвязаны.
    actionDeleteShortcut({ state, commit }, id) {
      const shortcut = state.activeWorkspace.shortcuts.find(shortcut => {
        return shortcut.id === id;
      });
      // Если удаляемый ярлык относится к папке, то удаляем все ярлыки, которые лежат в данной папке
      // (пока ярлык указывающий на папку и сама папка тождественно равны)
      if (shortcut.object.type === "folder") {
        state.activeWorkspace.shortcuts.forEach(s => {
          if (s.folderId === shortcut.object.id) {
            commit("deleteShortcut", s.id);
          }
        });
        // Удаляем саму папку на которую ссылается удаляемый ярлык
        commit("deleteFolder", shortcut.object.id);
      }

      commit("deleteShortcut", id);
    },

    actionUpdateShortcut({ commit }, data) {
      commit("updateShortcut", data);
    },

    // Данный экшен изменяет координаты ярлыка
    actionUpdateShortcutCoords({ state, commit, rootState }, options) {
      const widthWorkspace = rootState.desktop.widthWorkspace;
      const heightWorkspace = rootState.desktop.heightWorkspace;

      commit("updateShortcutCoords", {
        options,
        widthWorkspace,
        heightWorkspace
      });

      if (rootState.desktop.modeGrid) {
        const widthCell = rootState.desktop.widthCell;

        options.left = recalcCoordLeftForGridMode(
          options.left,
          widthCell,
          options.diffLeft
        );

        const heightCell = rootState.desktop.heightCell;

        options.top = recalcCoordTopForGridMode(
          options.top,
          heightCell,
          options.diffTop
        );

        commit("updateShortcutCoords", {
          options,
          widthWorkspace,
          heightWorkspace
        });

        /* setTimeout(function () {
          commit("updateShortcutCoords", {
            options,
            widthWorkspace,
            heightWorkspace
          });
        }, 1); */
      }
    },

    // Данный экшен привязывает координаты ярлыка к сетке (используется при переходе из "без сетки" в "режим сетки")
    actionSnapShortcutsToGrid({ state, commit, rootState }) {

      const widthWorkspace = rootState.desktop.widthWorkspace;
      const heightWorkspace = rootState.desktop.heightWorkspace;
      const widthCell = rootState.desktop.widthCell;
      const heightCell = rootState.desktop.heightCell;

      state.activeWorkspace.shortcuts.forEach((shortcut) => {
        let left = (shortcut.left / 100) * widthWorkspace;
        left = recalcCoordLeftForGridMode(left, widthCell, 0);

        let top = (shortcut.top / 100) * heightWorkspace;
        top = recalcCoordTopForGridMode(top, heightCell, 0);
        const options = { id: shortcut.id, top, left };
        //shortcut = Object.assign({}, shortcut, { left, top });
        commit("snapShortcutToGrid", {
          options,
          widthWorkspace,
          heightWorkspace
        });
      })
    },

    // Данный экшен изменяет координаты плэйсхолдера ярлыка
    actionUpdatePlaceholderShortcut({ state, commit, rootState }, options) {

      const widthWorkspace = rootState.desktop.widthWorkspace;
      const heightWorkspace = rootState.desktop.heightWorkspace;
      const widthCell = rootState.desktop.widthCell;

      options.left = recalcCoordLeftForGridMode(
        options.left,
        widthCell,
        options.diffLeft
      );

      const heightCell = rootState.desktop.heightCell;

      options.top = recalcCoordTopForGridMode(
        options.top,
        heightCell,
        options.diffTop
      );

      commit("updatePlaceholderShortcut", {
        options,
        widthWorkspace,
        heightWorkspace
      });
    },

    // Данный экшен создает новую папку и ярлык, ссылающийся на неё
    actionCreateNewFolder({ state, commit, rootState }, options) {
      const widthWorkspace = rootState.desktop.widthWorkspace;
      const heightWorkspace = rootState.desktop.heightWorkspace;
      const folder = options.folder;
      commit("createNewFolder", folder);
      commit("createNewShortcut", {
        object: state.folders[state.folders.length - 1],
        folderId: 0,
        widthWorkspace,
        heightWorkspace
      });

      if (rootState.desktop.modeGrid) {
        const shortcut =
          state.activeWorkspace.shortcuts[
          state.activeWorkspace.shortcuts.length - 1
          ];
        let options = { id: shortcut.id };

        const widthCell = rootState.desktop.widthCell;
        const left = (shortcut.left / 100) * widthWorkspace;
        options.left = recalcCoordLeftForGridMode(left, widthCell, 0);

        const heightCell = rootState.desktop.heightCell;
        const top = (shortcut.top / 100) * heightWorkspace;
        options.top = recalcCoordTopForGridMode(top, heightCell, 0);
        commit("updateShortcutCoords", {
          options,
          widthWorkspace,
          heightWorkspace
        });
      }
    },

    actionMoveElementToFolder({ commit }, data) {
      commit("moveElementToFolder", data);
    },

    actionMoveElementFromFolderToDesktop({ commit }, data) {
      commit("moveElementFromFolderToDesktop", data);
    }
  },
  getters: {
    getWorkspaces(state) {
      return state.workspaces;
    },

    workspaces(state) {
      return state.workspaces;
    },

    getActiveWorkspace(state) {
      return state.activeWorkspace;
    },

    getWindowsActiveWorkspace(state) {
      return state.activeWorkspace.windows;
    },

    getTitleActiveWorkspace(state) {
      return state.activeWorkspace ? state.activeWorkspace.title : "";
    },

    shortcuts(state) {
      return state.activeWorkspace ? state.activeWorkspace.shortcuts : [];
    },

    indexActiveWorkspace(state) {
      return state.indexActiveWorkspace;
    },

    countWorkspaces(state) {
      return state.workspaces.length;
    },

    isActiveShortcut(state) {
      const activeShortcuts = state.activeWorkspace.shortcuts.filter(
        shortcut => shortcut.active
      );
      return activeShortcuts.length > 0 ? true : false;
    },

    shortcutById(state) {
      return id => {
        let shortcut = null;
        shortcut = state.activeWorkspace.shortcuts.find(
          shortcut => shortcut.id == id
        );
        return shortcut;
      };
    },

    widthCell({ rootState }) {
      return rootState.desktop.widthCell;
    },

    heightCell({ rootState }) {
      return rootState.desktop.heightCell;
    }
  }
};
