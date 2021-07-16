import axios from "boot/axios";
import {Notify} from "quasar";

const state = () => ({
  users: [],
  loadingUsers: true
})

const getters = {
  getUsers: state => state.users,
  loadingUsers: state => state.loadingUsers
}

const mutations = {
  updateUsers (state, payload) {
    state.users = payload
  },
  updateLoadingUsers (state, payload){
    state.loadingUsers = payload
  }
}

const actions = {
  fetchUsers(context) {
    axios.get('https://ti-react-test.herokuapp.com/users')
      .then(response => {
        context.commit('updateUsers', response.data)
        context.commit('updateLoadingUsers', false)
      })
      .catch(err => err)
  },
  SaveUpdatedUserDetails(context, payload) {
    let data = {
      "name": payload.name,
      "bio": payload.bio,
      "email": payload.email,
      "occupation": payload.occupation
    }
    axios.patch(`https://ti-react-test.herokuapp.com/users/${payload.id}`, data, {
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(response => {
        Notify.create({message: 'Successful Updated Details', position: 'bottom', icon: 'check_circle', color: 'green-5'})
        context.dispatch('fetchUsers').catch(err => err)
      })
      .catch(error => {
        Notify.create({ message: 'Error Occurred. Retry!', position: 'bottom', icon: 'warning', color: 'red-5'})
      })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
