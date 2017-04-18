var EventEmitter = require('events').EventEmitter
var util = require('util')

function HTTPTrafficGenerator() {
  EventEmitter.call(this)
  this._subscribersCount = 0
}

util.inherits(HTTPTrafficGenerator, EventEmitter)

HTTPTrafficGenerator.prototype.subscribe = function() {
  this._subscribersCount ++
  if(!this._pendingTimeout) {
    this._pendingTimeout = setTimeout(() => {
      this._generateNextPayload()
    }, 0)
  }
}

HTTPTrafficGenerator.prototype.unsubscribe = function() {
  this._subscribersCount --
  if(this._subscribersCount <= 0 && this._pendingTimeout) {
    clearTimeout(this._pendingTimeout)
  }
}

HTTPTrafficGenerator.prototype._generateNextPayload = function() {
  if(this._subscribersCount <= 0) {
    return
  }
  
  let payload = {
    url: randomURL(),
    ip: randomIPAddress(),
    dateTime: new Date()
  }

  console.log('Sending payload', payload)
  
  this.emit('data', JSON.stringify(payload))

  this._pendingTimeout = setTimeout(() => {
    this._generateNextPayload()
  }, randomDelay())
}

module.exports = HTTPTrafficGenerator





/** Generate a delay between 1ms and 900ms
 *  The delay is exponentially skewed towards shorter delays.
 */
function randomDelay() {
  let base = 1 + Math.round(Math.random() * 3000)
  let delay = Math.round(Math.pow(base, 2) / 10000)
  return delay
}

function randomIPAddress() {
  let network = '192.168.0.'
  let suffix = 2 + Math.round(Math.random() * 253)
  return network + suffix
}


const URLs = [
  'https://www.example.com/',
  'https://www.example.com/news',
  'https://www.example.com/about',
  'https://www.example.com/blog',
  'https://www.example.com/blog/tech',
  'https://www.example.com/blog/cooking',
  'https://www.example.com/blog/random'
]
function randomURL() {
  
  let index = Math.round(Math.random() * (URLs.length - 1))
  return URLs[index]
  
}
