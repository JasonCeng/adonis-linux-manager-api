'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique().comment('用户登录凭据')
      table.string('name', 80).notNullable().unique().comment('用户姓名,保留,可追溯') //zengzhaochaung add at 2019/4/21 16:45
      table.integer('sex').defaultTo(0).comment('0:男,1:女')
      table.string('email', 254).notNullable().unique().comment('用户邮箱,保留')
      table.string('phone').defaultTo('').comment('用户手机')
      table.string('password', 60).notNullable()
      table.integer('role').defaultTo(0).comment('0:学生,1:老师') //zengzhaochaung add at 2019/4/21 16:45
      table.integer('mentor_id').defaultTo(0).notNullable().comment('归属导师,默认为0,就是导师自身')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
