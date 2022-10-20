<template>
  <div class='send_mail_container'>
    <div>
      <h3>ОТПРАВКА ПОЧТЫ</h3>
      <v-btn v-on:click='sendFiles' class='send_to_all_btn primary'>ОТПРАВИТЬ РАССЫЛКУ</v-btn>
      <v-btn v-on:click='downloadFiles' class='send_to_all_btn' style="color: #1976d2; font-weight: bold">СКАЧАТЬ ФАЙЛЫ</v-btn>
      <v-btn v-on:click='activateChoosing' class='choose_branches_btn'>{{ isChoosingBranches ? '&#9650; ОТМЕНА &#9650;' : '&#9660; ВЫБРАТЬ ФИЛИАЛЫ &#9660;'}}</v-btn>
      <div v-if='isChoosingBranches' class='checkbox_branch_container'>
        <v-checkbox
            dense
            v-for='branch in branches'
            v-bind:key='branch'
            v-model='selectedBranches'
            :label='branch'
            :value='branch'
            class='checkbox_branch'
        ></v-checkbox>
        <div class='checkbox_btns_container'>
          <v-btn v-on:click='setAllChecked'>
            <img src='../../../assets/checkbox-markedz.png'>
            ВСЕ
          </v-btn>
          <v-btn v-on:click='setAllUnchecked'>
            <img src='../../../assets/checkbox-blankz.png'>
            НЕТ
          </v-btn>
        </div>
      </div>

      <div class='send_response_container'>
        <img src='../../../assets/send-emails.gif' v-if='isSending'>
        <h4 v-if='completedRecipients.length > 0' style='margin-bottom: 15px'>Последние отправленные сообщения</h4>
        <p
            v-for='completedRecipient in completedRecipients'
            v-bind:key='completedRecipient'
            style='margin-bottom: 5px'
        >
          {{ completedRecipient }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import RestService from "@/services/rest.service";
  import EventBus from "@/common/EventBus";

  export default {
    computed: {
      isSending: {
        get: function () {return store.getters["email/emailSending"]},
        set: function (value) {store.commit('email/setEmailSending', value)}
      },
      completedRecipients: {
        get: function () {return store.getters["email/completedRecipients"]},
        set: function (value) {store.commit('email/setCompletedRecipients', value)}
      }
    },
    props: {
      recipients: Array
    },
    data() {
      return {
        branches: [],
        selectedBranches: [],
        isChoosingBranches: false
      }
    },
    methods: {
      sendFiles() {
        if(!this.isChoosingBranches) {
          store.dispatch('email/sendAllEmails').then(
              (result) => {
                store.commit('status_message/setDetailInfo', store.getters["email/completedRecipients"])
                store.commit('status_message/setActive', true)
                store.commit('status_message/setHaveError', false)
                store.commit('status_message/setMessage', 'Рассылка была успешно отправлена')
              }, error => {
                store.commit('status_message/setDetailInfo', store.getters["email/completedRecipients"])
                store.commit('status_message/setActive', true)
                store.commit('status_message/setHaveError', true)
                store.commit('status_message/setMessage', 'При рассылке произошла ошибка')
              }
          )
        } else {
          this.isChoosingBranches = false
          store.dispatch('email/sendCheckedEmails', this.selectedBranches).then(
              (result) => {
                store.commit('status_message/setDetailInfo', store.getters["email/completedRecipients"])
                store.commit('status_message/setActive', true)
                store.commit('status_message/setHaveError', false)
                store.commit('status_message/setMessage', 'Рассылка была успешно отправлена')
              }, error => {
                store.commit('status_message/setDetailInfo', store.getters["email/completedRecipients"])
                store.commit('status_message/setActive', true)
                store.commit('status_message/setHaveError', true)
                store.commit('status_message/setMessage', 'При рассылке произошла ошибка')
              }
          )
        }
      },
      downloadFiles() {
        if(!this.isChoosingBranches) {
          RestService.downloadFiles().then(
              (response) => {
                let blob = new Blob([response.data], {type: 'application/zip'})
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              },
              error => {
                this.content =
                    (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    error.toString();
                if (error.response && error.response.status === 403) {
                  EventBus.dispatch("logout");
                }
              }
          )
        } else {
          this.isChoosingBranches = false
          //TODO add for download check files
          RestService.postDownloadFiles().then(
              (response) => {
                let blob = new Blob([response.data], {type: 'application/zip'})
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              },
              error => {
                this.content =
                    (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    error.toString();
                if (error.response && error.response.status === 403) {
                  EventBus.dispatch("logout");
                }
              }
          )
        }
      },
      activateChoosing() {
        this.selectedBranches = []
        this.isChoosingBranches = !this.isChoosingBranches
      },
      mountBranches() {
        let array = this.recipients.map(recipient => recipient.branchName)
        let uniqueArray = [...new Set(array)]
        this.branches = uniqueArray
      },
      setAllChecked() {
        this.selectedBranches = this.branches
      },
      setAllUnchecked() {
        this.selectedBranches = []
      }
    },
    beforeMount() {
      this.mountBranches()
    },
    mounted() {
      this.mountBranches()
    },
    beforeUpdate() {
      this.mountBranches()
    }
  }

</script>

<style>
  .send_mail_container{
    min-width: 350px;
    justify-content: center;
  }

  .send_to_all_btn{
    min-width: 240px !important;
    display: block;
    margin: 10px auto;
  }

  .choose_branches_btn{
    min-width: 240px !important;
    display: block;
    margin: 10px auto;
  }

  .checkbox_branch_container {
    padding-left: 55px;
    padding-right: 55px;
    display: block;
    justify-content: center;
  }

  .checkbox_branch {
    margin: 0px 0px !important;
    padding: 0px 0px !important;
    border: 1px solid gray;
    max-width: 240px;
  }

  .checkbox_btns_container {
    display: flex;
    justify-content: space-between;
  }

  .send_response_container {
    padding-top: 20px;
    padding-bottom: 20px;
    text-align: center;
    justify-content: center;
  }

  .v-messages {
    visibility: hidden !important;
    min-height: 0px !important;
  }

  p {
    text-align: center;
  }

  h3 {
    text-align: center;
  }

</style>