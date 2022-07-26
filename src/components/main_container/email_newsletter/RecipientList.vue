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
        v-bind:is-active='isDeleteDialogActive'
        v-on:confirmAction='removeRecipient'
        v-on:cancelAction = 'cancelRemoveRecipient'
        ref='deleteDialog'
    />

    <table class='recipients_table'>
      <caption>
        <h3>СПИСОК АДРЕСАТОВ</h3>
      </caption>
      <tr>
        <th class='th_1 th_blue'>Филиал</th>
        <th class='th_2 th_blue'>Почта</th>
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
  import DeleteDialog from '@/components/other/DeleteDialog'
  import RestService from '@/services/rest.service'
  import EventBus from "@/common/EventBus";

  export default {
    props: {
      branches : Array,
      recipients: Array
    },
    data() {
      return {
        isDeleteDialogActive: false,
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
          RestService.putRecipient(this.recipient).then(
              () => {
                this.$emit('requestRecipients')
                this.toggleModalWindow()
              },
              error => {
                this.content =
                    (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    error.toString();
                if (error.response && error.response.status === 403) {
                  EventBus.dispatch("logout");
                }
              }
          )
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
        RestService.deleteRecipient(id).then(
            () => {
              this.isDeleteDialogActive = false
              this.$emit('requestRecipients')
            },
            error => {
              this.content =
                  (error.response && error.response.data && error.response.data.message) ||
                  error.message ||
                  error.toString();
              if (error.response && error.response.status === 403) {
                EventBus.dispatch("logout");
              }
            }
        )
      },
      cancelRemoveRecipient() {
        this.isDeleteDialogActive = false
      },
      activateDeleteDialog(recipient) {
        this.infoForDelete = recipient.branchName + ' ' + recipient.emailAddress
        this.recipientForDeleteId = recipient.id
        this.isDeleteDialogActive = true
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

  .th_blue {
    background-color: #bbdefb;
  }

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

  h3 {
    text-align: center;
  }

</style>