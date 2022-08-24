<template>
  <div>
    <v-dialog
        v-model='dialog'
        max-width="50vw"
    >
      <v-card class='dialog_card'>
        <v-card-title class="text-h5">
          {{ title }}
        </v-card-title>

        <ErrorDialog
            v-bind:message='message'
            v-bind:info='info'
            v-bind:isActive='haveError'
            @closed='haveErrorSetFalse'
        />

        <v-form
        >
          <v-text-field
              label='Введите ФИО'
              required
              v-model='driverLocal.name'
          ></v-text-field>

          <v-text-field
              label='Введите серию паспорта'
              required
              v-model='driverLocal.passportSeries'
          ></v-text-field>

          <v-text-field
              label='Введите номер паспорта'
              required
              v-model='driverLocal.passportNumber'
          ></v-text-field>

          <v-text-field
              label='Введите кем выдан паспорт'
              required
              v-model='driverLocal.issuedBy'
          ></v-text-field>

          <v-menu
              :close-on-content-click='false'
              ref='menu'
              v-model='menu'
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  label='Введите дату выдачи паспорта'
                  dense
                  v-model="formattedDate"
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
                v-model="driverLocal.dateOfIssue"
                :active-picker.sync="activePicker"
                :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                min="1985-01-01"
                @change="save"
                no-title
                locale='ru-RU'
                :first-day-of-week='1'
            ></v-date-picker>
          </v-menu>
        </v-form>

        <v-card-actions>

          <v-btn
              @click='addDriver'
          >
            Сохранить
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn
              @click='cancelDialog'
          >
            Отмена
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import RestService from '@/services/rest.service'
  import ErrorDialog from '@/components/other/ErrorDialog'
  import EventBus from '@/common/EventBus'

  export default {
    components: {ErrorDialog},
    props: ['dialog','title', 'driver'],
    model: {
      prop: 'driver',
      event: 'change'
    },
    data() {
      return {
        menu: false,
        activePicker: null,
        message: 'Ошибка при создании нового водителя',
        info: [],
        haveError: false,
      }
    },
    computed: {
      formattedDate() {
        return this.formatDate(this.driverLocal.dateOfIssue)
      },
      driverLocal: {
        get: function () {
          return this.driver
        },
        set: function (value) {
          this.$emit('change', value)
        }
      },
    },
    watch: {
      menu (val) {
        val && setTimeout(() => (this.activePicker = 'YEAR'))
      },
    },
    methods: {
      cancelDialog() {
        this.driverLocal = {
          id: null, name: null, passportSeries: null, passportNumber: null, issuedBy: null, dateOfIssue: null
        }
        this.$emit('cancel')
      },
      addDriver() {
        let someError = false
        let regExpSeries = /^[0-9]{2} [0-9]{2}$/
        let regExpSeriesWithoutSpace = /^[0-9]{2}[0-9]{2}$/
        let regExpNumber = /^[0-9]{6}$/

        if(this.driverLocal.name == null || this.driverLocal.name.length < 3) {
          this.info.push('Введите корректное ФИО')
          someError = true
        }

        if(this.driverLocal.passportSeries == null) {
          this.info.push('Введите серию паспорта')
          someError = true
        } else {
          if(!regExpSeries.test(this.driverLocal.passportSeries)
              && !regExpSeriesWithoutSpace.test(this.driverLocal.passportSeries)) {
            this.info.push('Введите корректную серию паспорта (4 цифры вида NN NN или NNNN)')
            someError = true
          }
        }

        if(regExpSeriesWithoutSpace.test(this.driverLocal.passportSeries)) {
          let correctedPassportSeries = this.driverLocal.passportSeries.substring(0, 2) + " "
              + this.driverLocal.passportSeries.substring(2)
          this.driverLocal.passportSeries = correctedPassportSeries
        }

        if(this.driverLocal.passportNumber == null) {
          this.info.push('Введите номер паспорта')
          someError = true
        } else {
          if (!regExpNumber.test(this.driverLocal.passportNumber)) {
            this.info.push('Введите корректный номер паспорта - 6 цифр без прочих знаков')
            someError = true
          }
        }

        if(this.driverLocal.issuedBy == null || this.driverLocal.issuedBy.length < 3) {
          this.info.push('Введите кем выдан паспорт')
          someError = true
        }

        if(this.driverLocal.dateOfIssue == null) {
          this.info.push('Выберите дату выдачи паспорта')
          someError = true
        }


        if(someError) {
          this.haveError = true
          return
        }
        else {
          if (this.driverLocal.id == null) {
            RestService.postDrivers(this.driverLocal).then((response) =>
                {
                  this.$emit('save', response.data)
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
          } else {
            RestService.putDrivers(this.driverLocal).then((response) =>
                {
                  this.$emit('save', response.data)
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

        }
      },
      save (date) {
        this.$refs.menu.save(date)
      },
      haveErrorSetFalse() {
        this.info = []
        this.haveError = false
      },
      formatDate(date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}-${month}-${year}`
      }
    },
  }

</script>

<style>
.dialog_card {
  padding: 4% 10%;
}
</style>