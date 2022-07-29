<template>
  <router-link
      tag="li"
      class="nav_item"
      v-bind:to="navbarItem.link"
      v-bind:class="{nav_item_mouseover: isMouseover || navbarItem.isActive}"
      @mouseover.native="isMouseover = true"
      @mouseleave.native="isMouseover = false"
  >
    <p v-bind:class="{nav_item_name_mouseover: isMouseover || navbarItem.isActive}"
       class="nav_item_name"
    >
      {{ navbarItem.title }}
    </p>
  </router-link>
</template>

<script>
  export default {
    props: ['navbarItem'],
    data() {
      return {
        isMouseover: false
      }
    }
  }
</script>

<style>
  .nav_item {
    list-style: none;
    height: 20%;
    border: dimgrey 1px solid;
  }

  .nav_item_mouseover {
    background-color: #0c427a;
  }

  .nav_item_name {
    display: block;
    padding-top: 40px;
    padding-left: 20px;
    padding-right: 20px;
    font-weight: bold;
    color: black;
    text-decoration: none;
  }

  .nav_item_name_mouseover {
    color: white;
    font-weight: bolder;
  }
</style>