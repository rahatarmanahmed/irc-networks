var fs = require('fs')
var path = require('path')
var Xray = require('x-ray')
var through2 = require('through2')
var JSONStream = require('JSONStream')

const x = Xray()

x('http://irc.netsplit.de/networks/', ['.netlist a@html'])

.write()

.pipe(JSONStream.parse('*'))

.pipe(through2.obj((chunk, enc, cb) => {
  const url = 'http://irc.netsplit.de/servers/?net=' + chunk

  x(url, 'body > table > tr:nth-child(4) > td > table > tr > td.center-column > table > tr:nth-child(2) > td', {
    avgUsers: 'table:nth-child(1) > tr > td > p:nth-child(4) > b:nth-child(2)@html',
    avgChannels: 'table:nth-child(1) > tr > td > p:nth-child(4) > b:nth-child(3)@html',
    servers: x('table:nth-child(4) > tr:nth-child(2) > td > table > tr:not(:nth-child(1))', [{
      hostname: 'td:nth-child(1)@html',
      port: 'td:nth-child(2)@html',
      ssl: 'td:nth-child(3)@html',
      isMainServer: 'td:nth-child(4)@html'
    }])
  })((err, network) => {
    if (err) return cb(err)

    network.avgUsers = Number(network.avgUsers.split(' ')[0])
    network.avgChannels = Number(network.avgChannels.split(' ')[0])
    network.servers.forEach(server => {
      server.hostname = server.hostname.replace(/&#x200B;/g, '')
      server.port = Number(server.port)
      server.ssl = server.ssl === 'on'
      server.isMainServer = server.isMainServer === 'yes'
    })

    cb(null, network)
  })
}))
.pipe(JSONStream.stringify('[', ',\n', ']', 2))
.pipe(fs.createWriteStream(path.join(__dirname, '../networks.json')))
.on('error', e => console.error(e))
