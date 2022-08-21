<template>
  <div>
    <div style="padding-left: 0px; max-height: 2rem">
      <v-btn
          @click='toggleNomenclatureDialog'
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
          v-model='isNomenclatureDialog'
          max-width="50vw"
      >
        <v-card class='dialog_card'>
          <v-card-title class="text-h5">
            Добавить номенклатуру
          </v-card-title>

          <v-form
          >
            <v-text-field
                label='Введите номенклатуру'
                required
                v-model='createdNomenclature.name'
            ></v-text-field>
          </v-form>

          <v-card-actions>

            <v-btn
                @click='addNomenclature'
            >
              Добавить
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn
                @click='toggleNomenclatureDialog'
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
  import EventBus from "@/common/EventBus"

  export default {
    props: ['currentindex'],
    data() {
      return {
        isNomenclatureDialog: false,
        createdNomenclature: {id: null, name: null}
      }
    },
    methods: {
      toggleNomenclatureDialog() {
        this.createdNomenclature = {id: null, name: null}
        this.isNomenclatureDialog = !this.isNomenclatureDialog
      },
      addNomenclature() {
        if (this.createdNomenclature.name != null && this.createdNomenclature.name != '') {

          RestService.postNomenclatures(this.createdNomenclature).then((response) =>
              {
                let result = {
                  nomenclature: response.data,
                  index: this.currentindex
                }
                this.$emit('added', result)
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
          this.toggleNomenclatureDialog()
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