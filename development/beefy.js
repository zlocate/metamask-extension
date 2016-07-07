const beefy = require('beefy')
const http = require('http')
const fs = require('fs')
const path = require('path')

const port = 8124

console.log('pwd: ' + process.cwd())
console.log('diranme: ' + __dirname)

const handler = beefy({
    entries: {'/development/bundle.js': 'ui_dev.js'}
  , index: './development/index.html'
  , cwd: process.cwd()
  , quiet: false
  , bundlerFlags: ['-t', 'brfs']
})

http.createServer(handler).listen(port)
console.log(`Now listening on port ${port}`)
