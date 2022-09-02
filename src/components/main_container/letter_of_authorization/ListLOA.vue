<template>
  <div>
    <v-card min-height='92vh'>
      <v-card-title>
        <div class='header_loa_container'>
          <p>Доверенности</p>
          <v-btn
              @click='openCreateDialog'
          >
              СОЗДАТЬ
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text>
        <v-data-table
            :headers='headers'
            :items='letters'
            single-expand
            show-expand
        >
          <template v-slot:item.issuedDate='{ item }'>
            {{ formatDate(item.issuedDate) }}
          </template>

          <template v-slot:item.actions='{ item }'>

            <v-btn
                fab
                x-small
                dark
                color='primary'
                @click="openEditDialog(item)"
            >
              <v-icon
                  x-small
                  dark
              >
                mdi-pencil
              </v-icon>
            </v-btn>

            <v-btn
                style='margin-left: 15px'
                fab
                x-small
                dark
                color='red'
                @click="openDeleteDialog(item)"
            >
              <v-icon
                  x-small
                  dark
              >
                mdi-delete
              </v-icon>
            </v-btn>

            <DeleteDialog
                message = 'Удалить доверенность'
                v-bind:info = 'letterOfAuthorization.principal ? letterOfAuthorization.principal.name +" №"+ letterOfAuthorization.number: " "'
                v-bind:id = 'letterOfAuthorization.id'
                v-bind:isActive = 'isDeleteDialogActive'
                @confirmAction = 'confirmDeleteLoa'
                @cancelAction = 'cancelDeleteLoa'
                ref='deleteDialog'
            />

          </template>

          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan='headers.length - 1 '>
              <p
                  style='margin-bottom: 0px'
                  v-for="element in additionalInfo(item.letterRows)"
              >{{ element }}
              </p>
            </td>
            <td> {{ item.sellType }} </td>
          </template>
        </v-data-table>
      </v-card-text>
      <LetterOfAuthorizationDialog
          v-bind:dialog='isLoaDialogActive'
          v-bind:title='loaDialogTitle'
          @save='confirmLoaDialog'
          @cancel='cancelLoaDialog'
          ref='loaDialog'
      />
    </v-card>
  </div>
</template>

<script>
  import DeleteDialog from '@/components/other/DeleteDialog'
  import LetterOfAuthorizationDialog
    from '@/components/main_container/letter_of_authorization/LetterOfAuthorizationDialog'
  import RestService from '@/services/rest.service'
  import EventBus from '@/common/EventBus'
  import store from '@/store'

  export default {
    components: {
      DeleteDialog,
      LetterOfAuthorizationDialog
    },
    computed: {
      letterOfAuthorization: {
        get: function () {return store.getters["loa/letterOfAuthorization"]},
        set: function (value) {store.commit('loa/setLetterOfAuthorization', value)}
      }
    },
    data() {
      return {
        letters: [],
        headers: [
          {
            text: 'Доверитель',
            align: 'start',
            value: 'principal.name',
          },
          { text: 'Номер', value: 'number' },
          { text: 'Дата выдачи', value: 'issuedDate' },
          { text: 'Водитель', value: 'driver.name' },
          { text: 'Поставщик', value: 'supplier.supplierName' },
          { text: '', value: 'actions', sortable: false },
        ],
        loaDialogTitle: null,
        isLoaDialogActive: false,
        isDeleteDialogActive: false,
      }
    },
    methods: {
      getAllLetters() {
        RestService.getLettersOfAuthorization().then((response) =>
            {
              console.log(response.data)
              this.letters = response.data
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
      formatDate(date) {
        let datePart = date.match(/\d+/g),
            year = datePart[0],
            month = datePart[1],
            day = datePart[2];
        return day+'-'+month+'-'+year;
      },
      additionalInfo(item) {
        let infoArray = []
        item.forEach(element => {
          infoArray.push(element.nomenclature.name + ": " + element.tonnage + 'тн')
        })
        return infoArray
      },
      openEditDialog(loa) {
        this.letterOfAuthorization = loa
        this.isLoaDialogActive = true
        this.loaDialogTitle = 'Редактирование доверенности'
      },
      openDeleteDialog(loa) {
        //TODO refactor
        // this.currentLoa = loa
        this.letterOfAuthorization = loa
        this.isDeleteDialogActive = true
      },
      confirmDeleteLoa(id) {
        RestService.deleteLettersOfAuthorization(id).then((response) => {
              store.dispatch("loa/resetLetterOfAuthorization")
              store.dispatch("loa/resetLetterRows")
              this.getAllLetters()
              this.isDeleteDialogActive = false
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
      cancelDeleteLoa() {
        this.isDeleteDialogActive = false
      },
      openCreateDialog() {
        store.dispatch('loa/resetLetterOfAuthorization')
        this.isLoaDialogActive = true
        this.loaDialogTitle = 'Создание доверенности'
      },
      cancelLoaDialog() {
        //TODO refactor
        // this.currentLoa = {
        //   id: null,
        //   principal: null,
        //   number: null,
        //   issuedDate: null,
        //   validUntil: null,
        //   supplier: null,
        //   driver: null,
        //   sellType: null
        // }
        this.getAllLetters()
        this.isLoaDialogActive = false
      },
      confirmLoaDialog() {
        this.getAllLetters()
        this.isLoaDialogActive = false
      }
    },
    created() {
      this.getAllLetters()
    }
  }

</script>

<style>
  .header_loa_container {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
</style>