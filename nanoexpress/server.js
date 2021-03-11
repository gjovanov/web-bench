const nanoexpress = require('nanoexpress')
const app = nanoexpress()
const port = 4004

const { sso } = require('node-expose-sspi')
const auth = sso.auth({ useGroups: false, useSession: false })

const authPromise = (ctx) => {
  return new Promise((resolve, reject) => {
    const next = (err) => {
      return err ? reject(err) : resolve()
    }
    auth(ctx.req, ctx.res, next)
  })
}

// app.use(async (req, res) => {
//   const ctx = {
//     req,
//     res
//   }
//   req.socket = {
//     remoteAddress: res.getRemoteAddressAsText(),
//     remotePort: port
//   }
//   await authPromise(ctx)
// })

// app.set('etag', false)
app.get('/api/ping', (req, res) => {
  res.send('pong')
})
// app.get('/api/auth', async (req, res) => {
//   res.onAborted(() => {
//     res.aborted = true
//   })

//   console.log(req.sso)
//   if (!res.aborted) {
//     res.end('hi')
//   }
// })
app.listen(port)
