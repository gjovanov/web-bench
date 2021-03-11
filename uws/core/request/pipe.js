
module.exports = {
  pipe (res, stream, totalSize) {
    res.onAborted(() => {
      stream.destroy()
      res.done = true
    })
    stream
      .on('data', (chunk) => {
        const ab = chunk.buffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength)
        const lastOffset = res.getWriteOffset()
        const [ok, done] = res.tryEnd(ab, totalSize)
        if (done) stream.destroy()
        if (ok) return
        // backpressure found!
        stream.pause()
        // save the current chunk & its offset
        res.ab = ab
        res.abOffset = lastOffset

        // set up a drainage
        res.onWritable((offset) => {
          const [ok, done] = res.tryEnd(res.ab.slice(offset - res.abOffset), totalSize)
          if (done) {
            stream.destroy()
          } else if (ok) {
            stream.resume()
          }
          return ok
        })
      })
      .on('error', () => {
        if (!res.done) {
          res.writeStatus('500').end()
        }
        stream.destroy()
      })
  }
}
