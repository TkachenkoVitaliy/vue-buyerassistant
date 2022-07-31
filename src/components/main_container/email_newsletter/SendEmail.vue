<template>
  <div class='send_mail_container'>
    <div>
      <p>ОТПРАВКА ПОЧТЫ</p>
      <v-btn v-on:click='sendToAll'>ОТПРАВИТЬ ВСЕМ</v-btn>
    </div>
  </div>
</template>

<script>
  import axios from "axios"

  export default {
    data() {
      return {
        completedRecipients: []
      }
    },
    methods: {
      sendToAll() {
        axios.get('http://localhost:8081/sendAllFiles').then((response) => {
          this.completedRecipients = response.data
        }).catch(() => {
          alert('При отправке произошла ошибка')
        })
      }
    }
  }

</script>

<style>
  p {
    text-align: center;
  }

</style>