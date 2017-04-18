const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const HTTPTrafficGenerator = require('./lib/HTTPTrafficGenerator.js')
const app = express()

app.use(express.static('public'))

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })


let trafficGenerator = new HTTPTrafficGenerator()

wss.on('connection', function connection(ws) {
  console.log('New client connected')
  trafficGenerator.subscribe()

  trafficGenerator.on('data', (data) => {
    ws.send(data)
  })

  ws.on('close', () => {
    console.log('Client left')
    trafficGenerator.unsubscribe()
  })
})

if(require.main === module) {
  server.listen(3000, () => {
    console.log('Listening on %d', server.address().port)
  })
} else {
  module.exports = server
}
