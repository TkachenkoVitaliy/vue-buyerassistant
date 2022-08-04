<template>
  <div class='undefined_product_group_container'>
    <p>
      <b>НЕРАСПРЕДЕЛЕННЫЕ ВИДЫ ПРОДУКЦИИ</b>
    </p>
    <button v-on:click='consoleLog'>CLICK</button>
    <table class='undefined_product_group_table'>
      <tr>
        <th class='product_type table_cell product_type_header'>Вид продукции</th>
        <th class='table_cell product_type_header'>| Группа планирования</th>
      </tr>
      <tr v-for='(undefinedType, index) in undefinedTypes'
          v-bind:key = 'undefinedType.id'
      >
        <td class='product_type table-cell product_type_item'>{{ undefinedType.name }}</td>
        <td class='table_cell'>
          <v-autocomplete
              v-model='undefinedType.productGroup'
              :items='productGroups'
              item-text = 'name'
              item-value = 'productGroup'
              dense
              outlined
              append-icon=''
          >
          </v-autocomplete>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  import axios from "axios"

  export default {
    data() {
      return {
        undefinedTypes: [],
        productGroups: []
      }
    },
    methods: {
      getUndefinedTypes() {
        axios.get('http://localhost:8081/productTypes/undefined').then((response) => {
          this.undefinedTypes = response.data
        }).catch(() => {
          alert('При загрузке нераспределенных видов продукции произошла ошибка')
        })
      },
      getProductGroup() {
        axios.get('http://localhost:8081/productGroups').then((response) => {
          this.productGroups = response.data
        }).catch(() => {
          alert('При загрузке групп продукции произошла ошибка')
        })
      },
      consoleLog() {
        console.log(this.undefinedTypes)
        console.log(this.productGroups)
      }
    },
    created() {
      this.getUndefinedTypes()
      this.getProductGroup()
    },
    mounted() {
    }
  }

</script>

<style>
  .undefined_product_group_container{
    margin-top: 40px;
    justify-content: center;
    text-align: center;
  }

  .product_type_header{
    border-bottom: 2px solid gray;
    min-width: 190px;
    background-color: #bbdefb;
  }

  .product_type_item {
    border-bottom: 1px solid gray;
  }

  .table_cell{
    max-width: 190px;
    text-align: left;
  }

  .product_type {
    padding-left: 4px;
    min-width: 140px;
    text-align: left;
  }

  .undefined_product_group_table {
    border-collapse: collapse;
    min-width: 330px;
    margin-left: auto;
    margin-right: auto;
    border: 2px solid gray;
  }


  .v-text-field.v-text-field--enclosed .v-text-field__details {
    padding-top: 0px;
    margin-bottom: 0px !important;
  }

  .v-messages {
    min-height: 0px !important;
    visibility: hidden !important;
  }

  .v-text-field__details{
    visibility: hidden !important;
    min-height: 0px !important;
  }

  .v-text-field input {
    padding: 3px 0px !important;
  }

  .v-select__slot{
    max-height: 26px !important;
  }

  .v-text-field--filled.v-input--dense.v-text-field--single-line > .v-input__control > .v-input__slot, .v-text-field--filled.v-input--dense.v-text-field--outlined > .v-input__control > .v-input__slot, .v-text-field--filled.v-input--dense.v-text-field--outlined.v-text-field--filled > .v-input__control > .v-input__slot, .v-text-field--full-width.v-input--dense.v-text-field--single-line > .v-input__control > .v-input__slot, .v-text-field--full-width.v-input--dense.v-text-field--outlined > .v-input__control > .v-input__slot, .v-text-field--full-width.v-input--dense.v-text-field--outlined.v-text-field--filled > .v-input__control > .v-input__slot, .v-text-field--outlined.v-input--dense.v-text-field--single-line > .v-input__control > .v-input__slot, .v-text-field--outlined.v-input--dense.v-text-field--outlined > .v-input__control > .v-input__slot, .v-text-field--outlined.v-input--dense.v-text-field--outlined.v-text-field--filled > .v-input__control > .v-input__slot {
    min-height: 20px !important;
    max-width:  190px !important;
  }

  .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot, .v-text-field.v-text-field--enclosed .v-text-field__details {
    padding: 0 6px;
  }

  .v-input--dense > .v-input__control > .v-input__slot {
    margin-bottom: 0px !important;
  }
</style>