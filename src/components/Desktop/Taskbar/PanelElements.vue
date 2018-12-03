<template>
  <div
    :class="{
      'mainboard-panel--noelements': countElements == 0,
    }"
    class="mainboard-panel"
  >
    <div class="mainboard-panel-elements">
      <v-card tile class="mainboard-panel__card" light>
        <v-card-title
          :class="{
            'hidden': !visibleCategory
          }"
          class="mainboard-panel__title title-panel"
        >
          <span v-if="!renameTitleCategory">{{ title }}</span>
          <input
            v-show="renameTitleCategory && visibleCategory"
            ref="inputRenameTitleCategory"
            :value="title"
            class="panel-title__input"
            @blur="updateTitleCategory"
            @keyup.enter="updateTitleCategory"
          >
          <v-spacer/>
          <v-btn
            v-show="!renameTitleCategory && visibleCategory"
            :title=" $t('category.rename') "
            icon
            small
            class="mainboard-panel__btn"
            @click="showInputRenameTitleCategory"
          >
            <!-- <v-icon color="white">fas fa-arrow-left</v-icon> -->
            <v-icon color="white">create</v-icon>
          </v-btn>
          <v-btn
            v-show="renameTitleCategory && visibleCategory"
            :title=" $t('save') "
            icon
            small
            class="mainboard-panel__btn"
            @click="updateTitleCategory"
          >
            <v-icon color="white">save</v-icon>
          </v-btn>
          <v-btn
            v-show="visibleCategory"
            :title=" $t('category.create')"
            icon
            small
            class="mainboard-panel__btn"
            @click="createNewCategory"
          >
            <v-icon color="white">add</v-icon>
          </v-btn>
          <v-btn
            v-show="visibleCategory"
            :title=" $t('category.hide') "
            icon
            small
            class="mainboard-panel__btn"
            @click="toggleVisibityCategory"
          >
            <v-icon color="white">visibility_off</v-icon>
          </v-btn>
          <v-btn
            v-show="!visibleCategory"
            :title=" $t('category.display') "
            icon
            small
            class="mainboard-panel__btn"
            @click="toggleVisibityCategory"
          >
            <v-icon color="white">visibility</v-icon>
          </v-btn>
          <v-btn
            v-show="!countElements && visibleCategory"
            :title=" $t('category.delete') "
            icon
            small
            class="mainboard-panel__btn"
            @click="removeCategory"
          >
            <v-icon color="white">delete</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text ref="body" class="mainboard-panel__body">
          <div
            v-for="(element, index) in elements"
            :key="element.id"
            :class="{
              'hidden': !visibleCategory
            }"
            class="mainboard-panel__element sortable-element"
            @contextmenu.prevent="showContextMenuElement(index, $event)"
          >
            <img :src="element.image" :class="{'hidden-image': !parseInt(element.visible)}" alt>
            <div class="sortable-element__caption">
              <span v-if="indexRenameElement !== index">{{ element.label }}</span>
              <input
                v-show="parseInt(element.visible) && indexRenameElement === index"
                ref="inputRenameTitleElement"
                :value="element.label"
                class="element-label__input"
                @blur="updateTitleElement(index)"
                @keyup.enter="updateTitleElement(index)"
              >
            </div>
            <div class="element-buttons">
              <ul v-show="visibleCategory" class="element-buttons__list">
                <li>
                  <v-btn
                    v-show="parseInt(element.visible) && indexRenameElement !== index"
                    :title=" $t('rename') "
                    fab
                    dark
                    small
                    color="primary"
                    class="element-buttons__button"
                    @click="showInputRenameTitleElement(index)"
                  >
                    <v-icon dark class="element-buttons__icon">create</v-icon>
                  </v-btn>
                </li>
                <li>
                  <v-btn
                    v-show="parseInt(element.visible) && indexRenameElement === index"
                    :title=" $t('save') "
                    fab
                    dark
                    small
                    color="primary"
                    class="element-buttons__button"
                    @click="updateTitleElement(index)"
                  >
                    <v-icon dark class="element-buttons__icon">save</v-icon>
                  </v-btn>
                </li>
                <li v-show="!parseInt(element.visible)">
                  <v-btn
                    :title=" $t('display') "
                    fab
                    dark
                    small
                    color="primary"
                    class="element-buttons__button"
                    @click="toggleVisibityElement(index)"
                  >
                    <v-icon dark class="element-buttons__icon">visibility</v-icon>
                  </v-btn>
                </li>
                <li v-show="parseInt(element.visible)">
                  <v-btn
                    :title=" $t('hide') "
                    fab
                    dark
                    small
                    color="primary"
                    class="element-buttons__button"
                    @click="toggleVisibityElement(index)"
                  >
                    <v-icon dark class="element-buttons__icon">visibility_off</v-icon>
                  </v-btn>
                </li>
              </ul>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    elements: {
      type: Array,
      required: true
    },
    visibleCategory: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      titleElement: "",
      indexRenameElement: null,
      renameTitleElement: false,
      renameTitleCategory: false
    };
  },
  computed: {
    countElements() {
      return this.elements.length;
    }
  },
  mounted() {
    const self = this;
    $(this.$refs.body).sortable({
      connectWith: ".mainboard-panel__body",
      distance: 5,
      /* items: ".sortable-element", */
      helper: "clone",
      tolerance: "pointer",
      forcePlaceholderSize: true,
      scroll: false,
      start: function(event, ui) {
        console.log("ui", ui.placeholder);
        var $placeholder = ui.placeholder;

        $placeholder
          .width(ui.item.width())
          .height(ui.item.width())
          .css({
            display: "inline-block",
            visibility: "visible",
            border: "2px solid #466788",
            borderRadius: "5px",
            backgroundColor: "#69a6d6"
          });

        const $body = $(this);
        const startIndexElement = $(this)
          .find(".sortable-element")
          .index(ui.item);

        const $panel = $body.closest(".mainboard-panel");
        const startIndexCategory = $(".mainboard-panel").index($panel);
        self.$emit("startSortable", {
          startIndexElement,
          startIndexCategory
        });
      },
      sort: function(event, ui) {
        //var $t = $(".ui-sortable-placeholder");
        //console.log("ui-sortable-placeholder", $t);
        //console.log("ui", ui);
        /* $t.css({ width: "88px" });
        $t.css({ height: "88px" });
        $t.css({ display: "inline-block" }); */
        //$t.hide();
      },
      receive: function(event, ui) {
        const $body = $(this);
        const stopIndexElement = $(this)
          .find(".sortable-element")
          .index(ui.item);

        const $panel = $body.closest(".mainboard-panel");
        const stopIndexCategory = $(".mainboard-panel").index($panel);

        self.$emit("receiveSortable", {
          stopIndexElement,
          stopIndexCategory
        });
      },
      stop: function(event, ui) {
        const $body = $(this);
        const stopIndexElement = $(this)
          .find(".sortable-element")
          .index(ui.item);
        if (stopIndexElement >= 0) {
          const $panel = $body.closest(".mainboard-panel");
          const stopIndexCategory = $(".mainboard-panel").index($panel);

          self.$emit("stopSortable", {
            stopIndexElement,
            stopIndexCategory
          });
        }
      }
    });
  },
  methods: {
    showContextMenuElement(indexElement, event) {
      //this.$emit("showContextMenuElement", { indexElement, event });
    },

    createNewCategory() {
      this.$emit("createNewCategory");
    },

    showInputRenameTitleElement(indexElement) {
      this.indexRenameElement = indexElement;
      this.renameTitleElement = true;
      this.$nextTick(() => {
        this.$refs.inputRenameTitleElement[indexElement].focus();
      });
    },

    showInputRenameTitleCategory() {
      this.renameTitleCategory = true;
      this.$nextTick(() => this.$refs.inputRenameTitleCategory.focus());
    },

    updateTitleElement(indexElement) {
      const newTitleElement = this.$refs.inputRenameTitleElement[indexElement]
        .value;
      //if (this.title !== newTitleCategory) {
      this.$emit("updateTitleElement", { indexElement, newTitleElement });
      //}
      this.indexRenameElement = null;
    },

    updateTitleCategory() {
      const newTitleCategory = this.$refs.inputRenameTitleCategory.value;
      if (this.title !== newTitleCategory) {
        this.$emit("updateTitleCategory", newTitleCategory);
      }
      this.renameTitleCategory = false;
    },

    toggleVisibityElement(indexElement) {
      this.$emit("toggleVisibityElement", indexElement);
    },

    toggleVisibityCategory() {
      this.$emit("toggleVisibityCategory");
    },

    removeCategory() {
      this.$emit("removeCategory");
    }
  }
};
</script>

<style scoped>
.mainboard-panel {
  position: relative;
  padding-bottom: 10px;
  /* min-height: 170px; */
}

.mainboard-panel--hidden {
  opacity: 0.4;
}

.mainboard-panel--noelements {
  height: 170px;
}

.mainboard-panel-elements {
  position: relative;
  width: 100%;
  height: 100%;
}

.mainboard-panel__card {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 170px;
}

.mainboard-panel__title {
  padding: 0 8px !important;
  height: 30px;
  background-color: #3b5375;
  color: #fff;
  font-size: 16px;
  overflow: hidden;
  cursor: move;
}

.mainboard-panel__title--hidden {
  background-color: #5c5c5c;
}

.panel-title__input {
  padding: 0 8px;
  background-color: #fff;
  color: #000;
  font-size: 16px;
  height: 22px;
  border-radius: 2px;
}

.mainboard-panel__btn {
  margin: 0 !important;
  opacity: 1 !important;
}

.mainboard-panel__body {
  height: calc(100% - 30px);
  padding: 5px;
}

.mainboard-panel__element {
  width: 80px;
  position: relative;
  display: inline-block;
  margin-right: 20px;
  vertical-align: top;
  text-align: center;
}

.sortable-element {
  cursor: move;
}

.element-label__input {
  width: 95%;
  height: 22px;
  padding: 0 4px;
  background-color: #fff;
  color: #000;
  font-size: 13px;
  text-align: center;
  border: 1px solid rgb(44, 119, 190);
  border-radius: 3px;
}

.element-buttons {
  position: absolute;
  top: 0px;
  right: -20px;
}

.element-buttons__list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.element-buttons__button {
  width: 23px !important;
  height: 23px !important;
  margin: 2px 3px !important;
}

.element-buttons__icon {
  font-size: 1.2em !important;
  display: inline-flex !important;
}

.mainboard-panel__img {
  margin: 0px auto;
  width: 64px;
  height: 64px;
  display: inline-block;
  max-width: 100%;
  height: auto;
  padding: 4px;
  line-height: 1.42857143;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.sortable-element__caption {
  font-size: 12px;
  overflow: hidden;
}

.hidden {
  opacity: 0.4;
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: gray; /* IE 6-9 */
}

.hidden-image {
  opacity: 0.4;
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: gray; /* IE 6-9 */
}

.hidden .hidden-image {
  opacity: 1 !important;
}
</style>
