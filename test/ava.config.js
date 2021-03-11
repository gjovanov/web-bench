const files = ['specs/ping/*.spec.js']

export default {
  files,
  cache: true,
  concurrency: 64,
  failFast: true,
  failWithoutAssertions: false,
  verbose: true
}
