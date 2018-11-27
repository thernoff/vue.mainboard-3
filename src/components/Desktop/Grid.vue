<template>
  <div
    :style="{ backgroundImage: 'url('+ require('@/assets/wallpaper.jpg') +')' }"
    class="mainboard-workspace__grid"
    @click="setNotActive"
  >
    <div 
      v-if="isModeGrid" 
      class="mainboard-workspace__grid-container">
      <div
        :style="{backgroundSize: widthGridCell + 'px' + ' ' + heightGridRow +'px'}"
        class="mainboard-workspace__grid-gradient"
      />
      <!-- <div v-for="y of countRows"
        :key=y
        :style="{
            'height': heightGridRow + '%',
          }"
      >
        <div v-for="x of countColumns"
          :key=x
          :style="{

            'float': 'left',
            'width': widthGridCell + '%',
            'border': '1px dashed rgb(191, 100, 155, 1)',
            'height': '100%'
          }"
        >

        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
export default {
  //props: ["widthWorkspace", "heightWorkspace"],
  data() {
    return {};
  },
  computed: {
    isModeGrid() {
      return this.$store.getters.isModeGrid;
    },

    countRows() {
      return this.$store.getters.getCountRows;
    },

    countColumns() {
      return this.$store.getters.getCountColumns;
    },

    widthGridCell() {
      console.log(
        "this.$store.state.desktop.countColumns",
        this.$store.state.desktop.countColumns
      );
      //return Math.ceil(10000000 / this.$store.getters.getCountColumns) / 100000;
      /* return (
        Math.ceil(10000000 / this.$store.state.desktop.countColumns) / 100000
      ); */
      return this.$store.state.desktop.widthCell;
    },

    heightGridRow() {
      console.log(
        "this.$store.state.desktop.countRows",
        this.$store.state.desktop.countRows
      );
      //return Math.ceil(100000000 / this.$store.getters.getCountRows) / 1000000;
      /* return (
        Math.ceil(100000000 / this.$store.state.desktop.countRows) / 1000000
      ); */
      return this.$store.state.desktop.heightCell;
    }
  },
  methods: {
    setNotActive() {
      const isActive =
        this.$store.getters.isActiveWindow ||
        this.$store.getters.isActiveShortcut;

      if (isActive) {
        this.$store.commit("setNotActiveWindows");
        this.$store.commit("setNotActiveShortcuts");
        this.$store.dispatch("actionSaveSettingsDesktop");
      }
    }
  }
};
</script>

<style scoped>
.mainboard-workspace__grid {
  position: relative;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* background-position: 50% 50%; */
  background-position: center center;
  -moz-background-size: cover; /* Firefox 3.6+ */
  -webkit-background-size: cover; /* Safari 3.1+ и Chrome 4.0+ */
  -o-background-size: cover; /* Opera 9.6+ */
  background-size: cover;
  background-repeat: no-repeat;
}

.mainboard-workspace__grid-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.mainboard-workspace__grid-gradient {
  /* display: inline-block; */
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  /* background-size: 15px 15px; */
  /* background-position: center center; */
  background: -moz-linear-gradient(rgb(226, 238, 255, 0.2), transparent 1px),
    -moz-linear-gradient(90deg, rgb(226, 238, 255, 0.2), transparent 1px);
  background: -webkit-linear-gradient(rgb(226, 238, 255, 0.2), transparent 1px),
    -webkit-linear-gradient(90deg, rgb(226, 238, 255, 0.2), transparent 1px);
  background: -o-linear-gradient(rgb(226, 238, 255, 0.2), transparent 1px),
    -o-linear-gradient(90deg, rgb(226, 238, 255, 0.2), transparent 1px);
  background: -ms-linear-gradient(rgb(226, 238, 255, 0.2), transparent 1px),
    -ms-linear-gradient(90deg, rgb(226, 238, 255, 0.2), transparent 1px);
  background: linear-gradient(rgb(226, 238, 255, 0.2), transparent 1px),
    linear-gradient(90deg, rgb(226, 238, 255, 0.2), transparent 1px);
  /* linear-gradient(90deg, mediumvioletred, transparent 1px); */

  /* background-position: center center; */
  /* border: 1px solid mediumvioletred; */
}
</style>
