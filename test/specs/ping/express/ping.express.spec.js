const test = require('ava')
const autocannon = require('autocannon')
const port = 4003
test('ping', async t => {
  try {
    const result = await autocannon({
      url: `http://localhost:${port}/api/ping`,
      method: 'GET',
      connections: 10, // default
      pipelining: 128, // default,
      // workers: 2,
      duration: 3 // default
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
