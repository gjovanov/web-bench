const { sso } = require('node-expose-sspi')
const uWS = require('uWebSockets.js')
const port = 4001
const getHeaders = require('./core/request/header')
const getParams = require('./core/request/param')
const pipe = require('./core/request/pipe')
const getQuery = require('./core/request/query')

const authPromise = (ctx) => {
  return new Promise((resolve, reject) => {
    const next = (err) => {
      console.log('inside')

      console.log(err)
      err ? reject(err) : resolve()
    }
    try {
      const { sso } = require('node-expose-sspi')
      const auth = sso.auth({ useGroups: false, useSession: false })
      auth(ctx.req, ctx.res, next)
    } catch (e) {
      console.log(e)
    }
  })
}
uWS.App()
  .get('/api/ping', (res, req) => {
    res.end('{ "result": "pong" }')
  })
  .get('/api/auth', async (res, req) => {
    req.method = req.getMethod().toUpperCase()
    res.setHeader = res.writeHeader
    req.headers = getHeaders(req)
    req.query = getQuery(req)
    req.params = getParams(req)
    req.pipe = pipe

    res.onAborted(() => {
      res.aborted = true
    })
    req.socket = {
      remoteAddress: res.getRemoteAddressAsText(),
      remotePort: port
    }
    try {
      const ctx = {
        req,
        res
      }

      await authPromise(ctx)

      console.log(req.sso)
    } catch (e) {
      console.error('ERRRRRROR')
      console.error(e)
    }
    console.log('hi')
    if (!res.aborted) {
      res.end('hi')
    }
  })
  .listen(port, (token) => {
    if (token) {
      console.log('Listening to port ' + port)
    } else {
      console.log('Failed to listen to port ' + port)
    }
  })
