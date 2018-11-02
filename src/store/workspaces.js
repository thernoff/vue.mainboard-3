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
    workspaces: [
      {
        title: "Рабочий стол пользователя",
        descripton: "",
        active: true,
        windows: [],
        shortcuts: []
      }
    ],
    dashboard: null
  },

  mutations: {
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

    createNewShortcut(state, options) {
      const shortcuts = state.activeWorkspace.shortcuts;

      let top = 0;
      if (shortcuts.length > 0) {
        top = shortcuts[shortcuts.length - 1].top + 100;
      }
      const newShortcut = {
        image: options.image || "",
        label: options.label,
        apiLink: options.apiLink || options.url,
        id: options.id || getRandomId(),
        top: top,
        left: 0,
        zIndex: 5,
        active: false,
        type: options.type || "api"
      };

      state.activeWorkspace.shortcuts.push(newShortcut);
    },

    setActiveShortcut(state, index) {
      state.activeWorkspace.shortcuts.forEach(shortcut => {
        shortcut.active = false;
      });
      state.activeWorkspace.shortcuts[index].active = true;
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
      console.log("supdateShortcut", state.activeWorkspace.shortcuts);
      const index = data.index;
      const options = data.options;
      state.activeWorkspace.shortcuts[index] = Object.assign(
        state.activeWorkspace.shortcuts[index],
        options
      );
    },

    deleteShortcut(state, indexShortcut) {
      state.activeWorkspace.shortcuts.splice(indexShortcut, 1);
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

          const workspaces = response.data.workspaces;
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
                  },
                  {
                    title: "Test user",
                    description: "",
                    active: true,
                    rows: [
                      {
                        title: "\u0421\u0442\u0440\u043e\u043a\u0430 1",
                        height: 50,
                        minimize: false,
                        cells: [
                          {
                            title:
                              "\u041e\u0431\u043e\u0440\u0443\u0434\u043e\u0432\u0430\u043d\u0438\u0435",
                            content: "",
                            width: 50,
                            minimize: false,
                            apiLink:
                              "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvcmVwb3J0cy9lcXVpcG1lbnRzLmh0bWw,",
                            itemId: 25
                          },
                          {
                            title:
                              "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430",
                            content: "",
                            width: 50,
                            minimize: false,
                            apiLink:
                              "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvc3RhdGlzdGljcy5odG1s",
                            itemId: 35
                          }
                        ]
                      },
                      {
                        title: "\u0421\u0442\u0440\u043e\u043a\u0430 2",
                        height: 50,
                        minimize: false,
                        cells: [
                          {
                            title:
                              "\u0410\u043d\u0442\u0438\u0432\u0430\u043d\u0434\u0430\u043b\u044c\u043d\u044b\u0435 \u044f\u0449\u0438\u043a\u0438",
                            content: "",
                            width: 50,
                            minimize: false,
                            apiLink:
                              "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvdmFuZGFsYm94ZXMv",
                            itemId: 28
                          },
                          {
                            title:
                              "\u0416\u0443\u0440\u043d\u0430\u043b \u0440\u0430\u0431\u043e\u0442",
                            content: "",
                            width: 50,
                            minimize: false,
                            apiLink:
                              "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvam9ibG9nLw,,",
                            itemId: 27
                          }
                        ]
                      }
                    ],
                    savedWorkspace: [
                      {
                        title: "\u0421\u0442\u0440\u043e\u043a\u0430 1",
                        height: 50,
                        minimize: false,
                        cells: [
                          {
                            title:
                              "\u041e\u0431\u043e\u0440\u0443\u0434\u043e\u0432\u0430\u043d\u0438\u0435",
                            content: "",
                            width: 50,
                            minimize: false,
                            apiLink:
                              "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvcmVwb3J0cy9lcXVpcG1lbnRzLmh0bWw,",
                            itemId: 25
                          },
                          {
                            title:
                              "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430",
                            content: "",
                            width: 50,
                            minimize: false,
                            apiLink:
                              "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvc3RhdGlzdGljcy5odG1s",
                            itemId: 35
                          }
                        ]
                      },
                      {
                        title: "\u0421\u0442\u0440\u043e\u043a\u0430 2",
                        height: 50,
                        minimize: false,
                        cells: [
                          {
                            title:
                              "\u0410\u043d\u0442\u0438\u0432\u0430\u043d\u0434\u0430\u043b\u044c\u043d\u044b\u0435 \u044f\u0449\u0438\u043a\u0438",
                            content: "",
                            width: 50,
                            minimize: false,
                            apiLink:
                              "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvdmFuZGFsYm94ZXMv",
                            itemId: 28
                          },
                          {
                            title:
                              "\u0416\u0443\u0440\u043d\u0430\u043b \u0440\u0430\u0431\u043e\u0442",
                            content: "",
                            width: 50,
                            minimize: false,
                            apiLink:
                              "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvam9ibG9nLw,,",
                            itemId: 27
                          }
                        ]
                      }
                    ]
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
              lists: {
                groups: [
                  { gid: "1", level: "100", groupname: "Administrator" },
                  { gid: "2", level: "70", groupname: "Manager" },
                  { gid: "3", level: "50", groupname: "Publisher" },
                  { gid: "4", level: "30", groupname: "Author" },
                  { gid: "5", level: "2", groupname: "User" },
                  { gid: "6", level: "1", groupname: "External user" },
                  { gid: "7", level: "0", groupname: "Guest" }
                ]
              },
              presets: [
                {
                  title: "Test user",
                  description: "",
                  active: true,
                  rows: [
                    {
                      title: "\u0421\u0442\u0440\u043e\u043a\u0430 1",
                      height: 50,
                      minimize: false,
                      cells: [
                        {
                          title:
                            "\u041e\u0431\u043e\u0440\u0443\u0434\u043e\u0432\u0430\u043d\u0438\u0435",
                          content: "",
                          width: 50,
                          minimize: false,
                          apiLink:
                            "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvcmVwb3J0cy9lcXVpcG1lbnRzLmh0bWw,",
                          itemId: 25,
                          currentLink:
                            "http://system.elxis.test/inner.php/speedcams/reports/equipments.html"
                        },
                        {
                          title:
                            "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430",
                          content: "",
                          width: 50,
                          minimize: false,
                          apiLink:
                            "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvc3RhdGlzdGljcy5odG1s",
                          itemId: 35,
                          currentLink:
                            "http://system.elxis.test/inner.php/speedcams/statistics.html"
                        }
                      ]
                    },
                    {
                      title: "\u0421\u0442\u0440\u043e\u043a\u0430 2",
                      height: 50,
                      minimize: false,
                      cells: [
                        {
                          title:
                            "\u0410\u043d\u0442\u0438\u0432\u0430\u043d\u0434\u0430\u043b\u044c\u043d\u044b\u0435 \u044f\u0449\u0438\u043a\u0438",
                          content: "",
                          width: 50,
                          minimize: false,
                          apiLink:
                            "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvdmFuZGFsYm94ZXMv",
                          itemId: 28,
                          currentLink:
                            "http://system.elxis.test/inner.php/speedcams/vandalboxes/"
                        },
                        {
                          title:
                            "\u0416\u0443\u0440\u043d\u0430\u043b \u0440\u0430\u0431\u043e\u0442",
                          content: "",
                          width: 50,
                          minimize: false,
                          apiLink:
                            "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvam9ibG9nLw,,",
                          itemId: 27,
                          currentLink:
                            "http://system.elxis.test/inner.php/speedcams/joblog/"
                        }
                      ]
                    }
                  ]
                }
              ],
              groupPresets: [],
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

    actionSaveSettingsDesktop({ state }) {
      const workspaces = state.workspaces;

      axios({
        method: "post",
        headers: { "Content-Type": "application/form-data" },
        //url: 'http://esv.elxis.test/extusers/fpage/savedesktop/',
        url: window.location.href + "extusers/fpage/savedesktop/",
        data: {
          settings: workspaces
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

    actionCreateNewShortcut({ commit, state }, options) {

      const shortcuts = state.activeWorkspace.shortcuts;
      const element = options.element;
      const error = options.error;
      const existShortcut = shortcuts.some(shortcut => {
        return element.id == shortcut.id;
      });

      if (!existShortcut) {
        commit("createNewShortcut", element);
      } else {
        commit("setError", error);
      }
    },

    actionSetActiveShortcut({ commit }, index) {
      commit("setActiveShortcut", index);
    },

    actionSetNotActiveShortcuts({ commit }) {
      commit("setNotActiveShortcuts");
    },

    actionUpdateOrderShortcuts({ commit }, data) {
      commit("updateOrderShortcuts", data);
    },

    actionDeleteShortcut({ commit }, index) {
      commit("deleteShortcut", index);
    },

    actionUpdateShortcut({ commit }, data) {
      commit("updateShortcut", data);
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
        shorcut
      ) {
        return shorcut.active;
      });
      return activeShortcuts.length > 0 ? true : false;
    }
  }
};
