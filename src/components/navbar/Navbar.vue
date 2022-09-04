<template>
  <div v-bind:class="[isNavbarHidden ? 'hide_list' : 'show_list', 'nav_container']">
    <ul class='nav' v-if='!isNavbarHidden'>
      <navbarItem
          v-for='navbarItem in navbarItems'
          v-bind:navbarItem='navbarItem'
          v-bind:key='navbarItem.id'
          v-on:click.native="$emit('changeSelectedSection', navbarItem.id )"
      />
      <li
          class="logout_item"
          v-on:click="$emit('logout')"
          style='cursor: pointer'
          v-bind:class="{logout_item_mouseover: isMouseover}"
          @mouseover="isMouseover = true"
          @mouseleave="isMouseover = false"
      >
        <p v-bind:class="{logout_item_name_mouseover: isMouseover}"
           class="logout_item_name"
        >
          ВЫЙТИ
        </p>
      </li>
    </ul>

    <div @click='toggleNavbarHidden'
         v-bind:class="[isNavbarHidden ? 'toggle_hidden' : 'toggle_showed', 'toggle_navbar_btn']"
    >
      <div v-if='isNavbarHidden' class='svg_container'>
        <svg class='svg_icon'>
          <use xlink:href='@/assets/NavDisplayToggle.svg#open'></use>
        </svg>
      </div>
      <div div v-if='!isNavbarHidden' class='svg_container'>
        <svg class='svg_icon'>
          <use xlink:href='@/assets/NavDisplayToggle.svg#close'></use>
        </svg>
      </div>

<!--      <div div v-if='!isNavbarHidden'>-->
<!--        <svg style="width:24px;height:24px" viewBox="0 0 24 24">-->
<!--          <path fill="white" d="M20,9V15H12V19.84L4.16,12L12,4.16V9H20Z" />-->
<!--        </svg>-->
<!--      </div>-->
    </div>

  </div>

</template>

<script>
  import NavbarItem from '@/components/navbar/NavbarItem'
  export default {
    props: ['navbarItems'],
    components: {
      NavbarItem
    },
    data() {
      return {
        isNavbarHidden: false,
        isMouseover: false
      }
    },
    methods: {
      toggleNavbarHidden() {
        this.isNavbarHidden = !this.isNavbarHidden
      }
    }
  }
</script>

<style>
  .nav_container {
    display: flex;
    flex-direction: row;
  }
  .nav {
    margin: 0px;
    width: 90%;
    background-color: lightskyblue;
    padding: 0px;
  }

  .toggle_navbar_btn {
    border-left: 4px solid #0c427a;
    background-color: #0c427a;
    cursor: pointer;
    display: flex;
  }

  .toggle_hidden {
    width: 100%;
  }

  .toggle_showed {
    width: 10%;
  }

  .svg_container {
    margin: auto;
  }

  .svg_icon {
    width: 100%;
    fill: white;
  }

  .hide_list {
    width: 1.3%
  }

  .show_list {
    width: 13%;
  }

  .logout_item {
    display: flex;
    padding: 8px;
    justify-content: center;
    text-align: center;
    list-style: none;
    height: 7%;
    border: dimgrey 1px solid;
  }

  .logout_item_mouseover {
    background-color: #0c427a;
  }

  .logout_item_name {
    display: block;
    margin-top: auto;
    margin-bottom: auto;
    font-weight: bold;
    color: black;
    text-decoration: none;
  }

  .logout_item_name_mouseover {
    color: white;
    font-weight: bolder;
  }
</style>