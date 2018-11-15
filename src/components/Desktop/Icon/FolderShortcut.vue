<template>
  <mainboard-base-shortcut
    :id = "id"
    :options="options"
    :size="size"
    class="mainboard-folder-shortcut"
  />
</template>

<script>
import baseShortcut from "@/components/Desktop/Icon/BaseShortcut.vue";
export default {
  components: {
    mainboardBaseShortcut: baseShortcut
  },
  props: {
    id: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      required: true
    },
    size: {
      type: Object,
      default: () => {
        return {
          width: 100,
          height: 110
        };
      }
    }
  },
  data() {
    return {};
  },
  computed: {},
  /* mounted() {
    var self = this;
    console.log("mounted", this.$refs.shortcut.$el);
    $(this.$refs.shortcut.$el).draggable({
      appendTo: ".mainboard-workspace",
      //containment: ".mainboard-workspace",
      helper: "clone",
      //stack: ".mainboard-window",
      zIndex: 1000,
      start: function(event) {
        var $shortcut = $(this);
        //$shortcut.css({ position: "relative" });
      },
      stop: function(event, ui) {
        console.log("FolderShortcut ui", ui);
        var $shortcut = $(this);
        if (!$shortcut.hasClass("over-folder-window")) {
          var options = {
            id: self.id,
            top: ui.position.top < 0 ? 0 : ui.position.top,
            left: ui.position.left < 0 ? 0 : ui.position.left,
            diffTop: ui.position.top - ui.originalPosition.top,
            diffLeft: ui.position.left - ui.originalPosition.left
          };

          self.$store.dispatch("actionUpdateShortcutCoords", options);
          self.$store.dispatch("actionSaveSettingsDesktop");
        }
      }
    });
  }, */
  methods: {}
};
</script>

<style>
.mainboard-folder-shortcut .mainboard-shortcut__title {
  color: rgb(51, 51, 51);
}
</style>
