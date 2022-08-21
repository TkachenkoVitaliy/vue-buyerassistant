<template>
  <v-dialog
      persistent
      v-model='isActive'
      max-width='40vw'
      max-height='40vh'
  >
    <v-card>
      <v-card-title
          style="color: red"
      >
        {{message}}
      </v-card-title>

      <v-card-text
      >
        <p v-for='item in info'>{{item}}</p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>

        <v-btn
            @click='isActiveSetFalse'
            color = 'primary'
            dark
        >
          ОК
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {

  props: ['isActive', 'message', 'info'],
  methods: {
    isActiveSetFalse() {
      this.$emit('closed')
    }
  }
}
</script>