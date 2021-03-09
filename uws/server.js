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
