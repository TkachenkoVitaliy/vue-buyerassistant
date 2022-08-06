<template>
  <div class='send_mail_container'>
    <div>
      <p>ОТПРАВКА ПОЧТЫ</p>
      <v-btn v-on:click='sendFiles' class='send_to_all_btn primary'>ОТПРАВИТЬ РАССЫЛКУ</v-btn>
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
        <p
            v-for='completedRecipient in completedRecipients'
            v-bind:key='completedRecipient'
        >
          {{ completedRecipient }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios"

  export default {
    props: {
      recipients: Array
    },
    data() {
      return {
        completedRecipients: [],
        branches: [],
        selectedBranches: [],
        isSending: false,
        isChoosingBranches: false
      }
    },
    methods: {
      sendFiles() {
        if(!this.isChoosingBranches) {
          this.isSending = true
          axios.get('http://localhost:8081/api/sendFiles').then((response) => {
            this.isSending = false
            this.completedRecipients = response.data
          }).catch(() => {
            alert('При отправке произошла ошибка')
          })
        } else {
          this.isSending = true
          this.isChoosingBranches = false
          axios({
            url: 'http://localhost:8081/api/sendFiles',
            method: 'post',
            data: this.selectedBranches
          }).then((response) => {
            this.selectedBranches = []
            this.isSending = false
            this.completedRecipients = response.data
          }).catch(() => {
            alert('При отправке произошла ошибка')
          })
        }
      },
      activateChoosing() {
        this.selectedBranches = []
        this.isChoosingBranches = !this.isChoosingBranches
        console.log(this.selectedBranches)
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

</style>