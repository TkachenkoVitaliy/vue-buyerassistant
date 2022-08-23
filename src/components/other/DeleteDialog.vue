<template>
  <v-dialog
      v-model='isActive'
      max-width='400'
      :retain-focus="false"
  >
    <v-card>
      <v-card-title>
        {{message}}
      </v-card-title>

      <v-card-text>
        {{info}}
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>

        <v-btn
            @click='confirm'
            class='red--text'
        >
          УДАЛИТЬ
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
            @click='cancel'
        >
          ОТМЕНА
        </v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    props: ['message', 'info','id', 'isActive'],
    methods: {
      confirm() {
        this.$emit('confirmAction', this.id)
      },
      cancel() {
        console.log(this.info)
        console.log(this.id)
        this.$emit('cancelAction')
      }
    }
  }
</script>