<template>

  <v-app class="mainboard">
    <mainboard-dialog-window-create-shortcut
      :visible="visibleDialogWindowCreateShortcut"
      @hideDialogWindow="createCustomShortcut"
    />
    <v-menu
      v-model="contextMenu.visible"
      :position-x="contextMenu.x"
      :position-y="contextMenu.y"
      absolute
      offset-y
    >
      <v-list>
        <v-list-tile
          @click="showDialogWindowCreateShortcut"
        >
          <v-list-tile-title
            @click="''"
          >
            {{ dictonary.CREATE_SHORTCUT }}
          </v-list-tile-title>
        </v-list-tile>

        <v-list-tile
          @click="''"
        >
          <v-list-tile-title
            @click="''"
          >
            {{ dictonary.ORDER_SHORTCUT }}
          </v-list-tile-title>
        </v-list-tile>

      </v-list>
    </v-menu>
    <!-- <v-navigation-drawer app temporary></v-navigation-drawer> -->
    <mainboard-toolbar class="mainboard-toolbar"/>

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
      <mainboard-shortcut-list :shortcuts="shortcuts"/>
      <mainboard-window
        v-for="(window, index) in windows"
        v-show="!window.minimize"
        :key="window.id"
        :index="index"
        :options="window"
      />
      <mainboard-grid
        ref="grid"
      />
      <!-- </v-layout> -->
      <!-- <mainboard-startmenu v-bind:heightWorkspace="heightWorkspace"></mainboard-startmenu> -->
      <!-- <router-view></router-view> -->
      <!-- </v-container> -->
    </div>
    <mainboard-taskbar class="mainboard-taskbar"/>
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
          {{ dictonary.CLOSE }}
        </v-btn>
      </v-snackbar>
    </template>
  </v-app>

</template>

<script>
import dictonary from "@/languages/ru.js";
import Taskbar from "@/components/Desktop/Taskbar/Taskbar.vue";
import Toolbar from "@/components/Desktop/Toolbar/Toolbar.vue";
import Startmenu from "@/components/Desktop/Taskbar/Startmenu.vue";
import Window from "@/components/Desktop/Window.vue";
import Grid from "@/components/Desktop/Grid.vue";
import Cover from "@/components/Desktop/Cover.vue";
import Shortcut from "@/components/Desktop/Shortcut.vue";
import ShortcutList from "@/components/Desktop/ShortcutList.vue";
import ResizableBlock from "@/components/Desktop/ResizableBlock.vue";
import DialogWindowCreateShortcut from "@/components/Desktop/DialogWindowCreateShortcut.vue";

export default {
  name: "App",

  components: {
    mainboardTaskbar: Taskbar,
    mainboardToolbar: Toolbar,
    mainboardStartmenu: Startmenu,
    mainboardWindow: Window,
    mainboardGrid: Grid,
    mainboardCover: Cover,
    mainboardShortcut: Shortcut,
    mainboardShortcutList: ShortcutList,
    mainboardResizableBlock: ResizableBlock,
    mainboardDialogWindowCreateShortcut: DialogWindowCreateShortcut
  },
  data() {
    return {
      dictonary,
      visibleDialogWindowCreateShortcut: false,
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

    shortcuts() {
      return this.$store.getters.shortcuts;
    },

    error() {
      return this.$store.getters.error;
    }
  },

  watch: {
    shortcuts() {
      console.log("watch shortcuts", this.shortcuts);
    }
  },

  created() {
    this.$store.dispatch("actionGetDashboard");
  },

  mounted() {
    //console.log("process.env.NODE_ENV", process.env.NODE_ENV);
    const self = this;
    //this.$store.commit("setWidthGrid", this.$refs.grid.$el.clientWidth);
    //this.$store.commit("setHeightGrid", this.$refs.grid.$el.clientHeight);

    this.$store.commit("setWidthWorkspace", this.$refs.workspace.clientWidth);
    this.$store.commit("setHeightWorkspace", this.$refs.workspace.clientHeight);

    window.addEventListener("resize", function() {
      /* const oldWidthWorkspace = self.$store.state.desktop.widthWorkspace;
      const oldHeightWorkspace = self.$store.state.desktop.heightWorkspace;
      const newWidthWorkspace = self.$refs.workspace.clientWidth;
      const newHeightWorkspace = self.$refs.workspace.clientHeight; */

      /* const options = {
        coefLeft: newWidthWorkspace / oldWidthWorkspace,
        coefTop: newHeightWorkspace / oldHeightWorkspace
      }; */

      //self.$store.dispatch("actionRecalcWindowsCoords", options);
      //self.$store.commit("setWidthGrid", self.$refs.grid.$el.clientWidth);
      //self.$store.commit("setHeightGrid", self.$refs.grid.$el.clientHeight);

      self.$store.commit("setWidthWorkspace", self.$refs.workspace.clientWidth);
      self.$store.commit(
        "setHeightWorkspace",
        self.$refs.workspace.clientHeight
      );

      //self.$store.dispatch("actionSaveSettingsDesktop");
    });
  },

  methods: {
    /* toggleWorkspace(step, event) {
      const touchElement = document.elementFromPoint(
        event.touchstartX,
        event.touchstartY
      );
      if (this.$refs.grid.$el.contains(touchElement)) {
        const indexActiveWorkspace = this.$store.getters.indexActiveWorkspace;
        const countWorkspaces = this.$store.getters.countWorkspaces;
        if (
          step + indexActiveWorkspace >= 0 &&
          step + indexActiveWorkspace < countWorkspaces
        ) {
          this.$store.dispatch(
            "actionSetActiveWorkspace",
            step + indexActiveWorkspace
          );
          this.$store.dispatch("actionSaveSettingsDesktop");
        }
      }
    }, */

    toggleVisibleStartMenu() {
      this.$store.dispatch("actionToggleVisibleStartMenu");
    },

    closeError() {
      this.$store.dispatch("actionClearError");
    },

    showContextMenu(event) {
      event.preventDefault();
      /*
      this.contextMenu.visible = false;
      this.contextMenu.x = event.clientX;
      this.contextMenu.y = event.clientY;
      this.$nextTick(() => {
        this.contextMenu.visible = true;
      }); */
    },

    showDialogWindowCreateShortcut() {
      this.visibleDialogWindowCreateShortcut = true;
    },

    createCustomShortcut(customShortcut) {
      this.visibleDialogWindowCreateShortcut = false;
      this.$store.dispatch("actionCreateNewShortcut", customShortcut);
      this.$store.dispatch("actionSaveSettingsDesktop");
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

/* .mainboard-toolbar {
  position: relative;
}

.mainboard-taskbar {
  position: relative;
} */
</style>
