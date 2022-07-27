<template>
  <div class="form_container">
    <v-file-input
        ref="fileUpload"
        v-on:change='onFileSelected'
        v-model='selectedFile'
        accept='.xls'
        required
        truncate-length="25"
        placeholder='Акцепт ММК'
    ></v-file-input>
    <v-btn v-on:click="onUpload " class="vue_button">
      Загрузить
    </v-btn>
  </div>
</template>


<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        selectedFile : null
      }
    },
    methods: {
      onFileSelected(file) {
        this.selectedFile = file
      },
      onUpload() {
        if(this.selectedFile) {
          const formData = new FormData()
          formData.append('mmkAccept', this.selectedFile, 'mmkAccept.xls')
          axios.post('http://localhost:8081/uploadAccept', formData)
              .then(() => {
                this.$refs.fileUpload.reset()
                this.selectedFile = null
              })
        }
      }
    }
  }
</script>


<style>
  .form_container {
    display: flex;
    width: 40%;
  }
  .vue_button {
    margin-top: 15px;
    margin-left: 10px;
  }

</style>