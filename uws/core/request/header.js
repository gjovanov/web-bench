
module.exports = {
  getHeaders (req) {
    let headers
    if (this.schema && this.schema.headers) {
      const { properties } = this.schema.headers.valueOf()
      for (const property in properties) {
        if (!headers) {
          headers = {}
        }
        headers[property] = req.getHeader(property)
      }
      return headers
    } else {
      req.forEach((key, value) => {
        if (!headers) {
          headers = {}
        }
        headers[key] = value
      })
    }
    return headers
  }
}
