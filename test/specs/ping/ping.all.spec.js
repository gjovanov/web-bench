const test = require('ava')
const autocannon = require('autocannon')
let port
let servername

test.serial('ping-dotnet', async t => {
  try {
    port = 5000
    servername = 'dotnet'
    const result = await autocannon({
      url: `http://localhost:${port}/api/ping`,
      method: 'GET',
      connections: 10, // default
      pipelining: 256, // default,
      // workers: 2,
      duration: 3 // default
    })
    console.log(servername)
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

test.serial('ping-uws', async t => {
  try {
    port = 4001
    servername = 'uws'
    const result = await autocannon({
      url: `http://localhost:${port}/api/ping`,
      method: 'GET',
      connections: 10, // default
      pipelining: 256, // default,
      // workers: 2,
      duration: 3 // default
    })
    console.log(servername)
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

test.serial('ping-fastify', async t => {
  try {
    port = 4002
    servername = 'fastify'
    const result = await autocannon({
      url: `http://localhost:${port}/api/ping`,
      method: 'GET',
      connections: 10, // default
      pipelining: 256, // default,
      // workers: 2,
      duration: 3 // default
    })
    console.log(servername)
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

test.serial('ping-express', async t => {
  try {
    port = 4003
    servername = 'express'
    const result = await autocannon({
      url: `http://localhost:${port}/api/ping`,
      method: 'GET',
      connections: 10, // default
      pipelining: 256, // default,
      // workers: 2,
      duration: 3 // default
    })
    console.log(servername)
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
