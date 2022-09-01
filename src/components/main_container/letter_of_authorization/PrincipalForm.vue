<template>
  <div>
    <p class='subtitle_text'>Доверитель</p>

    <v-autocomplete
        clearable
        dense
        @input="emitChangePrincipal($event)"
        v-model="principal"
        :items='principals'
        :item-text='item => item.name'
        return-object
    >
      <template v-slot:item="{ item }">

        <v-list-item-content>
          <v-list-item-title v-text="item.name"></v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn
              fab
              x-small
              dark
              color='primary'
              @click="openEditDialog(item)"
          >
            <v-icon
                x-small
                dark
            >
              mdi-pencil
            </v-icon>
          </v-btn>
        </v-list-item-action>
        <v-list-item-action>
          <v-btn
              style='margin-left: 15px'
              fab
              x-small
              dark
              color='red'
              @click="openDeleteDialog(item)"
          >
            <v-icon
                x-small
                dark
            >
              mdi-delete
            </v-icon>
          </v-btn>
        </v-list-item-action>

        <DeleteDialog
            message = 'Удалить доверителя'
            v-bind:info = currentPrincipal.name
            v-bind:id = currentPrincipal.id
            v-bind:isActive = 'isDeleteDialogActive'
            @confirmAction = 'confirmDeletePrincipal'
            @cancelAction = 'cancelDeletePrincipal'
            ref='deleteDialog'
        />

      </template>

      <template v-slot:append-item>
        <div style="padding-left: 0px; max-height: 2rem">
          <v-btn
              @click='openCreateDialog'
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

        <PrincipalDialog
            v-bind:dialog='isPrincipalDialogActive'
            v-bind:title='principalDialogTitle'
            v-model:supplier='currentPrincipal'
            @save='confirmPrincipalDialog($event)'
            @cancel='cancelPrincipalDialog'
        />
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
  import RestService from '@/services/rest.service'
  import EventBus from '@/common/EventBus'
  import DeleteDialog from '@/components/other/DeleteDialog'
  import PrincipalDialog from '@/components/main_container/letter_of_authorization/PrincipalDialog'

  export default {
    components: {
      DeleteDialog,
      PrincipalDialog
    },
    props: ['principal'],
    data() {
      return {
        principals: null,
        currentPrincipal: {
          id: null,
          name: null,
          inn: null,
          kpp: null,
          address: null,
          bankAccount: null,
          directorName: null,
          okpo: null
        },
        principalDialogTitle: null,
        isPrincipalDialogActive: false,
        isDeleteDialogActive: false
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
      openEditDialog(principal) {
        this.isPrincipalDialogActive = true
        this.currentPrincipal = principal
        this.principalDialogTitle = 'Редактирование доверителя'
      },
      openDeleteDialog(principal) {
        this.currentPrincipal = principal
        this.isDeleteDialogActive = true
        this.principal = {
          id: null,
          name: null,
          inn: null,
          kpp: null,
          address: null,
          bankAccount: null,
          directorName: null,
          okpo: null
        }
      },
      confirmDeletePrincipal(id) {
        RestService.deletePrincipals(id).then((response) => {
              this.principal = {id: null, name: null, inn: null, kpp: null, address: null, bankAccount: null,
                directorName: null, okpo: null}
              this.getAllPrincipals()
              this.$nextTick(() => this.isDeleteDialogActive = false)
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
      },
      cancelDeletePrincipal() {
        this.isDeleteDialogActive = false
      },
      openCreateDialog() {
        this.currentPrincipal = {id: null, name: null, inn: null, kpp: null, address: null, bankAccount: null,
          directorName: null, okpo: null}
        this.isPrincipalDialogActive = true
        this.principalDialogTitle = 'Создание доверителя'
      },
      cancelPrincipalDialog() {
        this.currentPrincipal = {id: null, name: null, inn: null, kpp: null, address: null, bankAccount: null,
          directorName: null, okpo: null}
        this.getAllPrincipals()
        this.isPrincipalDialogActive = false
      },
      confirmPrincipalDialog(principal) {
        this.getAllPrincipals()
        this.principal = principal
        this.isPrincipalDialogActive = false
      },
      emitChangePrincipal(principal) {
          this.$emit('change:principal', principal)
      }
    },
    mounted() {
      this.getAllPrincipals()
    }
  }
</script>

<style>
  .subtitle_text {
    font-size: 1.2rem;
    font-weight: bold;
    color: #00689a;
  }
</style>