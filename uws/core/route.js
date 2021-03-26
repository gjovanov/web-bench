const fastJson = require('fast-json-stringify')
const Request = require('./request')
const Response = require('./response')

const PARAMS_REGEX = /:([A-Za-z0-9_-]+)/g
const getParamNames = (url) => {
  if (url.indexOf(':') !== -1) {
    const paramsArray = url.match(PARAMS_REGEX)

    if (paramsArray) {
      return Object.assign({}, paramsArray.map((name) => name.substr(1)))
    }
  }

  return null
}

class Route {
  constructor (options) {
    this.method = options.method
    this.url = options.url
    this.handler = options.handler
    this.schema = options.schema
    this.stringify = this.schema && this.schema.response ? fastJson(this.schema.response.valueOf()) : JSON.stringify
    this.parse = options.parse || ((buffer) => JSON.parse(buffer.toString()))
    this.params = getParamNames(this.url)
    this.handle = this.handler(this)
    this.isAsync = this.handle.constructor.name === 'AsyncFunction'

    this.request = new Request(this, this.schema ? this.schema.request : undefined)
    this.response = new Response(this, this.schema ? this.schema.response : undefined, this.isAsync)
  }

  getHandler () {
    const request = this.request
    const response = this.response
    const handle = this.handle

    if (this.isAsync) {
      return async (res, req) => {
        try {
          res.onAborted(() => {
            response.isAborted = true
          })
          response.init(res, req)
          request.init(res, req)
          await handle(response, request)
          // await handle(res, req)
        } catch (e) {
          console.log(e)
          res.writeStatus('503').end()
          // TODO: Store error log
        }
      }
    } else {
      return (res, req) => {
        try {
          response.init(res, req)
          request.init(res, req)
          handle(response, request)
          // handle(res, req)
        } catch (e) {
          console.log(e)
          res.writeStatus('503').end()
          // TODO: Store error log
        }
      }
    }
  }
}

module.exports = Route
