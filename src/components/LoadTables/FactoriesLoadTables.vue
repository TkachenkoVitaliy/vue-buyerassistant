<template>
  <div>
    <table
        v-for = 'loadTable in loadTables'
        v-bind:key = 'loadTable.name'
    >
      <tr>
        <th>{{ loadTable.name }}</th>
        <th
            v-for = '(productGroup, index) in loadTable.productGroups'
            v-bind:key = 'productGroup + index'
        >{{ productGroup }}</th>
      </tr>

      <tr
          v-for = '(branchStock, stockIndex) in loadTable.branchesStock'
          v-bind:key = 'branchStock + stockIndex'
      >
        <td>{{ branchStock }}</td>
        <td
            v-for = '(stockCell, stockCellIndex) in loadTable.stockData[stockIndex]'
            v-bind:key = 'branchStock + stockCellIndex'
        >
          {{ stockCell }}
        </td>
      </tr>

      <tr
          v-for = '(branchTransit, transitIndex) in loadTable.branchesTransit'
          v-bind:key = 'branchTransit + transitIndex'
      >
        <td>{{ branchTransit + ' транзит'}}</td>
        <td
            v-for = '(transitCell, transitCellIndex) in loadTable.transitData[transitIndex]'
            v-bind:key = 'branchTransit + transitCellIndex'
        >
          {{ transitCell }}
        </td>
      </tr>

      <tr>
        <td>ИТОГО</td>
        <td
            v-for = '(sumCell, sumIndex) in loadTable.totalData'
            v-bind:key = "'sum' + sumIndex"
        >
          {{ sumCell }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>

export default {
  props: {loadTables: Array}
}
</script>

<style>
table {
  width: 100%;
  margin-bottom: 20px;
  border: 1px solid #dddddd;
  border-collapse: collapse;
}
table th {
  font-weight: bold;
  padding: 5px;
  background: #efefef;
  border: 1px solid #dddddd;
}
table td {
  white-space: nowrap;
  text-align: center;
  border: 1px solid #dddddd;
  padding: 2px 8px;
}
</style>