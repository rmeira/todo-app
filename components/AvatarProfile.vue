<template>
  <v-avatar size="35">
    <v-img :src="avatarSrc" :alt="user.name" />
  </v-avatar>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  computed: {
    avatarSrc() {
      return `${process.env.storage}/profile/avatar/${
        this.user.avatar ? this.user.avatar : 'default.png'
      }`
    },
  },
}
</script>

<style></style>
