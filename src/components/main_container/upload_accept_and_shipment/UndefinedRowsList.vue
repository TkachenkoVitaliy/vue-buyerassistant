<template>
  <div v-if='summaryRows.length > 0' class='undefined_rows_container'>
    <p class="undefined_title">
      <b>ЗАКАЗЫ С НЕОПРЕДЕЛЕННЫМ ФИЛИАЛОМ</b>
    </p>
    <table class='rows_table'>
      <tr>
        <th class='undefined_header'>Поставщик</th>
        <th class='undefined_header'>Номер заказа</th>
        <th class='undefined_header'>Месяц</th>
        <th class='undefined_header'>Год</th>
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
        axios.get('http://localhost:8081/api/undefinedRows').then((response) => {
          this.summaryRows = response.data
        }).catch(() => {
          alert('При загрузке строк произошла ошибка')
        })
      }
    }
  }
</script>

<style>
  .undefined_rows_container{
    justify-content: center;
  }

  .undefined_header{
    background: none;
  }

  .rows_table{
    margin-left: auto;
    margin-right: auto;
    border-collapse: separate;
    border-spacing: 20px 5px;
  }

  .undefined_title{
    text-align: center;
  }

</style>