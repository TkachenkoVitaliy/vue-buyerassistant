<template>
  <div>
    <v-data-table
        v-model='selected'
        :headers='headers'
        :items='filteredSpecs'
        :items-per-page='-1'
        item-key='name'
        disable-sort
        hide-default-footer
        dense
        style='max-width: 90%'
    >
      <template v-slot:header='{ header }'>
        <tr class='grey lighten-3'>
          <th v-for='header in headers' :key='header.text' class='specs_table_th'>
            <div v-if="filters.hasOwnProperty(header.value)">
              <v-autocomplete
                  flat
                  hide-details
                  multiple
                  dense
                  small-chips
                  min-height='38px'
                  :menu-props='{ minHeight: 304, offsetY: true }'
                  clearable
                  :items="columnValueList(header.value)"
                  v-model='filters[header.value]'
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index < 3">
                    <span>{{ item }}</span>
                  </v-chip>
                  <span v-if="index === 3" class="grey--text caption" >
                    (+{{ filters[header.value].length - 3 }} others)
                  </span>
                </template>
              </v-autocomplete>
            </div>
          </th>
        </tr>
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
        selected: [],
        filters: {
          supplier: [],
          branch: [],
          productType: [],
          profile: [],
          grade: [],
          spec: [],
          acceptMonth: [],
          acceptYear: [],
          accepted: [],
          shipped: []
        },
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
              this.specs.forEach(item => item['value'] = false)
              console.log(this.specs)
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
      haveOtherActiveFilters(val) {
        let result = false;
        for(let key in this.filters) {
          if(key != val) {
            if (this.filters[key].length > 0) {
              result = true;
            }
          }
        }
        return result;
      },
      columnValueList(val) {
        if(this.filters[val].length === 0) {
          return this.filteredSpecs.map((d) => d[val]).sort()
        }
        return this.prevFilteredSpecs(val).map((d) => d[val]).sort()
      },
      prevFilteredSpecs(currentFilter) {
        return this.specs.filter((d) => {
          return Object.keys(this.filters).every((f) => {
            return f == currentFilter || this.filters[f].length < 1 || this.filters[f].includes(d[f])
          })
        })
      }
    },
    computed: {
      filteredSpecs() {
        return this.specs.filter((d) => {
          return Object.keys(this.filters).every((f) => {
            return this.filters[f].length < 1 || this.filters[f].includes(d[f])
          })
        })
      }
    },
    mounted() {
      this.getAllOrders()
    }
  }
</script>

<style>
  .v-select__slot {
    max-height: 500px !important;
  }

</style>