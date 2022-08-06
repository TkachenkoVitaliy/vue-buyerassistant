<template>
  <div>
    <div class='form_container'>
      <v-file-input
          ref='fileUpload'
          v-on:change='onFileSelected'
          v-model='selectedFile'
          accept='.xls'
          required
          truncate-length='25'
          placeholder='Акцепт ММК'
      ></v-file-input>
      <v-btn v-on:click='onUpload' class='vue_button' v-if='!isLoading'>
        Загрузить
      </v-btn>
      <img src='../../../assets/loading.gif' class='loading-image' v-if='isLoading'>
    </div>
    <StatusMessage
        v-bind:has_error='hasError'
        v-bind:message='message'
    />
<!--    <p v-bind:class='[hasError ? errorClass : okClass, upload_accept_status]'>{{ status }}</p>-->
  </div>
</template>


<script>
  import RestService from '@/services/rest.service'
  import StatusMessage from '@/components/other/StatusMessage'

  export default {
    data() {
      return {
        selectedFile : null,
        isLoading : false,
        status: '',
        hasError: false,
        message: ''
      }
    },
    components: {StatusMessage},
    methods: {
      onFileSelected(file) {
        this.selectedFile = file
      },
      onUpload() {
        if(this.selectedFile) {
          this.isLoading = true
          const formData = new FormData()
          formData.append('mmkAccept', this.selectedFile, this.selectedFile.name)
          RestService.postUploadAccept(formData)
              .then(() => {
                this.$refs.fileUpload.reset()
                this.selectedFile = null
                this.isLoading = false
                this.hasError = false
                this.message = 'Акцепт успешно загружен'
                // this.status = 'Акцепт успешно загружен'
              }).catch(() => {
                this.$refs.fileUpload.reset()
                this.selectedFile = null
                this.isLoading = false
                this.hasError = true
                this.message = 'При загрузке акцепта произошла ошибка'
                // this.status = 'Произошла ошибка'
          })
        }
      }
    }
  }
</script>


<style>
  .form_container {
    display: flex;
    width: 100%;
  }

  .vue_button {
    margin-top: 15px;
    margin-left: 10px;
  }

  /*.upload_accept_status{
    min-height: 29px;
    margin-top: 15px;
    margin-left: 10px;
    font-size: larger;
  }

  .errorClass {
    color: red;
  }

  .okClass {
    color: green;
  }*/

</style>