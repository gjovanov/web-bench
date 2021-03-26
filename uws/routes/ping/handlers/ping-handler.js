module.exports = (route) => {
  return async (res, req) => {
    res.end('{ result: "pong "}')

    // res.cork(() => {
    //   res
    //     // .writeHeader('content-type', 'application/json')
    //     .end('{ result: "pong "}')
    //     // .end(route.stringify({
    //     //   result: 'pong'
    //     // }))
    // })
  }
}
