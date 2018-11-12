<template>
  <mainboard-base-shortcut
    class="mainboard-desktop-shortcut"
    :id = "id"
    :options="options"
    :size="size"
    :style="{
      top: options.top * heightWorkspace / 100 + 'px',
      left: options.left * widthWorkspace / 100 + 'px'
    }"
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
  computed: {
    widthWorkspace() {
      return this.$store.state.desktop.widthWorkspace;
    },

    heightWorkspace() {
      return this.$store.state.desktop.heightWorkspace;
    }
  },
  /*   mounted() {
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
        self.$store.dispatch("actionSaveSettingsDesktop");
      }
    });
  }, */
  methods: {}
};
</script>

<style>
.mainboard-desktop-shortcut {
  position: absolute;
}
.mainboard-desktop-shortcut .mainboard-shortcut__title {
  color: #fff;
  text-shadow: 1px 2px 5px #000;
}
</style>
