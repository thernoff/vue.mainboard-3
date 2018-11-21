<template>
  <mainboard-base-shortcut
    :id = "id"
    :options="options"
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
