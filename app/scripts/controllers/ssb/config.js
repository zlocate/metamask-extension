const extend = require('xtend')

module.exports = function (opts) {
  return require('ssb-config/inject')(null, extend({
      seeds: [
        // my pub
        'ws://128.199.132.182:9009~shs:DTNmX+4SjsgZ7xyDh5xxmNtFqa6pWi5Qtw7cE8aR9TQ=',
      ],
      timers: {
        inactivity: -1, handshake: 30000,
      },
      connections: {
        // disable the local server, since we have no way to receive connections
        incoming: {},
        outgoing: {
  //        net: [{transform: 'shs'}],
          ws: [{transform: 'shs'}],
  //        tunnel: [{transform: 'shs'}]
        },
      },
      gossip: {
        pub: false, // don't look for pub announcements
      },
      replicate: {
        legacy: false, // don't do legacy replication (only ebt)
      },
      ebt: { logging: true },
      passwordProtected: true,
    }), opts)
}
