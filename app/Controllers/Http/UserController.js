'use strict'

// add User Model
const User = use('App/Models/User')
const Database = use('Database')

class UserController {

  async signup ({ request, auth, response }) {
    // get user data from signup form
    const userData = request.only(['username', 'password', 'pwd_bk', 'name', 'sex', 'role', 'email', 'phone', 'mentor_id'])
    console.log(userData)
    try {
      // save user to database
      const user = await User.create(userData)
      // generate JWT token for user
      const token = await auth.generate(user)

      return response.json({
        status: 'success',
        data: token
      })
    } catch (error) {
      console.log(error)
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem creating the user, please try again later.'
      })
    }
  }

  async login ({ request, auth, response }) {
    try {
      // get username and password from request
      const username = request.input('username')
      const password = request.input('password')
      // calidate the user credentials and generate a JWT token
      const token = await auth.attempt(username, password)

      return response.json({
        status: 'success',
        data: token
      })
    } catch (error) {
      response.status(400).json({
        status: 'error',
        message: 'Invalid username/password'
      })
    }
  }

  async getUser ({ request, auth, response }) {
    try {
      const user = await User.query().where('id', auth.current.user.id).firstOrFail()
      // console.log(user)
      const mentor_id = user.mentor_id
      // console.log(mentor_id)
      const mentor = await Database.table('users').where('id', mentor_id).select()

      if(mentor_id == 0 || mentor_id === 0) {
        const mentor = user
        const data = {
          user: user,
          mentor: mentor
        }
        return response.json({
          status: 'success',
          data: data
        })
      } else {
        const mentor = await Database.table('users').where('id', mentor_id).select()
        const data = {
          user: user,
          mentor: mentor[0]
        }
        return response.json({
          status: 'success',
          data: data
        })
      }
      // console.log(mentor[0])
      // const data = {
      //   user: user,
      //   mentor: mentor[0]
      // }
      // console.log(mentor_id)
      // return response.json({
      //   status: 'success',
      //   data: data
      // })
    } catch (error) {
      response.status(400).json({
        status: 'error',
        message: 'There was a problem getting the userinfo, please try again later.'
      })
    }
    
  }

  async getMentors ({ request, auth, response }) {
    const mentors = await Database.table('users').where('role', 1).select()
    // console.log(mentors)
    return response.json({
      status: 'success',
      data: mentors
    })
  }
}

module.exports = UserController
