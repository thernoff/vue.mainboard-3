<template>
  <div class="mainboard-workspace__grid" @click="setNotActive">
    <!-- <div
    :style="{ backgroundImage: 'url('+ require('@/assets/wallpaper.jpg') +')' }"
    class="mainboard-workspace__grid"
    @click="setNotActive"
    >-->
    <div v-if="isModeGrid" class="mainboard-workspace__grid-container">
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
    <div
      class="mainboard-workspace__logo text-xs-center"
      :style="{ backgroundImage: 'url('+ require('@/assets/logo-incom.png') +')' }"
    >
      <!-- <img src="@/assets/logo-incom.png"> -->
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

  background-color: #577495;
  /* IE9, iOS 3.2+ */
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxIDEiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxyYWRpYWxHcmFkaWVudCBpZD0idnNnZyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGN4PSIwJSIgY3k9IjAlIiByPSIxNDEuNDIxMzU2MjM3MzA5NSUiPjxzdG9wIHN0b3AtY29sb3I9IiM3Yzk5YmUiIHN0b3Atb3BhY2l0eT0iMSIgb2Zmc2V0PSIwIi8+PHN0b3Agc3RvcC1jb2xvcj0iIzMxNGY2YiIgc3RvcC1vcGFjaXR5PSIxIiBvZmZzZXQ9IjEiLz48L3JhZGlhbEdyYWRpZW50PjxyZWN0IHg9Ii01MCIgeT0iLTUwIiB3aWR0aD0iMTAxIiBoZWlnaHQ9IjEwMSIgZmlsbD0idXJsKCN2c2dnKSIgLz48L3N2Zz4=);
  /* Android 2.3- hack (needed for the actual radial gradient) */
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxIDEiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxyYWRpYWxHcmFkaWVudCBpZD0idnNnZyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGN4PSIwJSIgY3k9IjAlIiByPSIxNDEuNDIxMzU2MjM3MzA5NSUiPjxzdG9wIHN0b3AtY29sb3I9IiM3Yzk5YmUiIHN0b3Atb3BhY2l0eT0iMSIgb2Zmc2V0PSIwIi8+PHN0b3Agc3RvcC1jb2xvcj0iIzMxNGY2YiIgc3RvcC1vcGFjaXR5PSIxIiBvZmZzZXQ9IjEiLz48L3JhZGlhbEdyYWRpZW50PjxyZWN0IHg9Ii01MCIgeT0iLTUwIiB3aWR0aD0iMTAxIiBoZWlnaHQ9IjEwMSIgZmlsbD0idXJsKCN2c2dnKSIgLz48L3N2Zz4=),
    -webkit-gradient(radial, left top, 0, left top, 723, color-stop(0, rgb(124, 153, 190)), color-stop(1, rgb(49, 79, 107)));
  /* Android 2.3 */
  background-image: -webkit-radial-gradient(
    left top,
    ellipse farthest-corner,
    rgb(124, 153, 190) 0%,
    rgb(49, 79, 107) 100%
  );
  /* IE10+ */
  background-image: radial-gradient(
    ellipse farthest-corner at left top,
    rgb(124, 153, 190) 0%,
    rgb(49, 79, 107) 100%
  );
  background-image: -ms-radial-gradient(
    left top,
    ellipse farthest-corner,
    rgb(124, 153, 190) 0%,
    rgb(49, 79, 107) 100%
  );
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

.mainboard-workspace__logo {
  position: relative;
  width: 100%;
  height: 100%;
  background-position: center center;
  background-repeat: no-repeat;
}

.mainboard-workspace__logo img {
  /* position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto; */
}
</style>
