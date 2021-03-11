const cookie = require('cookie')

module.exports = {
  hasCookie (name) {
    const req = this.__request
    return !!req && !!req.cookies && req.cookies[name] !== undefined
  },
  setCookie (name, value, options) {
    if (options.expires && Number.isInteger(options.expires)) {
      options.expires = new Date(options.expires)
    }
    const serialized = cookie.serialize(name, value, options)

    let getCookie = this.getHeader('Set-Cookie')

    if (!getCookie) {
      this.setHeader('Set-Cookie', serialized)
      return undefined
    }

    if (typeof getCookie === 'string') {
      getCookie = [getCookie]
    }

    getCookie.push(serialized)

    this.removeHeader('Set-Cookie')
    this.setHeader('Set-Cookie', getCookie)
    return this
  },
  removeCookie (name, options = {}) {
    const currTime = Date.now()
    if (!options.expires || options.expires >= currTime) {
      options.expires = currTime - 1000
    }
    this.setCookie(name, '', options)
    return this
  }

}
