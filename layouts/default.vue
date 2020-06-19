<template>
  <v-app>
    <v-app-bar color="orange" dark app>
      <v-toolbar-title>Tarefas: {{ profile.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <AvatarProfile :user="profile" />
    </v-app-bar>
    <nuxt />
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AvatarProfile from '~/components/AvatarProfile'
export default {
  async mounted() {
    await this.$axios
      .get(`${process.env.apiIdentity}/v1/profile`, {
        headers: {
          Authorization: `${localStorage.getItem(
            'token_type'
          )} ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        this.setProfile(response.data)
      })
      .catch((error) => {
        console.log(error.response)
      })
  },
  components: {
    AvatarProfile,
  },
  methods: {
    ...mapActions({
      setProfile: 'profile/setProfile',
    }),
  },
  computed: {
    ...mapGetters({
      profile: 'profile/profile',
    }),
  },
}
</script>
