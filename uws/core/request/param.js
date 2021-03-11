const PARAMS_REGEX = /:([A-Za-z0-9_-]+)/g

module.exports = {
  prepareParams (rawPath) {
    if (rawPath.indexOf(':') !== -1) {
      const paramsArray = rawPath.match(PARAMS_REGEX)

      if (paramsArray) {
        return paramsArray.map((name) => name.substr(1))
      }
    }

    return null
  },

  getParams (req) {
    let params
    if (this.params) {
      if (!params && this.params.length > 0) {
        params = {}
      }
      for (let i = 0, len = this.params.length; i < len; i += 1) {
        params[this.params[i]] = req.getParameter(i)
      }
    }
    req.params = params
    return params
  }
}
