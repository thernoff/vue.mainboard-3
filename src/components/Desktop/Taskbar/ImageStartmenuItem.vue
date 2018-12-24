<template>
  <div class="startmenu-item__img">
    <img v-if="!loadImageError" :src="src" @error="loadError">
    <img v-if="loadImageError" src="@/assets/no-image.png">
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
<style scoped>
.startmenu-item__img img {
  width: 25px;
  height: auto;
  margin-right: 5px;
}
</style>
