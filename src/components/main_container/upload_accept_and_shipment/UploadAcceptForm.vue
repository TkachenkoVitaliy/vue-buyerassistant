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
  </div>
</template>


<script>
  import EventBus from "@/common/EventBus";
  import store from "@/store";

  export default {
    computed: {
      isLoading: {
        get: function () {return store.getters["factory_files/acceptLoading"]},
        set: function (value) {store.commit('factory_files/setAcceptLoading', value)}
      }
    },
    data() {
      return {
        selectedFile : null,
      }
    },
    methods: {
      onFileSelected(file) {
        this.selectedFile = file
      },
      onUpload() {
        if(this.selectedFile) {
          this.isLoading = true
          store.dispatch('factory_files/uploadAccept', this.selectedFile).then(
              () => {
                if(this.$refs.fileUpload) this.$refs.fileUpload.reset()
                this.selectedFile = null
              },
              error => {
                if(this.$refs.fileUpload) this.$refs.fileUpload.reset()
                this.selectedFile = null
                this.content =
                    (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    error.toString();
                if (error.response && error.response.status === 403) {
                  EventBus.dispatch("logout");
                }
              }
          ).catch(
              () => {
                if (this.$refs.fileUpload) this.$refs.fileUpload.reset()
                this.selectedFile = null
              }
          )
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