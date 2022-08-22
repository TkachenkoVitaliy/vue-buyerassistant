<template>
  <div>
    <v-card style='height: 92vh; padding: 0vh 6vw'>
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
                clearable
                dense
                v-model="letterOfAuthorization.principal"
                :items='principals'
                :item-text='item => item.name'
            >
              <template v-slot:append-item>
                <PrincipalDialog
                    @added='setNewPrincipal($event)'
                />
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
                      dense
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
                dense
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
                clearable
                dense
                v-model="letterOfAuthorization.supplier"
                :items='suppliers'
                :item-text='item => item.supplierName'
                return-object
            >
              <template v-slot:append-item>
                <SupplierDialog
                    @added='setNewSupplier($event)'
                />
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
                clearable
                dense
                v-model='letterOfAuthorization.driver'
                :items='drivers'
                :item-text='item => item.name + " " + item.passportSeries + " " + item.passportNumber'
            >
              <template v-slot:append-item>
                <DriverDialog
                    @added='setNewDriver($event)'
                />
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
                disable-sort
                hide-default-footer
                dense
            >
              <template v-slot:item.nomenclature='props'>
                <v-autocomplete
                    solo-inverted
                    dense
                    v-model='props.item.nomenclature'
                    :items='nomenclatures'
                    :item-text='item => item.name'
                    return-object
                >
                  <template v-slot:append-item>
                    <NomenclatureDialog
                        v-bind:currentindex = 'props.item.number'
                        @added='setNewNomenclature($event)'
                    />
                  </template>
                </v-autocomplete>
              </template>
              <template v-slot:item.tonnage='props'>
                <v-text-field
                    solo-inverted
                    dense
                    v-model='props.item.tonnage'
                ></v-text-field>
              </template>

            </v-data-table>
            <div style="display: flex; justify-content: space-between">
              <v-btn
                  @click='addRow'
                  fab
                  color='green'
                  small
                  dark
              >
                <v-icon dark>
                  mdi-plus
                </v-icon>
              </v-btn>
              <v-btn
                  @click='removeRow'
                  fab
                  color='red'
                  small
                  dark
              >
                <v-icon dark>
                  mdi-minus
                </v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-spacer></v-spacer>
          <v-col
              cols='12'
              lg='2'
          >
            <v-btn
                class='darken-4 green--text'
            >СОЗДАТЬ
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col
              cols='12'
              lg='3'
          >
            <v-btn
                class='primary'
            >СОЗДАТЬ И СКАЧАТЬ
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col
              cols='12'
              lg='2'
          >
            <v-btn
                @click='goBack'
                class='red--text'
            >ОТМЕНА
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>

      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import RestService from '@/services/rest.service'
import SupplierDialog from '@/components/main_container/letter_of_authorization/SupplierDialog'
import NomenclatureDialog from '@/components/main_container/letter_of_authorization/NomenclatureDialog'
import DriverDialog from '@/components/main_container/letter_of_authorization/DriverDialog'
import PrincipalDialog from '@/components/main_container/letter_of_authorization/PrincipalDialog'
import EventBus from '@/common/EventBus'

export default {
  components: {
    SupplierDialog,
    NomenclatureDialog,
    DriverDialog,
    PrincipalDialog
  },
  data() {
    return {
      letterOfAuthorization: {
        principal: null,
        number: null,
        issuedDate: null,
        validUntil: null,
        supplier: null,
        driver: null,
        letterRows: [],
        sellType: null
      },
      principals: [],
      number: 1,
      issuedDate: null,
      drivers: [],
      rows: [],
      suppliers: [],
      nomenclatures: [],
      letterRows: [],
      headers: [
        {
          text: 'НОМЕНКЛАТУРА',
          align: 'center',
          value: 'nomenclature'
        },
        {
          text: 'ТОННАЖ',
          align: 'center',
          value: 'tonnage'
        }
      ],
      createdSupplierName: null,
      isPrincipalsDialog: false,
      isDriverDialog: false,
      isNomenclatureDialog: false
    }
  },
  methods: {
    getAllPrincipals() {
      RestService.getPrincipals().then((response) => {
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
    setNewPrincipal(principal) {
      this.getAllPrincipals()
      this.letterOfAuthorization.principal = principal
    },
    getAllSuppliers() {
      RestService.getSuppliers().then((response) => {
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
    setNewSupplier(supplier) {
      this.getAllSuppliers()
      this.letterOfAuthorization.supplier = supplier
    },
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
    setNewDriver(driver) {
      console.log(driver)
      this.getAllDrivers()
      this.letterOfAuthorization.driver = driver
    },
    getAllNomenclatures() {
      RestService.getNomenclatures().then((response) => {
            this.nomenclatures = response.data
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
    setNewNomenclature(result) {
      let nomenclature = result.nomenclature
      let index = result.index - 1
      this.getAllNomenclatures()
      this.letterRows[index].nomenclature = nomenclature
    },
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}-${month}-${year}`
    },
    addRow() {
      this.letterRows.push({
        number: this.letterRows.length + 1,
        nomenclature: {},
        tonnage: null
      })
    },
    removeRow() {
      if (this.letterRows.length > 1) {
        this.letterRows.pop()
      } else {
        this.letterRows.pop()
        this.letterRows.push({
          number: 1,
          nomenclature: {},
          tonnage: null
        })
      }
    },
    initialize() {
      this.letterRows = [
        {
          number: 1,
          nomenclature: {},
          tonnage: null
        }
      ]
    },
    goBack() {
      this.$router.push('/loas')
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
    this.getAllNomenclatures()
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