<template>
  <div class="application_container">
    <Navbar
        v-bind:navbarItems="navbarItems"
        v-on:changeSelectedSection="changeSelected"
        class='navigation_bar'
    />
    <v-app>
      <main-container />
    </v-app>
  </div>
</template>

<script>
  import Navbar from '@/components/navbar/Navbar'
  import MainContainer from '@/components/main_container/MainContainer'

  export default {
    name: 'Application',
    data() {
      return {
        navbarItems: [
          {id: 1, title: 'ПРОФИЛЬ И НАСТРОЙКИ', isActive: false, link: '/profile'},
          {id: 2, title: 'ЗАГРУЗИТЬ ФАЙЛЫ ЗАВОДОВ', isActive: false, link: '/upload_accept_and_shipment'},
          {id: 3, title: 'ПОЧТОВАЯ РАССЫЛКА', isActive: false, link: '/email_newsletter'},
          {id: 4, title: 'ШАХМАТКА', isActive: false, link: '/load_tables'},
          {id: 5, title: 'ДОВЕРЕННОСТИ', isActive: false, link: '/power_of_attorney'}
        ]
      }
    },
    components: {
      Navbar,
      MainContainer
    },
    methods: {
      changeSelected(selectedId) {
        for (let item of this.navbarItems) {
          item.isActive = false
          if(item.id === selectedId) item.isActive = true
        }
      },
      setSelected() {
        let meta = this.$route.meta
        let tabId = meta.tabId
        if(tabId === 0) {
          tabId = 1
        }
        this.changeSelected(tabId)
      }
    },
    computed: {
      currentUser() {
        return this.$store.state.auth.user;
      }
    },
    created() {
      if(!this.currentUser) {
        this.$router.push('/auth/login')
      } else {
        if (this.$route.path === '/') {
          this.$router.push('profile')
        }
      }
    },
    mounted() {
        this.setSelected()
    }
  }
</script>

<style>
  .application_container {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
  }
  .navigation_bar {
    height: 100vh !important;
    position: sticky;
    position: -webkit-sticky;
    top: 0;
    border-right: #0c427a 4px solid;
  }
</style>