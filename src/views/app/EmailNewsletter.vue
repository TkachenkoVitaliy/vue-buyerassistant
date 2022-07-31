<template>
  <div class='email_newsletter_container'>
    <SendEmail />
    <RecipientList v-bind:branches='branches'/>
  </div>
</template>

<script>
  import RecipientList from '@/components/main_container/email_newsletter/RecipientList'
  import SendEmail from '@/components/main_container/email_newsletter/SendEmail'
  import axios from "axios";

  export default {
    components: {
      RecipientList,
      SendEmail
    },
    data() {
      return {
        branches: [],
        recipients: []
      }
    },
    methods: {
      getBranches() {
        axios.get('http://localhost:8081/branches').then((response) => {
          this.branches = response.data
        }).catch(() => {
          alert('При загрузке списка филиалов произошла ошибка')
        })
      },
      getRecipients() {
        axios.get('http://localhost:8081/recipients').then((response) => {
          this.recipients = response.data
        }).catch(() => {
          alert('При загрузке адресатов рассылки произошла ошибка')
        })
      }
    },
    mounted() {
      this.getBranches()
    }
  }
</script>

<style>
  .email_newsletter_container{
    display: flex;
    justify-content: space-around;
  }

</style>