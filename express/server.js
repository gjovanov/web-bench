const express = require('express')
const app = express()
const port = 4003
app.set('etag', false)
app.get('/api/ping', (req, res) => {
  res.send('pong')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
