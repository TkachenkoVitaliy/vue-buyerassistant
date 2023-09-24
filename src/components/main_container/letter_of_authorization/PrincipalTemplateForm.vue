<template>
      <div class='form_container principal_template_row'>
        <div class="wmc">{{ principal.name }}</div>
        <div class="wmc">{{ principal.inn }}</div>
        <div class="wmc">
          <v-file-input
              ref='template'
              v-on:change='onFileSelected'
              v-model='selectedFile'
              accept='.xls'
              required
              truncate-length='25'
              placeholder='Шаблон доверенности'
          ></v-file-input>
        </div>
        <div class="wmc">
          <v-btn v-on:click='onUpload' class='vue_button'>
            Загрузить
          </v-btn>
        </div>
      </div>
</template>

<script>
import RestService from '@/services/rest.service'
import EventBus from '@/common/EventBus'
import DeleteDialog from '@/components/other/DeleteDialog'
import PrincipalDialog from '@/components/main_container/letter_of_authorization/PrincipalDialog'
import store from "@/store";

export default {
  components: {
  },
  computed: {

  },
  props: ['principal'],
  data() {
    return {
      principals: null,
      selectedFile : null,
      isLoading: false,
    }
  },
  methods: {
    onFileSelected(file) {
      this.selectedFile = file
    },
    onUpload() {
      if(this.selectedFile) {
        this.isLoading = true
        const formData = new FormData()
        formData.append('template', this.selectedFile, this.selectedFile.name)
        RestService.postUploadTemplate(formData, this.principal.inn)
            .then(
                () => {
                  this.isLoading = false;
                  this.selectedFile = null;
                },
                error => {
                  console.error(error)
                  this.isLoading = false;
                  this.selectedFile = null;
                }
            ).catch((e) => {
          console.error(e);
          this.isLoading = false;
          this.selectedFile = null;
        })
      }
    }
  },
  mounted() {
    this.getAllPrincipals()
  }
}
</script>

<style>
.wmc {
  width: max-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.principal_template_row {
  display: grid;
  gap: 20px;
  grid-template-columns:  1fr 1fr 1fr 1fr;
}
.accept_and_shipment_container{
  display: flex;
  justify-content: space-around;
}
.forms_container{
  width: 50%;
}
.rows_container{
  margin-left: 100px;
  width: 50%;
}
</style>
