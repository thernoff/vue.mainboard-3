<template>
  <div
    ref="shortcutList"
    class="mainboard-shortcut-list"
  >
    <div class="mainboard-shortcut-list__container">
      <!-- <div
        v-for="(shortcut, index) in shortcuts"
        :key="shortcut.id"
        class="sortable-shortcut"
      > -->
        <mainboard-shortcut
          v-for="(shortcut, index) in shortcuts"
          :key="shortcut.id"
          :index="index"
          :id="shortcut.id"
          :shortcut="shortcut"
        />
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import Shortcut from "@/components/Desktop/Shortcut.vue";
export default {
  components: {
    mainboardShortcut: Shortcut
  },
  props: {
    shortcuts: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  computed: {
    shortcutWidth() {
      const heightWorkspace = this.$store.state.desktop.heightWorkspace;
      return (
        120 *
        Math.ceil(this.shortcuts.length / Math.floor(heightWorkspace / 120))
      );
    }
  },
  mounted() {
    var self = this;
    var startIndex, stopIndex;
    /* $(".mainboard-shortcut-list__container").sortable({
      distance: 5,
      items: ".sortable-shortcut",
      connectWith: ".mainboard-shortcut-list__container",
      start: function(event, ui) {
        startIndex = $(this)
          .find(".sortable-shortcut")
          .index(ui.item);
      },
      stop: function(event, ui) {
        stopIndex = $(this)
          .find(".sortable-shortcut")
          .index(ui.item);
        self.$store.dispatch("actionUpdateOrderShortcuts", {
          startIndex,
          stopIndex
        });

        self.$store.dispatch("actionSaveSettingsDesktop");
      }
    }); */
  }
};
</script>

<style scoped>
.sortable-shortcut {
  list-style-type: none;
  display: inline-block;
}

.mainboard-shortcut-list {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* width: 120px; */
  /* height: 0px; */
  top: 0;
  left: 0;
  /* padding: 5px; */
  z-index: 1;
}

.mainboard-shortcut-list__container {
  position: relative;
  width: 100%;
  height: 100%;
}

.mainboard-list-icons {
  position: absolute;
  margin: 0 auto;
  width: 100px;
  height: 100px;
  background-color: #fff;
  border: 2px solid gray;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
}

.mainboard-desktop-icon__img {
  text-align: center;
}

.mainboard-desktop-icon__title {
  text-align: center;
}
</style>
