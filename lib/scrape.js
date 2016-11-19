const Xray = require('x-ray')
const through2 = require('through2')
const JSONStream = require('JSONStream')
const toArray = require('stream-to-array')

const x = Xray()
const REQUEST_THROTTLE = 10000

const stream = x('http://irc.netsplit.de/networks/', ['.netlist a@html'])

.write()

.pipe(JSONStream.parse('*'))

.pipe(through2.obj((chunk, enc, cb) => {
  const url = 'http://irc.netsplit.de/servers/?net=' + chunk
  console.error('Fetching data for', chunk)

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
    if (err) return setTimeout(() => cb(err), REQUEST_THROTTLE)

    if (!network.avgUsers ||
    !network.avgChannels ||
    !network.servers.length ||
    network.servers.some(s => !s.hostname || !s.port)) {
      console.error(`${chunk} has incomplete data. Not including in JSON...`)
      return setTimeout(() => cb(null), REQUEST_THROTTLE)
    }

    network.name = chunk
    network.avgUsers = Number(network.avgUsers.split(' ')[0])
    network.avgChannels = Number(network.avgChannels.split(' ')[0])
    network.servers.forEach(server => {
      server.hostname = server.hostname.replace(/&#x200B;/g, '')
      server.port = Number(server.port)
      server.ssl = server.ssl === 'on'
      server.isMainServer = server.isMainServer === 'yes'
    })

    setTimeout(() => cb(null, network), REQUEST_THROTTLE)
  })
}))
.on('error', onError)

toArray(stream)
.then(arr => console.log(JSON.stringify(arr, null, 2)))
.catch(onError)

function onError (e) {
  console.error(e)
  console.error(e.stack)
  process.exit(1)
}
