<template>
  <div class="mainboard-toolbar">
    <mainboard-info-dialog-window
      :visible="visibleInfoDialogWindow"
      :options="{
        title: $t('toolbar_workspaces.messages.title_cant_delete'),
        text: $t('toolbar_workspaces.messages.text_cant_delete')
      }"
      @hideInfoDialogWindow="hideInfoDialogWindow"
    />

    <mainboard-input-dialog-window
      :options="{
        title: $t('toolbar_workspaces.messages.title_create_workspace'),
        label: $t('toolbar_workspaces.messages.label_create_workspace'),
      }"
      :visible="visibleInputDialogWindow"
      @input="createNewWorkspace($event)"
      @hideInputDialogWindow="hideInputDialogWindow"
    />

    <mainboard-dialog-window
      :options="{
        title: $t('toolbar_workspaces.messages.title_delete_workspace'),
        text: $t('toolbar_workspaces.messages.text_delete_workspace')
      }"
      :visible="visibleDialogWindow"
      @hideDialogWindow="deleteCurrentWorkspace($event)"
    />
    <v-toolbar dark color="primary" height="40">
      <!-- <v-toolbar-side-icon
        v-if = "$vuetify.breakpoint.smAndDown"
        @click="showDrawer"
      ></v-toolbar-side-icon>-->
      <v-toolbar-title>
        <!-- <v-img src="@/assets/hawk.png"></v-img> -->
        Incom
        <!-- <img src="@/assets/hawk.png" alt=""> -->
      </v-toolbar-title>
      <v-spacer/>
      <v-menu offset-y light z-index="9999">
        <v-btn
          slot="activator"
          color="primary"
          dark
          @click="setNotActiveWindows"
        >{{ titleActiveWorkspace }}</v-btn>
        <v-list>
          <v-list-tile @click="showInputDialogWindow">{{ $t('toolbar_workspaces.create') }}</v-list-tile>

          <v-list-tile @click="showDialogWindow">{{ $t('toolbar_workspaces.delete') }}</v-list-tile>
          <v-divider/>

          <v-list-tile
            v-for="(workspace, index) in workspaces"
            :key="index"
            @click="setActiveWorkspace(index)"
          >
            <v-list-tile-title>{{ workspace.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-toolbar-items>
        <v-switch
          :label="(isModeGrid) ? $t('toolbar.gridSwitcher.modeOn') : $t('toolbar.gridSwitcher.modeOff')"
          v-model="isModeGrid"
          color="warning"
          @click.stop="toggleModeGrid"
        />
        <!-- <v-btn fab dark small size="14" class="mainboard-toolbar__btn-about">
          <v-icon>?</v-icon>
        </v-btn>-->
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
import InputDialogWindow from "@/components/Desktop/Toolbar/InputDialogWindow.vue";
import DialogWindow from "@/components/Desktop/Toolbar/DialogWindow.vue";
import InfoDialogWindow from "@/components/Desktop/Toolbar/InfoDialogWindow.vue";
export default {
  components: {
    mainboardInputDialogWindow: InputDialogWindow,
    mainboardDialogWindow: DialogWindow,
    mainboardInfoDialogWindow: InfoDialogWindow
  },
  data() {
    return {
      modeGrid: true,
      visibleDialogWindow: false,
      visibleInfoDialogWindow: false,
      visibleInputDialogWindow: false
    };
  },

  computed: {
    workspaces() {
      return this.$store.getters.workspaces;
    },

    countWorkspaces() {
      return this.workspaces.length;
    },

    isModeGrid() {
      return this.$store.getters.isModeGrid;
    },

    titleActiveWorkspace() {
      return this.$store.getters.getTitleActiveWorkspace;
    }
  },

  methods: {
    showDialogWindow() {
      this.visibleDialogWindow = true;
    },

    hideDialogWindow() {
      this.visibleDialogWindow = false;
    },

    showInfoDialogWindow() {
      this.visibleInfoDialogWindow = true;
    },

    hideInfoDialogWindow() {
      this.visibleInfoDialogWindow = false;
    },

    showInputDialogWindow() {
      this.visibleInputDialogWindow = true;
    },

    hideInputDialogWindow() {
      this.visibleInputDialogWindow = false;
    },

    createNewWorkspace(nameWorkspace) {
      this.$store
        .dispatch("actionCreateNewWorkspace", nameWorkspace)
        .then(() => {
          this.$store.dispatch("actionSaveSettingsDesktop");
        });
    },

    deleteCurrentWorkspace(accept) {
      this.visibleDialogWindow = false;
      if (this.countWorkspaces < 2 && accept) {
        this.showInfoDialogWindow();
        return;
      }

      if (accept) {
        this.$store.dispatch("actionDeleteCurrentWorkspace").then(() => {
          this.$store.dispatch("actionSaveSettingsDesktop");
        });
      }
    },

    toggleModeGrid() {
      this.$store.commit("toggleModeGrid");
      if (this.isModeGrid) {
        $(".mainboard-window").draggable("option", "snap", false);
      } else {
        $(".mainboard-window").draggable("option", "snap", ".mainboard-window");
      }
    },

    setActiveWorkspace(index) {
      this.$store.dispatch("actionSetActiveWorkspace", index).then(() => {
        this.$store.dispatch("actionSaveSettingsDesktop");
      });
    },

    setNotActiveWindows() {
      this.$store.commit("setNotActiveWindows");
      this.$store.dispatch("actionSaveSettingsDesktop");
    },

    showDrawer() {
      this.$emit("showDrawer");
      //this.$store.commit("toggleShowLeftSidebar");
    }
  }
};
</script>

<style scoped>
.mainboard-toolbar {
  height: 40px;
}

.mainboard-toolbar__btn-about {
  width: 30px !important;
  height: 30px !important;
  background-color: #7e456d !important;
  border-color: #7e456d !important;
}
</style>
