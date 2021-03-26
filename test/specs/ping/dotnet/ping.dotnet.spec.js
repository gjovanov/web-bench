const test = require('ava')
const autocannon = require('autocannon')
const port = 5000
test('ping', async t => {
  try {
    const result = await autocannon({
      url: `http://localhost:${port}/api/ping`,
      method: 'GET',
      connections: 100, // default
      pipelining: 256, // default,
      workers: 4,
      duration: 5 // default
    })
    console.log({
      average: result.requests.average,
      sent: result.requests.sent,
      total: result.requests.total
    })
  } catch (e) {
    t.fail(e)
  }

  t.pass()
})
