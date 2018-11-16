<template>
  <mainboard-base-shortcut
    :id = "id"
    :options="options"
    :size="size"
    :style="{
      top: options.top * heightWorkspace / 100 + 'px',
      left: options.left * widthWorkspace / 100 + 'px'
    }"
    class="mainboard-desktop-shortcut"
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
