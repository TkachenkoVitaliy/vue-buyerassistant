<template>
  <div>
    <FactoriesLoadTables
        v-bind:loadTables = 'loadTables'
    />
  </div>
</template>

<script>
  import FactoriesLoadTables from "@/components/LoadTables/FactoriesLoadTables";
  import axios from "axios";

  export default {
    components: {FactoriesLoadTables},
    data() {
      return {
        loadTables: []
      }
    },
    methods: {
      getLoadTables() {
        axios.get('http://localhost:8081/loadTables').then((response) => {
          this.loadTables = response.data
        }).catch(() => {
          alert('Не удалось получить таблицы шахматки для филиалов')
        })
      }
    },
    mounted() {
      this.getLoadTables()
    }
  }

</script>

<style>

</style>