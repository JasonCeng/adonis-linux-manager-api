var cpuStat = require('cpu-stat');
var osutils = require('os-utils');
// var _ = require('lodash');
// var ps = require('current-processes');
var process = require('child_process');

var osu = require('node-os-utils')
var os = require('node-os-utils').os
var osCmd = require('node-os-utils').osCmd
var users = require('node-os-utils').users
var cpu = osu.cpu
 
var count = cpu.count() // 8

var Promise = require('bluebird')
var cmd = require('node-cmd')
 
const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd })
 
getAsync('node -v').then(data => {
  console.log('cmd data:' + data)
}).catch(err => {
  console.log('cmd err: ' + err)
})

let usersData = 0
users.openedCount().then(info =>{
  console.log('users.openedCount() info:' + info)
})

let vmstatsData = {}
osCmd.vmstats().then(info => {
  // vmstatsData = JSON.parse(info)
  console.log(info)
})

cpu.usage()
  .then(cpuPercentage => {
    console.log('node-os-utils CPU使用情况 = ' + cpuPercentage + '%') // 10.38
})

let osUptime = os.uptime()
console.log('系统负载均衡：' + osUptime)

var osCmd = osu.osCmd  
 
osCmd.whoami()
  .then(userName => {
    console.log(userName) // admin
})

var memory = 100*(osutils.totalmem()-osutils.freemem())/osutils.totalmem();
console.log("内存使用情况 = " + memory + "%");

cpuStat.usagePercent(function(err, percent, seconds) {
    if (err) {
        return console.log(err);
    }
    console.log("CPU使用情况 = "+ percent + "%");
});

process.exec('netstat -ntlp',function (error, stdout, stderr) {
  if (error !== null) {
    console.log('exec error: ' + stderr);
  } else {
    console.log(stdout)
  }
});

// ps.get(function(err, processes) {
//   var sorted = _.sortBy(processes, 'cpu');
//   var top5  = sorted.reverse().splice(0, 5);
//   console.log(top5);
// });