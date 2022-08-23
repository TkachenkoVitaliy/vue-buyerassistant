<template>

  <div>
    <p class='subtitle_text'>Поставщик</p>

    <v-autocomplete
        clearable
        dense
        v-model='supplier'
        :items='suppliers'
        :item-text='item => item.supplierName'
        return-object
    >

      <template v-slot:item="{ item }">

        <v-list-item-content>
          <v-list-item-title v-text="item.supplierName"></v-list-item-title>
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
            message = 'Удалить поставщика'
            v-bind:info = currentSupplier.supplierName
            v-bind:id = currentSupplier.id
            v-bind:isActive = 'isDeleteDialogActive'
            @confirmAction = 'confirmDeleteSupplier'
            @cancelAction = 'cancelDeleteSupplier'
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
              style='font-size: 1em'
          >
            <v-icon
                left
                large
                color='green'
            >
              mdi-plus-circle
            </v-icon>
            Создать
          </v-btn>
        </div>

        <SupplierDialog
            v-bind:dialog='isSupplierDialogActive'
            v-bind:title='supplierDialogTitle'
            v-model:supplier='currentSupplier'
            @save='confirmSupplierDialog($event)'
            @cancel='cancelSupplierDialog'
        />

      </template>

    </v-autocomplete>
  </div>

</template>

<script>
import RestService from '@/services/rest.service'
import EventBus from '@/common/EventBus'
import DeleteDialog from '@/components/other/DeleteDialog'
import SupplierDialog from '@/components/main_container/letter_of_authorization/SupplierDialog'

export default {
  components: {
    DeleteDialog,
    SupplierDialog
  },
  data() {
    return {
      suppliers: null,
      currentSupplier: {id: null, name: null},
      supplier: {id: null, name: null},
      supplierDialogTitle: null,
      isSupplierDialogActive: false,
      isDeleteDialogActive: false
    }
  },
  methods: {
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
    openEditDialog(supplier) {
      this.isSupplierDialogActive = true
      this.currentSupplier = supplier
      this.supplierDialogTitle = 'Редактирование поставщика'
    },
    openDeleteDialog(supplier) {
      this.currentSupplier = supplier
      this.isDeleteDialogActive = true
      this.supplier = {id: null, name: null}
    },
    confirmDeleteSupplier(id) {
      RestService.deleteSuppliers(id).then((response) => {
        this.supplier = {id: null, name: null}
        this.getAllSuppliers()
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
    cancelDeleteSupplier() {
      this.isDeleteDialogActive = false
    },
    openCreateDialog() {
      this.currentSupplier = {id: null, name: null}
      this.isSupplierDialogActive = true
      this.supplierDialogTitle = 'Создание поставщика'
    },
    cancelSupplierDialog() {
      this.currentSupplier = {id: null, name: null}
      this.getAllSuppliers()
      this.isSupplierDialogActive = false
    },
    confirmSupplierDialog(supplier) {
      this.getAllSuppliers()
      this.supplier = supplier
      this.isSupplierDialogActive = false
    }
  },
  mounted() {
    this.getAllSuppliers()
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