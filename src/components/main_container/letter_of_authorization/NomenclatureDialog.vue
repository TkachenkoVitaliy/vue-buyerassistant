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

        <v-form
        >
          <v-text-field
              label='Введите номенклатуру'
              required
              v-model='nomenclature.name'
          ></v-text-field>
        </v-form>

        <v-card-actions>

          <v-btn
              @click='addNomenclature'
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
  props: ['dialog', 'title', 'nomenclature', 'currentIndex'],
  model: {
    prop: 'nomenclature',
    event: 'change'
  },
  computed: {
    nomenclatureLocal: {
      get: function () {
        return this.nomenclature
      },
      set: function (value) {
        this.$emit('change', value)
      }
    }
  },
  methods: {
    cancelDialog() {
      this.nomenclatureLocal = {id: null, name: null}
      this.$emit('cancel')
    },
    addNomenclature() {
      if (this.nomenclatureLocal.name != null && this.nomenclatureLocal.name != '') {

        if (this.nomenclatureLocal.id == null) {
          RestService.postNomenclatures(this.nomenclatureLocal).then((response) => {
                let result = {
                  nomenclature: response.data,
                  index: this.currentIndex
                }
                this.$emit('save', result)
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
          RestService.putNomenclatures(this.nomenclatureLocal).then((response) => {
                let result = {
                  nomenclature: response.data,
                  index: this.currentIndex
                }
                this.$emit('save', result)
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