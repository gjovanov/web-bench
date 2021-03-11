const compressStream = require('../utils/compress')

module.exports = {
  type (contentType) {
    this.setHeader('Content-Type', contentType)
    return this
  },
  send (result) {
    if (!result) {
      result = ''
    } else if (typeof result === 'object') {
      this.setHeader('Content-Type', 'application/json; charset=utf-8')

      const { fastJson, rawStatusCode: statusCode } = this

      if (fastJson) {
        if (typeof fastJson === 'function') {
          result = fastJson(result)
        } else if (fastJson && typeof fastJson[statusCode] === 'function') {
          result = fastJson[statusCode](result)
        } else {
          const _statusCode = `${statusCode}`
          for (let code in fastJson) {
            const fastJsonFunc = fastJson[code]
            if (code === _statusCode) {
              result = fastJsonFunc(result)
            } else if (code.indexOf('X') !== -1) {
              for (let i = 0; i < 3; i += 1) {
                if (code.charAt(i) === 'X') {
                  code =
                    code.substr(0, i) +
                    _statusCode.charAt(i) +
                    code.substr(i, code.length - (i + 1))
                }
              }

              // eslint-disable-next-line eqeqeq
              if (code == _statusCode) {
                result = fastJsonFunc(result)
              }
            }
          }
        }
      } else {
        result = JSON.stringify(result)
      }
    }

    return this.end(result)
  },

  modifyEnd () {
    if (!this._modifiedEnd) {
      const _oldEnd = this.end

      this.end = function modifiedEnd (chunk, encoding) {
        let { _headers, statusCode, rawStatusCode } = this

        // Polyfill for express-session and on-headers module
        if (!this.writeHead.notModified) {
          this.writeHead(statusCode || rawStatusCode, _headers)
          this.writeHead.notModified = true
          _headers = this._headers
        }

        if (typeof statusCode === 'number' && statusCode !== rawStatusCode) {
          this.status(statusCode)
          statusCode = this.statusCode
        }
        if (_headers) {
          if (statusCode && statusCode !== rawStatusCode) {
            this.writeStatus(statusCode)
          }

          this.applyHeadersAndStatus()
        } else if (statusCode && statusCode !== rawStatusCode) {
          this.writeStatus(statusCode)
        }

        return encoding
          ? _oldEnd.call(this, chunk, encoding)
          : _oldEnd.call(this, chunk)
      }

      this._modifiedEnd = true
    }
    return this
  },
  pipe (stream, size, compressed = false) {
    const { __request: req } = this
    const { onAborted, headers, responseHeaders } = req
    let isAborted = false

    this.stream = true

    if (compressed) {
      const compressedStream = compressStream(stream, responseHeaders || headers)

      if (compressedStream) {
        stream = compressedStream
      }
    }

    onAborted(() => {
      if (stream) {
        stream.destroy()
      }
      if (stream) {
        stream.destroy()
      }
      isAborted = true
    })

    if (compressed || !size) {
      stream.on('data', (buffer) => {
        if (isAborted) {
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
        if (isAborted) {
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
        if (!isAborted) {
          this.writeStatus('500 Internal server error')
          this.end()
        }
        stream.destroy()
      })
      .on('end', () => {
        this.stream = 1
        if (!isAborted) {
          this.end()
        }
      })

    return this
  }
}
