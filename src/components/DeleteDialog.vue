<template>
  <v-dialog
      v-model='isActive'
      persistent
      max-width='400'
  >
    <v-card>
      <v-card-title class='text-h5'>
        Удаление {{text}} {{value}}
      </v-card-title>

      <v-card-actions>

        <v-btn
            @click='confirm'
            class='red'
        >

        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
            @click='cancel'
        >
          Отмена
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
    props: ['text', 'value','id'],
    methods: {
      confirm() {
        this.toggle()
        this.$emit('confirmAction', 'id')
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