const S = require('fluent-schema')

const pingResponse = S.object()
  .prop('result', S.string())

module.exports = {
  ping: {
    response: pingResponse
  }
}
