<template>
  <div>
    <v-card style='height: 92vh; padding: 4vh 6vw'>
      <v-card-title>Создание доверенности</v-card-title>
      <v-card-text>
        <v-row
        >

          <v-col
              cols='12'
              lg='5'
          >
            <p class='subtitle_text'>Доверитель</p>
            <v-autocomplete
                :items = 'principals'
                :item-text='item => item.name'
            >
              <template v-slot:append-item>
                <div style="padding-left: 0px; max-height: 2rem">
                  <v-btn
                      to="/settings"
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
              </template>
            </v-autocomplete>
          </v-col>

          <v-spacer></v-spacer>

          <v-col
              cols='12'
              lg='3'
          >
            <div>
              <p class='subtitle_text'>Дата выдачи</p>
              <v-menu>
               <template v-slot:activator="{ on, attrs }">
                 <v-text-field
                     v-model="formattedDate"
                     prepend-icon="mdi-calendar"
                     v-bind="attrs"
                     v-on="on"
                 ></v-text-field>
               </template>
               <v-date-picker
                   v-model="issuedDate"
                   no-title
                   locale='ru-RU'
                   :first-day-of-week='1'
               ></v-date-picker>
             </v-menu>
            </div>
          </v-col>

          <v-spacer></v-spacer>

          <v-col
              cols='12'
              lg='1'
          >
            <p class='subtitle_text'>№</p>
            <v-text-field
                v-model='number'
                readonly
            ></v-text-field>
          </v-col>

        </v-row>

        <v-row>

          <v-col
              cols='12'
              lg='5'
          >
            <p class='subtitle_text'>Поставщик</p>
            <v-autocomplete
                :items = 'suppliers'
                :item-text='item => item.supplierName'
            >
              <template v-slot:append-item>
                <div style="padding-left: 0px; max-height: 2rem">
                  <v-btn
                      to="/email_newsletter"
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
              </template>
            </v-autocomplete>
          </v-col>

        </v-row>
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
        principals:[],
        number: 1,
        issuedDate: null,
        drivers: [],
        rows: [],
        suppliers: []
      }
    },
    methods: {
      getAllPrincipals() {
        RestService.getPrincipals().then((response) =>
            {
              this.principals = response.data
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
      getAllSuppliers() {
        RestService.getSuppliers().then((response) =>
            {
              this.suppliers = response.data
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
      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}-${month}-${year}`
      }
    },
    computed: {
      formattedDate() {
        return this.formatDate(this.issuedDate)
      }
    },
    mounted() {
      this.getAllPrincipals()
      this.getAllSuppliers()
      let currentDate = new Date()
      let day = currentDate.getDate() < 10 ? "0" + currentDate.getDate() : currentDate.getDate()
      let month = (currentDate.getMonth() + 1) < 10 ? "0" + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1
      let year = currentDate.getFullYear()
      this.issuedDate = year + "-" + month + "-" + day
    }
  }
</script>

<style scoped>
  .svg_create {
    height: 1.5rem;
    width: 1.5rem;
    fill: green;
  }

  .subtitle_text {
    font-size: 1.2rem;
    font-weight: bold;
    color: #00689a;
  }



</style>