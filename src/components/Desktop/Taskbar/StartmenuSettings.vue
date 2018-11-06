<template>
  <div class="mainboard-startmenu-settings">
    <v-menu
      v-model="contextMenu.visible"
      :position-x="contextMenu.x"
      :position-y="contextMenu.y"
      absolute
      offset-y
      light
      z-index="2000"
    >
      <v-list>
        <v-list-tile
          @click="''"
        >
          <v-list-tile-title
            @click="''"
          >
            {{ $t('rename') }}
          </v-list-tile-title>
        </v-list-tile>

        <v-list-tile
          @click="''"
        >
          <v-list-tile-title
            @click="''"
          >
            {{ $t('hide') }}
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-dialog
      v-model="visible"
      width="800px"
      persistent>
      <v-card light>
        <v-layout row>
          <v-flex xs12>
            <v-card-title class="primary mainboard-userform__title">
              <div class="headline">{{ $t('startmenu.customize') }}</div>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-container>
          <v-layout row>
            <v-flex xs12>
              <div
                ref="categories"
                class="container-categories">
                <mainboard-panel-elements
                  v-for="(category, index) in localCategories"
                  :key="category.id"
                  :title="category.label"
                  :elements="category.elements"
                  :visible-category="parseInt(category.visible)"
                  @startSortable="startSortable"
                  @receiveSortable="receiveSortable"
                  @stopSortable="stopSortable"
                  @createNewCategory="createNewCategory(index)"
                  @updateTitleCategory="updateTitleCategory(index, $event)"
                  @toggleVisibityCategory="toggleVisibityCategory(index)"
                  @removeCategory="removeCategory(index)"
                  @showContextMenuElement="showContextMenuElement(index, $event)"
                  @updateTitleElement="updateTitleElement(index, $event)"
                  @toggleVisibityElement="toggleVisibityElement(index, $event)"
                />
              </div>
            </v-flex>
          </v-layout>
          <v-layout align-center>
            <v-flex text-xs-center>
              <v-btn
                color="info"
                @click="saveCategories"
              >
                {{ $t('save') }}
              </v-btn>
              <v-btn
                color="error"
                @click="cancel"
              >
                {{ $t('cancel') }}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </div>

<!-- </div> -->
</template>
<script>
import PanelElements from "@/components/Desktop/Taskbar/PanelElements.vue";
export default {
  components: {
    mainboardPanelElements: PanelElements
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    categories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      localCategories: [],
      startIndexElement: null,
      stopIndexElement: null,
      startIndexCategory: null,
      stopIndexCategory: null,
      contextMenu: {
        visible: false,
        x: 0,
        y: 0
      }
    };
  },
  watch: {
    categories: {
      handler() {
        //this.localCategories = Object.assign([], this.categories);
        this.localCategories = JSON.parse(JSON.stringify(this.categories));
      },
      deep: true
    }
  },
  created() {
    this.localCategories = Object.assign([], this.categories);
  },
  mounted() {
    const self = this;
    $(this.$refs.categories).sortable({
      scroll: false,
      axis: "y",
      tolerance: "pointer",
      items: ".mainboard-panel",
      connectWith: ".container-categories",
      handle: ".mainboard-panel__title",
      //placeholder: "placeholder-row",
      start: function(event, ui) {
        const startIndexCategory = $(this)
          .find(".mainboard-panel")
          .index(ui.item);
        self.startIndexCategory = startIndexCategory;
      },
      stop: function(event, ui) {
        const stopIndexCategory = $(this)
          .find(".mainboard-panel")
          .index(ui.item);
        self.stopIndexCategory = stopIndexCategory;
        self.updateOrderCategoriesToLocalCategories();
      }
    });
  },
  methods: {
    showContextMenuElement(indexCategory, { indexElement, event }) {
      console.log(indexCategory, indexElement, event);
      event.preventDefault();
      this.contextMenu.visible = false;
      this.contextMenu.x = event.clientX;
      this.contextMenu.y = event.clientY;
      this.$nextTick(() => {
        this.contextMenu.visible = true;
      });
    },

    createNewCategory(index) {
      let newCategory = {
        id: 0,
        server_id: 0,
        label: this.$t("category.new"),
        opened: false,
        visible: 1,
        elements: []
      };
      this.localCategories.splice(index + 1, 0, newCategory);
    },

    startSortable({ startIndexElement, startIndexCategory }) {
      this.startIndexElement = startIndexElement;
      this.startIndexCategory = startIndexCategory;
    },

    receiveSortable({ stopIndexElement, stopIndexCategory }) {
      this.stopIndexElement = stopIndexElement;
      this.stopIndexCategory = stopIndexCategory;
      this.updateOrderElementsToLocalCategories();
    },

    stopSortable({ stopIndexElement, stopIndexCategory }) {
      this.stopIndexElement = stopIndexElement;
      this.stopIndexCategory = stopIndexCategory;
      this.updateOrderElementsToLocalCategories();
    },

    updateOrderElementsToLocalCategories() {
      const startIndexElement = this.startIndexElement;
      const startIndexCategory = this.startIndexCategory;
      const stopIndexElement = this.stopIndexElement;
      const stopIndexCategory = this.stopIndexCategory;
      const element = this.localCategories[startIndexCategory].elements[
        startIndexElement
      ];
      this.localCategories[startIndexCategory].elements.splice(
        startIndexElement,
        1
      );
      this.localCategories[stopIndexCategory].elements.splice(
        stopIndexElement,
        0,
        element
      );

      this.startIndexElement = null;
      this.startIndexCategory = null;
      this.stopIndexElement = null;
      this.stopIndexCategory = null;
    },

    updateOrderCategoriesToLocalCategories() {
      const startIndexCategory = this.startIndexCategory;
      const stopIndexCategory = this.stopIndexCategory;
      const category = this.localCategories[startIndexCategory];

      this.localCategories.splice(startIndexCategory, 1);
      this.localCategories.splice(stopIndexCategory, 0, category);

      this.startIndexCategory = null;
      this.stopIndexCategory = null;
    },

    updateTitleCategory(index, title) {
      this.localCategories[index].label = title;
    },

    updateTitleElement(indexCategory, { indexElement, newTitleElement }) {
      this.localCategories[indexCategory].elements[
        indexElement
      ].label = newTitleElement;
    },

    toggleVisibityElement(indexCategory, indexElement) {
      const value = parseInt(
        this.localCategories[indexCategory].elements[indexElement].visible
      );
      this.localCategories[indexCategory].elements[indexElement].visible = value
        ? 0
        : 1;
    },

    toggleVisibityCategory(index) {
      const value = parseInt(this.localCategories[index].visible);
      this.localCategories[index].visible = value ? 0 : 1;
    },

    removeCategory(index) {
      this.localCategories.splice(index, 1);
    },

    saveCategories() {
      this.$store
        .dispatch("actionSaveCategories", this.localCategories)
        .then(() => {
          this.localCategories = [];
          this.$emit("hideDialogWindow");
        });
    },

    cancel() {
      this.$emit("hideDialogWindow");
    }
  }
};
</script>

<style scoped>
.mainboard-userform__title {
  color: #fff;
}

.mainboard-panel-container {
  margin-bottom: 5px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 10px 15px;
}
</style>
