<template>
  <base-window
    :index="index"
    :id="id"
    :options="options"
    class="folder-window"
    :data-object-id="options.objectId"
  >

    <v-card-text
      slot="body"
      class="mainboard-window__body"
      @click="setActiveWindow"
    >
      <mainboard-folder-shortcut
        v-for="element in elements"
        :key="element.id"
        :id="element.id"
        :shortcut="element"
        :options="element"
      />
    </v-card-text>
  </base-window>
</template>

<script>
import baseWindow from "@/components/Desktop/Window/BaseWindow.vue";
import folderShortcut from "@/components/Desktop/Shortcut/FolderShortcut.vue";

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
        return shortcut.folderId === this.options.objectId;
      });
      console.log("elements", elements);
      return elements;
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
.mainboard-window--fullheight {
  top: 0px !important;
  height: 100% !important;
}

.mainboard-window--fullwidth {
  width: 100% !important;
}

.mainboard-window--top-half {
  top: 0px !important;
  left: 0px !important;
  width: 100% !important;
  height: 50% !important;
}

.mainboard-window--bottom-half {
  bottom: 0px !important;
  left: 0px !important;
  width: 100% !important;
  height: 50% !important;
}

.mainboard-window__card {
  position: relative;
  width: 100%;
  height: 100%;
  border: 2px solid #5b7aa1;
  border-radius: inherit;
}

.mainboard-window__cover-window {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
}

.mainboard-window__header {
  font-size: 16px;
  color: #fff;
  cursor: move;
  padding: 0 5px;
  height: 30px;
  border-top-left-radius: 0px !important;
  border-top-right-radius: 0px !important;
}

.mainboard-window__title {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.mainboard-window__group-buttons {
  /*   width: 40%;
  float: right; */
}

.mainboard-window__btn {
  margin: 0;
}

.mainboard-window__body {
  height: calc(100% - 40px);
  position: relative;
  overflow: auto;
  padding: 0;
  margin: 0;
  /* border-radius: inherit; */
}

.fullscreen {
  position: absolute !important;
  z-index: 1000;
  width: 100% !important;
  height: 100% !important;
  top: 0 !important;
  left: 0 !important;
  bottom: 0 !important;
  right: 0 !important;
}

.half-height {
  height: 90% !important;
}

.half-width {
  width: 90% !important;
}

@media (max-width: 1200px) {
  .mainboard-window__title {
    width: 55%;
    font-size: 14px;
  }
}

@media (max-width: 800px) {
  .mainboard-window__title {
    display: none;
  }
}
</style>
