const test = require('ava')
const autocannon = require('autocannon')
let port
let servername
const connections = 10
const pipelining = 1024
const workers = 4
const duration = 5

test.serial('ping-dotnet', async t => {
  try {
    port = 5000
    servername = 'dotnet'
    const result = await autocannon({
      url: `http://localhost:${port}/api/ping`,
      method: 'GET',
      connections,
      pipelining,
      workers,
      duration
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
      connections,
      pipelining,
      workers,
      duration
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
      connections,
      pipelining,
      workers,
      duration
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
      connections,
      pipelining,
      workers,
      duration
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

test.serial('ping-nanoexpress', async t => {
  try {
    port = 4004
    servername = 'nanoexpress'
    const result = await autocannon({
      url: `http://localhost:${port}/api/ping`,
      method: 'GET',
      connections,
      pipelining,
      workers,
      duration
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
