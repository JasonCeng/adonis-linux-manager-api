var cpuStat = require('cpu-stat');
var os = require('os');

function monit() {
  const option = {
    duration: 10,
    checkTime: 5,
    max: 8640
  }
  var max = option.max || 30;
  var duration = (option.duration || 10) * 1000;
  var checkTime = (option.checkTime || 1) * 1000;

  var Performance = global.Performance;
  //var PerformanceSave = global.PerformanceSave;
  if (!Performance) {
    //初始化监控数据
    Performance = { cpu:[], mem:[] };
    global.Performance = Performance;

    var now = Date.now();
    for (var i = 0; i < 30; i++) {
      var time = now - i * duration;
      Performance.cpu.push([ time, 0 ]);
      Performance.mem.push([ time, 0 ]);
    }
  }

  cpuStat.usagePercent({ sampleMs:checkTime }, function(err, cpuPercent) {
    if (err) {
        console.error(err);
        cpuPercent = 0;
    }
    var Performance = global.Performance;
    var time = Date.now();

    //最多记录max次监控数据, 把旧数据移除
    if (Performance.cpu.length >= max) Performance.cpu.shift();
    if (Performance.mem.length >= max) Performance.mem.shift();

    Performance.cpu.push([ time, cpuPercent ]);
    console.log('cpu: ', cpuPercent, '%');

    var totalMem = os.totalmem();
    var usedMem = totalMem - os.freemem();
    var memPercent = 100 * usedMem / totalMem;

    Performance.mem.push([ time, memPercent ]);
    console.log('mem: ', memPercent, '%');
  })
  //获取存储在全局对象中的监控数据
  Performance = global.Performance || { cpu:[], mem:[] };
  var result = {};
  //只需要显示最新的30次监控数据
  for (var key in Performance) {
    result[key] = Performance[key].slice(-30);
  }
}
setTimeout(monit, 10000);