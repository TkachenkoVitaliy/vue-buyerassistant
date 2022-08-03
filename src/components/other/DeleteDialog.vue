<template>
  <v-dialog
      v-model='isActive'
      max-width='400'
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
        isActive: false
      }
    },
    props: ['message', 'info','id'],
    methods: {
      confirm() {
        this.toggle()
        this.$emit('confirmAction', this.id)
      },
      cancel() {
        this.toggle()
      },
      toggle() {
        this.isActive = !this.isActive
      }
    }
  }
</script>