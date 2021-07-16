const mixins = {
  methods: {
    notify(message, icon, color) {
      this.$q.notify({
        message: message,
        icon: icon,
        color: color,
        position: 'bottom',
        textColor: 'white'
      })
    }
  }
}

export default mixins
