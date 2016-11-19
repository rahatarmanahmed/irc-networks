# irc-networks
JSON list of irc networks scraped from irc.netsplit.de. Some are overridden to provide better network server options.

If you find any outdated or incorrect servers listed here, or know of better generic server hostnames and ssl ports, contributions are welcomed!

## Installing
`npm install irc-networks`

## Usage
```js
var networks = require('irc-ne');
```

The first couple networks look like this:
```json
[
  {
    "avgUsers": 167,
    "avgChannels": 38,
    "servers": [
      {
        "hostname": "irc.1chan.us",
        "port": 6667,
        "ssl": false,
        "isMainServer": true
      }
    ],
    "name": "1chan"
  },
  {
    "avgUsers": 23,
    "avgChannels": 7,
    "servers": [
      {
        "hostname": "irc.fantastico.onmypc.org",
        "port": 6667,
        "ssl": false,
        "isMainServer": true
      }
    ],
    "name": "1chat_italia"
  },
  ...
```

Average users and channels will likely be outdated, as they are the values saved from when the data was scraped. That being said, they can be a semi decent way to order networks by popularity.

## Updates

Data updated by re-scraping the site will be published as new semver minor versions.

## Running the scraper

If you want to scrape the site yourself, run `npm install` then `npm start`. If you want to update the data with override servers, update `override.json`, and run `node lib/override.js`.
