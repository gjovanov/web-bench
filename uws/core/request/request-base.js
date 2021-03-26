const fastJson = require('fast-json-stringify')

/*
  Wrapper around uWebSockets.js HttpRequest
*/
class RequestBase {
  constructor (route, schema) {
    this.route = route
    this.schema = schema
    this.fastJson = fastJson

    this.req = null // raw uWebSockets.js HttpRequest (to be initialized later)
    this.res = null // raw uWebSockets.js HttpResponse (to be initialized later)

    this._hostname = null
    this._ip = null
    this._ips = null
    this._originalUrl = null
    this._body = null
    this._headers = null
    this._cookies = null
    this._query = null
    this._params = null

    console.log('constructor RequestBase')
  }

  init (res, req) {
    this.res = res
    this.req = req
  }

  forEach (cb) {
    return this.req.forEach(cb)
  }

  getHeader (lowerCaseKey) {
    return this.req.getHeader(lowerCaseKey)
  }

  getMethod () {
    return this.req.getMethod()
  }

  getParameter (index) {
    this.req.getParameter(index)
  }

  getQuery () {
    return this.req.getQuery()
  }

  getUrl () {
    return this.req.getUrl()
  }

  setYield (yieldValue) {
    return this.req.setYield(yieldValue)
  }
}

module.exports = RequestBase
