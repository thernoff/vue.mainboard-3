<template>
  <div
    :class="{'mainboard-panel--noelements': countElements == 0}"
    class="mainboard-panel"
  >
    <div
      class="mainboard-panel-elements"
    >
      <v-card
        tile
        class="mainboard-panel-elements__card"
        light
      >
        <v-card-title
          class="mainboard-panel-elements__title"
          primary-title
        >
          <h3 >{{ title }}</h3>
          <v-spacer/>
          <v-btn 
            icon 
            small 
            class="mainboard-panel-elements__btn" 
            title="Редактировать">
            <!-- <v-icon color="white">fas fa-arrow-left</v-icon> -->
            <v-icon color="white">create</v-icon>
          </v-btn>
          <v-btn 
            icon 
            small 
            class="mainboard-panel-elements__btn" 
            title="Добавить" 
            @click="createNewCategory">
            <v-icon color="white">add</v-icon>
          </v-btn>
          <v-btn 
            icon 
            small 
            class="mainboard-panel-elements__btn" 
            title="Отображать">
            <v-icon color="white">visibility</v-icon>
          </v-btn>
          <v-btn 
            icon 
            small 
            class="mainboard-panel-elements__btn" 
            title="Скрыть">
            <v-icon color="white">visibility_off</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="mainboard-panel-elements__body">
          <div 
            v-for="element in elements"
            :key="element.id"
            class="mainboard-panel-elements__element sortable-element"
          >
            <img 
              :src="element.image" 
              alt="">
            <div class="sortable-element__caption">
              <span>{{ element.label }}</span>
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
    }
  },
  computed: {
    countElements() {
      return this.elements.length;
    }
  },
  methods: {
    createNewCategory() {
      console.log("createNewCategory");
      this.$emit("createNewCategory");
    }
  }
};
</script>

<style>
.mainboard-panel {
  position: relative;
  min-height: 170px;
}

.mainboard-panel--noelements {
  height: 170px;
}

.mainboard-panel-elements {
  position: relative;
  width: 100%;
  height: 100%;
}

.mainboard-panel-elements__card {
  position: relative;
  width: 100%;
  height: 100%;
}

.mainboard-panel-elements__title {
  height: 30px;
  background-color: #4470e9;
  border-color: #d5b5c4;
  border-bottom-color: rgb(213, 181, 196);
  border-bottom: 1px solid transparent;
  overflow: hidden;
  cursor: move;
}

.mainboard-panel-elements__body {
  height: calc(100% - 30px);
}

.mainboard-panel-elements__element {
  width: 100px;
  position: relative;
  display: inline-block;
  margin-top: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
  vertical-align: top;
  text-align: center;
}

.mainboard-panel-elements__img {
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
}
</style>
