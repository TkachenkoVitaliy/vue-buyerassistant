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
  import RestService from '@/services/rest.service'
  import EventBus from '@/common/EventBus'

  export default {
    name: 'Application',
    data() {
      return {
        navbarItems: [
          {id: 1, title: 'НАСТРОЙКИ', isActive: false, link: '/settings'},
          {id: 2, title: 'ЗАГРУЗИТЬ ФАЙЛЫ ЗАВОДОВ', isActive: false, link: '/upload_accept_and_shipment'},
          {id: 3, title: 'ПОЧТОВАЯ РАССЫЛКА', isActive: false, link: '/email_newsletter'},
          {id: 4, title: 'ШАХМАТКА', isActive: false, link: '/load_tables'},
          {id: 5, title: 'ЗАКАЗЫ', isActive: false, link: '/orders'},
          {id: 6, title: 'ДОВЕРЕННОСТИ', isActive: false, link: '/power_of_attorney'},
        ]
      }
    },
    components: {
      Navbar,
      MainContainer
    },
    methods: {
      changeSelected(selectedId) {
        this.checkBackEndServer()
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
      },
      checkBackEndServer() {
        RestService.getBranches().then(
            response => {
            },
            error => {
              if (error.request && error.message == 'Network Error') {
                this.$router.push('/error').catch(() => {})
              }
              this.content =
                  (error.response && error.response.data && error.response.data.message) ||
                  error.message ||
                  error.toString();
              if (error.response && error.response.status === 403) {
                EventBus.dispatch("logout");
              }
            }
        )
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
          this.$router.push('settings')
        }
      }
    },
    mounted() {
      this.setSelected()

      this.checkBackEndServer()
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