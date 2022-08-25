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
            <PrincipalForm
                @change:principal='changePrincipal($event)'
            />
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
                    v-model="letterOfAuthorization.issuedDate"
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
                v-model='letterOfAuthorization.number'
                readonly
            ></v-text-field>
          </v-col>

        </v-row>

        <v-row>

          <v-col
              cols='12'
              lg='5'
          >
            <SupplierForm
                @change:supplier='changeSupplier($event)'
            />
          </v-col>

          <v-spacer></v-spacer>

          <v-col
              cols='12'
              lg='6'
          >
            <DriverForm
                @change:driver='changeDriver($event)'
            />
          </v-col>

        </v-row>

        <v-row>

          <v-col
              cols='12'
              lg='12'
          >
            <v-data-table
                :headers='headers'
                :items='letterOfAuthorization.letterRows'
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
import DeleteDialog from '@/components/other/DeleteDialog'
import SupplierForm from '@/components/main_container/letter_of_authorization/SupplierForm'
import SupplierDialog from '@/components/main_container/letter_of_authorization/SupplierDialog'
import NomenclatureDialog from '@/components/main_container/letter_of_authorization/NomenclatureDialog'
import DriverForm from '@/components/main_container/letter_of_authorization/DriverForm'
import DriverDialog from '@/components/main_container/letter_of_authorization/DriverDialog'
import PrincipalForm from '@/components/main_container/letter_of_authorization/PrincipalForm'
import PrincipalDialog from '@/components/main_container/letter_of_authorization/PrincipalDialog'
import EventBus from '@/common/EventBus'

export default {
  components: {
    PrincipalForm,
    PrincipalDialog,
    DeleteDialog,
    SupplierForm,
    SupplierDialog,
    NomenclatureDialog,
    DriverForm,
    DriverDialog
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
      rows: [],
      nomenclatures: [],
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
      isSupplierDialog: false,
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
      this.letterOfAuthorization.letterRows[index].nomenclature = nomenclature
    },
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}-${month}-${year}`
    },
    addRow() {
      this.letterOfAuthorization.letterRows.push({
        number: this.letterOfAuthorization.letterRows.length + 1,
        nomenclature: {},
        tonnage: null
      })
    },
    removeRow() {
      if (this.letterOfAuthorization.letterRows.length > 1) {
        this.letterOfAuthorization.letterRows.pop()
      } else {
        this.letterOfAuthorization.letterRows.pop()
        this.letterOfAuthorization.letterRows.push({
          number: 1,
          nomenclature: {},
          tonnage: null
        })
      }
    },
    initialize() {
      this.letterOfAuthorization.letterRows = [
        {
          number: 1,
          nomenclature: {},
          tonnage: null
        }
      ]
    },
    goBack() {
      this.$router.push('/loas')
    },
    changePrincipal(principal) {
      this.letterOfAuthorization.principal = principal
      if(principal == null) {
        this.letterOfAuthorization.number = null
        return
      }
      RestService.getLettersOfAuthorization(principal.id)
          .then((response) => {
            let maxNumber = 0
            let principalLetters = response.data
            if (principalLetters == null || principalLetters.length === 0) {
              this.letterOfAuthorization.number = 1
              return
            }
            principalLetters.forEach(e => {
              if (e.number > maxNumber) {
                maxNumber = e.number
              }
            })
            this.letterOfAuthorization.number = maxNumber + 1;
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
    changeSupplier(supplier) {
      this.letterOfAuthorization.supplier = supplier
    },
    changeDriver(driver) {
      this.letterOfAuthorization.driver = driver
    }
  },
  computed: {
    formattedDate() {
      return this.formatDate(this.letterOfAuthorization.issuedDate)
    }
  },
  mounted() {
    this.getAllPrincipals()
    this.getAllNomenclatures()
    this.initialize()
    let currentDate = new Date()
    let day = currentDate.getDate() < 10 ? "0" + currentDate.getDate() : currentDate.getDate()
    let month = (currentDate.getMonth() + 1) < 10 ? "0" + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1
    let year = currentDate.getFullYear()
    this.letterOfAuthorization.issuedDate = year + "-" + month + "-" + day
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