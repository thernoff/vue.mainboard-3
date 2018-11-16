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
  methods: {}
};
</script>

<style>
.mainboard-folder-shortcut .mainboard-shortcut__title {
  color: rgb(51, 51, 51);
}
</style>
