import axios from "boot/axios";
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
