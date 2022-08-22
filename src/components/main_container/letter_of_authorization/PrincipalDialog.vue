<template>
  <div>
    <div style="padding-left: 0px; max-height: 2rem">
      <v-btn
          @click='togglePrincipalDialog'
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
          v-model='isPrincipalDialog'
          max-width="50vw"
      >
        <v-card class='dialog_card'>
          <v-card-title class="text-h5">
            Добавить доверителя
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
                label='Введите ИНН'
                required
                v-model='createdPrincipal.inn'
            ></v-text-field>

            <v-btn
                @click='getPrincipalData'
            >Заполнить по ИНН</v-btn>

            <v-text-field
                label='Введите КПП'
                required
                v-model='createdPrincipal.kpp'
            ></v-text-field>

            <v-text-field
                label='Введите краткое наименование организации'
                required
                v-model='createdPrincipal.name'
            ></v-text-field>

            <v-text-field
                label='Введите адрес'
                required
                v-model='createdPrincipal.address'
            ></v-text-field>

            <v-text-field
                label='Введите имя руководителя (директора)'
                required
                v-model='createdPrincipal.directorName'
            ></v-text-field>

            <v-text-field
                label='Введите банковский счет'
                required
                v-model='createdPrincipal.bankAccount'
            ></v-text-field>

          </v-form>

          <v-card-actions>

            <v-btn
                @click='addPrincipal'
            >
              Добавить
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn
                @click='togglePrincipalDialog'
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
  import {daDataInstance, itSoftInstance} from "@/services/others.api";
  import EventBus from '@/common/EventBus'

  export default {
    components: {ErrorDialog},
    data() {
      return {
        isPrincipalDialog: false,
        createdPrincipal: {
          id: null,
          name: null,
          inn: null,
          kpp: null,
          address: null,
          bankAccount: null,
          directorName: null
        },
        message: 'Ошибка при создании нового доверителя',
        info: [],
        haveError: false,
      }
    },
    methods: {
      getPrincipalData() {
        if(this.createdPrincipal.inn != null && this.createdPrincipal.inn.length > 9) {
          itSoftInstance.get(this.createdPrincipal.inn)
              .then((response) => {
                let jsonData = response.data
                this.createdPrincipal.name = jsonData.short_name
                this.createdPrincipal.kpp = jsonData.kpp
                this.createdPrincipal.directorName = jsonData.chief_shortname
              })
              .catch(() => {
              })
          daDataInstance.post('', {query : this.createdPrincipal.inn})
              .then((response) => this.createdPrincipal.address = response.data.suggestions[0].data.address.unrestricted_value)
              .catch(() => {})
        }
      },
      togglePrincipalDialog() {
        this.createdPrincipal = {
          id: null,
          name: null,
          inn: null,
          kpp: null,
          address: null,
          bankAccount: null,
          directorName: null
        }
        this.isPrincipalDialog = !this.isPrincipalDialog
      },
      addPrincipal() {
        let someError = false
        let regExpInn = /^[0-9]{10,12}$/

        if(this.createdPrincipal.inn == null || this.createdPrincipal.inn == '') {
          this.info.push('Введите ИНН')
          someError = true
        } else {
          if(!regExpInn.test(this.createdPrincipal.inn)) {
            this.info.push('Введите корректный инн')
            someError = true
          }
        }

        if(this.createdPrincipal.name == null || this.createdPrincipal.name == '') {
          this.info.push('Введите краткое наименование организации')
          someError = true
        }

        if(this.createdPrincipal.address == null || this.createdPrincipal.address == '') {
          this.info.push('Введите юр адрес организации')
          someError = true
        }

        if(this.createdPrincipal.directorName == null || this.createdPrincipal.directorName == '') {
          this.info.push('Введите ФИО руководителя')
          someError = true
        }

        if(this.createdPrincipal.bankAccount == null || this.createdPrincipal.bankAccount == '') {
          this.info.push('Введите данные по банковскому счету')
          someError = true
        }

        if(someError) {
          this.haveError = true
          return
        } else {
          RestService.postPrincipals(this.createdPrincipal).then((response) =>
              {
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
          this.togglePrincipalDialog()
        }
      },
      haveErrorSetFalse() {
        this.info = []
        this.haveError = false
      }
    }
  }

</script>

<style>
.dialog_card {
  padding: 4% 10%;
}
</style>