<template>
  <div class="mainboard-dialog-window-create-shortcut">
    <v-dialog
      v-model="visible"
      width="400px"
      hide-overlay
      persistent>
      <v-card light>
        <v-layout row>
          <v-flex xs12>
            <v-card-title class="primary mainboard-userform__title">
              <div class="headline">{{ $t('shortcut.create') }}</div>
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
                  v-model="name"
                  :rules="nameRules"
                  :label=" $t('shortcut.name') "
                  name="name"
                  required
                />
                <v-text-field
                  :value="url"
                  :rules="urlRules"
                  :label=" $t('shortcut.url') "
                  name="url"
                  required
                  @input="url = $event"
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
  name: "DialogWindowCreateShortcut",
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
      name: "",
      url: "",
      nameRules: [
        v => !!v || this.$t("shortcut.rules.name_required")
        //v => (v && v.length <= 10) || "Name must be less than 10 characters"
      ],
      urlRules: [
        v => !!v || this.$t("shortcut.rules.url_required"),
        v =>
          /^(ftp|http|https):\/\/[^ "]+$/.test(v) ||
          this.$t("shortcut.rules.url_valid")
      ]
    };
  },
  watch: {
    visible(value) {
      this.modal = value;
    }
  },
  methods: {
    cancel() {
      this.$emit("hideDialogWindow", null);
    },
    create() {
      if (this.$refs.form.validate()) {
        const customShortcut = {
          label: this.name,
          url: this.url
        };
        this.name = "";
        this.url = "";
        this.$emit("hideDialogWindow", customShortcut);
      }
    }
  }
};
</script>

<style scoped>
</style>
