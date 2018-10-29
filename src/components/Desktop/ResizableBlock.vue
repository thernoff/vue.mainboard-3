<template>
  <div class="resizable">
    <h2>Resizable</h2>
  </div>
</template>
<script>
export default {
  mounted() {
    $(".resizable")
      .draggable({
        containment: ".mainboard-workspace"
      })
      .resizable({
        handles: "e, s, n, w"
      });
  }
};
</script>

<style scoped>
.resizable {
  width: 500px;
  height: 300px;
  border: 1px solid black;
  position: absolute;
  top: 300px;
  left: 600px;
}
</style>
