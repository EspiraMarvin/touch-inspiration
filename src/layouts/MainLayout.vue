<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Touch-Inspire
        </q-toolbar-title>
        <q-btn-dropdown stretch flat>
          <template #label>
            <p class="q-mx-md" style="margin-bottom: -1px">{{ email }}</p>
            <q-avatar color="white" text-color="primary">{{ email.charAt(0)}} </q-avatar>
          </template>
          <q-list>
            <q-item clickable tabindex="0" @click="logout">
              <q-item-section class="tw-cursor-pointer" side>
                <q-icon name="logout" ></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label @click="logout">Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

import firebase from "boot/firebase";
export default {
  name: 'MainLayout',
  data () {
    return {
      user: '',
      email: ''
    }
  },
  created() {
    firebase.auth().onAuthStateChanged((auth) => {
      if (auth) {
        this.user = auth.displayName
        if (auth.email) {
          this.email = auth.email.substring(0, auth.email.lastIndexOf("@"))
        }
      }
    })
  },
  methods: {
    logout() {
      firebase.auth().signOut()
      this.$router.push('/')
        .then(() => {
          this.$q.notify({message: 'Sign Out Success.'})
        })
        .catch(error =>  console.log('error',error))
    }
  }
}
</script>
