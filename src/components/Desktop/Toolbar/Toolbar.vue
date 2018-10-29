<template>
  <div class="mainboard-toolbar">
    <mainboard-info-dialog-window
      :visible="visibleInfoDialogWindow"
      :options="{
        title: 'Нельзя удалить текущую рабочий стол',
        text: 'Для работы необходима хотя бы один рабочий стол.'
      }"
      @hideInfoDialogWindow="hideInfoDialogWindow"
    />

    <mainboard-input-dialog-window
      :options="{
        title: 'Введите название рабочего стола',
        label: 'Название рабочего стола'
      }"
      :visible="visibleInputDialogWindow"
      @input="createNewWorkspace($event)"
      @hideInputDialogWindow="hideInputDialogWindow"
    />

    <mainboard-dialog-window
      :options="{
        title: 'Удаление рабочего стола',
        text: 'Вы действительно хотите удалить текущий рабочий стол?'
      }"
      :visible="visibleDialogWindow"
      @hideDialogWindow="deleteCurrentWorkspace($event)"
    />
    <mainboard-cover
      v-if="visibleCover"
      @click.native="hideCover"
    />
    <v-toolbar
      dark
      color="primary"
      height="40"
    >
      <!-- <v-toolbar-side-icon></v-toolbar-side-icon> -->
      <v-toolbar-title>Incom</v-toolbar-title>
      <v-spacer/>
      <v-menu 
        offset-y 
        light 
        z-index="9999">
        <v-btn
          slot="activator"
          color="primary"
          dark
          @click="setNotActiveWindows"
        >
          {{ titleActiveWorkspace }}
        </v-btn>
        <v-list>
          <v-list-tile
            @click="showInputDialogWindow"
          >
            Создать новый рабочий стол
          </v-list-tile>

          <v-list-tile
            @click="showDialogWindow"
          >
            Удалить текущий рабочий стол
          </v-list-tile>
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
      <v-toolbar-items class="hidden-sm-and-down">
        <!-- <v-btn flat>Link One</v-btn> -->
        <v-switch
          :label="(isModeGrid) ? 'Режим сетки' : 'Режим сетки'"
          v-model="isModeGrid"
          color="warning"
          @click.stop="toggleModeGrid"
        />
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
import InputDialogWindow from "@/components/Desktop/Toolbar/InputDialogWindow.vue";
import DialogWindow from "@/components/Desktop/Toolbar/DialogWindow.vue";
import InfoDialogWindow from "@/components/Desktop/Toolbar/InfoDialogWindow.vue";
import Cover from "@/components/Desktop/Cover.vue";
export default {
  components: {
    mainboardInputDialogWindow: InputDialogWindow,
    mainboardDialogWindow: DialogWindow,
    mainboardInfoDialogWindow: InfoDialogWindow,
    mainboardCover: Cover
  },
  data() {
    return {
      modeGrid: true,
      visibleDialogWindow: false,
      visibleInfoDialogWindow: false,
      visibleInputDialogWindow: false,
      visibleCover: false
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
    showCover() {
      this.visibleCover = true;
    },

    hideCover() {
      this.visibleCover = false;
    },

    showDialogWindow() {
      this.hideCover();
      this.visibleDialogWindow = true;
    },

    hideDialogWindow() {
      this.visibleDialogWindow = false;
    },

    showInfoDialogWindow() {
      this.hideCover();
      this.visibleInfoDialogWindow = true;
    },

    hideInfoDialogWindow() {
      this.visibleInfoDialogWindow = false;
    },

    showInputDialogWindow() {
      this.hideCover();
      this.visibleInputDialogWindow = true;
    },

    hideInputDialogWindow() {
      this.visibleInputDialogWindow = false;
    },

    createNewWorkspace(nameWorkspace) {
      this.$store.dispatch("actionCreateNewWorkspace", nameWorkspace);
      this.$store.dispatch("actionSaveSettingsDesktop");
    },

    deleteCurrentWorkspace(accept) {
      this.visibleDialogWindow = false;
      console.log("this.countWorkspaces", this.countWorkspaces);
      if (this.countWorkspaces < 2) {
        this.showInfoDialogWindow();
        return;
      }

      if (accept) {
        this.$store.dispatch("actionDeleteCurrentWorkspace");
        this.$store.dispatch("actionSaveSettingsDesktop");
      }
    },

    toggleModeGrid() {
      console.log("toggleModeGrid");
      this.$store.commit("toggleModeGrid");
      if (this.isModeGrid) {
        $(".mainboard-window").draggable("option", "snap", false);
      } else {
        $(".mainboard-window").draggable("option", "snap", ".mainboard-window");
      }
    },

    setActiveWorkspace(index) {
      this.$store.dispatch("actionSetActiveWorkspace", index);
      //this.$store.dispatch("actionSetActiveWindow");
      this.$store.dispatch("actionSaveSettingsDesktop");
    },

    setNotActiveWindows() {
      this.$store.dispatch("actionSetNotActiveWindows");
      this.$store.dispatch("actionSaveSettingsDesktop");
    }
  }
};
</script>

<style scoped>
.mainboard-toolbar {
  height: 40px;
}
</style>
