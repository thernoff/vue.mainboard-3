<template>
  <div class="mainboard-userform">
    <v-layout row justify-center>
      <v-btn icon @click="modal=true">
        <v-icon>settings</v-icon>
      </v-btn>
      <v-dialog v-model="modal" width="400px" persistent>
        <!-- <v-btn icon slot="activator">
        <v-icon>settings</v-icon>
        </v-btn>-->
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
                <v-form ref="form" v-model="valid" @submit.prevent="''">
                  <v-text-field
                    :value="user.firstname"
                    :rules="nameRules"
                    :label=" $t('user.firstname') "
                    name="firstname"
                    required
                    readonly
                  />
                  <v-text-field
                    :value="user.lastname"
                    :rules="nameRules"
                    :label=" $t('user.lastname') "
                    name="lastname"
                    required
                    readonly
                  />
                  <v-text-field
                    :value="user.email"
                    :rules="emailRules"
                    :label=" $t('user.email') "
                    name="email"
                    required
                    @input="email = $event"
                  />
                  <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    :type="'password'"
                    :label=" $t('user.password') "
                    name="password"
                  />
                  <v-text-field
                    v-model="repassword"
                    :rules="repasswordRules"
                    :type="'password'"
                    :label=" $t('user.repassword') "
                    name="repassword"
                  />
                  <v-select
                    :value="user.idActiveInterface"
                    :items="interfaces"
                    :label=" $t('user.interface') "
                    item-text="name"
                    item-value="id"
                    @input="idActiveInterface = $event"
                  />
                  <v-select
                    :value="currentLanguage"
                    :items="languages"
                    :label=" $t('user.language') "
                    @input="changeLang($event)"
                  />
                  <v-layout align-center>
                    <v-flex text-xs-center>
                      <v-btn :disabled="!valid" color="info" @click="saveUser">{{ $t('save') }}</v-btn>
                      <v-btn color="error" @click="cancel">{{ $t('cancel') }}</v-btn>
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
      langInterface: "",
      nameRules: [
        v => !!v || this.$t("user.rules.name_required")
        //v => (v && v.length <= 10) || "Name must be less than 10 characters"
      ],
      emailRules: [
        v => !!v || this.$t("user.rules.email_required"),
        //v => /.+@.+\./.test(v) || this.$t("user.rules.email_valid")
        v =>
          /^[0-9a-z-\.]+\@[0-9a-z-]{2,}\.[a-z]{2,}$/i.test(v) ||
          this.$t("user.rules.email_valid")
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
    interfaces() {
      return this.$store.getters.interfaces;
    },
    currentLanguage() {
      return this.$i18n.locale;
    },
    languages() {
      return this.$store.state.shared.languages;
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
        if (this.langInterface) {
          user.langInterface = this.langInterface;
        }
        if (
          this.password ||
          this.email ||
          this.idActiveInterface ||
          this.langInterface
        ) {
          this.$store.dispatch("actionSaveUser", user).then(response => {
            if (response) {
              this.clearData();
            }
          });
        }

        if (process.env.NODE_ENV !== "development") {
          //location.reload();
        }
      }
    },

    cancel() {
      //this.$refs.form.reset();
      this.modal = false;
      this.clearData();
    },

    clearData() {
      this.password = this.repassword = "";
      this.idActiveInterface = null;
      this.langInterface = "";
    },

    changeLang(lang) {
      //this.$i18n.locale = $lang;
      if (this.langInterface !== lang) {
        this.langInterface = lang;
      }
    }
  }
};
</script>

<style scoped>
.mainboard-userform__title {
  color: #fff;
}
</style>
