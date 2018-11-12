<template>
  <base-window
    :index="index"
    :id="id"
    :options="options"
    class="mainboard-folder-window"
    :data-object-id="options.object.id"
  >

    <div
      slot="body"
      class="mainboard-folder-window__body"
      @mousedown="setActiveWindow"
    >
      <mainboard-folder-shortcut
        v-for="element in elements"
        :key="element.id"
        :id="element.id"
        :options="element"
      />
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

    widthWorkspace() {
      return this.$store.state.desktop.widthWorkspace;
    },

    heightWorkspace() {
      return this.$store.state.desktop.heightWorkspace;
    },

    elements() {
      let elements = [];
      elements = this.$store.getters.shortcuts.filter(shortcut => {
        return shortcut.folderId === this.options.object.id;
      });
      elements.sort(function(a, b) {
        const a1 = a.label.toLowerCase();
        const b1 = b.label.toLowerCase();
        if (a1 < b1) return -1;
        if (a1 > b1) return 1;
        return 0;
      });
      console.log("elements", this.$store.getters.shortcuts);
      return elements;
    }
  },

  mounted() {
    var self = this;
    //console.log("this.$refs.folderWindow", this.$refs.windowBody.$el);
    //$(".mainboard-window__body").droppable({
    /* $(this.$refs.windowBody).droppable({
      accept: ".mainboard-shortcut",
      greedy: true,
      create: function(event, ui) {
        console.log("FOLDER WINDOW CREATE", ui);
      },
      activate: function(event, ui) {
        console.log("FOLDER WINDOW ACTIVATE", ui);
        console.log("FOLDER WINDOW ACTIVATE this", this);
        var $dragElement = $(ui.draggable);
        var $window = $dragElement.closest(".mainboard-window");
        if ($window.length > 0) {
          console.log(
            "FOLDER WINDOW ACTIVATE $dragElement.length",
            $dragElement.length
          );
          var $windowBodies = $(".mainboard-window__body").not(this);
          $windowBodies.droppable("option", "disabled", true);
        }
      },
      drop: function(event, ui) {
        //console.log("mainboard-window__body drop event", event);
        //console.log("mainboard-window__body drop ui", ui);
        console.log("FOLDER WINDOW DROP", this);
        var $dragElement = $(ui.draggable);
        var $window = $(this).closest(".mainboard-window");
        console.log('$window.data("object-id")', $window.data("object-id"));
        if ($dragElement.hasClass("mainboard-shortcut")) {
          var elementId = ui.draggable.data("id");
          self.$store.dispatch("actionMoveElementToFolder", {
            elementId,
            folderId: $window.data("object-id")
          });
          self.$store.dispatch("actionSaveSettingsDesktop");
        }

        var $windowBodies = $(".mainboard-window__body");
        $windowBodies.droppable("option", "disabled", false);
      },
      out: function(event, ui) {
        console.log("FOLDER WINDOW OUT", this);
        //console.log(".mainboard-window__body out event", event);
        //console.log(".mainboard-window__body out ui", ui);
        var $windowBodies = $(".mainboard-window__body");
        $windowBodies.droppable("option", "disabled", false);
        var $dragElement = $(ui.draggable);
        $dragElement.removeClass("over-folder-window");
      },
      over: function(event, ui) {
        console.log("FOLDER WINDOW OVER this", this);
        console.log("FOLDER WINDOW OVER ui", ui);
        var $dragElement = $(ui.draggable);
        var $windowBodies = $(".mainboard-window__body").not(this);
        $windowBodies.droppable("option", "disabled", true);
        //console.log("FOLDER WINDOW OVER", $windowBodies);
        $dragElement.addClass("over-folder-window");
        var $window = $(this).closest(".mainboard-window");
        var id = $window.data("id");
        self.$store.commit("setActiveWindow", id);
      }
    }); */
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
.mainboard-folder-window__body {
  height: 100%;
  overflow: auto;
}
</style>
