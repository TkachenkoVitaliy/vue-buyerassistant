<template>
  <div>
    <LoadTablesSettings
        v-bind:settings = 'userSettings'
        v-on:updateSettings = 'postUserSettings'
    />
    <FactoriesLoadTables
        v-bind:loadTables = 'loadTables'
    />
  </div>
</template>

<script>
  import axios from "axios"
  import FactoriesLoadTables from "@/components/main_container/load_tables/FactoriesLoadTables"
  import LoadTablesSettings from "@/components/main_container/load_tables/LoadTablesSettings";

  export default {
    components: {FactoriesLoadTables, LoadTablesSettings},
    data() {
      return {
        loadTables: [],
        userSettings: null
      }
    },
    methods: {
      getLoadTables() {
        axios.get('http://localhost:8081/loadTables').then((response) => {
          this.loadTables = response.data
        }).catch(() => {
          alert('Не удалось получить таблицы шахматки для филиалов')
        })
      },
      getUserSettings() {
        axios.get('http://localhost:8081/loadTables/settings').then((response) => {
          this.userSettings = response.data
        }).catch(() => {
          alert('Не удалось получить настройки шахматки')
        })
      },
      postUserSettings() {
        console.log('post')
        console.log(this.userSettings)
        axios({
          url: 'http://localhost:8081/loadTables/settings',
          method: 'post',
          data: {
            id: 1,
            username: 'admin',
            month: 3,
            year: 2022
          }
        }).then((response) => {
          this.userSettings = response.data
        }).catch(() => {
          alert('При сохранении произошла ошибка')
        })
      }
    },
    mounted() {
      this.getLoadTables()
      this.getUserSettings()
    }
  }

</script>

<style>

</style>