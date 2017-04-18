const WebSocket = require('ws')
const assert = require('assert')
const request = require('request')
const freeport = require('freeport')
const server = require('../server.js')

describe(__filename, () => {

  let ws
  let serverPort
  before((done) => {
    freeport(function(err, port) {
      assert.ok(!err, err ? err.stack : '')
      serverPort = port
      server.listen(serverPort, (err) => {
        assert.ok(!err, err ? err.stack : '')
        
        console.log('Test server started on %d', server.address().port)
        done()
      })
    })
  })

  after(() => {
    server.close()
  })
  
  it('HTTP service running', (done) => {
    request('http://127.0.0.1:' + serverPort, (err) => {
      done(err)
    })
  })
  
  it('can connect to WS', (done) => {
    try {
      ws = new WebSocket('ws://127.0.0.1:' + serverPort, {
        origin: 'http://127.0.0.1/'
      })
      ws.on('open', () => {
        done()
      })
    } catch(err) {
      assert.ok(!err, err ? err.stack : '')
    }
  })
         
  it('receives data', function(done) {
    this.timeout(2100)
    let receivedMessages = []
    setTimeout(() => { 
      ws.close()
      assert.ok(receivedMessages.length >= 2)
      receivedMessages.forEach((message, idx) => {
        assert.ok(/^https?:\/\/www\.example\.com.+$/mg.test(message.url), `message [${idx}] => ${message.url}`)
        assert.ok(/^192\.168\.0\.\d{1,3}$/mg.test(message.ip), `message [${idx}] => ${message.ip}`)
        assert.ok(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/mg.test(message.dateTime), `message [${idx}] => ${message.dateTime}`)
      })
      done()
    }, 2000)
    ws.on('message', (data) => {
      receivedMessages.push(JSON.parse(data))
    })
  })

})
