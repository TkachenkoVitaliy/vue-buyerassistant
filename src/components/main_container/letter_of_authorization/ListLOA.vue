<template>
  <div>
    <v-card min-height='92vh'>
      <v-card-title>
        <div class='header_loa_container'>
          <p>Доверенности</p>
          <v-btn to='loas/create'>
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

          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan='headers.length - 1 '>
              {{ item.letterRows }}
            </td>
            <td> {{ item.sellType }} </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import RestService from '@/services/rest.service'
  import EventBus from "@/common/EventBus";

  export default {
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
        ],
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