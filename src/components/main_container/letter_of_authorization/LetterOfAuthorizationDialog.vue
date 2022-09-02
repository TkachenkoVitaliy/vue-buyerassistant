<template>
  <div>
    <v-dialog
        v-model='dialog'
        persistent
    >
      <v-card style='min-height: 92vh; padding: 0vh 6vw'>
        <v-card-title> {{ title }} </v-card-title>
        <v-card-text>
          <ErrorDialog
              v-bind:message='message'
              v-bind:info='info'
              v-bind:isActive='haveError'
              @closed='haveErrorSetFalse'
          />


          <v-row
          >

            <v-col
                cols='12'
                lg='5'
            >
              <PrincipalForm
                  @change:principal='changePrincipal($event)'
                  ref='principal_form'
              />
            </v-col>

            <v-spacer></v-spacer>

            <v-col
                cols='12'
                lg='2'
            >
              <div>
                <p class='subtitle_text'>Тип</p>
                <v-select
                    required
                    dense
                    clearable
                    v-model='letterOfAuthorization.sellType'
                    :items='sellTypes'
                ></v-select>
              </div>
            </v-col>

            <v-spacer></v-spacer>

            <v-col
                cols='12'
                lg='2'
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
                  :readonly='haveInitialNumber'
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
                  ref='supplier_form'
              />
            </v-col>

            <v-spacer></v-spacer>

            <v-col
                cols='12'
                lg='6'
            >
              <DriverForm
                  @change:driver='changeDriver($event)'
                  ref='driver_form'
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
                  @click='onlySaveLoa'
              >СОХРАНИТЬ
              </v-btn>
            </v-col>
            <v-spacer></v-spacer>
            <v-col style='border: #00689a 2px solid; border-radius: 10px; background-color: #00689a'
                cols='12'
                lg='2'
            >
              <p style='text-align: center; color: #fff; font-weight: bolder; margin-bottom: 0px'>СОХРАНИТЬ И СКАЧАТЬ</p>
              <hr style='margin: 10px 0px'>
              <div style='display: flex; justify-content: space-between'>
                <button
                    style='width: 74px'
                    @click='saveAndDownloadXlsLoa'
                >
                  <svg style='height: 96px; width: 74px'>
                    <use xlink:href='@/assets/Extension.svg#xls'></use>
                  </svg>
                </button>

                <button style='width: 74px'
                >
                  <svg
                      style='height: 96px; width: 74px'
                      @click='saveAndDownloadPdfLoa'
                  >
                    <use xlink:href='@/assets/Extension.svg#pdf'></use>
                  </svg>
                </button>
              </div>

            </v-col>
            <v-spacer></v-spacer>
            <v-col
                cols='12'
                lg='2'
            >
              <v-btn
                  @click='cancelDialog'
                  class='red--text'
              >ОТМЕНА
              </v-btn>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>

        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import RestService from '@/services/rest.service'
import DeleteDialog from '@/components/other/DeleteDialog'
import ErrorDialog from '@/components/other/ErrorDialog'
import SupplierForm from '@/components/main_container/letter_of_authorization/SupplierForm'
import SupplierDialog from '@/components/main_container/letter_of_authorization/SupplierDialog'
import NomenclatureDialog from '@/components/main_container/letter_of_authorization/NomenclatureDialog'
import DriverForm from '@/components/main_container/letter_of_authorization/DriverForm'
import DriverDialog from '@/components/main_container/letter_of_authorization/DriverDialog'
import PrincipalForm from '@/components/main_container/letter_of_authorization/PrincipalForm'
import PrincipalDialog from '@/components/main_container/letter_of_authorization/PrincipalDialog'
import EventBus from '@/common/EventBus'
import store from '@/store'

export default {
  components: {
    DeleteDialog,
    ErrorDialog,
    PrincipalForm,
    PrincipalDialog,
    SupplierForm,
    SupplierDialog,
    NomenclatureDialog,
    DriverForm,
    DriverDialog
  },
  props: ['dialog','title'],
  computed: {
    letterOfAuthorization: {
      get: function () {return store.getters["loa/letterOfAuthorization"]},
      set: function (value) {store.commit('loa/setLetterOfAuthorization', value)}
    },
    letterRows: {
      get: function () {return store.getters["loa/letterRows"]},
      set: function (value) {store.commit('loa/setLetterRows', value)}
    },
    formattedDate() {
      return this.formatDate(store.getters["loa/issuedDate"])
    }
  },
  data() {
    return {
      nomenclatures: [],
      sellTypes: ['На склад', 'На клиента'],
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
      isNomenclatureDialog: false,
      message: 'Ошибка при создании новой доверенности',
      info: [],
      haveError: false,
      haveInitialNumber: false
    }
  },
  methods: {
    //TODO remove
    setNewPrincipal(principal) {
      this.getAllPrincipals()
      this.letterOfAuthorization.principal = principal
    },

    //TODO remove
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
    //TODO remove
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
      store.dispatch("loa/resetLetterRows")
    },
    cancelDialog() {
      store.dispatch("loa/resetLetterOfAuthorization")
      store.dispatch("loa/resetLetterRows")
      this.$emit('cancel')
    },

    //TODO remove
    changePrincipal(principal) {
      this.letterOfAuthorization.principal = principal
      if(principal == null) {
        this.letterOfAuthorization.number = null
        this.haveInitialNumber = true
        return
      }
      RestService.getLettersOfAuthorization(principal.id)
          .then((response) => {
            let maxNumber = 0
            let principalLetters = response.data
            if (principalLetters == null || principalLetters.length === 0) {
              this.letterOfAuthorization.number = 1
              this.haveInitialNumber = false
              return
            }
            principalLetters.forEach(e => {
              if (e.number > maxNumber) {
                maxNumber = e.number
              }
            })
            this.letterOfAuthorization.number = maxNumber + 1;
            this.haveInitialNumber = true
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

    //TODO remove
    changeSupplier(supplier) {
      this.letterOfAuthorization.supplier = supplier
    },

    //TODO remove
    changeDriver(driver) {
      this.letterOfAuthorization.driver = driver
    },

    //TODO remove
    cleanLetterRows() {
      this.letterRows = this.letterRows
          .filter(function (item) {
            return (item.nomenclature != null && Object.keys(item.nomenclature).length !== 0)
            || (item.tonnage != null && item.tonnage >= 0.001)
          })
      if(this.letterRows.length === 0) {
        return false
      } else {
        return true
      }
    },
    checkErrors() {
      let someError = false

      this.letterOfAuthorization.principal = this.$refs.principal_form.principal

      if(this.letterOfAuthorization.principal == null) {
        someError = true
        this.info.push('Выберите доверителя')
      }

      if(this.letterOfAuthorization.sellType == null || this.letterOfAuthorization.sellType === '') {
        someError = true
        this.info.push('Выберите тип отгрузки')
      }

      if(this.letterOfAuthorization.issuedDate == null) {
        someError = true
        this.info.push('Выберите дату выдачи доверенности')
      }

      this.changePrincipal(this.letterOfAuthorization.principal)
      if(this.letterOfAuthorization.number == null) {
        someError = true
      }

      this.letterOfAuthorization.supplier = this.$refs.supplier_form.supplier
      if(this.letterOfAuthorization.supplier == null) {
        someError = true
        this.info.push('Выберите поставщика')
      }

      this.letterOfAuthorization.driver = this.$refs.driver_form.driver
      if(this.letterOfAuthorization.driver == null) {
        someError = true
        this.info.push('Выберите водителя')
      }

      let checkFullProps = function (elem) {
        if(elem.nomenclature == null || Object.keys(elem.nomenclature).length == 0 || elem.tonnage == null) {
          return false
        } else {
          return true
        }
      }

      if(this.cleanLetterRows()) {
        if(!this.letterRows.every(checkFullProps)) {
          someError = true
          this.info.push('Во всех строках ТМЦ должны быть указаны номенклатура и тоннаж')
        }
      } else {
        someError = true
        this.letterRows.push({
          id: null,
          number: 1,
          nomenclature: {},
          tonnage: null,
          letterOfAuthorization_id: null
        })
        this.info.push('Укажите хотя бы одну строку ТМЦ')
      }

      return someError;
    },
    createLoA() {
      return new Promise((resolve, reject) => {
        let result = null
        if(this.checkErrors()) {
          this.haveError = true
        } else {
          let date = new Date(this.letterOfAuthorization.issuedDate)
          this.letterOfAuthorization.validUntil =  date.setDate(date.getDate() + 10)
          RestService.postLettersOfAuthorization(this.letterOfAuthorization).then((response) => {
                console.log(response.data)
                this.letterRows.forEach(item => item.letterOfAuthorization = response.data)
                result = response.data
                RestService.postArrayLetterRows(this.letterRows).then((response) => {
                      console.log(response.data)
                      resolve(result)
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
        }
      })
    },
    updateLoA() {
      return new Promise((resolve, reject) => {
        let result = null
        if(this.checkErrors()) {
          this.haveError = true
        } else {
          let date = new Date(this.letterOfAuthorization.issuedDate)
          this.letterOfAuthorization.validUntil =  date.setDate(date.getDate() + 10)
          RestService.putLettersOfAuthorization(this.letterOfAuthorization).then((response) => {
                console.log(response.data)
                this.letterRows.forEach(item => item.letterOfAuthorization = response.data)
                result = response.data
                RestService.putArrayLetterRows(this.letterRows).then((response) => {
                      console.log(response.data)
                      resolve(result)
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
        }
      })
    },
    onlySaveLoa() {
      if(this.letterOfAuthorization.id == null) {
        this.createLoA().then(res => {
          console.log(res)
          this.$emit('save')
        })
      } else {
        this.updateLoA().then(res => {
          console.log(res)
          this.$emit('save')
        })
      }

    },
    saveAndDownloadXlsLoa() {
      if (this.letterOfAuthorization.id == null) {
        this.createLoA().then(res => {
          const id = res.id
          RestService.downloadXlsLoa(id).then(response => {
            let fileUrl = window.URL.createObjectURL(response.data);
            let fileLink = document.createElement('a');

            fileLink.href = fileUrl;
            fileLink.setAttribute('download', 'Доверенность.xls');
            document.body.appendChild(fileLink)
            fileLink.click();

            this.$emit('save')
          }).catch(error => {
            console.log(error.response.data)
          })
        })
      } else {
        this.updateLoA().then(res => {
          const id = res.id
          RestService.downloadXlsLoa(id).then(response => {
            let fileUrl = window.URL.createObjectURL(response.data);
            let fileLink = document.createElement('a');

            fileLink.href = fileUrl;
            fileLink.setAttribute('download', 'Доверенность.xls');
            document.body.appendChild(fileLink)
            fileLink.click();

            this.$emit('save')
          }).catch(error => {
            console.log(error.response.data)
          })
        })
      }
    },
    saveAndDownloadPdfLoa() {
      if(this.letterOfAuthorization.id == null) {
        this.createLoA().then(res => {
          const id = res.id
          RestService.downloadPdfLoa(id).then(response => {
            let fileUrl = window.URL.createObjectURL(response.data);
            let fileLink = document.createElement('a');

            fileLink.href = fileUrl;
            fileLink.setAttribute('download', 'Доверенность.pdf');
            document.body.appendChild(fileLink)
            fileLink.click();

            this.$emit('save')
          }).catch(error => {
            console.log(error.response.data)
          })
        })
      } else {
        this.updateLoA().then(res => {
          const id = res.id
          RestService.downloadPdfLoa(id).then(response => {
            let fileUrl = window.URL.createObjectURL(response.data);
            let fileLink = document.createElement('a');

            fileLink.href = fileUrl;
            fileLink.setAttribute('download', 'Доверенность.pdf');
            document.body.appendChild(fileLink)
            fileLink.click();

            this.$emit('save')
          }).catch(error => {
            console.log(error.response.data)
          })
        })
      }
    },
    haveErrorSetFalse() {
      this.info = []
      this.haveError = false
    },
    // initializeEditMode() {
    //   this.$refs.principal_form.principal = this.loaLocal.principal
    //   this.$refs.supplier_form.supplier = this.loaLocal.supplier
    //   this.$refs.driver_form.driver = this.loaLocal.driver
      // this.letterOfAuthorization.number = this.loaLocal.number
      // this.letterOfAuthorization.issuedDate = this.loaLocal.issuedDate
      // this.letterOfAuthorization.validUntil = this.loaLocal.validUntil
      // this.letterOfAuthorization.id = this.loaLocal.id
      // this.letterOfAuthorization.sellType = this.loaLocal.sellType
  //     this.letterRows = this.loaLocal.letterRows
  //   }
  },
  // updated() {
  //   if(this.loaLocal.id != null) {
  //     console.log('loa.id != null', this.loa, this.loaLocal)
  //     this.initializeEditMode()
  //   }
  // },
  mounted() {
    this.getAllNomenclatures()
    this.initialize()

    if (this.letterOfAuthorization.issuedDate == null) {
      let currentDate = new Date()
      let day = currentDate.getDate() < 10 ? "0" + currentDate.getDate() : currentDate.getDate()
      let month = (currentDate.getMonth() + 1) < 10 ? "0" + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1
      let year = currentDate.getFullYear()
      this.letterOfAuthorization.issuedDate = year + "-" + month + "-" + day
    }
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