<template>
  <v-main>
    <v-container>
      {{ profile }}
    </v-container>
  </v-main>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      profile: 'profile/profile',
    }),
  },
}
</script>

<style></style>
