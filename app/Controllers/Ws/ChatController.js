'use strict'

const osu = require('node-os-utils');
const netstat = osu.netstat
const cpu = osu.cpu;
const cpuStat = require('cpu-stat');
const os = require('os');
const schedule = require('node-schedule');

class ChatController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
    console.log('Connected socket id %s', socket.id)
    socket.on('message', (data) => {
      console.log('this.socket.on message')
      console.log(data);
    })
    socket.on('close', () => {
      global.job.cancel(false) // 当websocket连接关闭时，停止定时查找服务器CPU、内存等运行状态任务job
    })
  }

  onMessage (message) {
    let _this = this
    global.job = null

    const option = {
      duration: 5,
      checkTime: 5,
      max: 8640
    }
    var max = option.max || 30; //最多存储几次数据，默认30次
    var duration = (option.duration || 10) * 1000; //每次监控的时间间隔，默认10秒一次
    var checkTime = (option.checkTime || 1) * 1000; //计算CPU使用率的耗时，默认1秒，时间越长越精确

    // console.log('global.Performance:' + global.Performance)

    var Performance = global.Performance

    if (!Performance) {
      //初始化监控数据
      Performance = { cpu:[], mem:[], net:[] };
      global.Performance = Performance;

      var now = Date.now();
      for (var i = 0; i < 30; i++) {
        var time = now - i * duration;
        Performance.cpu.push([ time, 0 ]);
        Performance.mem.push([ time, 0 ]);
        Performance.net.push([ time, 0, 0 ]); // 网络情况：第一位是时间，第二位是inputBytes，第三位是outputBytes
      }
    }
    // console.log('Performance.cpu.length:' + Performance.cpu.length)
    // console.log('Performance.mem.length:' + Performance.mem.length)

    function scheduleRecurrenceRule() {

      var rule = new schedule.RecurrenceRule();
      rule.second = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]; // 5秒一次
      // rule.second = [0,  10,  20,  30,  40,  50]; // 10秒一次

      var i = 1;

      global.job = schedule.scheduleJob(rule, function() {
        cpuStat.usagePercent({ sampleMs:checkTime }, function(err, cpuPercent) {
          // console.log('第' + i + '次执行');
          i++;

          if (err) {
              console.error('cpuStat.usagePercent error:' + err);
              cpuPercent = 0;
          }

          var Performance = global.Performance;
          var time = Date.now();
  
          //最多记录max次监控数据, 把旧数据移除
          if (Performance.cpu.length >= max) Performance.cpu.shift();
          if (Performance.mem.length >= max) Performance.mem.shift();
  
          //记录CPU使用率
          Performance.cpu.push([ time, cpuPercent ]);
          // console.log('cpu: ', cpuPercent, '%');
  
          //计算内存使用率
          var totalMem = os.totalmem();
          var usedMem = totalMem - os.freemem();
          var memPercent = 100 * usedMem / totalMem;
  
          //记录内存使用率
          Performance.mem.push([ time, memPercent ]);
          // console.log('mem: ', memPercent, '%');

          //记录网络情况
          // netstat.stats().then(info => {
          //   console.log(info)
          //   // info数据结构示例如下：
          //   // [ { interface: 'lo',
          //   //     inputBytes: '731508412',
          //   //     outputBytes: '731508412' },
          //   //   { interface: 'eth0',
          //   //     inputBytes: '1356471479',
          //   //     outputBytes: '26631036763' } ]
          //   Performance.net.push([ time, info[0].inputBytes, info[0].outputBytes ]);
          //   console.log('网络inputBytes：' + info[1].inputBytes + 'Bytes, ' + '网络outputBytes：' + info[1].outputBytes + 'Bytes')
          // })

          netstat.inOut().then(info => {
            // console.log(info)
             // info数据结构示例如下：
            //  { total: { inputMb: 0.02, outputMb: 1.22 },
            //   eth0: { inputMb: 0.02, outputMb: 1.22 } }
            let inputBytes = info.total.inputMb * 1024 * 1024
            let outputBytes = info.total.outputMb * 1024 * 1024
            Performance.net.push([ time, inputBytes, outputBytes ]);
            // console.log('网络inputBytes：' + inputBytes + 'Bytes, ' + '网络outputBytes：' + outputBytes + 'Bytes')
          })
  
          // console.log('Performance.cpu:' + Performance.cpu + '\n');
          // console.log('Performance.cpu.length:' + Performance.cpu.length + '\n');
  
          // console.log('global.Performance.cpu:' + global.Performance.cpu + '\n');
          // console.log('global.Performance.cpu.length:' + global.Performance.cpu.length + '\n');
  
          global.Performance = Performance;
        })

        //获取存储在全局对象中的监控数据
        var result = {};

        Performance = global.Performance || { cpu:[], mem:[], net:[] };

        //只需要显示最新的30次监控数据
        for (var key in Performance) {
          result[key] = Performance[key].slice(-30);
        }

        // console.log('result:', result)
        // console.log('result.length', result.length)

        // 使用websocket将result发送给客户端*******************************************************************
        _this.socket.emit('message2', result)

      });

    }
    
    scheduleRecurrenceRule()
  }
}

module.exports = ChatController
