<template>
  <q-page class="q-pa-md">
    <div class="">
      <q-table
        title="Users List"
        :data="users"
        filter=""
        :columns="columns"
        row-key="name"
        selection="single"
        :selected.sync="selected"
        :loading="loading"
        :pagination.sync="pagination"
        hide-selected-banner
        no-data-label="No Users Available"
        no-results-label="Sorry could not uncover any results"
        style="max-height: 770px"
      >
        <!--          table loading data-->
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>

        <!--          table top slot-->
        <template v-slot:top-right="props">
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
            <template v-for="col in props.cols">
              <q-td v-if="col.name === 'id'" :key="col.name">
                {{ props.row[col.name] }}
              </q-td>
              <q-td v-if="col.name === 'name'" :key="col.name">
                <q-avatar size="sm" class="q-mr-xs" v-if="!props.row.avatar">
                  <q-icon size="sm" name="face" />
                </q-avatar>
                <q-avatar size="sm" class="q-mr-xs" v-else>
                  <q-img :src="props.row.avatar" />
                </q-avatar>
                {{ props.row.name }}
              </q-td>
              <q-td v-if="col.name === 'email'" :key="col.name">
                {{ props.row[col.name] }}
              </q-td>
              <q-td v-if="col.name !== 'id' && col.name !== 'name' && col.name !== 'email'" :key="col.name">
                {{ props.row[col.name] }}
              </q-td>
            </template>
          </q-tr>
        </template>
      </q-table>
      <div class="row justify-center q-mt-md">
        <q-pagination
          v-model="pagination.page"
          :max="pagesNumber"
          color="teal"
          size="md"
          direction-links
          boundary-links
          icon-first="skip_previous"
          icon-last="skip_next"
          icon-prev="fast_rewind"
          icon-next="fast_forward"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
name: "Home",
  data () {
    return {
      selected: [],
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 2,
        rowsPerPage: 25
        // rowsNumber: xx if getting data from a server
      },
      columns: [
        { name: 'id', required: true, label: 'Id', align: 'left', field: row => row.name, sortable: true },
        { name: 'name', required: true, label: 'Name', align: 'left', field: row => row.name, sortable: true },
        { name: 'email', align: 'left', label: 'Email', field: row => row.name, sortable: true },
        { name: 'occupation', align: 'left', label: 'Occupation', field: row => row.name, sortable: true },
        { name: 'updated_at', align: 'left', label: 'Updated At', field: row => row.name, sortable: true }
      ],
    }
  },
  mounted () {
  setTimeout(() => {
    this.$store.dispatch('user/fetchUsers')
  }, 1000)
  },
  methods: {
  },
  computed: {
    users() {
      return this.$store.getters['user/getUsers']
    },
    loading() {
      return this.$store.getters['user/loadingUsers']
    },
    pagesNumber () {
      return Math.ceil(this.users.length / this.pagination.rowsPerPage)
    }
  }
}
</script>

<style scoped>

</style>
