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
  import RestService from '@/services/rest.service'
  import EventBus from "@/common/EventBus";

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
        RestService.getUndefinedRows().then(
            (response) => {
              this.summaryRows = response.data
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