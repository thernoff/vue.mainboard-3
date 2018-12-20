<template>
  <v-app class="mainboard">
    <!--Компонент верхнего тулбара-->
    <mainboard-toolbar class="mainboard-toolbar"/>

    <!--Компонент рабочей области (используется для отображения остальных компонентов)-->
    <div
      ref="workspace"
      :class="{'mainboard-workspace--nogrid': !isModeGrid}"
      class="mainboard-workspace"
      @contextmenu.stop.prevent="showContextMenu"
    >
      <mainboard-demo-info-widget v-if="isDemo"/>
      <mainboard-placeholder-shortcut/>
      <!--Компонент ярлыка для таких сущностей как folder и frame (отображаются только те ярлыки, которые не принадлежат ни одной папке)-->
      <mainboard-desktop-shortcut
        v-for="shortcut in shortcutsNotHaveFolder"
        :key="shortcut.id"
        :id="shortcut.id"
        :options="shortcut"
      />

      <!--Компонент окна для отображения такой сущности как frame-->
      <mainboard-frame-window
        v-for="window in frameWindows"
        v-show="!window.minimize"
        :key="window.id"
        :id="window.id"
        :options="window"
        @contextmenu.stop.prevent="''"
      />

      <!--Компонент окна для отображения такой сущности как folder-->
      <mainboard-folder-window
        v-for="window in folderWindows"
        v-show="!window.minimize"
        :key="window.id"
        :id="window.id"
        :options="window"
        @contextmenu.stop.prevent="''"
      />

      <!--Компонент сетки к которой происходит выравнивание ярлыков и окон при перемещении (при условии если выбран соответствующий режим)-->
      <mainboard-grid ref="grid"/>
    </div>

    <!--Компонент нижней панели задач-->
    <mainboard-taskbar class="mainboard-taskbar"/>

    <!--Компонент диалогового окна для отображения загрузочного экрана-->
    <v-dialog v-model="dialogLoading" class="mainboard-loading" fullscreen hide-overlay persistent>
      <div class="mainboard-loading__container text-md-center">
        <v-layout align-center justify-center column fill-height>
          <div class="mainboard-loading__progress">
            <img src="@/assets/logo-incom-loading.png">
            <v-progress-linear :indeterminate="true" color="deep-orange"/>
          </div>
          <div class="mainboard-loading__title">
            <span>{{ $t("loading") }}</span>
          </div>
        </v-layout>
      </div>
    </v-dialog>

    <v-dialog v-model="dialogChangePasswordForm" width="400px" persistent>
      <mainboard-change-password-form :user="user"/>
    </v-dialog>

    <!--Компонент диалогового окна для создания пользовательского ярлыка-->
    <!-- <mainboard-dialog-window-create-shortcut
      :visible="visibleDialogWindowCreateShortcut"
      @hideDialogWindow="createCustomShortcut"
    />-->
    <!--Компонент диалогового окна для создания папки-->
    <mainboard-dialog-window-create-folder
      :visible="visibleDialogWindowCreateFolder"
      @hideDialogWindow="createFolder"
    />
    <!--Компонент контекстного меню (вызывается щелчком правой кнопки мыши по рабочему столу)-->
    <v-menu
      v-model="contextMenu.visible"
      :position-x="contextMenu.x"
      :position-y="contextMenu.y"
      absolute
      offset-y
    >
      <v-list>
        <v-list-tile @click="sortShortcuts">
          <v-list-tile-title @click="''">{{ $t('shortcuts.sort') }}</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="showDialogWindowCreateFolder">
          <v-list-tile-title @click="''">{{ $t('shortcut.create_folder') }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>

    <!--Компонент для вывода сообщений-->
    <template v-if="message">
      <v-snackbar
        :multi-line="true"
        :timeout="3000"
        :value="true"
        color="green"
        @input="closeMessage"
      >
        {{ message }}
        <v-btn dark flat @click="closeMessage">{{ $t('close') }}</v-btn>
      </v-snackbar>
    </template>

    <!--Компонент для вывода ошибок-->
    <template v-if="error">
      <v-snackbar
        :multi-line="true"
        :timeout="3000"
        :value="true"
        color="error"
        @input="closeError"
      >
        {{ error }}
        <v-btn dark flat @click="closeError">{{ $t('close') }}</v-btn>
      </v-snackbar>
    </template>
  </v-app>
</template>

<script>
import Taskbar from "@/components/Desktop/Taskbar/Taskbar.vue";
import Toolbar from "@/components/Desktop/Toolbar/Toolbar.vue";
import Startmenu from "@/components/Desktop/Taskbar/Startmenu.vue";
import FrameWindow from "@/components/Desktop/Window/FrameWindow.vue";
import FolderWindow from "@/components/Desktop/Window/FolderWindow.vue";
import Grid from "@/components/Desktop/Grid.vue";
import Cover from "@/components/Desktop/Cover.vue";
import DesktopShortcut from "@/components/Desktop/Icon/DesktopShortcut.vue";
import DialogWindowCreateShortcut from "@/components/Desktop/Dialogs/DialogWindowCreateShortcut.vue";
import DialogWindowCreateFolder from "@/components/Desktop/Dialogs/DialogWindowCreateFolder.vue";
import DemoInfoWidget from "@/components/Desktop/Widgets/DemoInfoWidget.vue";
import PlaceholderShortcut from "@/components/Desktop/Icon/PlaceholderShortcut.vue";
import ChangePasswordForm from "@/components/Desktop/ModalWindows/ChangePasswordForm.vue";

import axios from "axios";

export default {
  name: "App",

  components: {
    mainboardTaskbar: Taskbar,
    mainboardToolbar: Toolbar,
    mainboardStartmenu: Startmenu,
    mainboardFrameWindow: FrameWindow,
    mainboardFolderWindow: FolderWindow,
    mainboardGrid: Grid,
    mainboardCover: Cover,
    mainboardDesktopShortcut: DesktopShortcut,
    mainboardDialogWindowCreateShortcut: DialogWindowCreateShortcut,
    mainboardDialogWindowCreateFolder: DialogWindowCreateFolder,
    mainboardDemoInfoWidget: DemoInfoWidget,
    mainboardPlaceholderShortcut: PlaceholderShortcut,
    mainboardChangePasswordForm: ChangePasswordForm
  },
  data() {
    return {
      visibleDialogWindowCreateShortcut: false,
      visibleDialogWindowCreateFolder: false,
      visibleSideBar: false,
      contextMenu: {
        visible: false,
        x: 0,
        y: 0
      },
      dialogLoading: true,
      dialogChangePasswordForm: false
    };
  },

  computed: {
    visibleStartmenu() {
      return this.$store.getters.visibleStartmenu;
    },

    isModeGrid() {
      return this.$store.getters.isModeGrid;
    },

    windows() {
      return this.$store.getters.windows;
    },

    frameWindows() {
      return this.$store.getters.frameWindows;
    },

    folderWindows() {
      return this.$store.getters.folderWindows;
    },

    shortcuts() {
      return this.$store.getters.shortcuts;
    },

    shortcutsNotHaveFolder() {
      return this.shortcuts.filter(shortcut => {
        return !shortcut.folderId;
      });
    },

    error() {
      return this.$store.getters.error;
    },

    message() {
      return this.$store.getters.message;
    },

    isDemo() {
      const position = window.location.href.search(/demo/);
      if (position > 0) {
        return true;
      }
      return false;
    },

    user() {
      return this.$store.getters.user;
    },

    changePasswordForm() {
      const actionChangePassword = this.$store.state.user.user.actions.find(
        action => action === "CHANGE_PASSWORD"
      );
      return actionChangePassword ? true : false;
    }
  },

  watch: {
    changePasswordForm(newVal, oldVal) {
      this.dialogChangePasswordForm = newVal;
    }
  },

  beforeCreate() {
    const dictonary = {};
    axios.get("/extusers/fpage/dictonary/").then(response => {
      const lang = response.data.lang;
      dictonary[lang] = response.data.dictonary;
      this.$i18n.setLocaleMessage(lang, dictonary[lang]);
      this.$i18n.locale = lang;
    });

    /* const promise = this.getDictonary();
    console.log("created promise", promise);
    promise.then(response => {
      console.log("response", response);
      this.$i18n.setLocaleMessage("ru", response["ru"]);
      this.$i18n.locale = "ru";
    }); */
  },

  created() {
    this.$store.dispatch("actionGetDashboard").then(() => {
      const self = this;
      setTimeout(() => {
        self.dialogLoading = false;
        self.dialogChangePasswordForm = self.changePasswordForm;
      }, 800);
    });
  },

  mounted() {
    //console.log("process.env.NODE_ENV", process.env.NODE_ENV);
    const self = this;

    this.$store.commit("setWidthWorkspace", this.$refs.workspace.clientWidth);
    this.$store.commit("setHeightWorkspace", this.$refs.workspace.clientHeight);

    window.addEventListener("resize", () => {
      self.$store.commit("setWidthWorkspace", self.$refs.workspace.clientWidth);
      self.$store.commit(
        "setHeightWorkspace",
        self.$refs.workspace.clientHeight
      );
    });

    $(".mainboard-workspace").droppable({
      accept: ".mainboard-shortcut, .mainboard-startmenu__item",
      drop: function(event, ui) {
        var $dragElement = $(ui.draggable);
        var elementId = ui.draggable.data("id");
        // Если перетаскиваемый объект является значком папки рабочего стола
        if (
          $dragElement.hasClass("mainboard-folder-shortcut") &&
          !$dragElement.hasClass("over-folder-window")
        ) {
          self.$store.dispatch("actionMoveElementFromFolderToDesktop", {
            elementId
          });
        }

        // Если перетаскиваемый объект является пунктом меню Пуск
        /* if ($dragElement.hasClass("mainboard-startmenu__item")) {
          var object = self.$store.getters.itemStartmenuById(elementId);
          self.$store.dispatch("actionCreateNewShortcut", {
            object,
            typeObject: "frame",
            error: self.$t("errors.shortcut_exist")
          });
          self.$store.dispatch("actionSaveSettingsDesktop");
        } */
      }
    });
  },

  methods: {
    toggleVisibleStartMenu() {
      this.$store.dispatch("actionToggleVisibleStartMenu");
    },

    closeError() {
      this.$store.commit("clearError");
    },

    closeMessage() {
      this.$store.commit("clearMessage");
    },

    showContextMenu(event) {
      event.preventDefault();

      this.contextMenu.visible = false;
      this.contextMenu.x = event.clientX;
      this.contextMenu.y = event.clientY;
      this.$nextTick(() => {
        this.contextMenu.visible = true;
      });
    },

    showDialogWindowCreateShortcut() {
      this.visibleDialogWindowCreateShortcut = true;
    },

    sortShortcuts() {
      this.$store.dispatch("actionSortShortcuts").then(() => {
        this.$store.dispatch("actionSaveSettingsDesktop");
      });
    },

    showDialogWindowCreateFolder() {
      this.visibleDialogWindowCreateFolder = true;
    },

    createCustomShortcut(customShortcut) {
      this.visibleDialogWindowCreateShortcut = false;
      if (customShortcut) {
        const options = {
          object: customShortcut,
          folderId: 0,
          error: ""
        };
        this.$store.dispatch("actionCreateNewShortcut", options).then(() => {
          this.$store.dispatch("actionSaveSettingsDesktop");
        });
      }
    },

    createFolder(folder) {
      this.visibleDialogWindowCreateFolder = false;
      if (folder) {
        this.$store
          .dispatch("actionCreateNewFolder", {
            folder,
            error: ""
          })
          .then(() => {
            this.$store.dispatch("actionSaveSettingsDesktop");
          });
      }
    },

    async getDictonary() {
      const dictonary = {};
      try {
        const response = await axios.get("/extusers/fpage/dictonary/");
        dictonary[response.data.lang] = response.data.dictonary;
      } catch (error) {
        console.log("error", error);
      }

      return dictonary;
    },

    handlerShowDrawer() {
      this.visibleSideBar = true;
    },

    hideShowDrawer(visibleSideBar) {
      if (!visibleSideBar) {
        this.visibleSideBar = visibleSideBar;
      }
    }
  }
};
</script>

<style scoped>
.mainboard {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.mainboard-workspace {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.mainboard-loading__container {
  height: 100%;
  background-color: rgb(51, 60, 68);
  border-color: rgb(51, 60, 68);
}

.mainboard-loading__progress {
  width: 150px;
  text-align: center;
}

.mainboard-loading__title {
  font-size: 16px;
  color: #fff;
}
</style>
