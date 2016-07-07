const port = 8124
const webshot = require('webshot')

//var jsdom = require('jsdom')
var runServer = require('../beefy')(8124)

webshot('http://localhost:' + port, 'screenshot.png', {
  takeShotOnCallback: true,
  captureSelector: '.mock-app-root'
}, function(err) {
  if (err) throw err
    console.log('completed screenshot!')
})

/*
jsdom.env(
  'http://0.0.0.0:' + port,
  ["http://code.jquery.com/jquery.js"],
  function (err, window) {
    console.log('there are %s input boxes', window.$('select'))
  }
)
*/
