<template>
  <mainboard-base-shortcut
    ref="shortcut"
    class="mainboard-folder-shortcut"
    :id = "id"
    :options="options"
    :size="size"
    :position="position"
  />
</template>

<script>
import baseShortcut from "@/components/Desktop/Shortcut/BaseShortcut.vue";
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
    },
    position: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {
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
        }
      }
    });
  },
  methods: {}
};
</script>

<style scoped>
</style>
