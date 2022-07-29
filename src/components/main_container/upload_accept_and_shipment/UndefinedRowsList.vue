<template>
  <div v-if='summaryRows.length > 0'>
    <p class="undefined_title">
      <b>Заказы с неопределенным филиалом</b>
    </p>
    <table class='rows_table'>
      <tr>
        <th>Поставщик</th>
        <th>Номер заказа</th>
        <th>Месяц</th>
        <th>Год</th>
      </tr>
      <tr
          v-for='summaryRow in summaryRowsValue'
          v-bind:key='summaryRow.id'
      >
        <td>{{ summaryRow.supplier }}</td>
        <td>{{ summaryRow.spec }}</td>
        <td>{{ summaryRow.acceptMonth }}</td>
        <td>{{ summaryRow.year }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    computed: {
      summaryRowsValue() {
        return this.summaryRows;
      }
    },
    data() {
      return {
        summaryRows: []
      }
    },
    mounted() {
      this.updateSummaryRows()
    },
    methods: {
      updateSummaryRows() {
        axios.get('http://localhost:8081/undefinedRows').then((response) => {
          this.summaryRows = response.data
        }).catch(() => {
          alert('При загрузке строк произошла ошибка')
        })
      }
    }
  }
</script>

<style>
  .rows_table{
    border-collapse: separate;
    border-spacing: 20px 5px;
  }

  .undefined_title{
    margin-left: 40px;
  }

</style>