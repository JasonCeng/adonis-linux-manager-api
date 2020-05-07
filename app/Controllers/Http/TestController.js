'use strict'
const process = require('child_process')
const exec = require('child_process').exec
// const cpuStat = require('cpu-stat');
// const osutils = require('os-utils');
const osu = require('node-os-utils')
const cpu = osu.cpu
const mem = osu.mem
const drive = osu.drive

class TestController {
  async homeDashboard ({ request, auth, response }) {
    try{
      
      let memoryusageData = 0;
      let cpuUsageData = 0;
      let driveusageData = 0;

      await drive.info().then(info => {
        console.log(info)
        driveusageData = parseFloat(info.usedPercentage);
        console.log('node-os-utils 磁盘使用情况 = ' + driveusageData + '%');
      })

      await mem.info().then(info => {
        console.log(info)
        memoryusageData = (100 * info.usedMemMb / info.totalMemMb).toFixed(2);
        console.log('node-os-utils 内存使用情况 = ' + memoryusageData + '%');
      });

      await cpu.usage().then(cpuPercentage => {
        cpuUsageData = cpuPercentage;
        console.log('node-os-utils CPU使用情况 = ' + cpuPercentage + '%');
      });

      return response.json({
        status: 'success',
        data: {
          cpu: cpuUsageData,
          memory: memoryusageData,
          drive: driveusageData
        }
      })
    } catch (error) {
      console.log(error)
      response.status(400).json({
        status: 'error',
        message: error
      })
    }
  }
}

module.exports = TestController
