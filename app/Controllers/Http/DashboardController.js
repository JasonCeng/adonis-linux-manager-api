'use strict'
const osu = require('node-os-utils');
const cpu = osu.cpu;
const cpuStat = require('cpu-stat');
const os = require('os');
const schedule = require('node-schedule');
const Promise = require('bluebird');

class DashboardController {
  cpuUsageData ({ request, auth, response }) {
    try {

      const option = { 
        duration: 10,
        checkTime: 5,
        max: 8640
      }
      var max = option.max || 30;
      var duration = (option.duration || 10) * 1000;
      var checkTime = (option.checkTime || 1) * 1000;

      console.log('global.Performance:' + global.Performance)

      var Performance = global.Performance

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
      console.log('Performance.cpu.length:' + Performance.cpu.length)
      console.log('Performance.mem.length:' + Performance.mem.length)

      //获取存储在全局对象中的监控数据
      var result = {};

      function scheduleRecurrenceRule() {

        var rule = new schedule.RecurrenceRule();
        rule.second = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

        var i = 1;

        schedule.scheduleJob(rule, function() {
          cpuStat.usagePercent({ sampleMs:checkTime }, function(err, cpuPercent) {
            console.log('第' + i + '次执行');
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
    
            Performance.cpu.push([ time, cpuPercent ]);
            console.log('cpu: ', cpuPercent, '%');
    
            var totalMem = os.totalmem();
            var usedMem = totalMem - os.freemem();
            var memPercent = 100 * usedMem / totalMem;
    
            Performance.mem.push([ time, memPercent ]);
            console.log('mem: ', memPercent, '%');
    
            console.log('Performance.cpu:' + Performance.cpu + '\n');
            console.log('Performance.cpu.length:' + Performance.cpu.length + '\n');
    
            console.log('global.Performance.cpu:' + global.Performance.cpu + '\n');
            console.log('global.Performance.cpu.length:' + global.Performance.cpu.length + '\n');
    
            global.Performance = Performance;
          })

          Performance = global.Performance || { cpu:[], mem:[] };

          //只需要显示最新的30次监控数据
          for (var key in Performance) {
            result[key] = Performance[key].slice(-30);
          }

          console.log(result)
        });
      }
      
      scheduleRecurrenceRule()

      response.json({
        status: 'success',
        data: {
          data: result
        }
      })

      // setTimeout(() => {
      //   Performance = global.Performance || { cpu:[], mem:[] };

      //   console.log('outside Performance.cpu:' + Performance.cpu + '\n');
      //   console.log('outside Performance.cpu.length:' + Performance.cpu.length + '\n');

      //   //获取存储在全局对象中的监控数据
      //   var result = {};
      //   //只需要显示最新的30次监控数据
      //   for (var key in Performance) {
      //     result[key] = Performance[key].slice(-30);
      //   }

      // }, 5000);
      
      
      // return response.json({
      //   status: 'success',
      //   data: {
      //     data: ''
      //   }
      // })
    } catch (error) {
      console.log(error)
      response.status(400).json({
        status: 'error',
        message: error
      })
    }
  } 
}

module.exports = DashboardController
