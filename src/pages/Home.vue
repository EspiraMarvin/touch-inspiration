<template>
  <q-page class="q-pa-md">
    <div class="q-pa-sm">
      <q-table
        title="Contacts"
        :data="data"
        :filter="filterItem"
        :columns="columns"
        row-key="name"
        selection="multiple"
        :selected.sync="selected"
        :loading="loadingContacts"
        :pagination.sync="pagination"
        hide-selected-banner
        no-data-label="No Contacts Available"
        no-results-label="Sorry could not uncover any results"
        style="max-height: 800px"
      >
        <!--          table loading data-->
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>

        <!--          table top slot-->
        <template v-slot:top="props">
          <template v-if="selected.length">
            <div class="action-buttons">
              <q-badge class="q-ml-sm" size="xs" v-model="props.selected" :label="selected.length" />
              <span class="q-ml-sm">selected
                  <q-icon v-show="selected.length === 1" name="edit" class="q-ml-md" color="accent" size="20px" @click="editContact"/>
                  <q-icon name="delete" class="q-ml-md" color="accent" size="20px" @click="deleteContact"/>
                </span>
            </div>
          </template>
          <template v-else>
            <q-checkbox class="float-left" size="xs" color="white" v-model="props.selected"/>
          </template>
        </template>

        <!--          custom no data template -->
        <template v-slot:no-data="{ icon, message, filter }">
          <div class="full-width row flex-center text-cyan q-gutter-sm">
            <q-icon size="2em" name="sentiment_dissatisfied" />
            <span> {{ message }} </span>
            <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
          </div>
        </template>

        <!--       custom table header -->
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th>
              <q-checkbox class="float-left" size="xs" v-model="props.selected"/>
            </q-th>
            <q-th  v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <!--          custom table body-->
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td >
              <q-checkbox size="xs" v-model="props.selected"/>
            </q-td>
            <q-td key="name" :props="props">
              <q-avatar size="sm" class="q-mr-xs" v-if="!props.row.avatar">
                <q-icon size="sm" name="face" />
              </q-avatar>
              <q-avatar size="sm" class="q-mr-xs" v-else>
                <img :src="props.row.avatar">
              </q-avatar>
              {{ props.row.name }}
            </q-td>
            <template v-for="col in props.cols">
              <q-td v-if="col.name !== 'name'" :key="col.name">
                {{ props.row[col.name] }}
              </q-td>
            </template>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import axios from 'src/boot/axios';
export default {
name: "Home",
  data () {
    return {
      selected: [],
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 20
        // rowsNumber: xx if getting data from a server
      },
      columns: [
        { name: 'name', required: true, label: 'Name', align: 'left', field: row => row.name, sortable: true },
        { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
        { name: 'companyName', align: 'left', label: 'Company Name', field: 'companyName', sortable: true },
        { name: 'role', align: 'left', label: 'Role', field: 'role' },
        { name: 'forecast', align: 'left', label: 'Forecast (%)', field: 'forecast' },
        { name: 'recentAct', align: 'left', label: 'Recent Activity', field: 'recentAct' }
      ],
      columnss: [
        {
          name: 'name',
          required: true,
          label: 'Dessert (100g serving)',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
        { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
        { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
        { name: 'protein', label: 'Protein (g)', field: 'protein' },
        { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
        { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ],
      data: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: '14%',
          iron: '1%'
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: '8%',
          iron: '1%'
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: '6%',
          iron: '7%'
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: '3%',
          iron: '8%'
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: '7%',
          iron: '16%'
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: '0%',
          iron: '0%'
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          sodium: 38,
          calcium: '0%',
          iron: '2%'
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          sodium: 562,
          calcium: '0%',
          iron: '45%'
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: '2%',
          iron: '22%'
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: '12%',
          iron: '6%'
        }
      ]
    }
  },
  created() {
  axios.get('https://ti-react-test.herokuapp.com/users')
    .then(response => console.log(response.data))
    .catch(err =>  console.log(err))
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
