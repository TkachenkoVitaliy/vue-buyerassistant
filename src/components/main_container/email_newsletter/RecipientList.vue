<template>
  <div class='recipients_container'>
    <v-dialog
        v-model="isModalActive"
        persistent
        max-width="400"
    >
      <v-card>
        <v-card-title class="text-h5">
          Добавить адресата
        </v-card-title>

        <v-form
            class='contact_form'
            lazy-validation
            ref='recipientForm'
        >
          <v-autocomplete
              :items='branches'
              label='Выберите филиал'
              :rules='branchRules' required
              v-model='recipient.branchName'
              allow-overflow
              autocomplete='off'
          ></v-autocomplete>
          <v-text-field
              label='Введите почту'
              :rules='emailRules' required
              v-model='recipient.emailAddress'
          ></v-text-field>
        </v-form>

        <v-card-actions>

          <v-btn
              @click='addRecipient'
          >
            Добавить
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn
              @click="toggleModalWindow"
          >
            Отмена
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
    <DeleteDialog
        message='Подтвердите удаление получателя'
        v-bind:info='infoForDelete'
        v-bind:id='recipientForDeleteId'
        v-on:confirmAction='removeRecipient'
        ref='deleteDialog'
    />

    <table class='recipients_table'>
      <caption>СПИСОК АДРЕСАТОВ</caption>
      <tr>
        <th class='th_1'>Филиал</th>
        <th class='th_2'>Почта</th>
        <th class="th_3">
          <v-btn class='add_btn' v-on:click='toggleModalWindow'>+</v-btn>
        </th>
      </tr>
      <tr v-for='recipient in recipients'
      v-bind:key='recipient.id'>
        <td class='td_1'>{{recipient.branchName}}</td>
        <td class='td_2'>{{recipient.emailAddress}}</td>
        <td class='td_3'>
          <v-btn class='remove_btn' v-on:click='activateDeleteDialog(recipient)'>
            <b>X</b>
          </v-btn>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  import axios from "axios"
  import DeleteDialog from "@/components/other/DeleteDialog";

  export default {
    props: {
      branches : Array,
      recipients: Array
    },
    data() {
      return {
        isModalActive: false,
        recipient: {
          branchName: null,
          emailAddress: null
        },
        branchRules: [
          v => !!v || 'Выберите филиал.'
        ],
        emailRules: [
          v => !!v || 'Заполните email',
          v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Введите корректную почту'
        ],
        recipientForDeleteId: null,
        recipientForDelete: null,
        infoForDelete: null
      }
    },
    methods: {
      toggleModalWindow() {
        this.isModalActive = !this.isModalActive
        this.resetRecipientForm()
      },
      addRecipient() {
        this.validateRecipientForm()
        if(this.recipient.branchName
          && this.recipient.emailAddress
          && /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.recipient.emailAddress)
        ) {
          axios.put('http://localhost:8081/recipients', this.recipient).then((response) => {
              this.$emit('requestRecipients')
              this.toggleModalWindow()
          }).catch(() => {
            alert('Не удалось добавить получателя')
          })
        }
      },
      validateRecipientForm() {
        this.$refs.recipientForm.validate()
      },
      resetRecipientForm() {
        if(this.recipient.branchName || this.recipient.emailAddress) {
          this.$refs.recipientForm.resetValidation()
          this.$refs.recipientForm.reset()
        }
      },
      removeRecipient(id) {
        axios.delete('http://localhost:8081/recipients/' + id).then(() => {
          this.$emit('requestRecipients')
        }).catch(() => {
          alert('Не удалось удалить получателя')
        })
      },
      activateDeleteDialog(recipient) {
        this.infoForDelete = recipient.branchName + ' ' + recipient.emailAddress
        this.recipientForDeleteId = recipient.id
        this.$refs.deleteDialog.toggle()
      }
    },
    components: {DeleteDialog},
    mounted() {
      this.$emit('requestRecipients')
    }
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap');

  .recipients_container{
    position: relative;
  }

  .recipients_table{
    position: relative;
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

  .contact_form {
    padding-left: 20px;
    padding-right: 20px;
  }

</style>