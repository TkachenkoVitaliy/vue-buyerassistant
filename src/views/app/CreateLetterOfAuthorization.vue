<template>
  <div>
    <v-card style='height: 92vh; padding: 2vh 6vw'>
      <v-card-title>СОЗДАНИЕ ДОВЕРЕННОСТИ</v-card-title>
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

          <v-spacer></v-spacer>

          <v-col
              cols='12'
              lg='6'
          >
            <p class='subtitle_text'>Водитель</p>
            <v-autocomplete
                :items = 'drivers'
                :item-text='item => item.name + " " + item.passportSeries + " " + item.passportNumber'
            >
              <template v-slot:append-item>
                <div style="padding-left: 0px; max-height: 2rem">
                  <v-btn
                      to="/upload_accept_and_shipment"
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

        <v-row>

          <v-col
              cols='12'
              lg='12'
          >
            <v-data-table
                :headers='headers'
                :items='letterRows'
                hide-default-footer
                dense
            >
              <template v-slot:item.nomenclature = 'props'>
                <v-autocomplete
                    dense
                    v-model='props.item.nomenclature'
                    :items = 'nomenclatures'
                    :item-text='item => item.name'
                    return-object
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
              </template>
              <template v-slot:item.tonnage = 'props'>
                <v-text-field
                    dense
                    v-model='props.item.tonnage'
                ></v-text-field>
              </template>

            </v-data-table>
            <div style="display: flex; justify-content: space-between">
              <v-btn
                  @click='addRow'
                  class='primary'
              >ДОБАВИТЬ</v-btn>
              <v-btn
                  @click='removeRow'
                  class='red white--text'
              >УДАЛИТЬ</v-btn>
            </div>
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
        suppliers: [],
        nomenclatures: [{id: 1, name: 'Арматура Пруток МД 12*11700 А500С'}],
        letterRows: [],
        headers: [
          {
            text: 'Номенклатура',
            align: 'left',
            value: 'nomenclature'
          },
          {
            text: 'Тоннаж',
            align: 'center',
            value: 'tonnage'
          }
        ]
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
      getAllDrivers() {
        RestService.getDrivers().then((response) =>
            {
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
      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}-${month}-${year}`
      },
      addRow() {
        this.letterRows.push({})
      },
      removeRow() {
        if(this.letterRows.length > 1) {
          this.letterRows.pop()
        }
      },
      initialize() {
        this.letterRows = [
          {
            nomenclature: {

            },
            tonnage: null
          }
        ]
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
      this.getAllDrivers()
      this.initialize()
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