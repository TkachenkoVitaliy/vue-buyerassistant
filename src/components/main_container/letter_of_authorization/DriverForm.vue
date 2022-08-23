<template>
  <div>
    <p class='subtitle_text'>Водитель</p>

    <v-autocomplete
        clearable
        dense
        v-model='driver'
        :items='drivers'
        :item-text='item => item.name + " " + item.passportSeries + " " + item.passportNumber'
    >
      <template v-slot:append-item>
        <DriverDialog
            @added='setNewDriver($event)'
        />
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
  import RestService from '@/services/rest.service'
  import EventBus from '@/common/EventBus'
  import DeleteDialog from '@/components/other/DeleteDialog'
  import DriverDialog from '@/components/main_container/letter_of_authorization/DriverDialog'

  export default {
    components: {
      DeleteDialog,
      DriverDialog
    },
    data() {
      return {
        drivers: null,
        driver: null,
        driverDialogTitle: null,
        isSDriverDialogActive: false,
        isDeleteDialogActive: false
      }
    },
    methods: {

    },
    mounted() {

    }

  }

</script>

<style>

</style>