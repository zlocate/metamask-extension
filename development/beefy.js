const beefy = require('beefy')
const http = require('http')
const fs = require('fs')
const path = require('path')

const port = 8124

/* THIS WORKS:
 *
  beefy ui-dev.js:bundle.js --live --open --index=./development/index.html --cwd ./
*/

const handler = beefy({
    entries: {'mocker.js': 'bundle.js'}
  , cwd: __dirname
  , live: true
  , open: true
  , quiet: false
  , bundlerFlags: ['-t', 'brfs']
})


http.createServer(handler).listen(port)
console.log(`Now listening on port ${port}`)
