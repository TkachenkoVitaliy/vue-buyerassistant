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
        userSettings: {}
      }
    },
    methods: {
      getLoadTables() {
        axios.get('http://localhost:8081/api/loadTables').then((response) => {
          this.loadTables = response.data
        }).catch(() => {
          alert('Не удалось получить таблицы шахматки для филиалов')
        })
      },
      getUserSettings() {
        axios.get('http://localhost:8081/api/loadTables/settings').then((response) => {
          this.userSettings = response.data
        }).catch(() => {
          alert('Не удалось получить настройки шахматки')
        })
      },
      postUserSettings() {
        axios({
          url: 'http://localhost:8081/api/loadTables/settings',
          method: 'post',
          data: this.userSettings
        }).then((response) => {
          this.userSettings = response.data
          this.getLoadTables()
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