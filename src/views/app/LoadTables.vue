<template>
  <div>
    <LoadTablesSettings
        v-bind:settings = 'userSettings'
        v-on:updateSettings = 'postUserSettings'
        v-if='loadTables.length > 0'
    />
    <FactoriesLoadTables
        v-bind:loadTables = 'loadTables'
    />
  </div>
</template>

<script>
  import FactoriesLoadTables from '@/components/main_container/load_tables/FactoriesLoadTables'
  import LoadTablesSettings from '@/components/main_container/load_tables/LoadTablesSettings'
  import RestService from '@/services/rest.service'
  import EventBus from "@/common/EventBus";
  import TokenService from "@/services/token.service";

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
        let username = TokenService.getUser().username;
        RestService.getLoadTables(username).then(
            (response) => {
              this.loadTables = response.data
            },
            error => {
              this.content =
                  (error.response && error.response.data && error.response.data.message) ||
                  error.message ||
                  error.toString();
              if (error.response && error.response.status === 403) {
                EventBus.dispatch("logout");
              }
            }
        )
      },
      getUserSettings() {
        let username = TokenService.getUser().username;
        RestService.getLoadTablesSettings(username).then(
            (response) => {
              this.userSettings = response.data
            },
            error => {
              this.content =
                  (error.response && error.response.data && error.response.data.message) ||
                  error.message ||
                  error.toString();
              if (error.response && error.response.status === 403) {
                EventBus.dispatch("logout");
              }
            }
        )
      },
      postUserSettings() {
        RestService.postLoadTableSettings(this.userSettings).then(
            (response) => {
              this.userSettings = response.data
              this.getLoadTables()
            },
            error => {
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
    mounted() {
      this.getLoadTables()
      this.getUserSettings()
    }
  }

</script>

<style>

</style>