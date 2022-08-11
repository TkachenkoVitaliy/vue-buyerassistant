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
  import RestService from '@/services/rest.service'
  import EventBus from "@/common/EventBus";

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
        RestService.getBranches().then(
            (response) => {
              this.branches = response.data
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
      },
      getRecipients() {
        RestService.getRecipients().then(
            (response) => {
              this.recipients = response.data
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