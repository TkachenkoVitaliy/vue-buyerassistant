<template>
  <ul class='nav'>
    <navbarItem
        v-for='navbarItem in navbarItems'
        v-bind:navbarItem='navbarItem'
        v-bind:key='navbarItem.id'
        v-on:click.native="$emit('changeSelectedSection', navbarItem.id )"
    />
  </ul>
</template>

<script>
  import NavbarItem from '@/components/navbar/NavbarItem'
  export default {
    props: ['navbarItems'],
    components: {
      NavbarItem
    }
  }
</script>

<style>
  .nav{
    margin: 0px;
    width: 13%;
    background-color: lightskyblue;
    padding: 0px;
  }
</style>