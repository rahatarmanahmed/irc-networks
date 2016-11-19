const fs = require('fs')
const path = require('path')

var rawNetworks = JSON.parse(fs.readFileSync(path.join(__dirname, '../raw-networks.json')).toString())
var overrideJSON = JSON.parse(fs.readFileSync(path.join(__dirname, '../override.json')).toString())

var overrides = {}
overrideJSON.forEach(override => { overrides[override.name] = override })

var networks = rawNetworks.map(network => {
  if (overrides[network.name]) {
    return Object.assign(network, overrides[network.name])
  }
  return network
})

fs.writeFileSync(path.join(__dirname, '../networks.json'), JSON.stringify(networks, null, 2))
