<template>
  <div class='server_error_container'>
    <p class='server_error'>МЫ УРОНИЛИ СЕРВЕР!</p>
  </div>
</template>

<script>
  export default {
  }
</script>

<style>
  .server_error_container {
    height: 95vh;
    text-align: center;
    background-image: url('@/assets/cats.jpg');
    background-repeat: no-repeat;
    background-size: 100%;
  }

  .server_error {
    -webkit-text-stroke: 2px black;
    font-weight: bolder;
    width: 100%;
    text-align: center;
    position: absolute;
    top: 45vh;
    color: white;
    font-size: 72px;
    z-index: 100;
  }
</style>