<template>
  <div>
    <v-dialog
      v-model='dialog'
        max-width="50vw"
        persistent
    >
      <v-card class='dialog_card'>
        <v-card-title class="text-h5">
          {{ title }}
        </v-card-title>

        <v-form
        >
          <v-text-field
              label='Наименование поставщика'
              required
              v-model='supplier.supplierName'
          ></v-text-field>
        </v-form>

        <v-card-actions>

          <v-btn
              @click='addSupplier'
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
  import EventBus from "@/common/EventBus"

  export default {
    props: ['dialog','title', 'supplier'],
    model: {
      prop: 'supplier',
      event: 'change'
    },
    computed: {
      supplierLocal: {
        get: function () {
          return this.supplier
        },
        set: function (value) {
          this.$emit('change', value)
        }
      },
    },
    methods: {
      cancelDialog() {
        this.supplierLocal = {id: null, supplierName: null}
        this.$emit('cancel')
      },
      addSupplier() {
        if (this.supplierLocal.supplierName != null && this.supplierLocal.supplierName != '') {

          if(this.supplierLocal.id == null) {
            RestService.postSuppliers(this.supplierLocal).then((response) =>
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
            RestService.putSuppliers(this.supplierLocal).then((response) =>
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
      }
    }
  }

</script>

<style>
.dialog_card {
  padding: 4% 10%;
}
</style>