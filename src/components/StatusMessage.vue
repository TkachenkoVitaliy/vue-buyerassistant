<template>
  <p v-bind:class='[has_error ? errorClass : okClass, defaultStyle]'>{{ message }}</p>
</template>

<script>
  export default {
    props: ['has_error', 'message'],
    data() {
      return {
        errorClass: 'errorClass',
        okClass: 'okClass',
        defaultStyle: 'defaultStyle'
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