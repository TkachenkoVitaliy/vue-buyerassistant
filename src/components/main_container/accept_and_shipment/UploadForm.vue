<template>
  <div class="form_container">
<!--    <input type="file" v-on:change="onFileSelected" accept=".xls" required>-->
    <v-file-input v-on:change='onFileSelected' accept = '.xls' required placeholder="Акцепт ММК"/>
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
      onFileSelected(event) {
        this.selectedFile = event.target.files[0]
      },
      onUpload() {
        const formData = new FormData()
        formData.append('mmkAccept', this.selectedFile, 'mmkAccept.xls')
        axios.post('http://localhost:8080/uploadAccept', formData)
            .then(response => {
              console.log(response)
              console.log('complete')
            })
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