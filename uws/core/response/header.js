module.exports = {
  getHeader (key) {
    return !!this._headers && !!key && this._headers[key]
  },
  hasHeader (key) {
    return (
      !!this._headers &&
      this._headers[key] !== undefined &&
      this._headers[key] !== null
    )
  },
  removeHeader (key) {
    if (!this._headers || !this._headers[key]) {
      return undefined
    }
    if (!this._modifiedEnd) {
      this.modifyEnd()
    }
    this._headers[key] = null
    delete this._headers[key]

    return this
  },
  setHeader (key, value) {
    if (!this._modifiedEnd) {
      this.modifyEnd()
    }

    if (!this._headers) {
      this._headers = {}
    }
    this._headers[key] = value
    return this
  },
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
  },
  writeHeaderValues (header, values) {
    for (let i = 0, len = values.length; i < len; i += 1) {
      this.writeHeader(header, `${values[i]}`)
    }
  },
  writeHeaders (headers) {
    for (const header in headers) {
      const value = headers[header]
      if (value) {
        if (value.splice) {
          this.writeHeaderValues(header, value)
        } else {
          this.writeHeader(header, `${value}`)
        }
      }
    }
    return this
  },
  applyHeadersAndStatus () {
    const { _headers, statusCode } = this

    if (typeof statusCode === 'string') {
      this.writeStatus(statusCode)
      this.statusCode = 200
    }

    for (const header in _headers) {
      const value = _headers[header]

      if (value) {
        if (value.splice) {
          this.writeHeaderValues(header, value)
        } else {
          this.writeHeader(header, `${value}`)
        }
        this.removeHeader(header)
      }
    }

    return this
  }
}
