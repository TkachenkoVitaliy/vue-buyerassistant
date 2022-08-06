<template>
  <div class='email_newsletter_container'>
    <SendEmail
        v-bind:recipients='recipients'
    />
    <RecipientList
        v-bind:branches='branches'
        v-bind:recipients='recipients'
        v-on:requestRecipients='getRecipients'
    />
  </div>
</template>

<script>
  import RecipientList from '@/components/main_container/email_newsletter/RecipientList'
  import SendEmail from '@/components/main_container/email_newsletter/SendEmail'
  import axios from "axios"
  import RestService from '@/services/rest.service'

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
        RestService.getBranches().then((response) => {
          this.branches = response.data
        }).catch(() => {
          alert('При загрузке списка филиалов произошла ошибка')
        })
      },
      getRecipients() {
        RestService.getRecipients().then((response) => {
          this.recipients = response.data
        }).catch(() => {
          alert('При загрузке адресатов рассылки произошла ошибка')
        })
      }
    },
    mounted() {
      this.getBranches()
      this.getRecipients()
    }
  }
</script>

<style>
  .email_newsletter_container{
    display: flex;
    justify-content: space-around;
  }

</style>