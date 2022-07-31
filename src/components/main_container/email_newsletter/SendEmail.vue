<template>
  <div class='send_mail_container'>
    <div>
      <p>ОТПРАВКА ПОЧТЫ</p>
      <v-btn v-on:click='sendToAll' class='send_to_all_btn primary'>ОТПРАВИТЬ РАССЫЛКУ</v-btn>
      <v-btn v-on:click='activateChoosing' class='choose_branches_btn'>ВЫБРАТЬ ФИЛИАЛЫ</v-btn>
      <div v-if='isChoosingBranches'>
        <v-container>
          <v-checkbox
              v-for='branch in branches'
          ></v-checkbox>
        </v-container>
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
    data() {
      return {
        completedRecipients: [],
        isSending: false,
        isChoosingBranches: false
      }
    },
    methods: {
      sendToAll() {
        this.isSending = true
        axios.get('http://localhost:8081/sendAllFiles').then((response) => {
          this.isSending = false
          this.completedRecipients = response.data
        }).catch(() => {
          alert('При отправке произошла ошибка')
        })
      },
      activateChoosing() {
        this.isChoosingBranches = true
      }
    }
  }

</script>

<style>
  .send_mail_container{
    min-width: 350px;
    justify-content: center;
  }

  .send_to_all_btn{
    min-width: 230px !important;
    display: block;
    margin: 10px auto;
  }

  .choose_branches_btn{
    min-width: 230px !important;
    display: block;
    margin: 10px auto;
  }

  .send_response_container{
    padding-top: 20px;
    padding-bottom: 20px;
    text-align: center;
    justify-content: center;
  }

  p {
    text-align: center;
  }

</style>