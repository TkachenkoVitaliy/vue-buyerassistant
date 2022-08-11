<template>
  <div class='undefined_product_group_container' v-if='undefinedTypes.length > 0'>
    <p>
      <b>НЕРАСПРЕДЕЛЕННЫЕ ВИДЫ ПРОДУКЦИИ</b>
    </p>
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
              v-on:change='checkChanges'
              v-model='undefinedType.productGroup'
              :items='productGroups'
              item-text = 'name'
              return-object
              dense
              outlined
              append-icon=''
          >
          </v-autocomplete>
        </td>
      </tr>
    </table>
    <div
        class='button_container'
        v-if='haveChanges'
    >
      <v-btn v-on:click= 'saveSettings' class='save_button'>СОХРАНИТЬ</v-btn>
      <v-btn v-on:click='cancelSettings' class='cancel_button'>ОТМЕНА</v-btn>
    </div>
  </div>
</template>

<script>
  import RestService from '@/services/rest.service'
  import EventBus from "@/common/EventBus";

  export default {
    data() {
      return {
        undefinedTypes: [],
        productGroups: [],
        initialUndefinedTypes: null,
        haveChanges: false
      }
    },
    methods: {
      getUndefinedTypes() {
        RestService.getProductTypesUndefined().then(
            (response) => {
              this.undefinedTypes = response.data
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
      getProductGroup() {
        RestService.getProductGroups().then(
            (response) => {
              this.productGroups = response.data
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
      saveSettings() {
        RestService.postProductTypesUndefined(this.undefinedTypes).then(
            response => {
              this.getUndefinedTypes()
              this.haveChanges = false
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
      cancelSettings() {
        this.getUndefinedTypes()
        this.haveChanges = false
      },
      checkChanges() {
        let count = 0;
        for (let i = 0; i < this.undefinedTypes.length; i++) {
          if (this.undefinedTypes[i].productGroup.name !== 'Не определена') {
            count = count + 1
          }
        }
        if (count > 0 ) {
          this.haveChanges = true
        } else {
          this.haveChanges = false
        }
      }
    },
    created() {
      this.getUndefinedTypes()
      this.getProductGroup()
      this.initialUndefinedTypes = JSON.stringify(this.undefinedTypes)
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

  .button_container{
    margin-left: auto;
    margin-right: auto;
    width: 340px;
    padding-top: 10px;
    padding-right: 5px;
    padding-left: 5px;
    display: flex;
    justify-content: space-between;
  }

  .save_button, .cancel_button {
    display: block;
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