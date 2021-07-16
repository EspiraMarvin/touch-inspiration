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
    },
    // check for white spaces (empty fields) in input fields
    hasWhiteSpacesOnly (val) {
      return val.replace(/\s/g, '').length || 'field is empty'
    },
    // email validation
    isValidEmail (val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      return emailPattern.test(val) || 'Invalid email'
    },
    // format string
    formatString(string) {
      return string.replace(/_/g, ' ');
    }
  }
}

export default mixins
