var Promise = require('bluebird')
var cmd = require('node-cmd')
 
const getAsync = Promise.promisify(cmd.get, { multiArgs: false, context: cmd })
 
let uptimeData = {}
let uptimeDataStr = ''

getAsync('uptime').then(data => {
  console.log(data)
  uptimeDataStr = JSON.stringify(data)
  uptimeDataStr = uptimeDataStr.substring(1, uptimeDataStr.length-3)
  // uptimeData = JSON.parse(uptimeDataStr)
  console.log('cmd data:' + uptimeDataStr)
}).catch(err => {
  console.log('cmd err: ' + err)
})