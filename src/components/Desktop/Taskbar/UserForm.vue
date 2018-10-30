<template>
  <div class="mainboard-userform">
    <v-layout
      row
      justify-center>
      <v-btn
        icon
        v-on:click="modal=true">
        <v-icon>settings</v-icon>
      </v-btn>
      <v-dialog
        v-model="modal"
        width="400px"
        persistent
      >
        <!-- <v-btn icon slot="activator">
        <v-icon>settings</v-icon>
      </v-btn> -->
        <v-card light>
          <v-layout row>
            <v-flex xs12>
              <v-card-title class="primary mainboard-userform__title">
                <div class="headline">{{ $t('user.settings') }}</div>
              </v-card-title>
            </v-flex>
          </v-layout>
          <v-container>
            <v-layout row>
              <v-flex xs12>
                <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation>
                  <v-text-field
                    v-bind:value="user.firstname"
                    v-bind:rules="nameRules"
                    name="firstname"
                    v-bind:label=" $t('user.firstname') "
                    required
                    readonly
                  />
                  <v-text-field
                    v-bind:value="user.lastname"
                    v-bind:rules="nameRules"
                    name="lastname"
                    v-bind:label=" $t('user.lastname') "
                    required
                    readonly
                  />
                  <v-text-field
                    v-bind:value="user.email"
                    v-bind:rules="emailRules"
                    name="email"
                    v-bind:label=" $t('user.email') "
                    required
                    v-on:input="email = $event"
                  />
                  <v-text-field
                    v-model="password"
                    v-bind:rules="passwordRules"
                    v-bind:type="'password'"
                    name="password"
                    v-bind:label=" $t('user.password') "
                  />
                  <v-text-field
                    v-model="repassword"
                    v-bind:rules="repasswordRules"
                    v-bind:type="'password'"
                    name="repassword"
                    v-bind:label=" $t('user.repassword') "
                  />
                  <v-select
                    v-bind:value="user.idActiveInterface"
                    v-bind:items="interfaces"
                    item-text="name"
                    item-value="id"
                    v-bind:label=" $t('user.interface') "
                    v-on:input="idActiveInterface = $event"
                  />
                  <v-select
                    v-bind:value="currentLanguage"
                    v-bind:items="languages"
                    v-bind:label=" $t('user.language') "
                    v-on:input="changeLang($event)"
                  />
                  <v-layout align-center>
                    <v-flex text-xs-center>
                      <v-btn
                        v-bind:disabled="!valid"
                        color="info"
                        v-on:click="saveUser"
                      >
                        {{ $t('save') }}
                      </v-btn>
                      <v-btn
                        color="error"
                        v-on:click="cancel"
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
    </v-layout>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      modal: false,
      valid: false,
      email: "",
      password: "",
      repassword: "",
      idActiveInterface: null,
      languages: ["ru", "en"],
      //firstname: this.user.firstname,
      nameRules: [
        v => !!v || this.$t("user.rules.name_required")
        //v => (v && v.length <= 10) || "Name must be less than 10 characters"
      ],
      emailRules: [
        v => !!v || this.$t("user.rules.email_required"),
        v => /.+@.+/.test(v) || this.$t("user.rules.email_valid")
      ],
      passwordRules: [
        v =>
          v.length === 0 ||
          v.length >= 6 ||
          this.$t("user.rules.password_length")
      ],
      repasswordRules: [
        v =>
          v.length === 0 ||
          v.length >= 6 ||
          this.$t("user.rules.password_length"),
        v => v == this.password || this.$t("user.rules.passwords_equals")
      ]
    };
  },
  computed: {
    /* user() {
      return this.$store.getters.user;
    }, */
    interfaces() {
      return this.$store.getters.interfaces;
    },
    currentLanguage() {
      return this.$i18n.locale;
    }
  },
  mounted() {},
  methods: {
    saveUser() {
      if (this.$refs.form.validate()) {
        // Native form submission is not yet supported
        this.modal = false;
        let user = {};
        if (this.password) {
          user.password = this.password;
          user.repassword = this.repassword;
        }
        if (this.email) {
          user.email = this.email;
        }
        if (this.idActiveInterface) {
          user.idActiveInterface = this.idActiveInterface;
        }
        if (this.password || this.email || this.idActiveInterface) {
          this.$store.dispatch("actionSaveUser", user);
        }
        this.password = this.repassword = "";

        if (process.env.NODE_ENV !== "development") {
          location.reload();
        }
      }
    },

    cancel() {
      //this.$refs.form.reset();
      this.modal = false;
      this.idActiveInterface = null;
    },

    changeLang($lang) {
      this.$i18n.locale = $lang;
    }
  }
};
</script>

<style scoped>
.mainboard-userform__title {
  color: #fff;
}
</style>
