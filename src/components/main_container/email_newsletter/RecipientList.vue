<template>
  <div class='recipients_container'>
    <div class='modal_layout' v-if='isModalActive'>
      <div class='modal_window'>
        <v-form>
          <v-autocomplete :items='branches' placeholder='Выберите филиал' :rules='rules' required></v-autocomplete>
          <v-text-field label='Введите почту' :rules='rules' required></v-text-field>
        </v-form>
      </div>
    </div>
    <table class='recipients_table'>
      <tr>
        <th class='th_1'>Филиал</th>
        <th class='th_2'>Почта</th>
        <th class="th_3">
          <v-btn class='add_btn' v-on:click='callModalWindow'>+</v-btn>
        </th>
      </tr>
      <tr v-for='recipient in recipients'
      v-bind:key='recipient.id'>
        <td class='td_1'>{{recipient.branchName}}</td>
        <td class='td_2'>{{recipient.emailAddress}}</td>
        <td class='td_3'>
          <v-btn class='remove_btn'><b>X</b></v-btn>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    data() {
      return {
        recipients: [],
        isModalActive: false,
        branches: [
            'Екатеринбург', 'Москва', 'Казань', 'Краснодар', 'Новокузнецк', 'Новосибирск', 'Набережные Челны', 'Новгород'
        ],
        rules: [
          value => !!value || 'Required.',
          value => (value && value.length >= 3) || 'Min 3 characters',
        ]
      }
    },
    methods: {
      getRecipients() {
        axios.get('http://localhost:8081/recipients').then((response) => {
          this.recipients = response.data
          console.log(this.recipients)
        }).catch(() => {
          alert('При загрузке адресатов рассылки произошла ошибка')
        })
      },
      callModalWindow() {
        this.isModalActive = !this.isModalActive;
      }
    },
    mounted() {
      this.getRecipients()
    }
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap');

  .recipients_container{
    position: relative;
  }

  .recipients_table{
    position: absolute;
    top: 0;
    left: 0;
    border-collapse: collapse;
  }

  .th_1, .th_2, .td_1, .td_2{
    border: 1px solid gray;
    padding-left: 8px;
    padding-right: 8px;
  }

  .th_3, .td_3{
    padding-left: 4px;
    padding-top: 3px;
    padding-bottom: 3px;
  }

  .remove_btn {
    font-family: 'Mochiy Pop One', sans-serif;
    font-size: large;
    color: red;
  }

  .add_btn {
    font-family: 'Mochiy Pop One', sans-serif;
    font-size: xx-large;
    font-weight: bolder;
    background-color: #4ec119 !important;
    color:white;
  }

  .modal_layout {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 100;
    height: 100vh;
    width: 100%;
  }

  .modal_window {
    height: 50vh;
    width: 50%;
    background-color: #f5f5f5;
    padding: 20px;
  }
</style>