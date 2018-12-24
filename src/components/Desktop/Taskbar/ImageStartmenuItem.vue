<template>
  <div class="startmenu-item__img">
    <img
      v-if="!loadImageError"
      :src="src"
      :style="{width: '25px', height: 'auto', marginRight: '5px'}"
      @error="loadError"
    >
    <img
      v-if="loadImageError"
      src="@/assets/no-image.png"
      :style="{width: '25px', height: 'auto', marginRight: '5px'}"
      class="mainboard-startmenu__item--no-image"
    >
  </div>
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loadImageError: false
    };
  },
  methods: {
    loadError() {
      this.loadImageError = true;
    }
  }
};
</script>
