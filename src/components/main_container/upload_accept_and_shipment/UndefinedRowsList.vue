<template>
  <div v-if='summaryRows.length > 0'>
    <p class="undefined_title">
      <b>Заказы с неопределенным филиалом</b>
    </p>
    <table class='rows_table'>
      <tr>
        <td class='table_cell'>
          <b>Поставщик</b>
        </td>
        <td class='table_cell'>
          <b>Номер заказа</b>
        </td>
        <td class='table_cell'>
          <b>Месяц</b>
        </td>
        <td class='table_cell'>
          <b>Год</b>
        </td>
      </tr>
      <tr
          v-for='summaryRow in summaryRowsValue'
          v-bind:key='summaryRow.id'
      >
        <td class='table_cell'>
          {{summaryRow.supplier}}
        </td>
        <td class='table_cell'>
          {{summaryRow.spec}}
        </td>
        <td class='table_cell'>
          {{summaryRow.acceptMonth}}
        </td>
        <td class='table_cell'>
          {{summaryRow.year}}
        </td>
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
          console.log(this.summaryRows.length > 0)
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