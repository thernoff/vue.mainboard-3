<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <v-form 
          ref="form" 
          v-model="valid" 
          lazy-validation>
          <v-text-field
            :value="user.firstname"
            name="firstname"
            label="Имя"
            required
            readonly
          />
          <v-text-field
            :value="user.lastname"
            :rules="nameRules"
            name="lastname"
            label="Фамилия"
            required
            readonly
          />
          <v-text-field
            :value="user.email"
            :rules="emailRules"
            name="email"
            label="E-mail"
            required
            @input="changeEmail"
          />
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            :type="'password'"
            name="password"
            label="Пароль"/>
          <v-text-field
            v-model="repassword"
            :rules="repasswordRules"
            :type="'password'"
            name="repassword"
            label="Введите пароль еще раз"/>
          <v-select
            :value="user.idActiveInterface"
            :items="interfaces"
            item-text="name"
            item-value="id"
            label="Тип интерфейса"
            @input="selectInterface"
          />
          <v-layout align-center>
            <v-flex text-xs-center>
              <v-btn
                :disabled="disableBtnSave"
                color="info"
                @click="saveUser"
              >
                Сохранить
              </v-btn>
              <v-btn
                color="error"
                @click="cancel"
              >
                Отмена
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
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
      change: false,
      email: "",
      password: "",
      repassword: "",
      idActiveInterface: null,
      //firstname: this.user.firstname,
      nameRules: [
        v => !!v || "Name is required"
        //v => (v && v.length <= 10) || "Name must be less than 10 characters"
      ],
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+/.test(v) || "E-mail must be valid"
      ],
      passwordRules: [
        v =>
          v.length === 0 ||
          v.length >= 6 ||
          "Пароль должен состоять минимум из 6 символов"
      ],
      repasswordRules: [
        v =>
          v.length === 0 ||
          v.length >= 6 ||
          "Пароль должен состоять минимум из 6 символов",
        v => v == this.password || "Пароли должны совпадать"
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
    disableBtnSave() {
      return !this.valid || !this.change;
    }
  },
  methods: {
    selectInterface(value) {
      if (this.idActiveInterface !== value) {
        this.idActiveInterface = value;
        this.change = true;
      } else {
        this.change = false;
      }
    },
    changeEmail(value) {
      this.email = value;
      this.change = true;
    },
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
        location.reload();
      }
    },

    cancel() {
      //this.$refs.form.reset();
      console.log("test");
      this.modal = false;
      this.idActiveInterface = null;
    }
  }
};
</script>

<style scoped>
.mainboard-userform__title {
  color: #fff;
}
</style>
