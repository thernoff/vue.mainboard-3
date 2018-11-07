<template>
  <div
    ref="shortcut"
    :style="{
      position: 'absolute',
      width: widthShortcut + 'px',
      height: heightShortcut + 'px',
      top: shortcut.top * heightWorkspace / 100 + 'px',
      left: shortcut.left * widthWorkspace / 100 + 'px' }"
    :class = "{'mainboard-shortcut--active': shortcut.active, 'mainboard-shortcut--noimage': !shortcut.image}"
    class="mainboard-shortcut"
    @dblclick="createNewWindow"
    @tap="createNewWindow"
    @touchstart="createNewWindow"
    @mousedown="setActive"
    @contextmenu.prevent.stop="showContextMenu"
  >
    <v-menu
      v-model="contextMenu.visible"
      :position-x="contextMenu.x"
      :position-y="contextMenu.y"
      class="mainboard-shortcut__context-menu context-menu"
      absolute
      offset-y
    >
      <v-list dense>
        <v-list-tile
          @click="''"
        >
          <v-list-tile-title
            @click="renameShortcut"
          >
            {{ $t('rename') }}
          </v-list-tile-title>
        </v-list-tile>

        <v-list-tile
          @click="''"
        >
          <v-list-tile-title
            @click="deleteShortcut"
          >
            {{ $t('delete') }}
          </v-list-tile-title>
        </v-list-tile>

      </v-list>
    </v-menu>

    <div
      v-if="shortcut.image"
      class="mainboard-shortcut__img"
    >
      <img
        :src="shortcut.image"
        :alt="shortcut.label"
      >
    </div>
    <div
      v-else-if="shortcut.type === 'folder'"
      class="mainboard-shortcut__icon-folder shortcut-folder"
    >
      <span>
        <i class="material-icons icon-folder">
          folder
        </i>
      </span>
    </div>
    <div
      v-else
      class="mainboard-shortcut__icon-firstletter"
    >
      <span>{{ firstLetterLabel }}</span>
    </div>

    <div class="mainboard-shortcut__title">
      <p v-if="!rename">{{ shortcut.label }}</p>
      <input
        v-show="rename"
        ref="renameinput"
        :value="shortLabel"
        class="mainboard-shortcut__input"
        @blur="updateShortcut"
        @keyup.enter="updateShortcut"
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    shortcut: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      contextMenu: {
        visible: false,
        x: 0,
        y: 0,
        indexShortcut: null
      },
      rename: false
    };
  },
  computed: {
    firstLetterLabel() {
      return this.shortcut.label[0].toUpperCase();
    },

    shortLabel() {
      return this.shortcut.label.length > 33
        ? this.shortcut.label.slice(0, 33) + "..."
        : this.shortcut.label;
    },

    widthWorkspace() {
      return this.$store.state.desktop.widthWorkspace;
    },

    heightWorkspace() {
      return this.$store.state.desktop.heightWorkspace;
    },

    widthShortcut() {
      return this.$store.state.workspaces.widthShortcut;
    },

    heightShortcut() {
      return this.$store.state.workspaces.heightShortcut;
    }
  },
  mounted() {
    var self = this;
    $(this.$refs.shortcut).draggable({
      //containment: ".mainboard-workspace",
      containment: ".mainboard-shortcut-list",
      zIndex: 1000,
      start: function(event) {},
      stop: function(event, ui) {
        var $shortcut = $(this);
        var options = {
          id: self.shortcut.id,
          top: ui.position.top < 0 ? 0 : ui.position.top,
          left: ui.position.left < 0 ? 0 : ui.position.left,
          diffTop: ui.position.top - ui.originalPosition.top,
          diffLeft: ui.position.left - ui.originalPosition.left
        };

        self.$store.dispatch("actionUpdateShortcutCoords", options);
      }
    });
  },
  methods: {
    setActive() {
      this.$store.dispatch("actionSetActiveShortcut", this.id);
      this.$store.dispatch("actionSaveSettingsDesktop");
    },

    createNewWindow() {
      console.log("createNewWindow this.shortcut", this.shortcut);
      this.$store.dispatch("actionCreateNewWindow", this.shortcut);
      this.$store.dispatch("actionSaveSettingsDesktop");
    },

    showContextMenu(e) {
      e.preventDefault();
      this.contextMenu.visible = false;
      this.contextMenu.x = e.clientX;
      this.contextMenu.y = e.clientY;
      this.$nextTick(() => {
        this.contextMenu.visible = true;
      });
    },

    renameShortcut() {
      this.rename = true;
      this.$nextTick(() => this.$refs.renameinput.focus());
    },

    updateShortcut() {
      this.rename = false;
      const label = this.$refs.renameinput.value;
      const data = {
        //index: this.index,
        id: this.id,
        options: {
          label
        }
      };
      this.$store.dispatch("actionUpdateShortcut", data);
      this.$store.dispatch("actionSaveSettingsDesktop");
      this.$nextTick(() => this.$refs.renameinput.blur());
    },

    deleteShortcut() {
      this.$store.dispatch("actionSetActiveShortcut", this.id);
      this.$store.dispatch("actionDeleteShortcut", this.id);
      this.$store.dispatch("actionSaveSettingsDesktop");
    }
  }
};
</script>

<style scoped>
.mainboard-shortcut {
  /* margin: 5px; */
  display: inline-block;
  /* width: 100px;
  height: 110px; */
  /* background-color: #fff;
  border: 2px solid #b1a0a0; */
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
  /* -webkit-box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
  box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.2); */
  box-sizing: border-box;
}

.mainboard-shortcut--active,
.mainboard-shortcut:hover {
  background-color: rgba(255, 255, 255, 0.5);
  border: 1px solid #b1a0a0;
  /* -webkit-box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
  box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.2); */
}

.mainboard-shortcut--noimage {
  /* background-color: #fff; */
  /*  border-radius: 50%; */
  /* border: 5px solid rgb(155, 46, 46); */
  overflow: hidden;
}

.mainboard-shortcut__img {
  /* padding: 5px; */
  margin-top: 5px;
  text-align: center;
}

.mainboard-shortcut__img img {
  width: 50px;
}

.mainboard-shortcut__icon-firstletter {
  color: rgb(126, 26, 26);
  padding: 5px;
  text-align: center;
  font-size: 35px;
  font-weight: 600;
}

.mainboard-shortcut__icon-folder {
  color: rgb(230, 199, 26);
  /* padding: 5px; */
  text-align: center;
  font-weight: 600;
}

.icon-folder {
  font-size: 48px !important;
}

.mainboard-shortcut__title {
  color: #fff;
  text-shadow: 1px 2px 5px #000;
  text-align: center;
  font-size: 12px;
  line-height: 1;
}

.mainboard-shortcut__input {
  color: #000;
  width: 90%;
  height: 2em;
  text-align: center;
}

.context-menu__tile {
  height: 32px;
}
</style>
