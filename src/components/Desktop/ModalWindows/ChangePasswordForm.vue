<template>
  <div class="mainboard-changepassword-form">
    <v-card light>
      <v-layout row>
        <v-flex xs12>
          <v-card-title class="primary mainboard-changepassword-form__title">
            <div class="headline">{{ $t('forms.change_password.title') }}</div>
          </v-card-title>
        </v-flex>
      </v-layout>
      <v-container>
        <v-layout row>
          <v-flex xs12>
            <v-form ref="form" v-model="valid" @submit.prevent="''">
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
              <v-layout align-center>
                <v-flex text-xs-center>
                  <v-btn :disabled="!valid" color="info" @click="saveUser">{{ $t('change') }}</v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
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
      password: "",
      repassword: "",
      passwordRules: [
        v => v.length >= 6 || this.$t("user.rules.password_length")
      ],
      repasswordRules: [
        v => v.length >= 6 || this.$t("user.rules.password_length"),
        v => v == this.password || this.$t("user.rules.passwords_equals")
      ]
    };
  },
  computed: {},
  methods: {
    saveUser() {
      if (this.$refs.form.validate()) {
        // Native form submission is not yet supported
        //this.modal = false;
        let user = {};
        if (this.password) {
          user.password = this.password;
          user.repassword = this.repassword;
        }

        if (this.password) {
          this.$store
            .dispatch("actionSaveUser", user)
            .then(response => {
              if (response) {
                this.clearData();
              }
            })
            .catch(error => {
              console.log("error", error);
            });
        }
      }
    },

    clearData() {
      this.valid = true;
      this.password = this.repassword = "";
    }
  }
};
</script>

<style scoped>
.mainboard-changepassword-form__title {
  color: #fff;
}
</style>
