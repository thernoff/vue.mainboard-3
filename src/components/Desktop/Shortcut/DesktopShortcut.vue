<template>
  <mainboard-base-shortcut
    ref="shortcut"
    class="mainboard-desktop-shortcut"
    :id = "id"
    :options="options"
    :size="size"
    :position="position"
    :style="{
      top: options.top * heightWorkspace / 100 + 'px',
      left: options.left * widthWorkspace / 100 + 'px'
    }"
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
  computed: {
    widthWorkspace() {
      return this.$store.state.desktop.widthWorkspace;
    },

    heightWorkspace() {
      return this.$store.state.desktop.heightWorkspace;
    }
  },
  mounted() {
    var self = this;
    console.log("mounted", this.$refs.shortcut.$el);
    $(this.$refs.shortcut.$el).draggable({
      //containment: ".mainboard-workspace",
      containment: ".mainboard-workspace",
      helper: "clone",
      //stack: ".mainboard-window",
      zIndex: 1000,
      start: function(event) {
        var $shortcut = $(this);
        //$shortcut.css({ position: "relative" });
      },
      stop: function(event, ui) {
        var $shortcut = $(this);
        var options = {
          id: self.id,
          top: ui.position.top < 0 ? 0 : ui.position.top,
          left: ui.position.left < 0 ? 0 : ui.position.left,
          diffTop: ui.position.top - ui.originalPosition.top,
          diffLeft: ui.position.left - ui.originalPosition.left
        };

        self.$store.dispatch("actionUpdateShortcutCoords", options);
      }
    });
  },
  methods: {}
};
</script>

<style scoped>
</style>
