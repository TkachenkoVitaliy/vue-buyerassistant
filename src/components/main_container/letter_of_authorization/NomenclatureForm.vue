<template>
  <v-autocomplete
      solo-inverted
      dense
      v-model='row.nomenclature'
      :items='nomenclatures'
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
          message='Удалить номенклатуру'
          v-bind:info=currentNomenclature.name
          v-bind:id=currentNomenclature.id
          v-bind:isActive='isDeleteDialogActive'
          @confirmAction='confirmDeleteNomenclature'
          @cancelAction='cancelDeleteNomenclature'
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
      <NomenclatureDialog
          v-bind:dialog='isNomenclatureDialogActive'
          v-bind:title='nomenclatureDialogTitle'
          v-model:nomenclature = 'currentNomenclature'
          v-bind:currentIndex = 'row.number'
          @save='confirmNomenclatureDialog($event)'
          @cancel='cancelNomenclatureDialog'
      />
    </template>
  </v-autocomplete>
</template>

<script>

import RestService from "@/services/rest.service";
import EventBus from "@/common/EventBus";
import NomenclatureDialog from "@/components/main_container/letter_of_authorization/NomenclatureDialog";
import DeleteDialog from "@/components/other/DeleteDialog";

export default {
  components: {
    NomenclatureDialog,
    DeleteDialog
  },
  props: ['row'],
  model: {
    prop: 'row',
    event: 'change'
  },
  data() {
    return {
      currentNomenclature: {id: null, name: null},
      nomenclatures: [],
      nomenclatureDialogTitle: null,
      isNomenclatureDialogActive: false,
      isDeleteDialogActive: false
    }
  },
  methods: {
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
    openEditDialog(nomenclature) {
      this.isNomenclatureDialogActive = true
      this.nomenclatureDialogTitle = 'Редактирование номенклатуры'
      this.currentNomenclature = nomenclature
    },
    openDeleteDialog(nomenclature) {
      this.currentNomenclature = nomenclature
      this.isDeleteDialogActive = true
      this.row.nomenclature = {id: null, name: null}
    },
    confirmDeleteNomenclature(id) {
      RestService.deleteNomenclatures(id).then((response) => {
            this.row.nomenclature = {id: null, name: null}
            this.getAllNomenclatures()
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
    cancelDeleteNomenclature() {
      this.isDeleteDialogActive = false
    },
    openCreateDialog() {
      this.currentNomenclature = {id: null, name: null}
      this.isNomenclatureDialogActive = true
      this.nomenclatureDialogTitle = 'Создание номенклатуры'
    },
    cancelNomenclatureDialog() {
      this.currentNomenclature = {id: null, name: null}
      this.getAllNomenclatures()
      this.isNomenclatureDialogActive = false
    },
    confirmNomenclatureDialog(nomenclature) {
      this.getAllNomenclatures()
      this.row.nomenclature = nomenclature
      this.isNomenclatureDialogActive = false
    },
    emitChangeNomenclature(nomenclature) {
      this.$emit('change:nomenclature', nomenclature)
    }
  },
  mounted() {
    this.getAllNomenclatures()
  }
}

</script>