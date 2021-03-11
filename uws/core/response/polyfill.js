const http = require('http')
const HTTP_PREFIX = 'http://'
const HTTPS_PREFIX = 'https://'

const normalizeLocation = (path, config, host) => {
  if (path.indexOf('http') === -1) {
    if (path.indexOf('/') === -1) {
      path = `/${path}`
    }
    let httpHost
    if (host) {
      httpHost = host
    } else if (config && config.host) {
      httpHost = config.host
      httpHost += config.port ? `:${config.port}` : ''
    }
    if (httpHost) {
      path =
        (config && config.https ? HTTPS_PREFIX : HTTP_PREFIX) + httpHost + path
    }
  }
  return path
}

module.exports = {
  writeHead (code, headers) {
    if (typeof code === 'object' && !headers) {
      headers = code
      code = 200
    }

    if (code !== undefined && code !== 200) {
      this.status(code)
    }
    if (headers !== undefined) {
      this.setHeaders(headers)
    }

    return this
  },
  status (code, notModify) {
    if (!notModify && this.modifyEnd && !this._modifiedEnd) {
      this.modifyEnd()
    }

    if (typeof code === 'string') {
      this.statusCode = code
      this.rawStatusCode = parseInt(code, 10)
    } else if (http.STATUS_CODES[code] !== undefined) {
      this.statusCode = `${code} ${http.STATUS_CODES[code]}`
      this.rawStatusCode = code
    } else {
      throw new Error(`Invalid Code: ${JSON.stringify(code)}`)
    }

    return this
  },
  redirect (code, path) {
    const { __request, config } = this
    const host = __request && __request.headers && __request.headers.host

    if (!path && typeof code === 'string') {
      path = code
      code = 301
    }

    let Location = ''
    if (path) {
      Location = normalizeLocation(path, config, host)
    }

    this.writeHead(code, { Location })
    this.end()

    return this
  }
}
