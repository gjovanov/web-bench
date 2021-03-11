const uws = require('uWebSockets.js')
const Route = require('./route')

class App {
  constructor (config = {}, routes = []) {
    const self = this

    this.uws = uws
    this.config = config
    this.server = config && config.key_file_name && config.cert_file_name ? uws.SSLApp(config) : uws.App()
    this.routes = []

    if (routes && routes.length) {
      routes.forEach(route => {
        self.use(new Route(route))
      })
    }
  }

  use (route) {
    if (!route.method || !route.url || !route.handler) {
      throw new Error('Route must have method, url and handler defined!')
    }
    this.routes.push(route)
    this.server[route.method.toLowerCase()](route.url, route.getHandler())
  }
}

module.exports = App
