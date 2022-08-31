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
                v-bind:info = 'currentLoa.principal ? currentLoa.principal.name +" "+ currentLoa.number: " "'
                v-bind:id = currentLoa.id
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
          v-model:loa='currentLoa'
          @save='confirmLoaDialog($event)'
          @cancel='cancelLoaDialog'
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

  export default {
    components: {
      DeleteDialog,
      LetterOfAuthorizationDialog
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
          { text: 'Действия', value: 'actions', sortable: false },
        ],
        loaDialogTitle: null,
        isLoaDialogActive: false,
        isDeleteDialogActive: false,
        currentLoa: {id: null, principal: null, number: null, issuedDate: null, validUntil: null, supplier: null,
          driver: null, sellType: null},
        loa: {id: null, principal: null, number: null, issuedDate: null, validUntil: null, supplier: null,
          driver: null, sellType: null}
      }
    },
    methods: {
      getAllLetters() {
        RestService.getLettersOfAuthorization().then((response) =>
            {
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
        this.isLoaDialogActive = true
        this.currentLoa = loa
        this.loaDialogTitle = 'Редактирование доверенности'
      },
      openDeleteDialog(loa) {
        this.currentLoa = loa
        this.isDeleteDialogActive = true
        this.loa = {
          id: null,
          principal: null,
          number: null,
          issuedDate: null,
          validUntil: null,
          supplier: null,
          driver: null,
          sellType: null
        }
      },
      confirmDeleteLoa(id) {
        RestService.deleteLoa(id).then((response) => {
              this.loa = {
                id: null,
                principal: null,
                number: null,
                issuedDate: null,
                validUntil: null,
                supplier: null,
                driver: null,
                sellType: null
              }
              this.getAllLetters()
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
      cancelDeleteLoa() {
        this.isDeleteDialogActive = false
      },
      openCreateDialog() {
        this.loa = {
          id: null,
          principal: null,
          number: null,
          issuedDate: null,
          validUntil: null,
          supplier: null,
          driver: null,
          sellType: null
        }
        this.isLoaDialogActive = true
        console.log(this.isLoaDialogActive)
        this.loaDialogTitle = 'Создание доверенности'
      },
      cancelLoaDialog() {
        this.currentLoa = {
          id: null,
          principal: null,
          number: null,
          issuedDate: null,
          validUntil: null,
          supplier: null,
          driver: null,
          sellType: null
        }
        this.getAllLetters()
        this.isLoaDialogActive = false
      },
      confirmLoaDialog(loa) {
        this.getAllLetters()
        this.loa = loa
        this.isLoaDialogActive = false
      }
    },
    mounted() {
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