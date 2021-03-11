const parse = require('querystring').parse

module.exports = {
  getQuery (req) {
    const query = req.getQuery()
    let queries
    if (!query) {
      return queries
    }
    const parsed = parse(query)
    for (const item in parsed) {
      if (!queries) {
        queries = {}
      }
      queries[item] = parsed[item]
    }
    return queries
  }
}
