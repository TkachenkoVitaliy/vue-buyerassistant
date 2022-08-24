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

      <template v-slot:item='{ item }'>

        <v-list-item-content>
          <v-list-item-title v-text='item.name + " " + item.passportSeries + " " + item.passportNumber'></v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn
              fab
              x-small
              dark
              color='primary'
              @click='openEditDialog(item)'
          >
            <v-icon
                x-small
                dark
            >
              mdi-pencil
            </v-icon>
          </v-btn>
        </v-list-item-action>

        <v-list-item-action>
          <v-btn
              style='margin-left: 15px'
              fab
              x-small
              dark
              color='red'
              @click='openDeleteDialog(item)'
          >
            <v-icon
                x-small
                dark
            >
              mdi-delete
            </v-icon>
          </v-btn>
        </v-list-item-action>

        <DeleteDialog
            message = 'Удалить водителя'
            v-bind:info = "[currentDriver.name, currentDriver.passportSeries, currentDriver.passportNumber]"
            v-bind:id = currentDriver.id
            v-bind:isActive = 'isDeleteDialogActive'
            @confirmAction = 'confirmDeleteDriver'
            @cancelAction = 'cancelDeleteDriver'
            ref='deleteDialog'
        />
      </template>


      <template v-slot:append-item>

        <div style="padding-left: 0px; max-height: 2rem">
          <v-btn
              @click='openCreateDialog'
              block
              text
              large
              style="font-size: 1em"
          >
            <v-icon
                left
                large
                color="green"
            >
              mdi-plus-circle
            </v-icon>
            Создать
          </v-btn>
        </div>

        <DriverDialog
            v-bind:dialog='isDriverDialogActive'
            v-bind:title='driverDialogTitle'
            v-model:driver='currentDriver'
            @save='confirmDriverDialog($event)'
            @cancel='cancelDriverDialog'
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
        driver: {
          id: null,
          name: null,
          passportSeries: null,
          passportNumber: null,
          issuedBy: null,
          dateOfIssue: null
        },
        currentDriver: {
          id: null,
          name: null,
          passportSeries: null,
          passportNumber: null,
          issuedBy: null,
          dateOfIssue: null
        },
        driverDialogTitle: null,
        isDriverDialogActive: false,
        isDeleteDialogActive: false
      }
    },
    methods: {
      getAllDrivers() {
        RestService.getDrivers().then((response) => {
              this.drivers = response.data
            },
            error => {
              this.content =
                  (error.response && error.response.data && error.response.data.message) ||
                  error.message ||
                  error.toString();
              this.isLoading = false;
              if (error.response && error.response.status === 403) {
                EventBus.dispatch("logout");
              }
            }
        )
      },
      openEditDialog(driver) {
        this.currentDriver = driver
        this.isDriverDialogActive = true
        this.driverDialogTitle = 'Редактирование водителя'
      },
      openDeleteDialog(driver) {
        this.currentDriver = driver
        this.isDeleteDialogActive = true
        this.driver = {
          id: null,
          name: null,
          passportSeries: null,
          passportNumber: null,
          issuedBy: null,
          dateOfIssue: null
        }
      },
      confirmDeleteDriver(id) {
        RestService.deleteDrivers(id).then((response) => {
              this.driver = {
                id: null, name: null, passportSeries: null, passportNumber: null, issuedBy: null,
                dateOfIssue: null
              }
              this.getAllDrivers()
              this.$nextTick(() => this.isDeleteDialogActive = false)
            },
            error => {
              this.content =
                  (error.response && error.response.data && error.response.data.message) ||
                  error.message ||
                  error.toString();
              this.isLoading = false;
              if (error.response && error.response.status === 403) {
                EventBus.dispatch("logout");
              }
            })
      },
      cancelDeleteDriver() {
        this.isDeleteDialogActive = false
      },
      openCreateDialog() {
        this.currentDriver = {id: null, name: null, passportSeries: null, passportNumber: null, issuedBy: null,
          dateOfIssue: null}
        this.isDriverDialogActive = true
        this.driverDialogTitle = 'Создание водителя'
      },
      cancelDriverDialog() {
        this.currentDriver = {id: null, name: null, passportSeries: null, passportNumber: null, issuedBy: null,
          dateOfIssue: null}
        this.getAllDrivers()
        this.isDriverDialogActive = false
      },
      confirmDriverDialog(driver) {
        this.getAllDrivers()
        this.driver = driver
        this.isDriverDialogActive = false
      },
    },
    mounted() {
      this.getAllDrivers()
    }
  }

</script>

<style>
  .subtitle_text {
    font-size: 1.2rem;
    font-weight: bold;
    color: #00689a;
  }
</style>