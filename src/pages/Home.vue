<template>
  <q-page class="q-pa-md">
    <div class="">
      <q-table
        title="Users List"
        :data="users"
        :filter="filter"
        :columns="tableHeaders"
        row-key="name"
        :loading="loading"
        :pagination.sync="pagination"
        hide-pagination
        no-results-label="Sorry could not uncover any results"
        style="max-height: 790px"
      >
        <!--          table top slot-->
        <template v-slot:top-right>
          <q-input borderless dense debounce="500" color="primary" v-model="filter" placeholder="Search a user">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <!--          custom no data message template  -->
        <template v-slot:no-data="{ icon, message, filter }">
          <div class="full-width row flex-center text-cyan q-gutter-sm">
            <q-icon size="2em" name="sentiment_dissatisfied" />
            <span> {{ message }} </span>
            <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
          </div>
        </template>
        <!--          custom table body-->
        <template v-slot:body="props">
          <q-tr :props="props">
            <template v-for="col in props.cols">
              <q-td v-if="col.name !== 'actions'" :key="col.name">
                {{ props.row[col.name] }}
              </q-td>
              <q-td v-if="col.name === 'actions'" :key="col.index" align="center">
                <q-btn
                  class="q-ma-xs" outline size="sm" color="primary" icon="visibility"
                  @click="viewUser(props.row)"
                />
                <q-btn
                  class="q-ma-xs" outline size="sm" color="positive" icon="edit"
                  @click="editUser(props.row)"
                />
              </q-td>
            </template>
          </q-tr>
        </template>
      </q-table>
      <div class="row justify-center q-mt-md">
        <q-pagination
          icon-first="skip_previous" icon-last="skip_next" icon-prev="fast_rewind" icon-next="fast_forward"
          color="primary" size="md" direction-links boundary-links  :ellipses="true"
          v-model="pagination.page"
          :max="pagesNumber"
        />
      </div>
      <q-dialog v-model="openDialog">
        <q-card style="width: 500px; max-width: 150vw;">
          <q-toolbar>
            <q-toolbar-title>{{ dialogTitle }}</q-toolbar-title>
          </q-toolbar>
          <q-card-section>
            <q-form ref="userForm">
              <div class="row">
                <div class="col-md-6 col-xs-12 q-pa-md">
                  <q-input
                    standard
                    v-model="userForm.name"
                    placeholder="Name *"
                    type="text"
                    hint="Name"
                    :disable="viewing"
                    lazy-rules
                    :rules="[val => (val && val.length > 0) || 'Please enter name', hasWhiteSpacesOnly]"
                  />
                </div>
                <div class="col-md-6 col-xs-12 q-pa-md">
                  <q-input
                    standard
                    v-model="userForm.email"
                    placeholder="Email *"
                    type="email"
                    lazy-rules hint="Email"
                    :disable="viewing"
                    mask="email"
                    :rules="[val => !!val || 'Email is missing', isValidEmail]"
                  />
                </div>
              </div>
              <div class="col-md-6 col-xs-12 q-pa-md">
                <q-input
                  standard
                  v-model="userForm.occupation"
                  placeholder="Company Name *"
                  type="text" hint="Occupation"
                  :disable="viewing"
                  lazy-rules
                  :rules="[val => (val && val.length > 0) || 'Please enter occupation', hasWhiteSpacesOnly]"
                />
              </div>
              <div class="col-md-6 col-xs-12 q-pa-md">
                <q-input
                  standard
                  autogrow
                  v-model="userForm.bio"
                  placeholder="Role *"
                  type="text" hint="Bio"
                  :disable="viewing"
                  lazy-rules
                  :rules="[val => (val && val.length > 0) || 'Please enter bio', hasWhiteSpacesOnly]"
                />
                <q-input
                  standard
                  v-model="userForm.created_at"
                  placeholder="Created At"
                  type="text" hint="Created At"
                  disable
                />
                <q-input
                  standard
                  v-model="userForm.updated_at"
                  placeholder="Updated At"
                  type="text" hint="Updated At"
                  disable
                />
              </div>
            </q-form>
          </q-card-section>
          <q-card-actions align="right" v-if="!viewing">
              <q-btn color="info" class="q-pl-md q-pr-md"  unelevated label="Cancel" v-close-popup />
              <q-btn label="Save" color="primary" class="q-pl-md q-pr-md" unelevated @click="btnSave" />
          </q-card-actions>
          <q-card-actions align="right" v-else>
            <q-btn label="Close" color="primary" class="q-pl-md q-pr-md" unelevated v-close-popup />
          </q-card-actions>

        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import mixins from "src/mixins/mixins";
import moment from 'moment'
import {cloneDeep, isMatch } from "lodash";
export default {
name: "Home",
  mixins: [ mixins ],
  data () {
    return {
      openDialog: false,
      moment: moment,
      filter: '',
      pagination: { sortBy: 'desc', descending: false, page: 1, rowsPerPage: 25 },
      dialogTitle: '',
      viewing: false,
      editing: false,
      userForm: {
        id: '',
        name: '',
        email: '',
        bio: '',
        occupation: ''
      },
      originalFormData: '',
    }
  },
  mounted () {
    this.fetchUsers()
  },
  methods: {
    fetchUsers() {
      this.$store.dispatch('user/fetchUsers')
    },
    editUser(row) {
      let row2 = cloneDeep(row);
      this.viewing = false;
      this.editing = true;
      this.userForm.id = row2.id;
      this.userForm.name = row2.name;
      this.userForm.email = row2.email;
      this.userForm.bio = row2.bio;
      this.userForm.occupation = row2.occupation;
      this.userForm.created_at = moment(row2.created_at).format('DD-MM-YYYY HH:mm:ss');
      this.userForm.updated_at = moment(row2.updated_at).format('DD-MM-YYYY HH:mm:ss');
      this.openDialog = true
      this.dialogTitle = `Editing ${row2.name}`
      this.originalFormData = row2
    },
    viewUser(row) {
      this.viewing = true;
      this.userForm.name = row.name;
      this.userForm.email = row.email;
      this.userForm.bio = row.bio;
      this.userForm.occupation = row.occupation;
      this.userForm.created_at = moment(row.created_at).format('DD-MM-YYYY HH:mm:ss');
      this.userForm.updated_at = moment(row.updated_at).format('DD-MM-YYYY HH:mm:ss');
      this.openDialog = true
      this.dialogTitle = `${row.name} Details`
    },
    btnSave () {
      // prevent submitting un-edited data to the api
      let c = cloneDeep(this.userForm)
      if(isMatch(this.originalFormData.name, c.name) && isMatch(this.originalFormData.email, c.email)
      && isMatch(this.originalFormData.bio, c.bio) && isMatch(this.originalFormData.occupation, c.occupation)){
        this.openDialog = false
      }else {
        this.$store.dispatch('user/SaveUpdatedUserDetails', this.userForm)
        this.openDialog = false
      }
    }
  },
  computed: {
    users() {return this.$store.getters['user/getUsers']},
    loading() {return this.$store.getters['user/loadingUsers']},
    pagesNumber () {return Math.ceil(this.users.length / this.pagination.rowsPerPage)},
    tableHeaders() {
      // these are the column object for the table header
      let columnObjects = []
      if (this.users.length){
        let firstValue = this.users[0]; // get first item
        let headerArray = Object.keys(firstValue);
        headerArray.map(header => {
          if (header !== 'bio' && header !== 'created_at' && header !== 'updated_at') {
            let obj1 = {
              name: header, sortable: true,
              label: this.formatString(header).charAt(0).toUpperCase() + this.formatString(header).substring(1),
              field: header,
              headerClasses: 'bg-grey-3',
              align: 'left'
            };
            columnObjects.push(obj1);
          }
        })
        columnObjects.push({
          name: 'actions', sortable: false, label: 'Actions', field: 'actions', headerClasses: 'bg-grey-3', align: 'center'
        });
      }
      return columnObjects
    }
  }
}
</script>
