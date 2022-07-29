<template>
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
    <v-btn v-on:click="onUpload " class='vue_button' v-if='!isLoading'>
      Загрузить
    </v-btn>
    <img src='../../../assets/loading.gif' class='loading-image' v-if='isLoading'>
  </div>
</template>


<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        selectedFile : null,
        isLoading : false,
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
          formData.append('mmkAccept', this.selectedFile, this.selectedFile.name)
          axios.post('http://localhost:8081/uploadAccept', formData)
              .then(() => {
                this.$refs.fileUpload.reset()
                this.selectedFile = null
                this.isLoading = false
              }).catch(() => {
                alert('При отправке файла произошла ошибка')
                this.$refs.fileUpload.reset()
                this.selectedFile = null
                this.isLoading = false
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

</style>