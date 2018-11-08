<template>
  <base-window
    :index="index"
    :id="id"
    :options="options"
    class="mainboard-file-manager"
    :data-object-id="options.objectId"
  >
    <div
      slot="body"
      class="mainboard-file-manager__body"
      @click="setActiveWindow"
    >


    <!-- <v-card-text
      slot="body"

      @click="setActiveWindow"
    > -->
      <div class="file-manager-sidebar">
        <ul>
          <li v-for="folder in folders"
            :key="folder.id"
          >
            <span>
              <i class="material-icons icon-folder">
                folder
              </i>
            </span>
            {{ folder.title }}
          </li>
        </ul>
      </div>
    <!-- </v-card-text> -->
    </div>
  </base-window>
</template>

<script>
import baseWindow from "@/components/Desktop/Window/BaseWindow.vue";
import folderShortcut from "@/components/Desktop/Icon/FolderShortcut.vue";

export default {
  components: {
    baseWindow: baseWindow,
    mainboardFolderShortcut: folderShortcut
  },
  props: {
    index: {
      type: Number,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
    isModeGrid() {
      return this.$store.isModeGrid;
    },

    elements() {
      let elements = [];
      elements = this.$store.getters.shortcuts.filter(shortcut => {
        return shortcut.folderId === this.options.objectId;
      });
      console.log("elements", elements);
      return elements;
    },

    folders() {
      return this.$store.state.workspaces.folders;
    }
  },

  mounted() {
    var self = this;
    $(".mainboard-window__body").droppable({
      accept: ".mainboard-shortcut",
      drop: function(event, ui) {
        console.log("mainboard-window__body drop event", event);
        console.log("mainboard-window__body drop ui", ui);
        var $dragElement = $(ui.draggable);
        var $window = $(this).closest(".mainboard-window");
        console.log('$window.data("object-id")', $window.data("object-id"));
        if ($dragElement.hasClass("mainboard-shortcut")) {
          var elementId = ui.draggable.data("id");
          self.$store.dispatch("actionMoveElementToFolder", {
            elementId,
            folderId: $window.data("object-id")
          });
        }
      },
      out: function(event, ui) {
        console.log(".mainboard-window__body out event", event);
        console.log(".mainboard-window__body out ui", ui);
        var $dragElement = $(ui.draggable);
        $dragElement.removeClass("over-folder-window");
      },
      over: function(event, ui) {
        console.log(".mainboard-window__body over event", event);
        console.log(".mainboard-window__body over ui", ui);
        var $dragElement = $(ui.draggable);
        $dragElement.addClass("over-folder-window");
      }
    });
  },

  methods: {
    setActiveWindow() {
      this.$store.commit("setActiveWindow", this.id);
      this.$store.dispatch("actionSaveSettingsDesktop");
    }
  }
};
</script>

<style scoped>
.file-manager-sidebar {
  width: 200px;
  height: 100%;
  /* background-color: rgb(192, 196, 201); */
  border-right: 2px solid rgb(203, 209, 216);
}

.file-manager-sidebar li {
  list-style: none;
}

.mainboard-file-manager__body {
  height: 100%;
}
</style>
