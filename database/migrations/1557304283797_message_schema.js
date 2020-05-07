'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MessageSchema extends Schema {
  up () {
    this.create('messages', (table) => {
      table.increments()
      table.string('author', 80).notNullable().comment('提交意见的作者，即当前登录的用户的姓名')
      table.string('content', 254).notNullable().comment('用户提交的意见内容')
      table.timestamps()
    })
  }

  down () {
    this.drop('messages')
  }
}

module.exports = MessageSchema
