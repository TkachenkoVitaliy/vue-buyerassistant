<template>
  <div class='send_mail_container'>
    <div>
      <p>ОТПРАВКА ПОЧТЫ</p>
      <v-btn v-on:click='sendToAll' class='send_to_all_btn'>ОТПРАВИТЬ ВСЕМ</v-btn>
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
        isSending: false
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
    display: block;
    margin: 0px auto;
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