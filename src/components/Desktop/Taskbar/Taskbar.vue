<template>
  <v-footer class="mainboard-taskbar" dark color="primary">
    <v-menu
      v-model="contextMenuMinimizeButton.visible"
      :position-x="contextMenuMinimizeButton.x"
      :position-y="contextMenuMinimizeButton.y"
      class="mainboard-taskbar__context-menu-minimize-button context-menu"
      absolute
      offset-y
      light
    >
      <v-list dense>
        <v-list-tile class="context-menu__tile" @click="closeWindow">
          <v-list-tile-title @click="''">{{ $t('window.close') }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <!-- <v-toolbar-side-icon></v-toolbar-side-icon> -->
    <!-- <v-btn
          color="primary"
          @click="toggleVisibleStartMenu"
        >
          <v-icon>home</v-icon>
    </v-btn>-->
    <mainboard-startmenu :height-workspace="heightWorkspace"/>

    <div class="mainboard-taskbar__minimize-windows" ref="container">
      <v-btn
        v-for="window in windows"
        :key="window.id"
        :color="(!window.minimize) ? 'primary' : 'minimizeWindowTaskbar'"
        class="mainboard-taskbar__btn-minimize-window"
        :style="{'minWidth': widthBtnMinimizeWindows + '%', 'width': widthBtnMinimizeWindows + '%'}"
        @click="toggleMinimizedWindow(window)"
        @contextmenu.prevent.stop="showContextMenuMinimizeButton(window.id, $event)"
      >
        <!-- <div class="btn-minimize-window__container"> -->
        <i v-if="window.minimize" class="material-icons" small>expand_less</i>
        <span
          :title="window.title"
          class="mainboard-taskbar__minimize-window-title"
        >{{ window.title }}</span>
        <!-- </div> -->
      </v-btn>
    </div>

    <v-spacer/>
    <mainboard-system-clock/>
    <v-btn
      v-if="!showBtnRestoreMinimizeWindow"
      :title=" $t('windows.minimize') "
      class="btn-minimize-windows"
      color="primary"
      @click="minimizeWindows"
    >
      <v-icon>expand_more</v-icon>
    </v-btn>
    <v-btn
      v-if="showBtnRestoreMinimizeWindow"
      :title=" $t('windows.restore') "
      class="btn-restore-windows"
      color="primary"
      @click="restoreMinimizeWindows"
    >
      <v-icon>expand_less</v-icon>
    </v-btn>
  </v-footer>
</template>

<script>
import StartMenu from "@/components/Desktop/Taskbar/Startmenu.vue";
import SystemClock from "@/components/Desktop/Taskbar/SystemClock.vue";
export default {
  components: {
    mainboardStartmenu: StartMenu,
    mainboardSystemClock: SystemClock
  },
  data() {
    return {
      maxWidthTitle: 85,
      visibleTaskbar: true,
      arrIndexesWindowsRestore: [],
      idCloseWindow: null,
      contextMenuMinimizeButton: {
        visible: false,
        x: 0,
        y: 0
      }
    };
  },

  computed: {
    showBtnRestoreMinimizeWindow() {
      return this.arrIndexesWindowsRestore.length;
    },

    windows() {
      return this.$store.getters.windows;
    },

    widthBtnMinimizeWindows() {
      const countWindows = this.windows.length + 1;
      const widthContainer = this.$refs.container.clientWidth;
      const widthBtnMinimizeWindows =
        Math.floor(widthContainer / countWindows) - 10;

      if (widthBtnMinimizeWindows > 100) {
        console.log("widthBtnMinimizeWindows 1", widthBtnMinimizeWindows);
        console.log(
          "widthBtnMinimizeWindows 1 return",
          (100 * 100) / widthContainer
        );
        return (100 * 100) / widthContainer;
      } else {
        console.log("widthBtnMinimizeWindows 2", widthBtnMinimizeWindows);
        console.log(
          "widthBtnMinimizeWindows 2 return",
          (100 * widthBtnMinimizeWindows) / widthContainer
        );
        return (100 * widthBtnMinimizeWindows) / widthContainer;
      }
    },

    heightWorkspace() {
      return this.$store.state.desktop.heightWorkspace;
    }
  },

  methods: {
    toggleVisibleTaskbar() {
      this.visibleTaskbar = !this.visibleTaskbar;
    },

    toggleMinimizedWindow(window) {
      this.arrIndexesWindowsRestore = [];
      if (window.minimize) {
        this.$store.commit("toggleMinimizeWindow", window.id);
        this.$store.commit("setActiveWindow", window.id);
      } else if (!window.active) {
        this.$store.commit("setActiveWindow", window.id);
      } else {
        this.$store.commit("toggleMinimizeWindow", window.id);
      }
      this.$store.dispatch("actionSaveSettingsDesktop");
    },

    toggleVisibleStartMenu() {
      this.$store.dispatch("actionToggleVisibleStartMenu");
    },

    titleMinimizeWindow(title) {
      return title.length < 10 ? title : title.substr(0, 10) + "...";
    },

    minimizeWindows() {
      this.windows.forEach((window, index) => {
        if (!window.minimize) {
          this.arrIndexesWindowsRestore.push(index);
        }
      });
      this.$store.commit("minimizeWindows");
    },

    restoreMinimizeWindows() {
      this.$store.commit(
        "restoreMinimizeWindows",
        this.arrIndexesWindowsRestore
      );
      this.arrIndexesWindowsRestore = [];
    },

    showContextMenuMinimizeButton(id, event) {
      event.preventDefault();
      this.idCloseWindow = id;
      this.contextMenuMinimizeButton.visible = false;
      this.contextMenuMinimizeButton.x = event.clientX;
      this.contextMenuMinimizeButton.y = event.clientY;
      this.$nextTick(() => {
        this.contextMenuMinimizeButton.visible = true;
      });
    },

    closeWindow() {
      this.arrIndexesWindowsRestore = [];
      this.$store.dispatch("actionCloseWindow", this.idCloseWindow).then(() => {
        this.$store.dispatch("actionSaveSettingsDesktop");
      });
    }
  }
};
</script>

<style scoped>
.mainboard-taskbar__minimize-windows {
  width: 100%;
  height: 100%;
}
.mainboard-taskbar__minimize-window-title {
  /* max-width: 85px; */
  /*   display: block;
  width: 100%; */
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mainboard-taskbar__btn-minimize-window {
  /* width: 100px;
  max-width: 100px; */
  margin: 2px 3px;
  padding: 1px;
}

.btn-minimize-windows,
.btn-restore-windows {
  min-width: 30px;
  padding: 0 10px;
}
</style>
