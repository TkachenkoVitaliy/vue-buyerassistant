<template>
  <div id="app">
      <router-view />
  </div>
</template>

<script>
import EventBus from './common/EventBus'

export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/auth/login').catch(() => {})
    }
  },
  mounted() {
    EventBus.on("logout", () => {
      this.logOut()
    })
  },
  beforeDestroy() {
    EventBus.remove("logout")
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
}
</style>
