<template>

  <router-link
      class="nav_item_router"
      tag="li"
      :to="navbarItem.link"
  >

    <div class="nav_item"
         :class="{nav_item_mouseover: isMouseover || navbarItem.isActive}"
         @mouseover="isMouseover = true"
         @mouseleave="isMouseover = false">

      <p v-bind:class="{nav_item_name_mouseover: isMouseover || navbarItem.isActive}"
         class="nav_item_name"
      >
        {{ navbarItem.title }}
      </p>

    </div>

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

  .nav_item_router {
    height: 25%;
    list-style: none;
  }

  .nav_item {
    height: 100%;
    border: dimgrey 1px solid;
  }

  .nav_item_mouseover {
    background-color: #0c427a;
  }

  .nav_item_name {
    display: block;
    padding-top: 40px;
    padding-left: 20px;
    font-weight: bold;
    color: black;
    text-decoration: none;
  }

  .nav_item_name_mouseover {
    color: white;
    font-weight: bolder;
  }

</style>