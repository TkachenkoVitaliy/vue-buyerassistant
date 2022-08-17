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
    display: flex;
    padding: 8px;
    justify-content: center;
    text-align: center;
    list-style: none;
    height: 15.5%;
    border: dimgrey 1px solid;
  }

  .nav_item_mouseover {
    background-color: #0c427a;
  }

  .nav_item_name {
    display: block;
    margin-top: auto;
    margin-bottom: auto;
    font-weight: bold;
    color: black;
    text-decoration: none;
  }

  .nav_item_name_mouseover {
    color: white;
    font-weight: bolder;
  }
</style>