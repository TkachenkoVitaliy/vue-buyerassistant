<template>
  <div class='accept_and_shipment_container'>
    <div class='forms_container'>
      <upload-accept-form />
      <upload-multiple-form v-on:updateSummaryData='updateUndefinedRows'/>
    </div>
    <div class='rows_container'>
      <undefined-rows-list ref="undefinedRows"/>
      <undefined-product-group ref="undefinedProductGroup"/>
    </div>
  </div>
</template>

<script>
  import UploadAcceptForm from '@/components/main_container/upload_accept_and_shipment/UploadAcceptForm'
  import UploadMultipleForm from '@/components/main_container/upload_accept_and_shipment/UploadMultipleForm'
  import UndefinedRowsList from '@/components/main_container/upload_accept_and_shipment/UndefinedRowsList'
  import UndefinedProductGroup from '@/components/main_container/upload_accept_and_shipment/UndefinedProductGroup'

  export default {
    components:
      {
        UndefinedRowsList,
        UploadMultipleForm,
        UploadAcceptForm,
        UndefinedProductGroup
      },
    methods:
      {
        updateUndefinedRows() {
          this.$refs.undefinedRows.updateSummaryRows()
          this.$refs.undefinedProductGroup.getUndefinedTypes()
        }
      }
  }
</script>

<style>
  .accept_and_shipment_container{
    display: flex;
    justify-content: space-around;
  }
  .forms_container{
    width: 50%;
  }
  .rows_container{
    margin-left: 100px;
    width: 50%;
  }
</style>