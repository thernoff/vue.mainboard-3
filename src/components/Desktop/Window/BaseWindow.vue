<template>
  <div
    ref="window"
    :data-index="index"
    :data-id="id"
    :style="{
      top: options.top * heightWorkspace / 100 + 'px',
      left: options.left * widthWorkspace / 100 + 'px',
      width: options.width + '%',
      height: options.height + '%',
      zIndex: options.zIndex,
    }"
    :class="[{'fullscreen': options.fullscreen}, options.classesCss.join(' ')]"
    class="mainboard-window"
    @contextmenu.stop.prevent="''"
  >
    <v-card
      tile
      class="mainboard-window__card"
    >
      <v-card-title
        :class = "{'titleWindow': options.active, 'indigo lighten-4': !options.active}"
        :title="options.title"
        class="mainboard-window__header"
        primary-title
        @mousedown="setActiveWindow"
        @dblclick="toggleFullscreenWindow"
      >
        <div class="mainboard-window__title">{{ options.title }}</div>
        <v-spacer/>
        <slot name="buttons"/>
        <div
          class="mainboard-window__group-buttons">
          <v-btn
            :title=" $t('minimize') "
            icon
            small
            class="mainboard-window__btn"
            @click.stop="minimizeWindow">
            <v-icon color="white">minimize</v-icon>
          </v-btn>
          <v-btn
            :title=" $t('window.fullscreen') "
            icon
            small
            class="mainboard-window__btn"
            @click.stop="toggleFullscreenWindow">
            <v-icon
              v-if="!options.fullscreen"
              color="white">fullscreen</v-icon>
            <v-icon
              v-if="options.fullscreen"
              color="white">fullscreen_exit</v-icon>
          </v-btn>
          <v-btn
            :title=" $t('window.close') "
            icon
            small
            class="mainboard-window__btn"
            @click.stop="closeWindow">
            <v-icon color="white">close</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <div class="mainboard-window__body">
        <slot name="body"/>
      </div>
      <!-- <v-card-text class="mainboard-window__body"> -->
        <!-- <div
          v-if="!options.active"
          class="mainboard-window__cover-window"
          @click="setActiveWindow"
        /> -->
        <!-- <slot name="body"/> -->
     <!--  </v-card-text> -->
      <v-divider/>
    </v-card>
  </div>
</template>

<script>
import baseFrame from "@/components/Base/BaseFrame.vue";
export default {
  components: {
    baseMainboardFrame: baseFrame
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
    return {};
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

  mounted() {
    var self = this;
    //var countRows = self.$store.getters.getCountRows;
    //var countColumns = self.$store.getters.getCountColumns;
    $(this.$refs.window)
      .draggable({
        handle: ".mainboard-window__header",
        containment: ".mainboard-workspace",
        snap: !self.isModeGrid ? false : ".mainboard-window",
        start: function(event) {
          var $window = $(this);
          $window.find(".mainboard-frame__cover").show();
          if ($window.hasClass("fullscreen")) {
            return false;
          }
        },
        stop: function(event, ui) {
          var $window = $(this);
          $window.find(".mainboard-frame__cover").hide();
          var id = $window.data("id");
          var options = {
            //index: $(this).data("index"),
            id: id,
            top: ui.position.top < 0 ? 0 : ui.position.top,
            left: ui.position.left < 0 ? 0 : ui.position.left,
            width: $window.width(),
            height: $window.height(),
            diffTop: ui.position.top - ui.originalPosition.top,
            diffLeft: ui.position.left - ui.originalPosition.left
          };

          //$window.removeClass("half-height");

          self.$store.dispatch("actionUpdateWindowCoords", options);
          self.$store.dispatch("actionSaveSettingsDesktop");
        }
      })
      .resizable({
        handles: "se, e, s, n, w",
        containment: ".mainboard-workspace",
        grid: [1, 1],
        iframeFix: true,
        minHeight: 150,
        minWidth: 300,
        //helper: "ui-resizable-helper",
        start: function(event) {
          var $window = $(this);
          //$window.find('.mainboard-frame__cover').css({display: 'block'});
          $window.find(".mainboard-frame__cover").show();
          var id = $window.data("id");
          self.$store.commit("setActiveWindow", id);
        },
        stop: function(event, ui) {
          console.log("ui", ui);
          var $window = $(this);
          $window.find(".mainboard-frame__cover").hide();
          var id = $window.data("id");
          //var coefWidth = ui.size.width / ui.originalSize.width;
          //var coefHeight = ui.size.height / ui.originalSize.height;
          //console.log(coefWidth, coefHeight);
          var options = {
            //index: self.index,
            id: id,
            //index: $(this).data("index"),
            //coefWidth: coefWidth,
            //coefHeight: coefHeight,
            top: ui.position.top < 0 ? 0 : ui.position.top,
            left: ui.position.left < 0 ? 0 : ui.position.left,
            width: ui.size.width,
            height: ui.size.height,
            diffTop: ui.position.top - ui.originalPosition.top,
            diffLeft: ui.position.left - ui.originalPosition.left
          };
          //self.$store.dispatch("actionUpdateWindowCoords", options);
          self.$store.dispatch("actionUpdateWindowSize", options);
          self.$store.dispatch("actionSaveSettingsDesktop");
        }
      });
  },

  methods: {
    toggleClassWindow(classCss) {
      this.$store.commit("toggleClassWindow", {
        id: this.id,
        classCss: classCss
      });
      this.$store.dispatch("actionSaveSettingsDesktop");
    },

    setActiveWindow() {
      this.$store.commit("setActiveWindow", this.id);
      this.$store.dispatch("actionSaveSettingsDesktop");
    },

    minimizeWindow() {
      this.$store.commit("toggleMinimizeWindow", this.id);
      if (this.options.active) {
        //this.$store.commit("unsetActiveWindow");
      }
      this.$store.dispatch("actionSaveSettingsDesktop");
    },

    toggleFullscreenWindow() {
      this.$store.commit("toggleFullscreenWindow", this.id);
      this.$store.dispatch("actionSaveSettingsDesktop");
    },

    closeWindow() {
      this.$store.dispatch("actionCloseWindow", this.id);
      //this.$store.commit("setActiveWindow");
      this.$store.dispatch("actionSaveSettingsDesktop");
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
