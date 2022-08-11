<template>
  <div class='start_month_setting_container'>
    <table class='recipients_table'>
      <caption>НАЧАЛЬНЫЙ ПЕРИОД ФАЙЛА</caption>
      <tr>
        <th class='th_start_month'>Филиал</th>
        <th class='th_start_month'>Месяц</th>
        <th class="th_start_month">Год</th>
      </tr>
      <tr v-for='(branchSettings, index) in branchesSettings'
          v-bind:key='branchSettings.id'
          class='branch_settings_row'
      >
        <td class='td_1'
            v-bind:class="{changed : (branchSettings.startMonth != onMountBranchesSettings[index].startMonth ||
            branchSettings.startYear != onMountBranchesSettings[index].startYear)}"
        >{{ branchSettings.name }}</td>
        <td class='td_2'
            v-bind:class="{changed : (branchSettings.startMonth != onMountBranchesSettings[index].startMonth)}"
        >
          <v-autocomplete
              v-on:change='compareArrays'
              v-model='branchSettings.startMonth'
              :items = 'months'
              dense
              outlined
              height="25px !important"
              append-icon=''
              class='month_input'
          >
          </v-autocomplete>
        </td>
        <td class='td_3'
            v-bind:class="{changed : (branchSettings.startYear != onMountBranchesSettings[index].startYear)}"
        >
          <v-autocomplete
              v-on:change='compareArrays'
              v-model='branchSettings.startYear'
              :items = 'years'
              dense
              outlined
              height="25px"
              append-icon=''
              class='year_input'
          >
          </v-autocomplete>
        </td>
      </tr>
    </table>
    <div
        class='btn_container'
        v-if='haveChanges'
    >
      <v-btn v-on:click='saveSettings' class='save_btn'>СОХРАНИТЬ</v-btn>
      <v-btn v-on:click='cancelSettings' class='cancel_btn'>ОТМЕНА</v-btn>
    </div>
  </div>
</template>

<script>
  import RestService from '@/services/rest.service'
  import EventBus from '@/common/EventBus'

  export default {
    data() {
      return {
        branchesSettings: [],
        onMountBranchesSettings: [],
        months: [{text: 'Январь', value: 1}, {text: 'Февраль', value: 2}, {text: 'Март', value: 3},
          {text: 'Апрель', value: 4}, {text: 'Май', value: 5}, {text: 'Июнь', value: 6},
          {text: 'Июль', value: 7}, {text: 'Август', value: 8}, {text: 'Сентябрь', value: 9},
          {text: 'Октябрь', value: 10}, {text: 'Ноябрь', value: 11}, {text: 'Декабрь', value: 12}],
        years: [],
        haveChanges: false
      }
    },
    methods: {
      getBranchesSettings() {
        RestService.getBranchesSettings().then(
            (response) => {
              this.branchesSettings = response.data
              this.haveChanges = false
              this.onMountBranchesSettings = this.copyBranchesSettings(response.data)
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
      copyBranchesSettings(data) {
        let copyArray = []
        for (let i = 0; i < data.length; i++) {
          let currentObj = data[i];
          let id = currentObj.id;
          let name = currentObj.name;
          let startMonth = currentObj.startMonth;
          let startYear = currentObj.startYear;
          copyArray[i] = {
            id: id,
            name:name,
            startMonth: startMonth,
            startYear: startYear
          }
        }
        return copyArray
      },
      createYearsArray() {
        let currentYear = new Date().getFullYear()
        this.years = [currentYear - 1, currentYear]
      },
      saveSettings() {
        RestService.postBranchesSettings(this.branchesSettings).then(
            () => {
              this.getBranchesSettings()
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
      cancelSettings() {
        this.getBranchesSettings()
      },
      compareArrays() {
        this.haveChanges = !(JSON.stringify(this.onMountBranchesSettings) == JSON.stringify(this.branchesSettings))
      }
    },
    mounted() {
      this.getBranchesSettings()
      this.createYearsArray()
    }
  }
</script>

<style>
  .start_month_setting_container {
    max-width: 372px;
  }

  .changed{
    background-color: #90caf9 !important;
  }

  .btn_container{
    padding-top: 10px;
    padding-right: 10px;
    padding-left: 10px;
    display: flex;
    justify-content: space-between;
  }

  .save_btn, .cancel_btn {
    display: block;
  }

  .td_1 {
    min-width: 164px;
    background-color: #e3f2fd;
  }

  .th_start_month {
    background-color: #bbdefb;
  }

  .v-text-field.v-text-field--enclosed .v-text-field__details {
    padding-top: 0px;
    margin-bottom: 0px !important;
  }

  .v-messages {
    min-height: 0px !important;
    visibility: hidden !important;
  }

  .v-text-field__details{
    visibility: hidden !important;
    min-height: 0px !important;
  }

  .v-text-field input {
    padding: 3px 0px !important;
  }

  .v-select__slot{
    max-height: 26px !important;
  }

  .v-text-field--filled.v-input--dense.v-text-field--single-line > .v-input__control > .v-input__slot, .v-text-field--filled.v-input--dense.v-text-field--outlined > .v-input__control > .v-input__slot, .v-text-field--filled.v-input--dense.v-text-field--outlined.v-text-field--filled > .v-input__control > .v-input__slot, .v-text-field--full-width.v-input--dense.v-text-field--single-line > .v-input__control > .v-input__slot, .v-text-field--full-width.v-input--dense.v-text-field--outlined > .v-input__control > .v-input__slot, .v-text-field--full-width.v-input--dense.v-text-field--outlined.v-text-field--filled > .v-input__control > .v-input__slot, .v-text-field--outlined.v-input--dense.v-text-field--single-line > .v-input__control > .v-input__slot, .v-text-field--outlined.v-input--dense.v-text-field--outlined > .v-input__control > .v-input__slot, .v-text-field--outlined.v-input--dense.v-text-field--outlined.v-text-field--filled > .v-input__control > .v-input__slot {
     min-height: 20px !important;
    max-width:  140px;
  }

  .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot, .v-text-field.v-text-field--enclosed .v-text-field__details {
    padding: 0 6px;
  }

  .v-input--dense > .v-input__control > .v-input__slot {
    margin-bottom: 0px !important;
  }

</style>