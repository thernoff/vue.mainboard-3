<!--Компонент меню "Пуск"-->
<template>
  <div class="mainboard-startmenu">
    <mainboard-dialog-window
      :options="{
        title: $t('startmenu.messages.title_reset_settings_desktop'),
        text: $t('startmenu.messages.text_reset_settings_desktop')
      }"
      :visible="visibleDialogWindow"
      @hideDialogWindow="actionResetSettingsDesktop($event)"
    />
    <mainboard-startmenu-settings
      :categories="categories"
      :visible="visibleStartmenuSettings"
      @hideDialogWindow="visibleStartmenuSettings = false"
    />
    <v-menu
      v-model="contextMenuItem.visible"
      :position-x="contextMenuItem.x"
      :position-y="contextMenuItem.y"
      class="mainboard-startmenu__contextmenu-item"
      absolute
      offset-y
      light
      z-index="1000"
    >
      <v-list dense>
        <v-list-tile
          @click="''"
        >
          <v-list-tile-title @click="addShortcutToDesktop">
            {{ $t('shortcut.add_to_desktop') }}
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-menu
      v-model="contextMenuStartbutton.visible"
      :position-x="contextMenuStartbutton.x"
      :position-y="contextMenuStartbutton.y"
      class="mainboard-startmenu__contextmenu-startbutton"
      absolute
      offset-y
      light
      z-index="1000"
    >
      <v-list dense>
        <v-list-tile
          @click="''"
        >
          <v-list-tile-title @click="showStartmenuSettings">
            {{ $t('startmenu.settings') }}
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-menu
      :close-on-content-click="false"
      :close-delay="50"
      v-model="startMenu"
      top
      offset-y
      light
      z-index="999"
      close-on-click
    >
      <v-btn
        slot="activator"
        color="btnTaskbar"
        dark
        @click="onClickBtnStart"
        @contextmenu.prevent.stop="showContextMenuStartbutton($event)"
      >
        <v-icon>home</v-icon>
      </v-btn>
      <v-card class="mainboard-startmenu">
        <v-toolbar
          color="primary"
          dark
          depressed
        >
          <!-- <v-toolbar-side-icon></v-toolbar-side-icon> -->

          <v-toolbar-title>
            {{ user.lastname + ' ' + user.firstname }}
          </v-toolbar-title>
          <v-spacer/>
          <mainboard-user-form
            :user="user"
            @click.native="onClickBtnSettingsUser"
          />
        </v-toolbar>

        <v-list
          ref="listCategories"
          :style="{height: heightWorkspace * 0.45 + 'px'}"
          class="mainboard-startmenu__categories"
        >
          <!--Если строка поиска меню "Пуск" пуста, то отображаем шаблон для всех элементов -->
          <template
            v-if="!countSearchElements"
          >
            <v-list-group
              v-for="category in categories"
              v-if="parseInt(category.visible)"
              :key="category.id"
              class="mainboard-startmenu__category"
            >
              <v-list-tile slot="activator">
                <i class="material-icons icon-folder">folder</i>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ category.label }}
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <div
                v-for="element in category.elements"
                v-if="parseInt(element.visible)"
                ref="menuitem"
                :key="element.id"
                :data-id="element.id"
                :title="element.label"
                class="mainboard-startmenu__item"
                @click="createNewWindow(element)"
                @contextmenu.prevent="showContextMenuItem(element, $event)"
              >
                <v-list-tile
                  tag="a"
                >
                  <img
                    :src="element.image"
                    :style="{width: '25px', marginRight: '5px'}"
                  >
                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{ element.label }}
                    </v-list-tile-title>
                  </v-list-tile-content>

                </v-list-tile>
              </div>
            </v-list-group>
          </template>
          <!--Если строка поиска меню "Пуск" не пуста, то отображаем шаблон для найденных элементов -->
          <template v-else>
            <div
              v-for="element in searchElements"
              ref="menuitem"
              :key="element.id"
              :data-id="element.id"
              class="mainboard-startmenu__item"
              @click="createNewWindow(element)"
              @contextmenu.prevent="showContextMenuItem(element, $event)"
            >
              <v-list-tile
                tag="a"
              >
                <img
                  :src="element.image"
                  :style="{width: '25px', marginRight: '5px'}"
                >
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ element.label }}
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </div>
          </template>
          <v-divider/>
          <!--Вывод служебных утилит-->
          <v-list-group
            class="mainboard-startmenu__service-utils"
          >
            <v-list-tile slot="activator">
              <i class="material-icons icon-folder">build</i>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ $t('service.utils') }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <div
              :title= "$t('desktop.settings.reset')"
              class="mainboard-startmenu__item"
              @click="showDialogWindow"
              @contextmenu.prevent="''"
            >
              <v-list-tile
                tag="a"
              >
                <i class="material-icons icon-folder">autorenew</i>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ $t('desktop.settings.reset') }}
                  </v-list-tile-title>
                </v-list-tile-content>

              </v-list-tile>
            </div>
          </v-list-group>
        </v-list>
        <v-divider/>
        <!--Поиск по меню-->
        <v-list>
          <v-list-tile>
            <v-list-tile-content>
              <v-text-field
                v-model="inputSearch"
                :label=" $t('search') "
                class="mainboard-startmenu__input-search"
                append-icon="search"
              />
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <div class="text-md-center">
          <v-btn
            :title=" $t('page_refresh') "
            color="btnReload"
            dark
            @click="reloadApp"
          >
            <i class="material-icons">cached</i>
          </v-btn>
          <v-btn
            :title=" $t('signout') "
            color="btnLogout"
            dark
            @click="signoutApp"
          >
            <i class="material-icons">power_settings_new</i>
          </v-btn>
        </div>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import axios from "axios";
import { axiosInstance } from "@/axios-instance.js";

import UserForm from "@/components/Desktop/Taskbar/UserForm.vue";
import StartmenuSettings from "@/components/Desktop/Taskbar/StartmenuSettings.vue";
import DialogWindow from "@/components/Desktop/ModalWindows/DialogWindow.vue";

export default {
  components: {
    mainboardUserForm: UserForm,
    mainboardStartmenuSettings: StartmenuSettings,
    mainboardDialogWindow: DialogWindow
  },
  props: {
    heightWorkspace: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      startMenu: false,
      visibleStartmenuSettings: false,
      contextMenuItem: {
        visible: false,
        x: 0,
        y: 0,
        indexItem: null,
        indexElement: null,
        element: null
      },
      contextMenuStartbutton: {
        visible: false,
        x: 0,
        y: 0
      },
      inputSearch: "",
      visibleDialogWindow: false
    };
  },
  computed: {
    workspaces() {
      return this.$store.getters.getWorkspaces;
    },

    categories() {
      return this.$store.getters.categories;
    },

    searchElements() {
      let arrElements = [];
      if (this.inputSearch) {
        let regexp = new RegExp(this.inputSearch, "i");
        for (let i = 0; i < this.categories.length; i++) {
          this.categories[i].elements.forEach(function(element) {
            if (regexp.test(element.label)) {
              arrElements.push(element);
            }
          });
        }
      }
      return arrElements;
    },

    countSearchElements() {
      return this.searchElements.length;
    },

    user() {
      return this.$store.getters.user;
    }
  },

  mounted() {
    this.$refs.listCategories.$el.addEventListener(
      "scroll",
      this.onScrollListCategories
    );
  },

  updated() {
    this.addDroppableToItemMenu();
  },

  methods: {
    onScrollListCategories() {
      this.contextMenuItem.visible = false;
    },

    createNewWindow(element) {
      console.log("createNewWindow from element", element);
      this.startMenu = false;
      this.$store.dispatch("actionCreateNewWindow", element);
      this.$store.dispatch("actionToggleVisibleStartMenu");
      this.$store.dispatch("actionSaveSettingsDesktop");
    },

    addDroppableToItemMenu() {
      const self = this;

      $(this.$refs.menuitem).draggable({
        //$(".mainboard-startmenu__item").draggable({
        appendTo: ".mainboard-workspace",
        containment: ".mainboard-workspace",
        helper: "clone",
        distance: 5,
        zIndex: 1000,
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
          helper.show();
        },
        stop: function(event, ui) {
          var $menuItem = $(this);
          var elemOverDrag = document.elementFromPoint(
            event.clientX,
            event.clientY
          );
          var $elemOverDrag = $(elemOverDrag);
          var elementId = $(this).data("id");
          var object = self.$store.getters.itemStartmenuById(elementId);

          var folderId = 0;
          if ($elemOverDrag.closest(".mainboard-window").length > 0) {
            var $window = $elemOverDrag.closest(".mainboard-window");
            folderId = $window.data("object-id");
          }
          object.top = ui.position.top < 0 ? 0 : ui.position.top;
          object.left = ui.position.left < 0 ? 0 : ui.position.left;
          self.$store
            .dispatch("actionCreateNewShortcut", {
              object,
              folderId,
              error: self.$t("errors.shortcut_exist")
            })
            .then(response => {
              self.$store.dispatch("actionSaveSettingsDesktop");
              /* if (!folderId && response) {
                var options = {
                  id: response.id,
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
              } else {
                self.$store.dispatch("actionSaveSettingsDesktop");
              } */
            })
            .catch(error => {
              console.log("error", error);
            });
        }
      });
    },

    onClickBtnStart() {
      //this.addDroppableToItemMenu();
      //$(".mainboard-startmenu__categories").on("scroll", this.onScrollListCategories);
      //listCategories
      //console.log("onClickBtnStart", this.$refs.listCategories);

      this.inputSearch = "";
      this.$store.dispatch("actionSetNotActiveWindows");
      this.$store.dispatch("actionSaveSettingsDesktop");
    },

    onClickBtnSettingsUser() {
      console.log(this.searchElements);
      console.log("onClickBtnSettingsUser", this.user);
      //this.startMenu = false;
    },

    showContextMenuItem(element, event) {
      event.preventDefault();
      this.contextMenuItem.visible = false;
      this.contextMenuItem.x = event.clientX;
      this.contextMenuItem.y = event.clientY;
      this.contextMenuItem.element = element;
      this.$nextTick(() => {
        this.contextMenuItem.visible = true;
      });
    },

    showContextMenuStartbutton(event) {
      this.startMenu = false;
      event.preventDefault();
      this.contextMenuStartbutton.visible = false;
      this.contextMenuStartbutton.x = event.clientX;
      this.contextMenuStartbutton.y = event.clientY;
      this.$nextTick(() => {
        this.contextMenuStartbutton.visible = true;
      });
    },

    showStartmenuSettings() {
      this.visibleStartmenuSettings = true;
    },
    // Создаем ярлык из контекстного меню
    addShortcutToDesktop() {
      //const object = this.contextMenuItem.element;
      const object = this.$store.getters.itemStartmenuById(
        this.contextMenuItem.element.id
      );
      console.log("addShortcutToDesktop object", object);
      if (object) {
        this.$store
          .dispatch("actionCreateNewShortcut", {
            object,
            folderId: 0,
            error: this.$t("errors.shortcut_exist")
          })
          .then(response => {
            this.$store.dispatch("actionSaveSettingsDesktop");
          });
      }
    },

    reloadApp() {
      window.location.href = "/";
    },

    signoutApp() {
      axios({
        method: "post",
        headers: { "Content-Type": "application/form-data" },
        url: "/inner.php/extusers/fpage/logout/"
      })
        .then(() => {
          window.location.href = "/";
        })
        .catch(error => {
          console.log("error", error);
        });
    },

    showDialogWindow() {
      this.visibleDialogWindow = true;
    },

    actionResetSettingsDesktop(accept) {
      this.visibleDialogWindow = false;
      if (accept) {
        axios
          .post("/extusers/fpage/resetdesktop/")
          .then(() => {
            window.location.href = "/";
          })
          .catch(error => {
            console.log("error", error);
          });
      }
    }
  }
};
</script>

<style scoped>
.mainboard-startmenu {
  /* width: 300px; */
  overflow: hidden;
  /* position: absolute;
  left: 5px;
  bottom: 20px;
  z-index: 100; */
}

.mainboard-startmenu__categories {
  /* height: 500px; */
  overflow-y: auto;
  overflow-x: hidden;
  width: 320px;
}

.mainboard-startmenu__category {
  /* padding-right: 10px;
  overflow-y: scroll;
  overflow-x: hidden; */
  width: 320px;
}

.mainboard-startmenu__item:hover {
  background-color: rgba(208, 225, 245, 0.5);
}

.mainboard-startmenu__input-search {
  width: 100%;
}

.icon-folder {
  margin-right: 3px;
  color: #f58815;
}

.contextmenu-item {
  height: 32px;
}
</style>
