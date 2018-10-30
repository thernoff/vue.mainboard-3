<template>
  <!-- <v-footer app dark color="primary"> -->
  <v-footer
    class="mainboard-taskbar"
    dark
    color="primary"
  >
    <v-menu
      v-model="contextMenuMinimizeButton.visible"
      v-bind:position-x="contextMenuMinimizeButton.x"
      v-bind:position-y="contextMenuMinimizeButton.y"
      class="mainboard-taskbar__context-menu-minimize-button context-menu"
      absolute
      offset-y
      light
    >
      <v-list dense>
        <v-list-tile
          class="context-menu__tile"
          v-on:click="closeWindow"
        >
          <v-list-tile-title
            v-on:click="''"
          >
            {{ $t('window.close') }}
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <!-- <v-toolbar-side-icon></v-toolbar-side-icon> -->
    <!-- <v-btn
          color="primary"
          @click="toggleVisibleStartMenu"
        >
          <v-icon>home</v-icon>
      </v-btn> -->
    <mainboard-startmenu :height-workspace="heightWorkspace"/>
    <v-btn
      v-for="(window, index) in windows"
      v-if="!window.closed"
      v-bind:key="index"
      v-bind:color="(!window.minimize) ? 'primary' : 'minimizeWindowTaskbar'"
      v-bind:style="{minWidth: widthBtnMinimizeWindows + '%', width: widthBtnMinimizeWindows + '%'}"
      class="mainboard-taskbar__btn-minimize-window"
      v-on:click="toggleMinimizedWindow(index, window.minimize)"
      v-on:contextmenu.prevent.stop="showContextMenuMinimizeButton(index, $event)"
    >
      <i
        v-if="window.minimize"
        class="material-icons"
        small>
        expand_less
      </i>
      <span
        v-bind:title="window.title"
        class="mainboard-taskbar__minimize-window">
        {{ titleMinimizeWindow(window.title) }}
      </span>
    </v-btn>
    <v-spacer/>
    <mainboard-system-clock/>
    <v-btn
      v-if="!showBtnRestoreMinimizeWindow"
      class="btn-minimize-windows"
      color="primary"
      v-bind:title=" $t('windows.minimize') "
      v-on:click="minimizeWindows"
    >
      <v-icon>expand_more</v-icon>
    </v-btn>
    <v-btn
      v-if="showBtnRestoreMinimizeWindow"
      class="btn-restore-windows"
      color="primary"
      v-bind:title=" $t('windows.restore') "
      v-on:click="restoreMinimizeWindows"
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
      visibleTaskbar: true,
      arrIndexesWindowsRestore: [],
      indexCloseWindow: null,
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
      const countWindows = this.windows.length + 3;
      const widthGrid = this.$store.getters.widthGrid;
      const widthBtnMinimizeWindows = widthGrid / countWindows;
      return widthBtnMinimizeWindows > 120
        ? Math.floor((1000 * 120) / widthGrid) / 10
        : Math.floor((1000 * widthBtnMinimizeWindows) / widthGrid) / 10;
    },

    heightWorkspace() {
      return this.$store.state.desktop.heightWorkspace;
    }
  },

  methods: {
    toggleVisibleTaskbar() {
      this.visibleTaskbar = !this.visibleTaskbar;
    },

    toggleMinimizedWindow(index, minimize) {
      console.log("minimize", minimize, index);
      this.arrIndexesWindowsRestore = [];
      this.$store.commit("toggleMinimizeWindow", index);
      if (minimize) {
        this.$store.commit("setActiveWindow", index);
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
      this.$store.dispatch("actionMinimizeWindows");
    },

    restoreMinimizeWindows() {
      this.$store
        .dispatch("actionRestoreMinimizeWindows", this.arrIndexesWindowsRestore)
        .then((this.arrIndexesWindowsRestore = []));
    },

    showContextMenuMinimizeButton(index, event) {
      event.preventDefault();
      this.indexCloseWindow = index;
      this.contextMenuMinimizeButton.visible = false;
      this.contextMenuMinimizeButton.x = event.clientX;
      this.contextMenuMinimizeButton.y = event.clientY;
      this.$nextTick(() => {
        this.contextMenuMinimizeButton.visible = true;
      });
    },

    closeWindow() {
      this.arrIndexesWindowsRestore = [];
      this.$store.dispatch("actionCloseWindow", this.indexCloseWindow);
      this.$store.dispatch("actionSaveSettingsDesktop");
    }
  }
};
</script>

<style scoped>
.mainboard-taskbar__minimize-window {
  max-width: 85px;
  overflow: hidden;
  font-size: 12px;
}

.mainboard-taskbar__btn-minimize-window {
  max-width: 120px;
  margin: 8px 3px;
  padding: 5px;
}

.btn-minimize-windows,
.btn-restore-windows {
  min-width: 30px;
  padding: 0 10px;
}
</style>
