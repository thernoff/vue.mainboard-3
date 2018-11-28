<template>
  <div
    ref="shortcut"
    :id="id"
    :data-type="options.object.type"
    :data-object-id="options.object.id"
    :style="{
      display: 'inline-block',
      width: widthShortcut + 'px',
      height: heightShortcut + 'px',
    }"
    :class="{'mainboard-shortcut--active': options.active, 'mainboard-shortcut--noimage': !options.image}"
    :data-id=" id "
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
        <v-list-tile @click="''">
          <v-list-tile-title @click="createNewWindow">{{ $t('openInNewWindow') }}</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="''">
          <v-list-tile-title @click="renameShortcut">{{ $t('rename') }}</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="''">
          <v-list-tile-title @click="deleteShortcut">{{ $t('delete') }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>

    <!-- <div class="mainboard-shortcut__arrow">
      <i class="material-icons">
        link
      </i>
    </div>-->
    <div v-if="options.image" class="mainboard-shortcut__img">
      <img :src="options.image" :alt="options.label">
    </div>
    <div
      v-else-if="options.object.type === 'folder'"
      class="mainboard-shortcut__icon-folder shortcut-folder"
    >
      <span>
        <i class="material-icons icon-folder">folder</i>
      </span>
    </div>
    <div v-else class="mainboard-shortcut__icon-firstletter">
      <span>{{ firstLetterLabel }}</span>
    </div>

    <div class="mainboard-shortcut__title">
      <span v-if="!rename" class="shortcut-title">{{ options.label }}</span>
      <!-- <span
        v-if="!rename"
        class="shortcut-title"
        :class="{'shortcut-title--short': !options.active}"
      >{{ options.label }}</span>-->
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
      return this.options.label[0].toUpperCase();
    },

    shortLabel() {
      return this.options.label.length > 33
        ? this.options.label.slice(0, 33) + "..."
        : this.options.label;
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
      appendTo: ".mainboard-workspace",
      containment: ".mainboard-workspace",
      helper: "clone",
      zIndex: 1000,
      distance: 5,
      drag: function(event, ui) {
        var helper = ui.helper;
        helper.hide();
        var elemOverDrag = document.elementFromPoint(
          event.clientX,
          event.clientY
        );
        var $elemOverDrag = $(elemOverDrag);
        if ($elemOverDrag.closest(".mainboard-window").length > 0) {
          var $window = $elemOverDrag.closest(".mainboard-window");
          if (!$window.hasClass("window-active")) {
            var id = $window.data("id");
            self.$store.commit("setActiveWindow", id);
          }
        }

        var $shortcuts = $(".mainboard-shortcut");
        $shortcuts.removeClass("mainboard-shortcut--over-drag");

        if ($elemOverDrag.closest(".mainboard-shortcut").not(this).length > 0) {
          var $shortcut = $elemOverDrag.closest(".mainboard-shortcut");
          if ($shortcut.data("type") === "folder") {
            $shortcut.addClass("mainboard-shortcut--over-drag");
          }
        }

        helper.show();
      },
      stop: function(event, ui) {
        var helper = ui.helper;
        helper.hide();
        var $shortcut = $(this);

        var $shortcuts = $(".mainboard-shortcut");
        $shortcuts.removeClass("mainboard-shortcut--over-drag");

        var elemOverDrag = document.elementFromPoint(
          event.clientX,
          event.clientY
        );
        var $elemOverDrag = $(elemOverDrag);
        var $shortcutOverDrag = $elemOverDrag
          .closest(".mainboard-shortcut")
          .not(this);
        var elementId = $shortcut.data("id");

        if ($elemOverDrag.closest(".mainboard-window").length > 0) {
          var $window = $elemOverDrag.closest(".mainboard-window");
          var folderId = $window.data("object-id");
          if (elementId && folderId && $shortcut.data("type") !== "folder") {
            self.$store
              .dispatch("actionMoveElementToFolder", {
                elementId,
                folderId
              })
              .then(() => {
                self.$store.dispatch("actionSaveSettingsDesktop");
              })
              .catch(error => {
                console.log("error", error);
              });
          }
        } else if (
          $shortcut.data("type") !== "folder" &&
          $shortcutOverDrag.length > 0 &&
          $shortcutOverDrag.data("type") === "folder"
        ) {
          console.log("DROP ON FOLDER");
          var folderId = $shortcutOverDrag.data("object-id");
          if (elementId && folderId) {
            self.$store
              .dispatch("actionMoveElementToFolder", {
                elementId,
                folderId
              })
              .then(() => {
                self.$store.dispatch("actionSaveSettingsDesktop");
              })
              .catch(error => {
                console.log("error", error);
              });
          }
        } else {
          var options = {
            id: elementId,
            top: ui.position.top < 0 ? 0 : ui.position.top,
            left: ui.position.left < 0 ? 0 : ui.position.left,
            diffTop: ui.position.top - ui.originalPosition.top,
            diffLeft: ui.position.left - ui.originalPosition.left
          };

          self.$store
            .dispatch("actionUpdateShortcutCoords", options)
            .then(() => {
              self.$store.dispatch("actionSaveSettingsDesktop");
            });
        }

        helper.show();
      }
    });

    $(this.$refs.shortcut).click();
  },
  methods: {
    setActive() {
      this.$store.commit("setNotActiveShortcuts");
      this.$store.commit("setActiveShortcut", this.id);
      //this.$store.dispatch("actionSaveSettingsDesktop");
    },

    createNewWindow() {
      const type = this.options.object.type;
      const id = this.options.object.id;
      let object = null;
      switch (type) {
        case "folder":
          object = this.$store.state.workspaces.folders.find(f => f.id === id);
          break;
        case "frame": {
          object = this.$store.getters.itemStartmenuById(id);
          break;
        }
      }
      /* console.log("createNewWindow this.shortcut", this.options.object);
      console.log("createNewWindow from object", object); */

      if (object) {
        this.$store.dispatch("actionCreateNewWindow", object).then(response => {
          //this.$store.commit("setActiveWindow", response.id);
          if (response.minimize) {
            this.$store.commit("toggleMinimizeWindow", response.id);
          }
          this.$store.dispatch("actionSaveSettingsDesktop");
        });
      } else {
        this.$store.commit(
          "setError",
          this.$t("shortcut.errors.object_not_found")
        );
      }
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
      this.$store.dispatch("actionUpdateShortcut", data).then(() => {
        this.$store.dispatch("actionSaveSettingsDesktop");
      });
      this.$nextTick(() => this.$refs.renameinput.blur());
    },

    deleteShortcut() {
      this.$store.commit("setActiveShortcut", this.id);
      this.$store.dispatch("actionDeleteShortcut", this.id).then(() => {
        this.$store.dispatch("actionSaveSettingsDesktop");
      });
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
  cursor: default;
  /* -webkit-box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
  box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.2); */
  box-sizing: border-box;
  z-index: 1;
}

.mainboard-shortcut--active,
.mainboard-shortcut:hover {
  background-color: rgba(255, 255, 255, 0.5);
  border: 1px solid #b1a0a0;
  box-sizing: content-box;
  /* -webkit-box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
  box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.2); */
}

.shortcut-title {
  display: block;
  padding: 0px 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mainboard-shortcut--active .shortcut-title,
.mainboard-shortcut:hover .shortcut-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

.mainboard-shortcut--over-drag {
  background-color: rgba(142, 178, 255, 0.603);
  border: 1px solid rgba(90, 133, 226, 0.5);
}

.mainboard-shortcut--noimage {
  /* background-color: #fff; */
  /*  border-radius: 50%; */
  /* border: 5px solid rgb(155, 46, 46); */
  overflow: hidden;
}

.mainboard-shortcut__arrow {
  position: absolute;
  top: 30px;
  left: 50px;
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
  width: 100%;
  /*   color: #fff; */
  /* text-shadow: 1px 2px 5px #000; */
  text-align: center;
  font-size: 12px;
  line-height: 1;
}

.mainboard-shortcut__input {
  color: #000;
  width: 90%;
  height: 2em;
  text-align: center;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.context-menu__tile {
  height: 32px;
}
</style>
