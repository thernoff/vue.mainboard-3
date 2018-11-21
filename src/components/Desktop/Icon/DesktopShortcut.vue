<template>
  <mainboard-base-shortcut
    :id = "id"
    :options="options"
    :style="{
      top: options.top * heightWorkspace / 100 + 'px',
      left: options.left * widthWorkspace / 100 + 'px'
    }"
    :title="(options.object.type === 'folder') ? 'Папка содержит: ' + shortcutsHasFolder + ' элементов': options.label"
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
    },

    shortcutsHasFolder() {
      console.log("this.options", this.options);
      return this.$store.state.workspaces.activeWorkspace.shortcuts.filter(
        shortcut => {
          console.log("shortcut", shortcut);
          return this.options.object.id === shortcut.folderId;
        }
      ).length;
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
