<template>
  <div>
    <v-dialog
        v-model='active'
        max-width='400'
        :retain-focus="false"
    >
      <v-card>
        <v-card-title
            v-bind:class='[haveError ? errorClass : okClass, defaultStyle]'
        >
          {{message}}
        </v-card-title>

        <v-divider></v-divider>

        <v-card-actions>

          <v-btn
              @click='confirm'
              color=primary
          >
            ОК
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import store from '@/store'

  export default {
    computed: {
      haveError: {
        get: function () {return store.getters["status_message/haveError"]},
        set: function (value) {store.commit('status_message/setHaveError', value)}
      },
      message: {
        get: function () {return store.getters["status_message/message"]},
        set: function (value) {store.commit('status_message/setMessage', value)}
      },
      active: {
        get: function () {return store.getters["status_message/active"]},
        set: function (value) {store.commit('status_message/setActive', value)}
      },
    },
    data() {
      return {
        errorClass: 'errorClass',
        okClass: 'okClass',
        defaultStyle: 'defaultStyle'
      }
    },
    methods: {
      confirm() {
        store.commit('status_message/setActive', false)
      }
    }
  }
</script>

<style scoped>
  .defaultStyle{
    min-height: 29px;
    margin-top: 15px;
    margin-left: 10px;
    font-size: larger;
  }

  .errorClass {
    color: red;
  }

  .okClass {
    color: green;
  }
</style>