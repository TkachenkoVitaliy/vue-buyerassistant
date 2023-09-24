<template>
  <div class='accept_and_shipment_container'>
    <div class='forms_container' v-if='!isLoading'>
      <PrincipalTemplateForm v-for = "principal in principals" v-bind:principal = "principal" v-bind:key = "principal.id" class='form_container principal_template_row'>
      </PrincipalTemplateForm>
    </div>
    <img src='../../assets/loading.gif' class='loading-image' v-if='isLoading'>
  </div>
</template>

<script>
import RestService from '@/services/rest.service'
import EventBus from '@/common/EventBus'
import PrincipalTemplateForm from '@/components/main_container/letter_of_authorization/PrincipalTemplateForm'

export default {
  components: {
    PrincipalTemplateForm,
  },
  computed: {

  },
  data() {
    return {
      principals: null,
      selectedFile : null,
      isLoading: false,
    }
  },
  methods: {
    getAllPrincipals() {
      this.isLoading = true;
      RestService.getPrincipals().then((response) => {
            this.principals = response.data
            this.isLoading = false;
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
    onFileSelected(file) {
      this.selectedFile = file
    },
    onUpload() {
      if(this.selectedFile) {
        this.isLoading = true
        const formData = new FormData()
        formData.append('template', this.selectedFile, this.selectedFile.name)
        RestService.postUploadTemplate(formData)
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
