<<<<<<< HEAD
const port = 4001
const App = require('./core/app')
const routes = require('./routes')

const appConfig = {
}
const app = new App(appConfig, routes)
app.server.listen(port, (token) => {
  if (token) {
    console.log('Listening to port ' + port)
  } else {
    console.log('Failed to listen to port ' + port)
  }
})
=======
const uWS = require('uWebSockets.js')
const port = 4001
uWS.App()
  .get('/api/ping', (res, req) => {
    res.end('pong')
  }).listen(port, (token) => {
    if (token) {
      console.log('Listening to port ' + port)
    } else {
      console.log('Failed to listen to port ' + port)
    }
  })
>>>>>>> 5690ea7847285aa3954bc9708258d3caba81d356
