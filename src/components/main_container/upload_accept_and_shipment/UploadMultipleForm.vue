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
  import RestService from '@/services/rest.service'
  import EventBus from "@/common/EventBus";
  import store from "@/store";

  export default {
    computed: {
      isLoading: {
        get: function () {return store.getters["factory_files/multipleLoading"]},
        set: function (value) {store.commit('factory_files/setMultipleLoading', value)}
      }
    },
    data() {
      return {
        selectedFileOtherFactory: null,
        selectedFileOracleMmk: null,
        selectedFileDependMmk: null,
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
          store.dispatch('factory_files/uploadMultipleFiles', formData).then(
              () => {
                if(this.$refs.fileUpload) this.$refs.fileUpload.reset()
                this.selectedFileOtherFactory = null
                this.selectedFileOracleMmk = null
                this.selectedFileDependMmk = null
                this.$emit('updateSummaryData')
              },
              error => {
                if(this.$refs.fileUpload) this.$refs.fileUpload.reset()
                this.selectedFileOtherFactory = null
                this.selectedFileOracleMmk = null
                this.selectedFileDependMmk = null
                this.$emit('updateSummaryData')
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
                if(this.$refs.fileUpload) this.$refs.fileUpload.reset()
                this.selectedFileOtherFactory = null
                this.selectedFileOracleMmk = null
                this.selectedFileDependMmk = null
                this.$emit('updateSummaryData')
              }
          )


          // const formData = new FormData()
          // formData.append('otherFactories', this.selectedFileOtherFactory, this.selectedFileOtherFactory.name)
          // formData.append('oracleMmk', this.selectedFileOracleMmk, this.selectedFileOracleMmk.name)
          // formData.append('dependenciesMmk', this.selectedFileDependMmk, this.selectedFileDependMmk.name)
          // RestService.postUploadMultipleFiles(formData)
          //     .then(
          //         () => {
          //           this.$refs.fileUpload.reset()
          //           this.selectedFileOtherFactory = null
          //           this.selectedFileOracleMmk = null
          //           this.selectedFileDependMmk = null
          //           this.isLoading = false
          //           this.message = 'Файлы были успешно загружены'
          //           this.hasError = false
          //           this.$emit('updateSummaryData')
          //         },
          //         error => {
          //           this.$refs.fileUpload.reset()
          //           this.selectedFileOtherFactory = null
          //           this.selectedFileOracleMmk = null
          //           this.selectedFileDependMmk = null
          //           this.isLoading = false
          //           this.message = 'При загрузке файлов произошла ошибка'
          //           this.hasError = true
          //           this.$emit('updateSummaryData')
          //           this.content =
          //               (error.response && error.response.data && error.response.data.message) ||
          //               error.message ||
          //               error.toString();
          //           if (error.response && error.response.status === 403) {
          //             EventBus.dispatch("logout");
          //           }
          //         }
          //     )
          //     .catch(
          //         () => {
          //         this.$refs.fileUpload.reset()
          //         this.selectedFileOtherFactory = null
          //         this.selectedFileOracleMmk = null
          //         this.selectedFileDependMmk = null
          //         this.isLoading = false
          //         this.message = 'При загрузке файлов произошла ошибка'
          //         this.hasError = true
          //         this.$emit('updateSummaryData')
          //         }
          //     )
        }
      }
    },
    mounted() {
      this.$emit('updateSummaryData')
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