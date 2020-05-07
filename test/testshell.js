var child_process = require('child_process');
var Promise = require('bluebird')

const getAsync = Promise.promisify(child_process.exec, { multiArgs: false, context: child_process })

// var cmdStr = 'curl http://www.weather.com.cn/data/sk/101010100.html';

let cmdData = {}

getAsync('curl http://www.weather.com.cn/data/sk/101010100.html').then(data => {
  console.log(data)
  cmdData = JSON.parse(data)
  console.log(cmdData)
}).catch(err => {
  console.log('cmd err: ' + err)
})

// exec(cmdStr, function(err, stdout, stderr){
//   if(err) {
//     console.log('get weather api error:'+stderr);
//   } else {
//     var data = JSON.parse(stdout);
//     console.log(data);
//   }
// });