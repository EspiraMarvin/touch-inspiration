<template>
  <div>
    <template v-if="tab === 'register'">
      <div class="text-center q-mb-lg">Sign up with</div>
    </template>
    <template v-else>
      <div class="text-center q-mb-lg">Sign in with</div>
    </template>
    <div class="flex flex-center">
      <q-btn
        class="flex flex-center q-px-lg q-py-sm q-mb-md"
        size="md"
        label="Google"
        @click="google"
        color="primary"
      />
    </div>
    <template v-if="tab === 'register'">
      <p class="text-center">Sign up with credentials</p>
    </template>
    <template v-else>
      <p class="text-center">Sign in with credentials</p>
    </template>

    <q-form @submit="submitForm">
      <q-input
        v-model="formData.email"
        outlined
        class="q-mb-md"
        type="email"
        label="Email"
        :rules="[val => (val && val.length > 0) || 'Please enter email', isValidEmail]"
      />
      <q-input
        v-model="formData.password"
        :type="isPwd ? 'password' : 'text'"
        outlined
        class="q-mb-md"
        :rules="[val => (val && val.length > 0) || 'Please enter password', hasWhiteSpacesOnly]"
        label="Password">
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      <div class="row">
        <q-space />
        <q-btn
          type="submit"
          color="primary"
          :label="tab"
          :disable="isDisabled"
        />
      </div>
    </q-form>
    <div class="text-center q-my-md">
      <q-btn
        v-if="tab !== 'register'"
        flat
        @click="forgotPassword"
        label="Forgot Password?"
        color="green"
        class="text-capitalize rounded-borders"
      />
    </div>
    <q-dialog v-model="resetPwdDialog">
      <ForgotPassword />
    </q-dialog>
  </div>
</template>

<script>
// import firebase from "firebase";
import firebase from 'src/boot/firebase'
import ForgotPassword from "components/ForgotPassword";
import mixins from "src/mixins/mixins";
export default {
  name: "AuthComponent",
  props: ['tab'],
  mixins: [mixins],
  components: {ForgotPassword},
  data() {
    return {
      isPwd: true,
      formData: {
        email: 'marvin@gmail.com',
        password: '12345678'
      },
      resetPwdDialog: false
    }
  },
  computed: {
    isDisabled() {
      return !this.formData.email.replace(/\s/g, '').length
        || !this.formData.password.replace(/\s/g, '').length
        || this.isValidEmail(this.formData.email) === 'Invalid email'
    }
  },
  methods: {
    submitForm() {
      if (this.tab === 'login') {
        this.signInExistingUser(this.formData.email, this.formData.password)
      } else {
        this.createUser(this.formData.email, this.formData.password)
      }
    },
    google() {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider)
        .then(result => {
          this.notify('Sign In Success', 'check_circle', 'green-5')
          this.$router.push('/home')
        })
        .catch(error => this.notify(error.message, 'warning', 'red-5'))
    },
    signInExistingUser(email, password) {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          this.notify('Sign In Success', 'check_circle', 'green-5')
          this.$router.push('/home')
        })
        .catch(error => {
          this.notify(error.message, 'warning', 'red-5')
        })
    },
    createUser(email, password) {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(auth => {
          this.notify('Sign In Success', 'check_circle', 'green-5')
          this.$router.push('/home')
        })
        .catch(error => this.notify(error.message, 'warning', 'red-5'))
    },
    forgotPassword() {
      this.resetPwdDialog = true
    }
  }
}
</script>

<style scoped>

</style>
