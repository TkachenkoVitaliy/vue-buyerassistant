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
              label='Введите ИНН'
              required
              v-model='principal.inn'
          ></v-text-field>

          <v-btn
              @click='getPrincipalData'
          >Заполнить по ИНН
          </v-btn>

          <v-text-field
              label='Введите КПП'
              required
              v-model='principal.kpp'
          ></v-text-field>

          <v-text-field
              label='Введите краткое наименование организации'
              required
              v-model='principal.name'
          ></v-text-field>

          <v-text-field
              label='Введите адрес'
              required
              v-model='principal.address'
          ></v-text-field>

          <v-text-field
              label='Введите имя руководителя (директора)'
              required
              v-model='principal.directorName'
          ></v-text-field>

          <v-text-field
              label='Введите банковский счет'
              required
              v-model='principal.bankAccount'
          ></v-text-field>

        </v-form>

        <v-card-actions>

          <v-btn
              @click='addPrincipal'
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
  import {daDataInstance, itSoftInstance} from "@/services/others.api";
  import EventBus from '@/common/EventBus'

  export default {
    components: {ErrorDialog},
    props: ['dialog','title', 'principal'],
    model: {
      prop: 'principal',
      event: 'change'
    },
    computed: {
      principalLocal: {
        get: function () {
          return this.principal
        },
        set: function (value) {
          this.$emit('change', value)
        }
      },
    },
    data() {
      return {
        message: 'Ошибка при создании нового доверителя',
        info: [],
        haveError: false,
      }
    },
    methods: {
      getPrincipalData() {
        if(this.principalLocal.inn != null && this.principalLocal.inn.length > 9) {
          itSoftInstance.get(this.principalLocal.inn)
              .then((response) => {
                let jsonData = response.data
                this.principalLocal.name = jsonData.short_name
                this.principalLocal.kpp = jsonData.kpp
                this.principalLocal.directorName = jsonData.chief_shortname
              })
              .catch(() => {
              })
          daDataInstance.post('', {query : this.principalLocal.inn})
              .then((response) => this.principalLocal.address = response.data.suggestions[0].data.address.unrestricted_value)
              .catch(() => {})
        }
      },
      cancelDialog() {
        this.principalLocal = {
          id: null,
          name: null,
          inn: null,
          kpp: null,
          address: null,
          bankAccount: null,
          directorName: null
        }
        this.$emit('cancel')
      },
      addPrincipal() {
        let someError = false
        let regExpInn = /^[0-9]{10,12}$/

        if(this.principalLocal.inn == null || this.principalLocal.inn == '') {
          this.info.push('Введите ИНН')
          someError = true
        } else {
          if(!regExpInn.test(this.principalLocal.inn)) {
            this.info.push('Введите корректный инн')
            someError = true
          }
        }

        if(this.principalLocal.name == null || this.principalLocal.name == '') {
          this.info.push('Введите краткое наименование организации')
          someError = true
        }

        if(this.principalLocal.address == null || this.principalLocal.address == '') {
          this.info.push('Введите юр адрес организации')
          someError = true
        }

        if(this.principalLocal.directorName == null || this.principalLocal.directorName == '') {
          this.info.push('Введите ФИО руководителя')
          someError = true
        }

        if(this.principalLocal.bankAccount == null || this.principalLocal.bankAccount == '') {
          this.info.push('Введите данные по банковскому счету')
          someError = true
        }

        if(someError) {
          this.haveError = true
          return
        } else {
          if(this.principalLocal.id == null) {
            RestService.postPrincipals(this.principalLocal).then((response) =>
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
            RestService.putPrincipals(this.principalLocal).then((response) =>
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