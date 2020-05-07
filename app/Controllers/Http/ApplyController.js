'use strict'

const User = use('App/Models/User')
const Apply = use('App/Models/Apply')
const Database = use('Database')
const util = require('util')
const execFile = util.promisify(require('child_process').execFile)
const linuxUser = require('linux-user')
const addUser = util.promisify(require('linux-user').addUser)
const setPassword = util.promisify(require('linux-user').setPassword)
const passwd = require('passwd-linux')
var exec = require('child_process').exec;


class ApplyController {
  async createApply ({ request, auth, response }) {
    try {
      const userData = request.only(['username', 'name', 'password', 'mentor', 'appliedflag'])
      if(userData.appliedflag == false || userData.appliedflag === false) {
        userData.appliedflag = 1
      }
      // console.log(userData)

      const apply = new Apply()
      apply.username = userData.username
      apply.name = userData.name
      apply.password = userData.password
      apply.mentor = userData.mentor
      await apply.save()

      await Database.table('users').where('username', userData.username).update({appliedflag: userData.appliedflag})

      return response.json({
        status: 'success'
      })
    } catch (error) {
      response.status(400).json({
        status: 'error',
        message: 'There has an error, please try again later.'
      })
    }
  }

  async checkApply ({ request, auth, response }) {
    try {
      const user = await User.query().where('id', auth.current.user.id).firstOrFail()
      const appliedFlag = user.appliedflag
      // console.log(appliedFlag)
      return response.json({
        status: 'success',
        data: appliedFlag
      })
    } catch (error) {
      response.status(400).json({
        status: 'error',
        message: 'There was a problem checking the applyinfo, please try again later.'
      })
    }
  }

  async getApplies ({ request, auth, response }) {
    try {
      const applies = await Database.table('applies').select()
      return response.json({
        status: 'success',
        data: applies
      })
    } catch (error) {
      response.status(400).json({
        status: 'error',
        message: 'There was a problem getting the applyinfo, please try again later.'
      })
    }
  }

  async agreeApply ({ request, auth, response }) {
    try {
      const approval_time = request.input('approval_time')
      const result = request.input('result')
      const username = request.input('username')
      const password = request.input('password')
      console.log('2333333333password:', password)
      // console.log(username)

      await Database.table('applies').where('username', username).update({approval_time: approval_time, result: result})

      // 在当前服务器创建用户
      async function createUserFun () {
        try {
          await execFile('/usr/sbin/useradd', ['-d /home/' + username, username]).then( () => {
            // linuxUser.setPassword(username, password, function (err) {
            //   if(err) {
            //     return console.error(err);
            //   }
            // })
            // console.log('创建用户成功！')
            // console.log('为' + username + '设置密码成功！')
            //为用户设置密码
            // let setPasswdCmd = "echo " + "-e " + "\"" + password + '\\n' + password + "\"" + " | " + "passwd " + username
            // console.log('setPasswdCmd:',setPasswdCmd)
            // exec(setPasswdCmd, function (error, stdout, stderr) {
            //   if(error) {
            //     console.log('Error changing password');
            //     console.log(stderr);
            //   } else {
            //     console.log('Password successfully changed');
            //     console.log(stdout);
            //   }
            // });.
            // await execFile('cp', ['/etc/skel/*', '/home/' + username])

            passwd.changePassword(username, password, function (err, response) {
              if (err) {
                console.log(err);
              } else {
                if (response) {
                    console.log('Password successfully changed');
                } else {
                    console.log('Error changing password');
                }
              }
            }, 6);
          })
        } catch (error) {
          console.log(error)
        }
      }
      createUserFun();
      
      //创建用户
      // async function createUserFun () {
      //   try {
      //     const { stdout } = await addUser(username)
      //     // const { stdout2 } = await setPassword(username, password)
      //     linuxUser.setPassword(username, password, function (err) {
      //       if(err) {
      //         return console.error(err);
      //       }
      //     });
      //     console.log('addUser:', stdout)
      //     // console.log('setPassword:', stdout2)
      //   } catch(error) {
      //     console.log(error)
      //   }
      // }
      // createUserFun();

      // linuxUser.addUser(username, function (err, user) {
      //   if(err) {
      //     return console.error(err);
      //   }
      //   console.log(user);
      //   // ------------------------------------------
      //   // { username: 'gkuchan',
      //   //   password: 'x',
      //   //   uid: 1001,
      //   //   gid: 1001,
      //   //   fullname: '',
      //   //   homedir: '/home/gkuchan',
      //   //   shell: '/usr/sbin/nologin' }
      //   // ------------------------------------------

      //   //设置用户密码
      //   linuxUser.setPassword(username, password, function (err) {
      //     if(err) {
      //       return console.error(err);
      //     }
      //   });
      // });
      

      return response.json({
        status: 'success',
        data: ''
      })
    } catch (error) {
      response.status(400).json({
        status: 'error',
        message: 'There was a problem handle the apply, please try again later.'
      })
    }
  }

  async rejectApply ({ request, auth, response }) {
    try {
      const approval_time = request.input('approval_time')
      const result = request.input('result')
      const username = request.input('username')
      // console.log(username)

      await Database.table('applies').where('username', username).update({approval_time: approval_time, result: result})

      return response.json({
        status: 'success',
        data: ''
      })
    } catch (error) {
      response.status(400).json({
        status: 'error',
        message: 'There was a problem handle the apply, please try again later.'
      })
    }
  }
}

module.exports = ApplyController
