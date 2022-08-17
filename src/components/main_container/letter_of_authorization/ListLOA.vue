<template>
  <div>
    <v-data-table
        :headers='headers'
        :items='letters'
    ></v-data-table>
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
            value: 'principal',
          },
          { text: 'Номер', value: 'number' },
          { text: 'Дата выдачи', value: 'issuedDate' },
          { text: 'Водитель', value: 'driver' },
          { text: 'Поставщик', value: 'supplier' },
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
      }
    },
    mounted() {
      this.getAllLetters()
    }
  }

</script>