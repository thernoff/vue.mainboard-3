<template>
  <div class="mainboard-dialog-window-create-folder">
    <v-dialog
      v-model="visible"
      width="400px"
      hide-overlay
      persistent>
      <v-card light>
        <v-layout row>
          <v-flex xs12>
            <v-card-title class="primary mainboard-userform__title">
              <div class="headline">{{ $t('folder.create') }}</div>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-container>
          <v-layout row>
            <v-flex xs12>
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
                v-on:submit.prevent="''"
              >
                <v-text-field
                  v-model="title"
                  :rules="titleRules"
                  :label=" $t('folder.title') "
                  name="title"
                  @keyup.prevent.enter="create"
                  required
                />
                <v-layout align-center>
                  <v-flex text-xs-center>
                    <v-btn
                      :disabled="!valid"
                      color="info"
                      @click="create"
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
              </v-form>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "DialogWindowCreateFolder",
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      modal: false,
      valid: false,
      title: "",
      titleRules: [v => !!v || this.$t("folder.rules.title_required")]
    };
  },
  watch: {
    visible(value) {
      this.modal = value;
    }
  },
  methods: {
    cancel() {
      this.clearData();
      this.$emit("hideDialogWindow", null);
    },
    create() {
      if (this.$refs.form.validate()) {
        const folder = {
          title: this.title
        };
        this.clearData();
        this.$emit("hideDialogWindow", folder);
      }
    },

    clearData() {
      this.title = "";
    }
  }
};
</script>

<style scoped>
</style>
