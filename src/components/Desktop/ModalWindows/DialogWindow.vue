<template>
  <div class="mainboard-dialog-window">
    <slot/>
    <v-dialog 
      v-model="visible" 
      width="400px">
      <v-card light>
        <v-container>
          <v-layout row>
            <v-flex xs12>
              <v-card-title>
                <h1 class="text--primary">{{ options.title }}</h1>
              </v-card-title>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12>
              <v-card-text>
                <p>{{ options.text }}</p>
              </v-card-text>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12>
              <v-card-actions>
                <v-spacer/>
                <v-btn 
                  class="danger" 
                  @click="onCancel">{{ dictonary.CANCEL }}</v-btn>
                <v-btn 
                  class="info" 
                  @click="onAccept">{{ dictonary.AGREE }}</v-btn>
              </v-card-actions>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import dictonary from "@/languages/ru.js";

export default {
  props: {
    options: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dictonary,
      modal: false
    };
  },
  watch: {
    visible(value) {
      this.modal = value;
    }
  },
  methods: {
    onCancel() {
      this.$emit("hideDialogWindow", false);
    },
    onAccept() {
      this.$emit("hideDialogWindow", true);
    }
  }
};
</script>

<style scoped>
</style>
