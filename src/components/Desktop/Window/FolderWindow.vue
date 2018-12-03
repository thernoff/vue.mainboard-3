<template>
  <base-window
    :id="id"
    :options="options"
    :data-object-id="options.object.id"
    class="mainboard-folder-window"
  >
    <div slot="body" class="mainboard-folder-window__body" @mousedown="setActiveWindow">
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
      // Сортируем элементы по имени
      elements.sort((a, b) => {
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
