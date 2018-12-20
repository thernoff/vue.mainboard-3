<template>
  <div
    v-if="modeGrid"
    ref="placeholder"
    :style="{
      width: widthShortcut + 'px',
      height: heightShortcut + 'px',
      top: top + 'px',
      left: left + 'px'
    }"
    :class="{'mainboard-placeholder-shortcut--over': over}"
    class="mainboard-placeholder-shortcut"
  ></div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  computed: {
    modeGrid() {
      return this.$store.state.desktop.modeGrid;
    },

    widthWorkspace() {
      return this.$store.state.desktop.widthWorkspace;
    },

    heightWorkspace() {
      return this.$store.state.desktop.heightWorkspace;
    },

    widthShortcut() {
      return this.$store.state.workspaces.widthShortcut;
    },

    heightShortcut() {
      return this.$store.state.workspaces.heightShortcut;
    },

    widthCell() {
      return this.$store.state.desktop.widthCell;
    },

    heightCell() {
      return this.$store.state.desktop.heightCell;
    },

    top() {
      return this.$store.state.workspaces.placeholder.top;
    },

    left() {
      return this.$store.state.workspaces.placeholder.left;
    },

    over() {
      return this.$store.state.workspaces.placeholder.over;
    }
  },
  methods: {}
};
</script>

<style scoped>
.mainboard-placeholder-shortcut {
  display: none;
  position: absolute;
  border-radius: 5px;
  overflow: hidden;
  background-color: rgba(125, 255, 147, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-sizing: border-box;
  z-index: 1;
}

.mainboard-placeholder-shortcut--over {
  background-color: rgba(255, 125, 125, 0.3) !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
}
</style>
