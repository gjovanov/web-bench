const cookie = require('cookie')
const ResponseBase = require('./response-base')

class Response extends ResponseBase {
  constructor (route, schema, isAsync) {
    super(route, schema, isAsync)

    console.log('constructor Response')
  }

  set (key, value) {
    const type = typeof key
    const isObject = (type === 'function' || (type === 'object' && !!key))
    if (isObject) {
      this.setHeaders(key)
    } else if (!!key && !!value) {
      this.setHeader(key, value)
    } else {
      throw new Error('Invalid parameters')
    }
    return this
  }

  append (key, value) {
    return this.set(key, value)
  }

  header (key, value) {
    return this.set(key, value)
  }

  getHeader (key) {
    return !!this._headers && !!key && this._headers[key]
  }

  setHeader (key, value) {
    this._headers[key] = value
    return this
  }

  removeHeader (key) {
    delete this._headers[key]
  }

  setHeaders (headers) {
    for (const header in headers) {
      if (this._headers) {
        const currentHeader = this._headers[header]
        if (currentHeader !== undefined || currentHeader !== null) {
          continue
        }
      }
      this.setHeader(header, headers[header])
    }

    return this
  }

  hasHeader (key) {
    return this._headers[key] !== null && this._headers[key] !== undefined
  }

  setCookie (name, value, options) {
    if (options.expires && Number.isInteger(options.expires)) {
      options.expires = new Date(options.expires)
    }
    const serialized = cookie.serialize(name, value, options)

    let setCookie = this.getHeader('Set-Cookie')

    if (!setCookie) {
      this.setHeader('Set-Cookie', serialized)
      return this
    }

    if (typeof setCookie === 'string') {
      setCookie = [setCookie]
    }

    setCookie.push(serialized)

    this.removeHeader('Set-Cookie')
    this.setHeader('Set-Cookie', setCookie)
    return this
  }

  cookie (name, value, options) {
    return this.setCookie(name, value, options)
  }

  removeCookie (name, options = {}) {
    const currTime = Date.now()
    if (!options.expires || options.expires >= currTime) {
      options.expires = currTime - 1000
    }
    this.setCookie(name, '', options)
    return this
  }

  clearCookie (name, options = {}) {
    return this.removeCookie(name, options)
  }

  hasCookie (name) {
    return this._cookies[name] !== null && this._cookies[name] !== undefined
  }

  status (status) {
    this._status = status
    this._statusRaw = parseInt(status)
    return this
  }

  type (contentType) {
    this.setHeader('Content-Type', contentType)
    return this
  }

  get serialize () {
    const status = this._status
    if (typeof this._serializers === 'function') {
      return this._serializers
    }
    if (typeof this._serializers[status] === 'function') {
      return this._serializers[status]
    }
    if (typeof this._serializers[`${status[0]}${status[1]}X`] === 'function') {
      return this._serializers[`${status[0]}${status[1]}X`]
    }
    if (typeof this._serializers[`${status[0]}XX`] === 'function') {
      return this._serializers[`${status[0]}XX`]
    }
    if (typeof this._serializers.XXX === 'function') {
      return this._serializers.XXX
    }
    return JSON.stringify
  }

  send (body) {
    let result = body
    if (!result) {
      result = ''
    } else if (typeof result === 'object') {
      this.setHeader('Content-Type', 'application/json; charset=utf-8')
      this.serialize(result)
    }
    this.end(result)
  }

  pipe (stream, size, compressed = false) {
    const self = this
    this.stream = true

    if (compressed) {
      const compressedStream = this.compress(stream, this._headers)

      if (compressedStream) {
        stream = compressedStream
      }
    }

    this.onAborted(() => {
      if (stream) {
        stream.destroy()
      }
      if (stream) {
        stream.destroy()
      }
      self._isAborted = true
    })

    if (compressed || !size) {
      stream.on('data', (buffer) => {
        if (self._isAborted) {
          stream.destroy()
          return
        }
        this.write(
          buffer.buffer.slice(
            buffer.byteOffset,
            buffer.byteOffset + buffer.byteLength
          )
        )
      })
    } else {
      stream.on('data', (buffer) => {
        if (self._isAborted) {
          stream.destroy()
          return
        }
        buffer = buffer.buffer.slice(
          buffer.byteOffset,
          buffer.byteOffset + buffer.byteLength
        )
        const lastOffset = this.getWriteOffset()

        // First try
        const [ok, done] = this.tryEnd(buffer, size)

        if (done) {
          stream.destroy()
        } else if (!ok) {
          // pause because backpressure
          stream.pause()

          // Register async handlers for drainage
          this.onWritable((offset) => {
            const [writeOk, writeDone] = this.tryEnd(
              buffer.slice(offset - lastOffset),
              size
            )
            if (writeDone) {
              stream.end()
            } else if (writeOk) {
              stream.resume()
            }
            return writeOk
          })
        }
      })
    }
    stream
      .on('error', () => {
        this.stream = -1
        if (!self._isAborted) {
          this.writeStatus('500 Internal server error')
          this.end()
        }
        stream.destroy()
      })
      .on('end', () => {
        this.stream = 1
        if (!self._isAborted) {
          this.end()
        }
      })

    return this
  }
}

module.exports = Response
