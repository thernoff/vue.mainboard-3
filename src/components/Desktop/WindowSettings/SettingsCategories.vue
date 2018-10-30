<template>
  <div class="mainboard-settings-categories">
    <!-- <div class="mainboard-panel-wrapper"
    v-for="category in categories"
    v-bind:key="category.id"
  > -->
    <mainboard-panel-elements
      v-for="category in categories"
      :key="category.id"
      :title="category.label"
      :elements="category.elements"
      @createNewCategory="createNewCategory"
    />
  </div>

<!-- </div> -->
</template>
<script>
import PanelElements from "@/components/Desktop/WindowSettings/PanelElements.vue";
export default {
  components: {
    mainboardPanelElements: PanelElements
  },
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      localCategories: []
    };
  },
  watch: {
    categories() {
      this.localCategories = Object.assign([], this.categories);
    }
  },
  created() {
    console.log("this.categories", this.categories);
    this.localCategories = Object.assign([], this.categories);
  },
  methods: {
    createNewCategory() {
      console.log("createNewCategory categories", this.categories);
      let newCategory = {
        id: 0,
        server_id: 0,
        label: "Новая категория",
        opened: false,
        visible: 1,
        elements: []
      };
      this.categories.push(newCategory);
    }
  }
};
</script>

<style scoped>
.mainboard-panel-container {
  margin-bottom: 5px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 10px 15px;
}
</style>
