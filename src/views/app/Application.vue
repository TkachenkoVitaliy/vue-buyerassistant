<template>
  <div class="application_container">
    <Navbar
        v-bind:navbarItems="navbarItems"
        v-on:changeSelectedSection="changeSelected"
    />
    <main-container />
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
          {id: 2, title: 'АКЦЕПТ И ОТГРУЗКА', isActive: false, link: '/accept_and_shipment'},
          {id: 3, title: 'ШАХМАТКА', isActive: false, link: '/capacity'},
          {id: 4, title: 'ДОВЕРЕННОСТИ', isActive: false, link: '/power_of_attorney'}
        ]
      }
    },
    components: {
      Navbar,
      MainContainer
    }, methods: {
      changeSelected(selectedId) {
        for (let item of this.navbarItems) {
          item.isActive = false
          if(item.id === selectedId) item.isActive = true
        }
      },
      setSelected() {
        let meta = this.$route.meta
        let tabId = meta.tabId
        this.changeSelected(tabId)
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
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>