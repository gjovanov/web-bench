
module.exports = {
  getBody (res) {
    const route = this
    return new Promise((resolve) => {
      let buffer
      if (res.onData) {
        res.onData((ab, isLast) => {
          const curBuf = Buffer.from(ab)
          buffer = buffer ? Buffer.concat([buffer, curBuf]) : isLast ? curBuf : Buffer.concat([curBuf])
          if (isLast) {
            try {
              resolve(route.parse(buffer))
            } catch (e) {
              resolve(null)
            }
          }
        })
      } else {
        resolve(null)
      }
    })
  }
}
