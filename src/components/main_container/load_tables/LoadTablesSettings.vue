<template>
  <div>
    <table>
      <tr>
        <td>
          <v-autocomplete
              :items='months'
              v-model='settings.month'
              v-on:change='updateSettings'
          ></v-autocomplete>
        </td>
        <td>
          <v-autocomplete
              :items='years'
              v-model='settings.year'
              v-on:change='updateSettings'
          ></v-autocomplete>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
    props: ['settings'],
    data() {
      return {
        months: [{text: 'Январь', value: 1}, {text: 'Февраль', value: 2}, {text: 'Март', value: 3},
          {text: 'Апрель', value: 4}, {text: 'Май', value: 5}, {text: 'Июнь', value: 6},
          {text: 'Июль', value: 7}, {text: 'Август', value: 8}, {text: 'Сентябрь', value: 9},
          {text: 'Октябрь', value: 10}, {text: 'Ноябрь', value: 11}, {text: 'Декабрь', value: 12}],
        years: []
      }
    },
    methods: {
      setYears() {
        let currentYear = new Date().getFullYear()
        this.years = [currentYear - 1, currentYear, currentYear + 1]
      },
      updateSettings() {
        this.$emit('updateSettings')
      }
    },
    beforeMount() {
      this.setYears()
    }
  }

</script>

<style>

</style>