<template>
  <div>
    <div style="padding-left: 0px; max-height: 2rem">
      <v-btn
          @click='toggleDriverDialog'
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

      <v-dialog
          v-model='isDriverDialog'
          max-width="50vw"
      >
        <v-card class='dialog_card'>
          <v-card-title class="text-h5">
            Добавить водителя
          </v-card-title>

          <ErrorDialog
              v-bind:message='message'
              v-bind:info='info'
              v-bind:isActive='haveError'
              @closed = 'haveErrorSetFalse'
          />

          <v-form
          >
            <v-text-field
                label='Введите ФИО'
                required
                v-model='createdDriver.name'
            ></v-text-field>

            <v-text-field
                label='Введите серию паспорта'
                required
                v-model='createdDriver.passportSeries'
            ></v-text-field>

            <v-text-field
                label='Введите номер паспорта'
                required
                v-model='createdDriver.passportNumber'
            ></v-text-field>

            <v-text-field
                label='Введите кем выдан паспорт'
                required
                v-model='createdDriver.issuedBy'
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
                  v-model="createdDriver.dateOfIssue"
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
              Добавить
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn
                @click='toggleDriverDialog'
            >
              Отмена
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
  import RestService from '@/services/rest.service'
  import ErrorDialog from '@/components/other/ErrorDialog'
  import EventBus from '@/common/EventBus'

  export default {
    components: {ErrorDialog},
    data() {
      return {
        isDriverDialog: false,
        menu: false,
        activePicker: null,
        createdDriver: {
          id: null,
          name: null,
          passportSeries: null,
          passportNumber: null,
          issuedBy: null,
          dateOfIssue: null
        },
        message: 'Ошибка при создании нового водителя',
        info: [],
        haveError: false,
      }
    },
    watch: {
      menu (val) {
        val && setTimeout(() => (this.activePicker = 'YEAR'))
      },
    },
    methods: {
      toggleDriverDialog() {
        this.createdDriver = {
          id: null,
          name: null,
          passportSeries: null,
          passportNumber: null,
          issuedBy: null,
          dateOfIssue: null
        }
        this.isDriverDialog = !this.isDriverDialog
      },
      addDriver() {
        let someError = false
        let regExpSeries = /^[0-9]{2} [0-9]{2}$/
        let regExpSeriesWithoutSpace = /^[0-9]{2}[0-9]{2}$/
        let regExpNumber = /^[0-9]{6}$/

        if(this.createdDriver.name == null || this.createdDriver.name.length < 3) {
          this.info.push('Введите корректное ФИО')
          someError = true
        }

        if(this.createdDriver.passportSeries == null) {
          this.info.push('Введите серию паспорта')
          someError = true
        } else {
          if(!regExpSeries.test(this.createdDriver.passportSeries)
              && !regExpSeriesWithoutSpace.test(this.createdDriver.passportSeries)) {
            this.info.push('Введите корректную серию паспорта (4 цифры вида NN NN или NNNN)')
            someError = true
          }
        }

        if(regExpSeriesWithoutSpace.test(this.createdDriver.passportSeries)) {
          let correctedPassportSeries = this.createdDriver.passportSeries.substring(0, 2) + " "
              + this.createdDriver.passportSeries.substring(2)
          this.createdDriver.passportSeries = correctedPassportSeries
          console.log(this.createdDriver.passportSeries)
        }

        if(this.createdDriver.passportNumber == null) {
          this.info.push('Введите номер паспорта')
          someError = true
        } else {
          if (!regExpNumber.test(this.createdDriver.passportNumber)) {
            this.info.push('Введите корректный номер паспорта - 6 цифр без прочих знаков')
            someError = true
          }
        }

        if(this.createdDriver.issuedBy == null || this.createdDriver.issuedBy.length < 3) {
          this.info.push('Введите кем выдан паспорт')
          someError = true
        }

        if(this.createdDriver.dateOfIssue == null) {
          this.info.push('Выберите дату выдачи паспорта')
          someError = true
        }


        if(someError) {
          this.haveError = true
          return
        } else {
          RestService.postDrivers(this.createdDriver).then((response) =>
              {
                console.log(response.data)
                this.$emit('added', response.data)
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
          this.toggleDriverDialog()
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
    computed: {
      formattedDate() {
        return this.formatDate(this.createdDriver.dateOfIssue)
      }
    }
  }

</script>

<style>
.dialog_card {
  padding: 4% 10%;
}
</style>