<template>
  <v-app class="mainboard">
    <!--Компонент диалогового окна для создания пользовательского ярлыка-->
    <mainboard-dialog-window-create-shortcut
      :visible="visibleDialogWindowCreateShortcut"
      @hideDialogWindow="createCustomShortcut"
    />
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
        <!-- <v-list-tile
          @click="showDialogWindowCreateShortcut"
        >
          <v-list-tile-title
            @click="''"
          >
            {{ $t('shortcut.create') }}
          </v-list-tile-title>
        </v-list-tile>

        <v-list-tile
          @click="''"
        >
          <v-list-tile-title
            @click="''"
          >
            {{ $t('shortcuts.order') }}
          </v-list-tile-title>
        </v-list-tile> -->

        <v-list-tile
          @click="showDialogWindowCreateFolder"
        >
          <v-list-tile-title
            @click="''"
          >
            {{ $t('shortcut.create_folder') }}
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>

    <!-- <v-navigation-drawer app temporary></v-navigation-drawer> -->

    <!--Компонент верхнего тулбара-->
    <mainboard-toolbar class="mainboard-toolbar"/>

    <!--Компонент рабочей области (используется для отображения остальных компонентов)-->
    <div
      ref="workspace"
      class="mainboard-workspace"
      @contextmenu.stop.prevent="showContextMenu"
    >
      <!-- <mainboard-cover
        v-if="visibleStartmenu"
        v-on:click.native="toggleVisibleStartMenu"
      >
      </mainboard-cover> -->
      <!-- <v-container fluid> -->
      <!-- <v-layout row wrap> -->
      <!-- <mainboard-shortcut-list :shortcuts="shortcuts" /> -->

      <!--Компонент ярлыка для таких сущностей как folder и frame-->
      <mainboard-desktop-shortcut
        v-for="(shortcut, index) in shortcutsNotHaveFolder"
        :key="shortcut.id"
        :index="index"
        :id="shortcut.id"
        :options="shortcut"
      />

      <!--Компонент окна для отображения такой сущности как frame-->
      <mainboard-frame-window
        v-for="(window, index) in frameWindows"
        v-show="!window.minimize"
        :key="window.id"
        :id="window.id"
        :index="index"
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
      <mainboard-grid
        ref="grid"
      />

      <!-- </v-layout> -->
      <!-- <mainboard-startmenu v-bind:heightWorkspace="heightWorkspace"></mainboard-startmenu> -->
      <!-- <router-view></router-view> -->
      <!-- </v-container> -->
    </div>

    <!--Компонент нижней панели задач-->
    <mainboard-taskbar class="mainboard-taskbar"/>

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
        <v-btn
          dark
          flat
          @click="closeError"
        >
          {{ $t('close') }}
        </v-btn>
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
import FileManager from "@/components/Desktop/Window/FileManager.vue";
import Grid from "@/components/Desktop/Grid.vue";
import Cover from "@/components/Desktop/Cover.vue";
import DesktopShortcut from "@/components/Desktop/Icon/DesktopShortcut.vue";
import ShortcutList from "@/components/Desktop/Icon/ShortcutList.vue";
import ResizableBlock from "@/components/Desktop/ResizableBlock.vue";
import DialogWindowCreateShortcut from "@/components/Desktop/Dialogs/DialogWindowCreateShortcut.vue";
import DialogWindowCreateFolder from "@/components/Desktop/Dialogs/DialogWindowCreateFolder.vue";

import axios from "axios";

export default {
  name: "App",

  components: {
    mainboardTaskbar: Taskbar,
    mainboardToolbar: Toolbar,
    mainboardStartmenu: Startmenu,
    mainboardFrameWindow: FrameWindow,
    mainboardFolderWindow: FolderWindow,
    mainboardFileManager: FileManager,
    mainboardGrid: Grid,
    mainboardCover: Cover,
    mainboardDesktopShortcut: DesktopShortcut,
    mainboardShortcutList: ShortcutList,
    mainboardResizableBlock: ResizableBlock,
    mainboardDialogWindowCreateShortcut: DialogWindowCreateShortcut,
    mainboardDialogWindowCreateFolder: DialogWindowCreateFolder
  },
  data() {
    return {
      visibleDialogWindowCreateShortcut: false,
      visibleDialogWindowCreateFolder: false,
      contextMenu: {
        visible: false,
        x: 0,
        y: 0
      }
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
      console.log(
        "folderWindows this.$store.getters.folderWindows",
        this.$store.getters.folderWindows
      );
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
    }
  },

  watch: {
    shortcuts() {
      //console.log("watch shortcuts", this.shortcuts);
    }
  },

  beforeCreate() {
    const dictonary = {};
    axios
      //.get(window.location.href + "extusers/fpage/dictonary/")
      .get("/extusers/fpage/dictonary/")
      .then(response => {
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
    this.$store.dispatch("actionGetDashboard");
  },

  mounted() {
    //console.log("process.env.NODE_ENV", process.env.NODE_ENV);
    const self = this;

    this.$store.commit("setWidthWorkspace", this.$refs.workspace.clientWidth);
    this.$store.commit("setHeightWorkspace", this.$refs.workspace.clientHeight);

    window.addEventListener("resize", function() {
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
      this.$store.dispatch("actionClearError");
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
        this.$store.dispatch("actionCreateNewShortcut", options);
        this.$store.dispatch("actionSaveSettingsDesktop");
      }
    },

    createFolder(folder) {
      this.visibleDialogWindowCreateFolder = false;
      if (folder) {
        this.$store.dispatch("actionCreateNewFolder", {
          folder,
          error: ""
        });
        this.$store.dispatch("actionSaveSettingsDesktop");
      }
    },

    async getDictonary() {
      const dictonary = {};
      try {
        const response = await axios.get("/extusers/fpage/dictonary/");
        console.log("getDictonary response", response);
        dictonary[response.data.lang] = response.data.dictonary;
      } catch (error) {
        console.log("error", error);
      }

      return dictonary;
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
</style>
