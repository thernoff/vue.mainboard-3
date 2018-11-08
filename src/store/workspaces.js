import axios from "axios";

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
    indexActiveWorkspace: 0,
    activeWorkspace: null,
    topPrevShortcut: 5,
    leftPrevShortcut: 5,
    stepShift: 120,
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
    widthShortcut: 100,
    heightShortcut: 110,
    folders: [],
    dashboard: null
  },

  mutations: {
    /***** WORKSPACE *****/
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
      //state.windows = state.activeWorkspace.windows
      const length = state.workspaces.push(newWorkspace);
      state.activeWorkspace = state.workspaces[length - 1];
      state.indexActiveWorkspace = length - 1;
    },

    deleteCurrentWorkspace(state) {
      state.workspaces.splice(state.indexActiveWorkspace, 1);
    },

    setActiveWorkspace(state, index = undefined) {
      if (index != undefined) {
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
    },

    setWorkspaces(state, workspaces) {
      if (workspaces && workspaces.length > 0) {
        state.workspaces = workspaces;
      }
    },

    setDashboard(state, dashboard) {
      state.dashboard = dashboard;
    },

    /* recalcWindowsCoords(state, { options, widthWorkspace, heightWorkspace }) {
      console.log('recalcWindowsCoords', widthWorkspace, heightWorkspace)
      state.workspaces.forEach(function (workspace) {
        workspace.windows.forEach(function (window) {
          console.log('window', window)
          window.top = window.top * options.coefTop
          window.left = window.left * options.coefLeft
        })
      })
    }, */

    /***** WINDOWS *****/
    minimizeWindows(state) {
      state.activeWorkspace.windows.forEach(function (window) {
        window.minimize = true;
      });
    },

    restoreMinimizeWindows(state, arrIndexesWindowsRestore) {
      arrIndexesWindowsRestore.forEach(
        index => (state.activeWorkspace.windows[index].minimize = false)
      );
    },

    /***** SHORTCUT *****/
    createNewShortcut(
      state,
      { element, widthWorkspace, heightWorkspace, type }
    ) {
      const shortcuts = state.activeWorkspace.shortcuts;

      /* let top = 0;
      if (shortcuts.length > 0) {
        top = shortcuts[shortcuts.length - 1].top + 100;
      } */
      const top = state.topPrevShortcut > 0 ? state.topPrevShortcut : 5;
      const left = state.leftPrevShortcut > 0 ? state.leftPrevShortcut : 5;
      console.log("createNewShortcut from element", element);
      const newShortcut = {
        id: getRandomId(),
        image: "image" in element ? element.image : "",
        top: (100 * top) / heightWorkspace,
        left: (100 * left) / widthWorkspace,
        zIndex: 5,
        active: false,
        type: type || "",
        objectId: element.id || "",
        folderId: 0
      };

      switch (type) {
        case "folder":
          newShortcut.label = element.title;
          break;
        case "frame":
          newShortcut.apiLink = element.apiLink || element.url;
          newShortcut.label = element.label;
          break;
      }
      state.activeWorkspace.shortcuts.push(newShortcut);
      console.log(
        "createNewShortcut state.activeWorkspace.shortcuts",
        state.activeWorkspace.shortcuts
      );

      if (
        heightWorkspace - (state.topPrevShortcut + state.heightShortcut) <
        state.stepShift
      ) {
        console.log("1");
        state.topPrevShortcut = 5;
        state.leftPrevShortcut += state.stepShift;
      } else {
        console.log("2");
        console.log("2 state.topPrevShortcut", state.topPrevShortcut);
        console.log(
          "2 heightWorkspace + state.heightShortcut",
          heightWorkspace + state.heightShortcut
        );
        //console.log('2 state.leftPrevShortcut', state.leftPrevShortcut);
        state.topPrevShortcut += state.stepShift;
        //console.log('2 state.topPrevShortcut', state.topPrevShortcut);
        //console.log('2 state.leftPrevShortcut', state.leftPrevShortcut);
      }

      if (state.leftPrevShortcut >= widthWorkspace + state.widthShortcut) {
        console.log("3");
        state.topPrevShortcut = 5;
        state.leftPrevShortcut = 5;
      }
    },

    setActiveShortcut(state, id) {
      console.log("setActiveShortcut id", id);
      state.activeWorkspace.shortcuts.forEach(shortcut => {
        shortcut.active = false;
      });
      //state.activeWorkspace.shortcuts[index].active = true;
      const shortcut = state.activeWorkspace.shortcuts.find(shortcut => {
        return shortcut.id === id;
      });

      shortcut.active = true;
    },

    setNotActiveShortcuts(state) {
      state.activeWorkspace.shortcuts.forEach(shortcut => {
        shortcut.active = false;
      });
    },

    updateOrderShortcuts(state, { startIndex, stopIndex }) {
      //console.log('updateOrderShortcuts')
      //console.log('startIndex', startIndex)
      //console.log('stopIndex', stopIndex)
      //let shortcutStart = state.activeWorkspace.shortcuts[startIndex];
      //let shortcutStop = state.activeWorkspace.shortcuts[stopIndex];
      let arr = state.activeWorkspace.shortcuts.slice();
      let shortcutStart = arr[startIndex];
      let shortcutStop = arr[stopIndex];
      //state.activeWorkspace.shortcuts[startIndex] = shortcutStop
      //state.activeWorkspace.shortcuts[stopIndex] = shortcutStart
      arr[startIndex] = shortcutStop;
      arr[stopIndex] = shortcutStart;
      state.activeWorkspace.shortcuts = arr;
      //console.log('state.activeWorkspace.shortcuts', state.activeWorkspace.shortcuts)
    },

    updateShortcut(state, data) {
      console.log("updateShortcut", state.activeWorkspace.shortcuts);
      //const index = data.index;
      const id = data.id;
      const options = data.options;
      /* state.activeWorkspace.shortcuts[index] = Object.assign(
        state.activeWorkspace.shortcuts[index],
        options
      ); */

      const shortcut = state.activeWorkspace.shortcuts.find(shortcut => {
        return shortcut.id === id;
      });

      shortcut = Object.assign(state.activeWorkspace.shortcuts[index], options);
    },

    updateShortcutCoords(state, { options, widthWorkspace, heightWorkspace }) {
      console.log("updateWindowCoords options", options);
      //let window = state.windows[options.index];
      const id = options.id;
      const shortcut = state.activeWorkspace.shortcuts.find(shortcut => {
        return shortcut.id === id;
      });
      shortcut.top = (+options.top / heightWorkspace) * 100;
      shortcut.left = (+options.left / widthWorkspace) * 100;
    },

    deleteShortcut(state, id) {
      //state.activeWorkspace.shortcuts.splice(indexShortcut, 1);

      for (let i = 0; i < state.activeWorkspace.shortcuts.length; i++) {
        if (id === state.activeWorkspace.shortcuts[i].id) {
          state.activeWorkspace.shortcuts.splice(i, 1);
        }
      }
    },

    /***** FOLDERS *****/
    createNewFolder(state, folder) {
      folder.id = getRandomId();
      state.folders.push(folder);
      console.log("createNewFolder state.folders", state.folders);
    },

    setFolders(state, data) {
      state.folders = data;
    },

    deleteFolder(state, id) {
      for (let i = 0; i < state.folders.length; i++) {
        if (id === state.folders[i].id) {
          state.folders.splice(i, 1);
        }
      }
    },

    moveElementToFolder(state, { elementId, folderId }) {
      let shortcut = null;
      shortcut = state.activeWorkspace.shortcuts.find(shortcut => {
        return shortcut.id === elementId;
      });
      if (shortcut) {
        shortcut.folderId = folderId;
      }
    },

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

    actionGetDashboard({ commit, state, dispatch }) {
      commit("setActiveWorkspace");
      commit("setWindows", state.activeWorkspace.windows);
      axios
        .get(window.location.href + "extusers/fpage/desktop/")
        .then(response => {
          //console.log("response", response.data);
          // Массив данных для отображения стартового меню
          const dashboard = response.data.dashboard;
          if (dashboard && dashboard.length > 0) {
            commit("setStartmenuItems", dashboard);
          }

          const user = response.data.user;
          if (user) {
            commit("setUser", user);
          }

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
          if (process.env.NODE_ENV === "development") {
            const data = {
              status: 1,
              dashboard: [
                {
                  id: "17",
                  parent_id: "0",
                  server_id: "0",
                  user_id: "6",
                  access: null,
                  label: "\u0416\u0443\u0440\u043d\u0430\u043b\u044b",
                  image: null,
                  link: null,
                  visible: "1",
                  ordering: "1",
                  elements: [
                    {
                      id: "2",
                      parent_id: "17",
                      server_id: "1",
                      user_id: "6",
                      access: "vandalboxes",
                      label: "\u042f\u0449\u0438\u043a\u0438",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/vandal-proof.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/vandalboxes/",
                      visible: "1",
                      ordering: "1",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvdmFuZGFsYm94ZXMv"
                    },
                    {
                      id: "5",
                      parent_id: "17",
                      server_id: "1",
                      user_id: "6",
                      access: "joblog",
                      label:
                        "\u0416\u0443\u0440\u043d\u0430\u043b \u0440\u0430\u0431\u043e\u0442",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/diary.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/joblog/",
                      visible: "1",
                      ordering: "2",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvam9ibG9nLw,,"
                    }
                  ]
                },
                {
                  id: "16",
                  parent_id: "0",
                  server_id: "0",
                  user_id: "6",
                  access: null,
                  label:
                    "\u041a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u0438",
                  image: null,
                  link: null,
                  visible: "1",
                  ordering: "2",
                  elements: [
                    {
                      id: "6",
                      parent_id: "16",
                      server_id: "1",
                      user_id: "6",
                      access: "incident",
                      label:
                        "\u0418\u043d\u0446\u0438\u0434\u0435\u043d\u0442\u044b",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/incident.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/incidents/",
                      visible: "1",
                      ordering: "1",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvaW5jaWRlbnRzLw,,"
                    },
                    {
                      id: "8",
                      parent_id: "16",
                      server_id: "1",
                      user_id: "6",
                      access: "stationary",
                      label:
                        "\u041c\u043e\u043d\u0438\u0442\u043e\u0440\u0438\u043d\u0433 \u0441\u0442\u0430\u0446\u0438\u043e\u043d\u0430\u0440\u043e\u0432",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/stationary.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/stationary/",
                      visible: "1",
                      ordering: "2",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvc3RhdGlvbmFyeS8,"
                    }
                  ]
                },
                {
                  id: "1",
                  parent_id: "0",
                  server_id: "1",
                  user_id: "6",
                  access: null,
                  label: "Speedcams",
                  image: null,
                  link: null,
                  visible: "1",
                  ordering: "3",
                  elements: [
                    {
                      id: "3",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "dtp",
                      label: "\u0414\u0422\u041f",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/dtp.png",
                      link: "http://system.elxis.test/inner.php/speedcams/dtp/",
                      visible: "1",
                      ordering: "1",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvZHRwLw,,"
                    },
                    {
                      id: "19",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "carinfo:view",
                      label:
                        "\u0421\u0435\u0440\u0432\u0438\u0441 \u0410\u0432\u0442\u043e-\u0418\u043d\u0444\u043e",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/carinfo.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/carinfo/",
                      visible: "1",
                      ordering: "2",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvY2FyaW5mby8,"
                    },
                    {
                      id: "20",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "monitoring",
                      label:
                        "\u0422\u0435\u0445\u043d\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u043c\u043e\u043d\u0438\u0442\u043e\u0440\u0438\u043d\u0433",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/monitoring.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/monitoring/",
                      visible: "1",
                      ordering: "3",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvbW9uaXRvcmluZy8,"
                    },
                    {
                      id: "46",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "guards:module",
                      label:
                        "\u041e\u0445\u0440\u0430\u043d\u043d\u0438\u043a\u0438",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/guard.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/guards.html",
                      visible: "1",
                      ordering: "4",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvZ3VhcmRzLmh0bWw,"
                    },
                    {
                      id: "47",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "parkright",
                      label:
                        "\u041f\u0430\u0440\u043a\u0440\u0430\u0439\u0442\u044b",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/parkright.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/parkrights/",
                      visible: "1",
                      ordering: "5",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvcGFya3JpZ2h0cy8,"
                    },
                    {
                      id: "48",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "timesheets_cameras",
                      label:
                        "\u0422\u0430\u0431\u0435\u043b\u0438 \u043f\u043e \u043a\u043e\u043c\u043f\u043b\u0435\u043a\u0441\u0430\u043c",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/timesheet.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/timesheets/cameras/",
                      visible: "1",
                      ordering: "6",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvdGltZXNoZWV0cy9jYW1lcmFzLw,,"
                    },
                    {
                      id: "49",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "statistics:view",
                      label:
                        "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/statistics.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/statistics.html",
                      visible: "1",
                      ordering: "7",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvc3RhdGlzdGljcy5odG1s"
                    },
                    {
                      id: "50",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "employees:module",
                      label:
                        "\u0421\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u043a\u0438",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/employees.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/employees.html",
                      visible: "1",
                      ordering: "8",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvZW1wbG95ZWVzLmh0bWw,"
                    },
                    {
                      id: "57",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "cameras",
                      label:
                        "\u0413\u0435\u043e\u043b\u043e\u043a\u0430\u0446\u0438\u044f",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/geolocation.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/cameras/",
                      visible: "1",
                      ordering: "9",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvY2FtZXJhcy8,"
                    },
                    {
                      id: "58",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "reports",
                      label: "\u041e\u0442\u0447\u0435\u0442\u044b",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/report.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/reports/",
                      visible: "1",
                      ordering: "10",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvcmVwb3J0cy8,"
                    },
                    {
                      id: "59",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "moncomplex",
                      label:
                        "\u041c\u043e\u043d\u0438\u0442\u043e\u0440\u0438\u043d\u0433 \u043f\u0435\u0440\u0435\u0434\u0432\u0438\u0436\u043d\u044b\u0445 \u043a\u043e\u043c\u043f\u043b\u0435\u043a\u0441\u043e\u0432",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/mobile.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/moncomplex/",
                      visible: "1",
                      ordering: "11",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvbW9uY29tcGxleC8,"
                    },
                    {
                      id: "60",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "violpayments:statuses",
                      label:
                        "\u0421\u0442\u0430\u0442\u0443\u0441\u044b \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0438/\u0432\u044b\u0433\u0440\u0443\u0437\u043a\u0438 \u043d\u0430\u0440\u0443\u0448\u0435\u043d\u0438\u0439",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/chart.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/violations/statuses.html",
                      visible: "1",
                      ordering: "12",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvdmlvbGF0aW9ucy9zdGF0dXNlcy5odG1s"
                    },
                    {
                      id: "62",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "violpayments:analitics",
                      label:
                        "\u0410\u043d\u0430\u043b\u0438\u0442\u0438\u043a\u0430 \u043f\u043b\u0430\u0442\u0435\u0436\u0435\u0439 \u043e\u0442 \u0426\u0410\u0424\u0410\u041f",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/violpays_chart.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/violpayments/analitics.html",
                      visible: "1",
                      ordering: "14",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvdmlvbHBheW1lbnRzL2FuYWxpdGljcy5odG1s"
                    }
                  ]
                }
              ],
              settingsDashboard: {
                workspaces: [
                  {
                    title:
                      "\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442 (2 x 2)",
                    active: false,
                    rows: [
                      {
                        title: "\u0421\u0442\u0440\u043e\u043a\u0430 1",
                        height: 50,
                        minimize: false,
                        fullscreen: false,
                        cells: [
                          {
                            title:
                              "\u041e\u0431\u043b\u0430\u0441\u0442\u044c 1",
                            apiLink: "",
                            content: "<div>Cell 1</div>",
                            width: 50,
                            minimize: false,
                            fullscreen: false
                          },
                          {
                            title:
                              "\u041e\u0431\u043b\u0430\u0441\u0442\u044c 2",
                            apiLink: "",
                            content: "<div>Cell 2</div>",
                            width: 50,
                            minimize: false,
                            fullscreen: false
                          }
                        ]
                      },
                      {
                        title: "\u0421\u0442\u0440\u043e\u043a\u0430 2",
                        height: 50,
                        minimize: false,
                        fullscreen: false,
                        cells: [
                          {
                            title:
                              "\u041e\u0431\u043b\u0430\u0441\u0442\u044c 3",
                            apiLink: "",
                            content: "Cell 3",
                            width: 50,
                            minimize: false,
                            fullscreen: false
                          },
                          {
                            title:
                              "\u041e\u0431\u043b\u0430\u0441\u0442\u044c 4",
                            apiLink: "",
                            content: "Cell 4",
                            width: 50,
                            minimize: false,
                            fullscreen: false
                          }
                        ]
                      }
                    ],
                    savedWorkspace: []
                  }
                ],
                sidebar: { visible: true }
              },
              user: {
                firstname: "\u0412\u043b\u0430\u0434\u0438\u043c\u0438\u0440",
                lastname: "\u0414\u0443\u0434\u0438\u043a\u043e\u0432",
                uname: "test2",
                email: "test2@test.com",
                phone: "555-33-44",
                gid: 5
              },
              lang: "ru"
            };
            commit("setStartmenuItems", data.dashboard);

            const workspaces = [
              {
                title: "Рабочая область пользователя",
                descripton: "",
                active: true,
                windows: [],
                shortcuts: []
              },
              {
                title: "Тесты",
                descripton: "",
                active: false,
                windows: [
                  {
                    id: "5YDfqtnqzx1537796630",
                    title: "Сервис Авто-Инфо",
                    link:
                      "http://system.elxis.test/inner.php/speedcams/carinfo/",
                    apiLink:
                      "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvY2FyaW5mby8,",
                    top: 0,
                    left: 1080,
                    width: 41.66666666666667,
                    height: 50,
                    zIndex: 2,
                    minimize: false,
                    fullscreen: false,
                    closed: false,
                    active: false,
                    classesCss: []
                  },
                  {
                    id: "p6RipvAjOe1537796642",
                    title: "Аналитика платежей от ЦАФАП",
                    link:
                      "http://system.elxis.test/inner.php/speedcams/violpayments/analitics.html",
                    apiLink:
                      "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvdmlvbHBheW1lbnRzL2FuYWxpdGljcy5odG1s",
                    top: 431,
                    left: 0,
                    width: 100,
                    height: 50,
                    zIndex: 1,
                    minimize: false,
                    fullscreen: false,
                    closed: false,
                    active: false,
                    classesCss: []
                  }
                ],
                shortcuts: []
              }
            ];
            dispatch("actionInitWorkspaces", workspaces);
            console.log("workspaces", state.workspaces);

            const user = {
              firstname: "Владимир",
              lastname: "Дудиков",
              uname: "test2",
              email: "test2@test.com",
              phone: "555-33-44",
              gid: 5,
              idActiveInterface: 2
            };
            commit("setUser", user);

            const interfaces = [
              { id: 1, name: "Таблица" },
              { id: 2, name: "Десктоп" }
            ];
            commit("setInterfaces", interfaces);
          }
        });
    },

    actionSaveSettingsDesktop({ state, rootState }) {
      const workspaces = state.workspaces;
      const folders = state.folders;
      console.log("actionSaveSettingsDesktop folders", folders);
      axios({
        method: "post",
        headers: { "Content-Type": "application/form-data" },
        //url: 'http://esv.elxis.test/extusers/fpage/savedesktop/',
        url: window.location.href + "extusers/fpage/savedesktop/",
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
    },

    actionDeleteCurrentWorkspace({ commit, state }) {
      if (state.workspaces.length > 1) {
        commit("deleteCurrentWorkspace");
        commit("setActiveWorkspace", 0);
        commit("setWindows", state.activeWorkspace.windows);
        commit("setActiveWindow");
      }
    },

    actionRecalcWindowsCoords({ commit, rootState }, options) {
      const widthWorkspace = rootState.desktop.widthWorkspace;
      const heightWorkspace = rootState.desktop.heightWorkspace;
      commit("recalcWindowsCoords", {
        options,
        widthWorkspace,
        heightWorkspace
      });
    },

    actionMinimizeWindows({ commit }) {
      commit("minimizeWindows");
    },

    actionRestoreMinimizeWindows({ commit }, arrIndexesWindowsRestore) {
      commit("restoreMinimizeWindows", arrIndexesWindowsRestore);
    },

    actionCreateNewShortcut(
      { commit, state, rootState },
      { element, type, error }
    ) {
      const widthWorkspace = rootState.desktop.widthWorkspace;
      const heightWorkspace = rootState.desktop.heightWorkspace;
      const shortcuts = state.activeWorkspace.shortcuts;
      const existShortcut = shortcuts.some(shortcut => {
        return element.id == shortcut.id;
      });

      if (!existShortcut) {
        commit("createNewShortcut", {
          element,
          widthWorkspace,
          heightWorkspace,
          type
        });
      } else {
        commit("setError", error);
      }
    },

    actionSetActiveShortcut({ commit }, id) {
      commit("setActiveShortcut", id);
    },

    actionSetNotActiveShortcuts({ commit }) {
      commit("setNotActiveShortcuts");
    },

    actionUpdateOrderShortcuts({ commit }, data) {
      commit("updateOrderShortcuts", data);
    },

    actionDeleteShortcut({ commit }, id) {
      commit("deleteShortcut", id);
    },

    actionUpdateShortcut({ commit }, data) {
      commit("updateShortcut", data);
    },

    actionUpdateShortcutCoords({ commit, dispatch, rootState }, options) {
      const widthWorkspace = rootState.desktop.widthWorkspace;
      const heightWorkspace = rootState.desktop.heightWorkspace;

      commit("updateShortcutCoords", {
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

        setTimeout(function () {
          commit("updateShortcutCoords", {
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

    actionCreateNewFolder({ state, commit, rootState }, options) {
      const widthWorkspace = rootState.desktop.widthWorkspace;
      const heightWorkspace = rootState.desktop.heightWorkspace;
      const folder = options.folder;
      commit("createNewFolder", folder);
      commit("createNewShortcut", {
        element: state.folders[state.folders.length - 1],
        widthWorkspace,
        heightWorkspace,
        type: "folder"
      });
    },

    actionDeleteFolder({ commit }, id) {
      commit("deleteFolder", id);
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
      /* let activeWorkspace;
      for (let i = 0; i < state.workspaces.length; i++ ) {
        if ( state.workspaces[i].active ) {
          activeWorkspace = state.workspaces[i]
          break;
        }
      } */

      return state.activeWorkspace;
    },

    getWindowsActiveWorkspace(state) {
      /* let activeWorkspace;
      for (let i = 0; i < state.workspaces.length; i++ ) {
        if ( state.workspaces[i].active ) {
          activeWorkspace = state.workspaces[i]
          break;
        }
      } */

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
      const activeShortcuts = state.activeWorkspace.shortcuts.filter(function (
        shortcut
      ) {
        return shortcut.active;
      });
      return activeShortcuts.length > 0 ? true : false;
    }
  }
};
