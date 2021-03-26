const fastJson = require('fast-json-stringify')
const { isHttpCode } = require('../utils/http-utils')
const compress = require('../utils/compressor')

/*
  Wrapper around uWebSockets.js HttpResponse
*/
class ResponseBase {
  constructor (route, schema, isAsync = false) {
    this.route = route
    this.schema = schema
    this.fastJson = fastJson
    this.compress = compress

    this.req = null // raw uWebSockets.js HttpRequest (to be initialized later)
    this.res = null // raw uWebSockets.js HttpResponse (to be initialized later)

    this._headers = {}
    this._cookies = {}
    this._status = '200'
    this._statusRaw = 200
    this._isAborted = false
    this._abortEvents = []
    this._isAsync = isAsync

    this._serializers = this.initSerializers()
    console.log('constructor ResponseBase')
  }

  init (res, req) {
    // const self = this
    this.res = res
    this.req = req
    // if (this._isAsync) {
    //   this.onAborted(() => {
    //     self.isAborted = true
    //   })
    // }
  }

  initSerializers () {
    if (!this.schema) {
      return JSON.stringify
    }
    const keys = Object.keys(this.schema)
    const httpCodeKeys = Object.keys(this.schema).filter(isHttpCode)
    if (!keys.length !== httpCodeKeys.length) {
      return fastJson(this.schema.valueOf())
    }
    const result = Object.assign({}, httpCodeKeys)
    httpCodeKeys.forEach(key => {
      result[key] = fastJson(this.schema[key].valueOf())
    })
    return result
  }

  getProxiedRemoteAddress () {
    return this.res.getProxiedRemoteAddress()
  }

  getRemoteAddress () {
    return this.res.getRemoteAddress()
  }

  getWriteOffset () {
    return this.res.getWriteOffset()
  }

  close () {
    if (this._isAborted) {
      console.log('uWs debugging: "close" aborted ')
      return this
    }
    return this.res.close()
  }

  cork (cb) {
    if (this._isAborted) {
      console.log('uWs debugging: "cork" aborted ')
      return this
    }
    return this.res.cork(cb)
  }

  end (body) {
    if (this._isAborted) {
      console.log('uWs debugging: "end" aborted ')
      return this
    }
    this.res.writeStatus(this._status)
    this.writeHeaders()
    return this.res.end(body)
  }

  onAborted (handler) {
    this.res.onAborted(handler)
    return this
  }

  onData (handler) {
    if (this._isAborted) {
      console.log('uWs debugging: "onData" aborted ')
      return this
    }
    return this.onData(handler)
  }

  onWritable (handler) {
    if (this._isAborted) {
      console.log('uWs debugging: "onWritable" aborted ')
      return this
    }
    return this.res.onWritable(handler)
  }

  tryEnd (fullBodyOrChunk, totalSize) {
    if (this._isAborted) {
      console.log('uWs debugging: "tryEnd" aborted ')
      return [true, true]
    }
    return this.res.tryEnd(fullBodyOrChunk, totalSize)
  }

  upgrade (userData, secWebSocketKey, secWebSocketProtocol, secWebSocketExtensions, context) {
    if (this._isAborted) {
      console.log('uWs debugging: "upgrade" aborted ')
      return this
    }
    return this.res.upgrade(userData, secWebSocketKey, secWebSocketProtocol, secWebSocketExtensions, context)
  }

  write (chunk) {
    if (this._isAborted) {
      console.log('uWs debugging: "write" aborted ')
      return this
    }
    return this.res.write(chunk)
  }

  writeHeader (key, value) {
    if (this._isAborted) {
      console.log('uWs debugging: "writeHeader" aborted ')
      return this
    }
    return this.res.writeHeader(key, value)
  }

  writeStatus (status) {
    if (this._isAborted) {
      console.log('uWs debugging: "writeStatus" aborted ')
      return this
    }
    return this.res.writeStatus(status)
  }

  writeHeaderValues (header, values) {
    for (let i = 0, len = values.length; i < len; i += 1) {
      this.res.writeHeader(header, `${values[i]}`)
    }
    return this
  }

  writeHeaders () {
    for (const header in this._headers) {
      const value = this.headers[header]
      if (value) {
        if (value.splice) {
          this.writeHeaderValues(header, value)
        } else {
          this.res.writeHeader(header, `${value}`)
        }
      }
    }
    return this
  }
}

module.exports = ResponseBase
