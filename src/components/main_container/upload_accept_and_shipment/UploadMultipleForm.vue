<template>
  <div class='multiple_form_container'>
    <v-file-input
        ref='fileUpload'
        v-on:change='onFileSelectedOtherFactory'
        v-model='selectedFileOtherFactory'
        accept='.xlsx'
        required
        truncate-length='25'
        placeholder='Прочие заводы'
    ></v-file-input>
    <v-file-input
        ref='fileUpload'
        v-on:change='onFileSelectedOracleMmk'
        v-model='selectedFileOracleMmk'
        accept='.xlsx'
        required
        truncate-length='25'
        placeholder='Оракл ММК'
    ></v-file-input>
    <v-file-input
        ref='fileUpload'
        v-on:change='onFileSelectedDependMmk'
        v-model='selectedFileDependMmk'
        accept='.xlsx'
        required
        truncate-length='25'
        placeholder='Зависимости ММК'
    ></v-file-input>
    <v-btn v-on:click='onUpload' class='vue_button' v-if='!isLoading'>
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
        selectedFileOtherFactory : null,
        selectedFileOracleMmk : null,
        selectedFileDependMmk : null,
        isLoading : false,
      }
    },
    methods: {
      onFileSelectedOtherFactory(file) {
        this.selectedFileOtherFactory = file
      },
      onFileSelectedOracleMmk(file) {
        this.selectedFileOracleMmk = file
      },
      onFileSelectedDependMmk(file) {
        this.selectedFileDependMmk = file
      },
      onUpload() {
        if(this.selectedFileOtherFactory && this.selectedFileOracleMmk && this.selectedFileDependMmk) {
          this.isLoading = true
          const formData = new FormData()
          formData.append('otherFactories', this.selectedFileOtherFactory, this.selectedFileOtherFactory.name)
          formData.append('oracleMmk', this.selectedFileOracleMmk, this.selectedFileOracleMmk.name)
          formData.append('dependenciesMmk', this.selectedFileDependMmk, this.selectedFileDependMmk.name)
          axios.post('http://localhost:8081/uploadMultipleFiles', formData)
              .then(() => {
                this.$refs.fileUpload.reset()
                this.selectedFileOtherFactory = null
                this.selectedFileOracleMmk = null
                this.selectedFileDependMmk = null
                this.isLoading = false
                this.$emit('updateSummaryData')
              }).catch(() => {
            alert('При отправке файлов произошла ошибка')
            this.$refs.fileUpload.reset()
            this.selectedFileOtherFactory = null
            this.selectedFileOracleMmk = null
            this.selectedFileDependMmk = null
            this.isLoading = false
          })
        }
      }
    }
  }
</script>


<style>
  .multiple_form_container {
    margin-top: 60px;
    width: 100%;
  }

  .vue_button {
    margin-top: 15px;
    margin-left: 10px;
  }

  .loading-image {
    margin-top: 10px;
    margin-left: 30px;
    height: 50px;
    width: 50px;
  }
</style>