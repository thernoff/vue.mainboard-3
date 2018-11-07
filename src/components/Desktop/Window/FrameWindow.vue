<template>
  <base-window
    :index="index"
    :id="id"
    :options="options"
  >
    <div
      slot="buttons"
      class="mainboard-window__group-buttons">
      <v-btn
        v-if="showBtnBack"
        icon
        small
        class="mainboard-window__btn"
        title="Назад"
        @click="back">
        <v-icon color="white">fas fa-arrow-left</v-icon>
      </v-btn>
      <!-- <v-btn icon small class="mainboard-window__btn" @click="toggleClassWindow('mainboard-window--fullheight')" title="Развернуть по высоте">
        <v-icon color="white">fas fa-arrows-alt-v</v-icon>
    </v-btn>
    <v-btn icon small class="mainboard-window__btn" @click="toggleClassWindow('mainboard-window--fullwidth')" title="Развернуть по ширине">
        <v-icon color="white">fas fa-arrows-alt-h</v-icon>
    </v-btn> -->
      <v-btn
        :title=" $t('window.refresh') "
        icon
        small
        class="mainboard-window__btn"
        @click.stop="reloadWindow">
        <v-icon color="white">refresh</v-icon>
      </v-btn>
    </div>

    <v-card-text
      slot="body"
      class="mainboard-window__body">
      <base-mainboard-frame
        ref="baseMainboardFrame"
        :back-link="backLink"
        :api-link="options.apiLink"
        @loadFrame="updateWindow($event)"/>
    </v-card-text>
  </base-window>
</template>

<script>
import baseWindow from "@/components/Desktop/Window/BaseWindow.vue";
import baseFrame from "@/components/Base/BaseFrame.vue";
export default {
  components: {
    baseMainboardFrame: baseFrame,
    baseWindow: baseWindow
  },
  props: {
    index: {
      type: Number,
      required: true
    },
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
    return {
      apiLink: "",
      backLink: "",
      history: [],
      pressBtnReload: false,
      pressBtnBack: false
    };
  },
  computed: {
    showBtnBack() {
      return this.history.length > 1;
    },

    isModeGrid() {
      return this.$store.isModeGrid;
    },

    widthWorkspace() {
      return this.$store.state.desktop.widthWorkspace;
    },

    heightWorkspace() {
      return this.$store.state.desktop.heightWorkspace;
    }
  },

  created() {
    this.apiLink = this.options.apiLink;
    this.history.push(this.options.apiLink);
  },

  methods: {
    reloadWindow() {
      this.$refs.baseMainboardFrame.$refs.baseFrame.src = this.options.apiLink;
    },

    updateWindow(data) {
      console.log("updateWindow data", data);
      //this.updateHistory(data.apiLink);
      this.updateHistory(data.currentLink);
      let options = Object.assign({}, data, { id: this.id });
      this.$store.dispatch("actionUpdateWindow", options);
      this.$store.dispatch("actionSaveSettingsDesktop");
    },

    updateWindowTitle(title) {
      this.$store.commit("updateWindowTitle", { id: this.id, title });
      this.$store.dispatch("actionSaveSettingsDesktop");
    },

    updateHistory(apiLink) {
      if (!this.pressBtnReload && !this.pressBtnBack) {
        this.history.push(apiLink);
      }

      this.pressBtnReload = false;
      this.pressBtnBack = false;
      this.backLink = "";
      console.log("Window.history", this.history);
    },

    back() {
      if (this.history.length > 1) {
        this.pressBtnBack = true;
        this.backLink = this.history[this.history.length - 2];
        this.history.pop();
      }
    }
  }
};
</script>

<style scoped>
.mainboard-window {
  position: absolute;
  /* border: 2px solid rgba(92, 107, 192, 0.8); */
  border-radius: 5px;
  box-sizing: border-box;
  webkit-box-shadow: 1px 3px 9px rgba(0, 0, 0, 0.5);
  box-shadow: 1px 3px 9px rgba(0, 0, 0, 0.5);
  background-color: #fff;
}

.mainboard-window--fullheight {
  top: 0px !important;
  height: 100% !important;
}

.mainboard-window--fullwidth {
  width: 100% !important;
}

.mainboard-window--top-half {
  top: 0px !important;
  left: 0px !important;
  width: 100% !important;
  height: 50% !important;
}

.mainboard-window--bottom-half {
  bottom: 0px !important;
  left: 0px !important;
  width: 100% !important;
  height: 50% !important;
}

.mainboard-window__card {
  position: relative;
  width: 100%;
  height: 100%;
  border: 2px solid #5b7aa1;
  border-radius: inherit;
}

.mainboard-window__cover-window {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
}

.mainboard-window__header {
  font-size: 16px;
  color: #fff;
  cursor: move;
  padding: 0 5px;
  height: 30px;
  border-top-left-radius: 0px !important;
  border-top-right-radius: 0px !important;
}

.mainboard-window__title {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.mainboard-window__group-buttons {
  /*   width: 40%;
  float: right; */
}

.mainboard-window__btn {
  margin: 0;
}

.mainboard-window__body {
  height: calc(100% - 40px);
  position: relative;
  padding: 0;
  margin: 0;
  /* border-radius: inherit; */
}

.fullscreen {
  position: absolute !important;
  z-index: 1000;
  width: 100% !important;
  height: 100% !important;
  top: 0 !important;
  left: 0 !important;
  bottom: 0 !important;
  right: 0 !important;
}

.half-height {
  height: 90% !important;
}

.half-width {
  width: 90% !important;
}

@media (max-width: 1200px) {
  .mainboard-window__title {
    width: 55%;
    font-size: 14px;
  }
}

@media (max-width: 800px) {
  .mainboard-window__title {
    display: none;
  }
}
</style>
