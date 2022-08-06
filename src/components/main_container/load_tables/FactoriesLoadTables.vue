<template>
  <div>
    <table
        v-for = '(loadTable, ltIndex) in loadTables'
        v-bind:key = 'ltIndex'
    >
      <tr>
        <th class='factory_name_cell'>
          <div>{{ loadTable.name }}</div>
            <img
                v-bind:src='toggleImage(ltIndex)' class='hide_show_button'
                v-on:click = 'toggleCollapse(ltIndex)'
            >
        </th>
        <th
            v-for = '(productGroup, index) in loadTable.productGroups'
            v-bind:key = 'loadTable.name + productGroup + index'
        >{{ productGroup }}</th>
      </tr>

      <tr
          v-for = '(branchStock, stockIndex) in loadTable.branchesStock'
          v-bind:key = 'loadTable.name + branchStock + stockIndex'
          v-bind:class= '{bold_text : (reservedNames.includes(branchStock)), hidden_row: check(ltIndex) && !reservedNames.includes(branchStock)}'
          v-on:click='check(ltIndex)'
      >
        <td>{{ branchStock }}</td>
        <td
            v-for = '(stockCell, stockCellIndex) in loadTable.stockData[stockIndex]'
            v-bind:key = 'loadTable.name + branchStock + stockCellIndex + stockCell'
        >
          {{ stockCell }}
        </td>
      </tr>

      <tr
          v-for = '(branchTransit, transitIndex) in loadTable.branchesTransit'
          v-bind:key = "loadTable.name + branchTransit + transitIndex + 'транзит'"
          v-bind:class= '{bold_text : (reservedNames.includes(branchTransit)), hidden_row: check(ltIndex) && !reservedNames.includes(branchTransit)}'
      >
        <td>{{ branchTransit == 'ТРАНЗИТ' ? branchTransit : branchTransit + ' транзит'}}</td>
        <td
            v-for = '(transitCell, transitCellIndex) in loadTable.transitData[transitIndex]'
            v-bind:key = "loadTable.name + branchTransit + transitCellIndex + transitCell + 'транзит'"
        >
          {{ transitCell }}
        </td>
      </tr>

      <tr class='bold_text'>
        <td>ИТОГО</td>
        <td
            v-for = '(sumCell, sumIndex) in loadTable.totalData'
            v-bind:key = "loadTable.name + 'sum' + sumIndex + sumCell"
        >
          {{ sumCell }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>

export default {
  props: {loadTables: Array},
  data() {
    return {
      reservedNames: ['БАЗА', 'ТРАНЗИТ', 'ИТОГО'],
      tablesCollapse: [false, false, false, false, false, false, false, false, false, false, false, false]
    }
  },
  methods: {
    toggleCollapse(index) {
      this.tablesCollapse[index] = !this.tablesCollapse[index]
      this.$forceUpdate()
    },
    check(ltIndex) {
      return this.tablesCollapse.at(ltIndex)
    },
    toggleImage(ltIndex) {
      if(this.tablesCollapse[ltIndex]) {
        return require('@/assets/arrow-expand-vertical.png')
      } else {
        return require('@/assets/arrow-collapse-vertical.png')
      }
    }
  }
}
</script>

<style scoped>
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

.factory_name_cell {
  display: flex;
  justify-content: space-between;
}

.bold_text {
  font-weight: bold;
}

.hidden_row {
  visibility: collapse;
}

.hide_show_button {
  border: 1px solid gray;
}

.hide_show_button:hover {
  background-color: #ffffff;
  border: 1px solid black;
}
</style>