<template>
  <v-main>
    <v-container class="fill-height d-flex align-center justify-center" fluid>
      <v-form ref="form" v-model="valid" @submit.prevent="handleLogin()">
        <v-card class="elevation-2" width="350">
          <v-toolbar color="orange" dark flat>
            <v-toolbar-title v-if="!user.name">Login</v-toolbar-title>
            <v-toolbar-title v-else>{{ user.name }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <AvatarProfile :user="user" v-if="user.avatar" />
          </v-toolbar>
          <v-card-text>
            <v-alert type="error" v-if="error">
              {{ error }}
            </v-alert>
            <v-text-field
              v-model="form.username"
              label="Login"
              prepend-icon="mdi-account"
              :rules="rules.username"
              @blur="handleSearchUsername()"
            ></v-text-field>

            <v-text-field
              v-model="form.password"
              label="Password"
              prepend-icon="mdi-lock"
              :rules="rules.password"
              type="password"
              counter
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="orange"
              type="submit"
              :disabled="!valid"
              :loading="loading"
              >Login</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-form>
    </v-container>
  </v-main>
</template>

<script>
import AvatarProfile from '~/components/AvatarProfile'
export default {
  layout: 'simple',
  data() {
    return {
      valid: true,
      form: {
        username: '',
        password: '',
      },
      rules: {
        username: [(v) => !!v || 'Username é um campo obrigatório'],
        password: [
          (v) => !!v || 'Senha é um campo obrigatório',
          (v) =>
            (v && v.length >= 8) || 'O campo deve ter no mínimo 8 caracteres',
        ],
      },
      user: {
        username: '',
        name: '',
        avatar: '',
      },
      error: '',
      loading: false,
    }
  },
  components: {
    AvatarProfile,
  },
  mounted() {
    if (localStorage.getItem('token')) this.$router.push('/')
  },
  methods: {
    async handleSearchUsername() {
      this.loading = true
      await this.$axios
        .post(`${process.env.apiIdentity}/v1/auth/user`, this.form)
        .then((response) => {
          this.user = response.data
          this.error = ''
        })
        .catch((error) => {
          console.log(error.response.data)
          this.error = 'Usuário não encontrado'
        })
        .then(() => {
          this.loading = false
        })
    },
    async handleLogin() {
      if (this.$refs.form.validate()) {
        this.loading = true
        await this.$axios
          .post(`${process.env.apiIdentity}/v1/auth/login`, this.form)
          .then((response) => {
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('token_type', response.data.token_type)
            this.error = ''
            this.$router.push('/')
          })
          .catch((error) => {
            this.error = error.response.data
          })
          .then(() => {
            this.loading = false
          })
      }
    },
  },
  computed: {
    avatarSrc() {
      return `${process.env.storage}/profile/avatar/${this.user.avatar}`
    },
  },
}
</script>

<style></style>
