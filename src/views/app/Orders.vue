<template>
  <div>
    <v-data-table
        v-model='selected'
        :headers='headers'
        :items='specs'
        :search='search'
        :items-per-page='-1'
        disable-sort
        hide-default-footer
        item-key='id'
        dense
        style='max-width: 90%'
    >
      <template v-slot:header.supplier='{ header }'>
        <v-autocomplete
            v-model='search'
            :items='specs'
            item-text='supplier'
            :label='header.text'
            v-bind='selected'
            dense
            clearable
        ></v-autocomplete>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import RestService from '@/services/rest.service'
  import EventBus from "@/common/EventBus";

  export default {
    data() {
      return {
        specs: [],
        selected: "",
        search: [],
        headers: [
          {
            text: 'Поставщик',
            align: 'start',
            value: 'supplier',
          },
          // { text: 'Стан', value: 'mill' },
          { text: 'Филиал', value: 'branch' },
          // { text: 'Тип продажи', value: 'sellType' },
          // { text: 'Грузополучатель', value: 'consignee' },
          { text: 'Вид продукции', value: 'productType' },
          { text: 'Размеры', value: 'profile' },
          { text: 'Марка', value: 'grade' },
          { text: 'Заказ', value: 'spec' },
          // { text: 'Позиция', value: 'position' },
          { text: 'Месяц акцепта', value: 'acceptMonth' },
          { text: 'Год акцепта', value: 'acceptYear' },
          { text: 'Акцептовано', value: 'accepted' },
          { text: 'Отгруженно', value: 'shipped' },
          // { text: 'Дата отгрузки', value: 'shippedDate' },
          // { text: 'Номер ТС', value: 'vehicleNumber' },
          // { text: 'Цена', value: 'price' }
        ]
      }
    },
    methods: {
      getAllOrders() {
        RestService.getSpecs().then(
            (response) => {
              this.specs = response.data
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
    computed: {
      itemsForSelected() {
        if (this.search.length) {
          console.log()
          console.log(this.specs.filter(item => this.search.includes(item.supplier)))
          return this.specs.filter(item => this.search.includes(item.supplier))
        }
        return this.specs
      }
    },
    mounted() {
      this.getAllOrders()
    }
  }
</script>

<style>

</style>