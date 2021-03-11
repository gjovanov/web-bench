const fastJson = require('fast-json-stringify')

// const request = require('./request')
// const response = require('./response')

class Route {
  constructor (options) {
    this.method = options.method
    this.url = options.url
    this.handler = options.handler
    this.schema = options.schema
    this.stringify = this.schema && this.schema.response ? fastJson(this.schema.response.valueOf()) : JSON.stringify
    this.parse = options.parse || ((buffer) => JSON.parse(buffer.toString()))
    // this.request = Object.assign({}, request)
    // this.response = Object.assign({}, response)
  }

  getHandler () {
    const route = this
    const handler = route.handler(route)
    return async (res, req) => {
      try {
        // Object.assign(req, route.request)
        // Object.assign(res, route.response)
        await handler(res, req)
        // if (!res.done) {
        //   throw new Error('Route Handler did not respond')
        // }
      } catch (e) {
        console.log(e)
        res.writeStatus('503').end()
        // TODO: Store error log
      }
    }
  }
}

module.exports = Route
